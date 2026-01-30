import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    currentExercise?: string;
    currentModule?: string;
    codeSnippet?: string;
    errorContext?: string;
  };
  history?: Array<{ role: string; content: string }>;
}

// Chat service URL - must be configured via environment variable
const CHAT_SERVICE_URL = process.env.NEXT_PUBLIC_CHAT_URL;
if (!CHAT_SERVICE_URL) {
  throw new Error('CHAT_SERVICE_URL environment variable is required');
}

export async function POST(request: NextRequest) {
  const body: ChatRequest = await request.json();
  const { message, conversationId, context, history } = body;

  // Create a streaming response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Call the real chat service through the proxy
        const response = await fetch(`${CHAT_SERVICE}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            conversation_id: conversationId,
            context,
            history: history || [],
          }),
        });

        if (!response.ok) {
          throw new Error(`Chat service returned ${response.status}`);
        }

        // Parse the streaming response from the chat service
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body from chat service');
        }

        let accumulatedResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.chunk) {
                  accumulatedResponse += parsed.chunk;
                  const chunkData = JSON.stringify({ chunk: parsed.chunk, done: false });
                  controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
                } else if (parsed.content) {
                  accumulatedResponse += parsed.content;
                  const chunkData = JSON.stringify({ chunk: parsed.content, done: false });
                  controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
                }
              } catch (e) {
                // Skip invalid JSON
                console.warn('Failed to parse chat response:', e);
              }
            }
          }
        }

        // Send done signal
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Chat API error:', error);

        // Send error message as fallback
        const errorResponse = JSON.stringify({
          chunk: "I apologize, but I'm having trouble connecting to the chat service right now. Please try again in a moment.",
          done: false,
        });
        controller.enqueue(encoder.encode(`data: ${errorResponse}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
