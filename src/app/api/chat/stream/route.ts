import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ai, GEMINI_MODEL } from "@/lib/ai/client";
import {
  prepareMentorStream,
  persistMentorTurn,
  generateFallbackMentorResponse,
} from "@/lib/ai/chat-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userRole = sessionUser?.role || "student";

    if (userRole === "recruiter" || userRole === "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: AI Placement Mentor is an exclusive feature for students." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const message = body?.message;
    const sessionId = body?.sessionId;

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Message content cannot be empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const {
      session: chatSession,
      cleanMessage,
      mentorContext,
      systemPrompt,
      contents,
    } = await prepareMentorStream(userId, message, sessionId);

    // Create ReadableStream for SSE
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let accumulatedText = "";

        const sendEvent = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Send initial metadata
          sendEvent({
            type: "start",
            sessionId: chatSession.id,
            sessionTitle: chatSession.title,
          });

          // Attempt Gemini streaming with dynamic model and systemInstruction
          let streamSucceeded = false;
          try {
            const responseStream = await ai.models.generateContentStream({
              model: GEMINI_MODEL,
              contents,
              config: {
                systemInstruction: systemPrompt,
              },
            });

            for await (const chunk of responseStream) {
              const textChunk = chunk.text || "";
              if (textChunk) {
                streamSucceeded = true;
                accumulatedText += textChunk;
                sendEvent({
                  type: "token",
                  content: textChunk,
                });
              }
            }
          } catch (geminiErr) {
            console.warn("Gemini stream error, transitioning to fallback streaming:", geminiErr);
          }

          // If Gemini did not yield tokens (e.g. rate limit/no API key), stream fallback response
          if (!streamSucceeded || !accumulatedText.trim()) {
            const fallbackText = generateFallbackMentorResponse(cleanMessage, mentorContext);
            accumulatedText = fallbackText;

            // Stream words smoothly in small chunks for natural feel
            const words = fallbackText.split(" ");
            for (let i = 0; i < words.length; i++) {
              const piece = (i === 0 ? "" : " ") + words[i];
              sendEvent({
                type: "token",
                content: piece,
              });
              // Tiny delay to create realistic typing stream
              await new Promise((resolve) => setTimeout(resolve, 20));
            }
          }

          // Persist user and assistant messages
          const persisted = await persistMentorTurn(
            chatSession,
            cleanMessage,
            accumulatedText
          );

          // Send final completion event
          sendEvent({
            type: "done",
            sessionId: persisted.session.id,
            sessionTitle: persisted.session.title,
            userMessage: persisted.userMessage,
            assistantMessage: persisted.assistantMessage,
          });
        } catch (err) {
          console.error("Stream generation error:", err);
          sendEvent({
            type: "error",
            error: "Failed to generate mentor response. Please try again.",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/chat/stream:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error while initializing mentor stream." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
