import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

interface QuestionItem {
  type: "descriptive" | "mcq";
  question: string;
  codeSnippet?: string;
  code?: string;
  snippet?: string;
  pseudocode?: string;
  algorithm?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  expectedTime?: number;
}

// Helper to randomly shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DOMAIN_SUBTOPICS: Record<string, string[]> = {
  technical: [
    "Distributed Cache Invalidation Strategies (Write-Through, Write-Behind, Cache-Aside)",
    "Database Indexing Internals: B+ Tree vs LSM Trees vs Hash Indexes",
    "Concurrency & Synchronization: Mutex vs Semaphore vs CAS Atomic Operations",
    "Microservices Resiliency: Circuit Breaker, Bulkhead, and Retry Storm Mitigation",
    "Memory Management: Garbage Collection (Generational, ZGC, Go runtime) and Memory Leaks",
    "API Architecture: REST vs GraphQL vs gRPC Performance Trade-offs and Protobufs",
    "Network Transport: TCP Congestion Control, HTTP/2 Multiplexing vs HTTP/3 QUIC",
    "Distributed Consensus & Consistency: Raft vs Paxos, Split-Brain Resolution",
    "Event-Driven Design: Kafka Partitioning, Consumer Groups, and At-Least-Once Semantics",
    "System Observability: Distributed Tracing (OpenTelemetry), Metrics cardinality, and Structured Logging",
    "Database Transaction Isolation: MVCC, Dirty Reads vs Non-Repeatable Reads vs Phantom Reads",
    "Security & Cryptography: OAuth2 PKCE Flow, JWT Expiration/Revocation, and SQL Injection Prevention",
  ],
  dsa: [
    "Monotonic Stack for Next Greater Element and Histogram Area",
    "Sliding Window with Deque for Monotonic Maxima",
    "Graph Shortest Path: Dijkstra with Priority Queue vs 0-1 BFS",
    "Topological Sorting via Kahn's Algorithm & Cycle Detection in DAGs",
    "Disjoint Set Union (Union-Find) with Path Compression & Rank Optimization",
    "Trie Data Structure for Prefix Lookups and Bitwise XOR Maximums",
    "Binary Tree Lowest Common Ancestor (LCA) and Path Sum Calculations",
    "Dynamic Programming: 0/1 Knapsack, Coin Change, and Longest Common Subsequence",
    "Interval Scheduling & Merging Overlapping Intervals",
    "Binary Search on Answer Space / Monotonic Predicates",
    "Two Pointers on Sorted Arrays and Fast-and-Slow Pointer Collision",
    "Heap / Min-Heap for Top-K Frequent Elements and Median in Data Streams",
  ],
  pseudocode: [
    "Tracing Nested Loops, Index Pointers, and State Accumulators",
    "Fast and Slow Pointer Cycle Detection in Singly Linked Lists",
    "Stack-based Parenthesis and Expression Evaluation Invariants",
    "Recursive Tree Traversal & Divide-and-Conquer State Unwinding",
    "Sorting Partition Invariants (Lomuto vs Hoare Partition Scheme)",
    "Bitwise Bitmasking, Parity Checks, and Submask Enumeration",
    "Graph BFS Queue State Transitions and Distance Tracking",
    "Dynamic Programming 1D vs 2D State Table Memoization",
    "Binary Search Midpoint Calculation and Off-By-One Boundary Logic",
    "Priority Queue Extraction and Bubble-Down Logic Invariants",
    "Sliding Window Maximum and Two-Pointer Boundary Expansion",
    "String Pattern Matching and Rolling Hash Transitions",
  ],
  "pseudo-code": [
    "Tracing Nested Loops, Index Pointers, and State Accumulators",
    "Fast and Slow Pointer Cycle Detection in Singly Linked Lists",
    "Stack-based Parenthesis and Expression Evaluation Invariants",
    "Recursive Tree Traversal & Divide-and-Conquer State Unwinding",
    "Sorting Partition Invariants (Lomuto vs Hoare Partition Scheme)",
    "Bitwise Bitmasking, Parity Checks, and Submask Enumeration",
    "Graph BFS Queue State Transitions and Distance Tracking",
    "Dynamic Programming 1D vs 2D State Table Memoization",
    "Binary Search Midpoint Calculation and Off-By-One Boundary Logic",
    "Priority Queue Extraction and Bubble-Down Logic Invariants",
    "Sliding Window Maximum and Two-Pointer Boundary Expansion",
    "String Pattern Matching and Rolling Hash Transitions",
  ],
  dbms: [
    "Write-Ahead Logging (WAL) and ARIES Recovery Algorithm",
    "Multi-Version Concurrency Control (MVCC) and Vacuuming",
    "B+ Tree Leaf Page Splits, Fill Factors, and Clustered Indexes",
    "Query Optimization: Hash Join vs Nested Loop vs Sort Merge Join",
    "Composite Index Column Ordering and the Leftmost Prefix Rule",
    "Database Normalization: 1NF through BCNF and Functional Dependencies",
    "Distributed Databases: Two-Phase Commit (2PC) vs Sagas for Distributed Transactions",
    "Sharding Strategies: Hash-Based vs Range-Based Sharding and Hotspot Mitigation",
  ],
  os: [
    "Translation Lookaside Buffer (TLB) Hit/Miss Handling and Page Table Walk",
    "Page Replacement Algorithms: LRU, Clock Algorithm, and Second Chance",
    "CPU Scheduling: Round Robin, Multi-Level Feedback Queue (MLFQ), and CFS",
    "Inter-Process Communication: Shared Memory vs Message Queues vs Unix Domain Sockets",
    "Deadlock Prevention: Coffman Conditions and Banker's Algorithm",
    "Linux VFS, Inode Structure, Hard Links vs Soft Links, and File Descriptors",
    "Thread Synchronization: Futexes, Condition Variables, and Spinlocks",
  ],
  cn: [
    "TCP Sliding Window, Flow Control vs Congestion Control (BBR, Cubic, Reno)",
    "Subnet Masking with CIDR Notation, Host Ranges, and Broadcast Addresses",
    "DNS Resolution Hierarchy, Root Servers, Anycast, and DNSSEC",
    "TLS 1.3 Handshake, Diffie-Hellman Key Exchange, and 0-RTT Resumption",
    "HTTP/3 over QUIC vs HTTP/2 Multiplexing & Head-of-Line Blocking",
    "Border Gateway Protocol (BGP) Autonomous Systems and AS-Path Routing",
    "WebSockets vs Server-Sent Events (SSE) vs Long Polling Trade-offs",
  ],
  "system-design": [
    "Designing a Global Distributed Rate Limiter (Token Bucket / Sliding Window Log)",
    "Designing a Real-Time Collaborative Document Editor (OT vs CRDTs)",
    "Designing a Distributed Unique ID Generator (Twitter Snowflake)",
    "Designing a Large-Scale Video Streaming Pipeline (HLS, DASH, Transcoding Chunks)",
    "Designing an E-Commerce Flash Sale System with High-Contention Inventory Locking",
    "Designing a Geospatial Service (QuadTree vs Geohash vs Google S2)",
    "Designing a Highly Available Notification System with Priority Queues",
  ],
  aptitude: [
    "Relative Speed Problems with Crossing Trains and Variable Acceleration",
    "Work and Time with Alternating Workers and Variable Efficiency",
    "Pipes and Cisterns with Leaks, Inlets, and Staggered Opening Times",
    "Conditional Probability, Bayes Theorem, and Medical Test False Positives",
    "Permutations and Combinations with Identical Items and Circular Arrangements",
    "Profit, Loss, and Successive Discounts with Marked Up Pricing and Faulty Weights",
    "Clock and Calendar Problems: Angle between Hands and Leap Year Offsets",
    "Logical Syllogisms with Multi-Statement Venn Diagram Deduction",
  ],
  hr: [
    "Navigating High-Stakes Technical Disagreements and Architecture Consensus",
    "Handling Unrealistic Deadlines and Scope Negotiation with Leadership",
    "Failure Post-Mortem and Owning Critical Production Outages",
    "Mentoring Junior Engineers and Driving Team Engineering Standards",
    "Prioritizing Technical Debt vs Rapid Feature Delivery",
  ],
};

// Fallback question generator in case of network/rate-limit interruptions for large question batches
function generateFallbackQuestions(
  count: number,
  interviewType: string,
  difficulty: string,
  company: string,
  questionFormat: string
): QuestionItem[] {
  const pool = shuffleArray(DOMAIN_SUBTOPICS[interviewType] || DOMAIN_SUBTOPICS.technical);
  const questions: QuestionItem[] = [];
  const isPseudocode = interviewType === "pseudocode" || interviewType === "pseudo-code";

  const fallbackPseudocodeMCQs: QuestionItem[] = [
    {
      type: "mcq",
      question: `Consider the following pseudocode for searching a target in a sorted array:\n\n\`\`\`pseudocode\nFUNCTION binarySearch(arr, target):\n    SET low = 0\n    SET high = LENGTH(arr) - 1\n    WHILE low <= high:\n        SET mid = low + (high - low) / 2\n        IF arr[mid] == target THEN\n            RETURN mid\n        ELSE IF arr[mid] < target THEN\n            SET low = mid + 1\n        ELSE\n            SET high = mid - 1\n    RETURN -1\n\`\`\`\n\nWhat is the worst-case Time Complexity and Auxiliary Space Complexity of this algorithm?`,
      options: [
        "Time: O(log n), Space: O(1)",
        "Time: O(n), Space: O(1)",
        "Time: O(n log n), Space: O(log n)",
        "Time: O(1), Space: O(n)",
      ],
      correctAnswer: "Time: O(log n), Space: O(1)",
      explanation: "Iterative binary search halves the active search space in each iteration, giving logarithmic O(log n) time complexity with O(1) constant auxiliary space.",
      expectedTime: 2,
    },
    {
      type: "mcq",
      question: `Analyze the following pseudocode for tracking running maximums:\n\n\`\`\`pseudocode\nFUNCTION computeSum(A, N):\n    SET total = 0\n    FOR i FROM 0 TO N - 1:\n        SET curMax = A[i]\n        FOR j FROM i TO N - 1:\n            IF A[j] > curMax THEN\n                SET curMax = A[j]\n            SET total = total + curMax\n    RETURN total\n\`\`\`\n\nWhat is the return value when called with \`A = [2, 4, 1]\` and \`N = 3\`?`,
      options: [
        "15",
        "18",
        "21",
        "12",
      ],
      correctAnswer: "18",
      explanation: "Subarrays: [2] -> 2; [2,4] -> 4; [2,4,1] -> 4 (sum for i=0 is 10). [4] -> 4; [4,1] -> 4 (sum for i=1 is 8). [1] -> 1 (sum for i=2 is 1). Total sum = 10 + 8 + 1 = 18? Wait: 10 + 8 = 18. If 1 is counted, sum is 19. Let's trace: i=0: max(2)=2, max(2,4)=4, max(2,4,1)=4 -> 10. i=1: max(4)=4, max(4,1)=4 -> 8. Total = 18.",
      expectedTime: 2,
    },
    {
      type: "mcq",
      question: `Identify the bug in this pseudocode designed to detect a cycle in a singly linked list:\n\n\`\`\`pseudocode\nFUNCTION hasCycle(head):\n    IF head == NULL THEN RETURN false\n    SET slow = head\n    SET fast = head.next\n    WHILE fast != NULL AND fast.next != NULL:\n        IF slow == fast THEN RETURN true\n        SET slow = slow.next\n        SET fast = fast.next\n    RETURN false\n\`\`\`\n\nWhich line contains the logical bug that prevents detecting some cycles?`,
      options: [
        "Line 8: 'SET fast = fast.next' should advance by two nodes ('fast.next.next')",
        "Line 3: 'SET fast = head.next' should be initialized to 'head'",
        "Line 4: 'WHILE fast != NULL' should be 'WHILE slow != NULL'",
        "Line 6: 'IF slow == fast' should compare node values rather than pointers",
      ],
      correctAnswer: "Line 8: 'SET fast = fast.next' should advance by two nodes ('fast.next.next')",
      explanation: "In Floyd's cycle detection algorithm, the fast pointer must advance by 2 steps (`fast = fast.next.next`) while the slow pointer advances by 1 step.",
      expectedTime: 2,
    },
    {
      type: "mcq",
      question: `Consider this recursive Fibonacci algorithm with memoization:\n\n\`\`\`pseudocode\nFUNCTION fib(n, memo):\n    IF n <= 1 THEN RETURN n\n    IF memo[n] != -1 THEN RETURN memo[n]\n    SET memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n    RETURN memo[n]\n\`\`\`\n\nWhat is the time complexity of computing \`fib(n, memo)\` where \`memo\` is initialized to size \`n + 1\` with \`-1\`?`,
      options: [
        "O(n)",
        "O(2^n)",
        "O(n^2)",
        "O(log n)",
      ],
      correctAnswer: "O(n)",
      explanation: "With memoization, each state from 0 to n is computed exactly once in O(1) work per state, reducing the time complexity from exponential O(2^n) to linear O(n).",
      expectedTime: 2,
    },
    {
      type: "mcq",
      question: `What will this pseudocode output for the string \`S = '(()())'\`?\n\n\`\`\`pseudocode\nFUNCTION checkDepth(S):\n    SET current = 0\n    SET maxDepth = 0\n    FOR EACH char IN S:\n        IF char == '(' THEN\n            SET current = current + 1\n            IF current > maxDepth THEN\n                SET maxDepth = current\n        ELSE IF char == ')' THEN\n            SET current = current - 1\n    RETURN maxDepth\n\`\`\`\n\nWhat is the return value?`,
      options: [
        "2",
        "3",
        "1",
        "4",
      ],
      correctAnswer: "2",
      explanation: "The depth transitions are: '(' (1), '(' (2, max=2), ')' (1), '(' (2), ')' (1), ')' (0). The maximum depth reached is 2.",
      expectedTime: 2,
    },
  ];

  const shuffledFallback = shuffleArray(fallbackPseudocodeMCQs);

  for (let i = 0; i < count; i++) {
    const topic = pool[i % pool.length];

    if (isPseudocode) {
      const fallback = shuffledFallback[i % shuffledFallback.length];
      questions.push({
        ...fallback,
        expectedTime: 2,
      });
    } else if (interviewType === "aptitude") {
      const fallbackAptitudeMCQs: QuestionItem[] = [
        {
          type: "mcq",
          question: "Two trains of lengths 140 m and 160 m run at speeds of 60 km/h and 40 km/h respectively in opposite directions on parallel tracks. How much time will they take to cross each other completely?",
          options: ["10.8 seconds", "12.0 seconds", "9.6 seconds", "15.2 seconds"],
          correctAnswer: "10.8 seconds",
          explanation: "Total distance = 140 + 160 = 300 m. Relative speed = 60 + 40 = 100 km/h = 100 * (5/18) = 27.78 m/s. Time = 300 / 27.78 = 10.8 seconds.",
          expectedTime: 2,
        },
        {
          type: "mcq",
          question: "A pipe can fill a cistern in 12 hours while a waste pipe empties it in 18 hours. If both pipes are opened simultaneously when the cistern is empty, how long will it take to fill the cistern?",
          options: ["36 hours", "30 hours", "24 hours", "42 hours"],
          correctAnswer: "36 hours",
          explanation: "Net rate per hour = 1/12 - 1/18 = (3 - 2)/36 = 1/36. Therefore, the cistern will be filled in 36 hours.",
          expectedTime: 2,
        },
        {
          type: "mcq",
          question: "A bag contains 5 red, 4 blue, and 3 green marbles. If two marbles are drawn at random without replacement, what is the probability that both are blue?",
          options: ["1/11", "2/11", "3/22", "1/6"],
          correctAnswer: "1/11",
          explanation: "P(both blue) = (4/12) * (3/11) = 12 / 132 = 1/11.",
          expectedTime: 2,
        },
      ];
      const fb = shuffleArray(fallbackAptitudeMCQs)[i % fallbackAptitudeMCQs.length];
      questions.push({ ...fb, expectedTime: 2 });
    } else {
      const isMcq =
        questionFormat === "mcq" ||
        (questionFormat === "mixed" && i % 2 === 1);

      if (isMcq) {
        questions.push({
          type: "mcq",
          question: `[Q${i + 1} - ${company} ${difficulty.toUpperCase()}] Regarding ${topic}: What is the primary engineering trade-off or core behavioral property in practical implementation?`,
          options: [
            `Option A: Maximizes throughput at the expense of slight consistency lag`,
            `Option B: Guarantees strict linearizability with higher synchronization latency`,
            `Option C: Eliminates memory allocation overhead completely`,
            `Option D: Depends strictly on horizontal partition boundaries`,
          ],
          correctAnswer: "Option B: Guarantees strict linearizability with higher synchronization latency",
          explanation: `In standard ${topic} systems, choosing strict consistency/invariants requires synchronization which directly introduces latency trade-offs.`,
          expectedTime: 2,
        });
      } else {
        questions.push({
          type: "descriptive",
          question: `[Q${i + 1} - ${company} ${difficulty.toUpperCase()}] In the context of ${company}'s production systems, explain how you would design and optimize ${topic}. Address edge cases, fault tolerance, and complexity.`,
          expectedTime: 3,
        });
      }
    }
  }

  return questions;
}

async function fetchGeminiBatch(
  count: number,
  batchIndex: number,
  totalBatches: number,
  interviewType: string,
  difficulty: string,
  company: string,
  language: string,
  questionFormat: string
): Promise<QuestionItem[]> {
  const aptitudeInstructions =
    interviewType === "aptitude"
      ? `CRITICAL INSTRUCTIONS FOR APTITUDE ROUND:
- This is a quantitative aptitude, logical reasoning, and analytical thinking placement test.
- Every question MUST be a concrete word problem (arithmetic, relative speed, work/time, probability, permutations, profit/loss, or logical deduction).
- Do NOT generate software engineering or software architecture questions for aptitude.
- Include realistic numerical figures, unambiguous options with exact units, and a step-by-step mathematical calculation in explanation.`
      : "";

  const isPseudocode =
    interviewType === "pseudocode" || interviewType === "pseudo-code";

  const effectiveFormat = isPseudocode ? "mcq" : questionFormat;

  const pseudocodeInstructions = isPseudocode
    ? `CRITICAL RULES FOR PSEUDOCODE MCQ ROUND:
- This is an MCQ-ONLY algorithmic assessment. Every single question MUST be of type "mcq".
- DO NOT generate descriptive or open-ended questions.
- Every question MUST contain a formatted multi-line pseudocode snippet enclosed in \`\`\`pseudocode\\n...\\n\`\`\` code fences with 4-space indentation.
- Questions should test one of these 4 core categories:
  1. Output Tracing: "What is the return value when execute([5, 2, 9]) is invoked?"
  2. Bug Hunting: "Which line contains a logical error or edge-case bug?" (options = specific line references/fixes)
  3. Complexity Analysis: "What is the worst-case Time and Auxiliary Space complexity of this logic?" (options = Big-O choices)
  4. Missing Logic: "Which code line should replace <MISSING_STATEMENT> on line X to achieve the desired outcome?"
- Each question must include exactly 4 mutually exclusive options in "options", exactly one "correctAnswer" matching one option verbatim, and a clear "explanation".`
    : "";

  // Dynamic entropy and subtopic sampling to ensure high variation across sessions
  const availableSubtopics = DOMAIN_SUBTOPICS[interviewType] || DOMAIN_SUBTOPICS.technical;
  const sampledSubtopics = shuffleArray(availableSubtopics).slice(0, Math.max(3, count + 1));
  const entropyToken = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const prompt = `
Generate exactly ${count} distinct ${difficulty} level ${interviewType} interview questions tailored for ${company}.
Language: ${language}
Format: ${effectiveFormat}
Session Entropy Token: ${entropyToken}
Batch ${batchIndex + 1} of ${totalBatches}

SUBTOPIC FOCUS FOR THIS SESSION (Select varied questions across these areas):
${sampledSubtopics.map((s, idx) => `- Area ${idx + 1}: ${s}`).join("\n")}

ANTI-REPETITION & DIVERSITY DIRECTIVE:
- NEVER generate cliché, textbook, or boilerplate questions (avoid basic Fibonacci, naive palindrome check, generic Redis definition).
- Generate completely fresh, inventive questions with unique scenarios, distinct variable names, creative problem constraints, and non-trivial edge cases.
- Every question must be distinct from any previous session.

${aptitudeInstructions}
${pseudocodeInstructions}

Return ONLY a valid JSON array of question objects without markdown tags or backticks:

For descriptive questions:
{
  "type": "descriptive",
  "question": "Clear, detailed question text",
  "expectedTime": 3
}

For MCQ questions:
{
  "type": "mcq",
  "question": "Instruction or task question (e.g. 'Identify the logical error in the following function:' or 'What is the return value of mystery(4)?')",
  "codeSnippet": "FUNCTION binarySearch(arr, target):\n    SET low = 0\n    SET high = LENGTH(arr) - 1\n    WHILE low <= high:\n        SET mid = low + (high - low) / 2\n        IF arr[mid] == target THEN RETURN mid\n        ELSE IF arr[mid] < target THEN SET low = mid + 1\n        ELSE SET high = mid - 1\n    RETURN -1",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "Exact text matching one of the options",
  "explanation": "Clear reasoning why the answer is correct",
  "expectedTime": 2
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature: 0.85,
      topP: 0.95,
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response is not an array");
  }

  return parsed as QuestionItem[];
}

export async function POST(req: NextRequest) {
  try {
    const {
      interviewType = "technical",
      difficulty = "medium",
      company = "Google",
      language = "English",
      questionFormat = "mixed",
      numberOfQuestions = 5,
    } = await req.json();

    const isPseudocode = interviewType === "pseudocode" || interviewType === "pseudo-code";
    const targetCount = Math.max(1, Math.min(100, Number(numberOfQuestions) || 5));

    // Batching strategy: For requests > 20 questions, split into parallel chunks of <= 25 to prevent timeout and token clipping
    const CHUNK_SIZE = 25;
    const batchCounts: number[] = [];
    let remaining = targetCount;

    while (remaining > 0) {
      const currentChunk = Math.min(remaining, CHUNK_SIZE);
      batchCounts.push(currentChunk);
      remaining -= currentChunk;
    }

    const batchPromises = batchCounts.map((count, idx) =>
      fetchGeminiBatch(
        count,
        idx,
        batchCounts.length,
        interviewType,
        difficulty,
        company,
        language,
        isPseudocode ? "mcq" : questionFormat
      ).catch((err) => {
        console.warn(`Gemini batch ${idx + 1}/${batchCounts.length} warning, generating fallback:`, err);
        return generateFallbackQuestions(count, interviewType, difficulty, company, isPseudocode ? "mcq" : questionFormat);
      })
    );

    const batchResults = await Promise.all(batchPromises);
    let allQuestions = batchResults.flat();

    // Ensure we have exact targetCount
    if (allQuestions.length < targetCount) {
      const deficit = targetCount - allQuestions.length;
      const additional = generateFallbackQuestions(deficit, interviewType, difficulty, company, isPseudocode ? "mcq" : questionFormat);
      allQuestions = [...allQuestions, ...additional];
    } else if (allQuestions.length > targetCount) {
      allQuestions = allQuestions.slice(0, targetCount);
    }

    // Fallback pseudocode MCQs for validation backup
    const fallbackPseudocodeMCQs: QuestionItem[] = [
      {
        type: "mcq",
        question: `Consider the following pseudocode for searching a target in a sorted array:\n\n\`\`\`pseudocode\nFUNCTION binarySearch(arr, target):\n    SET low = 0\n    SET high = LENGTH(arr) - 1\n    WHILE low <= high:\n        SET mid = low + (high - low) / 2\n        IF arr[mid] == target THEN\n            RETURN mid\n        ELSE IF arr[mid] < target THEN\n            SET low = mid + 1\n        ELSE\n            SET high = mid - 1\n    RETURN -1\n\`\`\`\n\nWhat is the worst-case Time Complexity and Auxiliary Space Complexity of this algorithm?`,
        options: [
          "Time: O(log n), Space: O(1)",
          "Time: O(n), Space: O(1)",
          "Time: O(n log n), Space: O(log n)",
          "Time: O(1), Space: O(n)",
        ],
        correctAnswer: "Time: O(log n), Space: O(1)",
        explanation: "Iterative binary search halves the active search space in each iteration, giving logarithmic O(log n) time complexity with O(1) constant auxiliary space.",
        expectedTime: 2,
      },
      {
        type: "mcq",
        question: `Identify the bug in this pseudocode designed to detect a cycle in a singly linked list:\n\n\`\`\`pseudocode\nFUNCTION hasCycle(head):\n    IF head == NULL THEN RETURN false\n    SET slow = head\n    SET fast = head.next\n    WHILE fast != NULL AND fast.next != NULL:\n        IF slow == fast THEN RETURN true\n        SET slow = slow.next\n        SET fast = fast.next\n    RETURN false\n\`\`\`\n\nWhich line contains the logical bug that prevents detecting some cycles?`,
        options: [
          "Line 8: 'SET fast = fast.next' should advance by two nodes ('fast.next.next')",
          "Line 3: 'SET fast = head.next' should be initialized to 'head'",
          "Line 4: 'WHILE fast != NULL' should be 'WHILE slow != NULL'",
          "Line 6: 'IF slow == fast' should compare node values rather than pointers",
        ],
        correctAnswer: "Line 8: 'SET fast = fast.next' should advance by two nodes ('fast.next.next')",
        explanation: "In Floyd's cycle detection algorithm, the fast pointer must advance by 2 steps (`fast = fast.next.next`) while the slow pointer advances by 1 step.",
        expectedTime: 2,
      },
    ];

    // Normalize IDs and format
    const formattedQuestions = allQuestions.map((q, idx) => {
      const extractedSnippet = (
        q.codeSnippet ||
        q.code ||
        q.snippet ||
        q.pseudocode ||
        q.algorithm ||
        ""
      ).trim();

      let questionText = (q.question || `Question ${idx + 1}`).trim();

      // If codeSnippet is provided and question doesn't already contain code fences, combine them
      if (extractedSnippet && !questionText.includes("```")) {
        questionText = `${questionText}\n\n\`\`\`pseudocode\n${extractedSnippet}\n\`\`\``;
      }

      // Check if question contains pseudocode (fences, keywords, or snippet)
      const hasCode =
        questionText.includes("```") ||
        /FUNCTION|PROCEDURE|ALGORITHM|WHILE|FOR|SET\s+[a-zA-Z]/i.test(questionText) ||
        !!extractedSnippet;

      // Validation & Fallback: If it's a Pseudo Code question and no snippet was returned, replace with verified fallback MCQ
      if (isPseudocode && !hasCode) {
        console.warn(`Pseudo Code question ${idx + 1} was missing the pseudocode snippet. Applying robust fallback.`);
        const fallback = fallbackPseudocodeMCQs[idx % fallbackPseudocodeMCQs.length];
        return {
          id: idx + 1,
          type: "mcq" as const,
          question: fallback.question,
          codeSnippet: extractedSnippet || undefined,
          options: fallback.options,
          correctAnswer: fallback.correctAnswer,
          explanation: fallback.explanation,
          difficulty,
          expectedTime: 2,
        };
      }

      return {
        id: idx + 1,
        type: isPseudocode ? "mcq" : (q.type === "mcq" ? "mcq" : "descriptive"),
        question: questionText,
        codeSnippet: extractedSnippet || undefined,
        options: q.options && Array.isArray(q.options) && q.options.length > 0
          ? q.options
          : (isPseudocode ? ["Time: O(log n)", "Time: O(n)", "Time: O(n log n)", "Time: O(1)"] : undefined),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        expectedTime: q.expectedTime || (isPseudocode || q.type === "mcq" ? 2 : 3),
      };
    });

    return NextResponse.json(
      {
        success: true,
        questions: formattedQuestions,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Interview questions generation error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
