export function safeParseJson<T>(text: string): T {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Invalid AI response:", text);

    throw new Error(
      "AI returned an invalid JSON response."
    );
  }
}