import OpenAI from "openai";
import { Message } from "../types";

// Initialize OpenAI client (unchanged)
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // In production, proxy through a backend
});

export interface ChatCompletionOptions {
    messages: Message[];          // { role: 'system'|'user'|'assistant'; content: string; images?: string[] }
    temperature?: number;
    max_tokens?: number;          // visible output tokens (mapped to max_output_tokens)
    retryCount?: number;
    reasoningEffort?: "low" | "medium" | "high"; // <-- new, optional
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getChatCompletion = async (options: ChatCompletionOptions) => {
    const maxRetries = options.retryCount ?? 3;
    const maxOutputTokens = options.max_tokens ?? 1000;      // visible text budget
    const reasoningEffort = options.reasoningEffort ?? "low";
    const temperature = options.temperature ?? 0.7;

    // Map your messages to Responses API "input" format
    const input = options.messages.map((msg) => {
        if (msg.images && msg.images.length > 0) {
            return {
                role: msg.role,
                content: [
                    { type: "text", text: msg.content },
                    ...msg.images.map((image) => ({
                        type: "image_url" as const,
                        image_url: `data:image/jpeg;base64,${image}`,
                    })),
                ],
            };
        }
        return {
            role: msg.role,
            content: [{ type: "text", text: msg.content }],
        };
    });

    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const resp = await openai.responses.create({
                model: "gpt-5-mini",
                input,
                temperature,
                max_output_tokens: maxOutputTokens,     // caps visible text only
                reasoning: { effort: reasoningEffort }, // valid on Responses API
            });

            // Prefer SDK convenience; fall back to manual concat if needed
            const text =
                (resp as any).output_text ??
                (resp.output
                    ?.map((block: any) =>
                        (block.content ?? [])
                            .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
                            .join("")
                    )
                    .join("\n")) ??
                "";

            return { role: "assistant" as const, content: text };
        } catch (error: any) {
            if (error?.status === 429) {
                retryCount++;
                if (retryCount < maxRetries) {
                    const waitTime = Math.pow(2, retryCount) * 1000; // backoff
                    await delay(waitTime);
                    continue;
                }
            }
            throw {
                message:
                    error?.status === 429
                        ? "We're experiencing high demand. Please try again in a few moments."
                        : "Sorry, we encountered an error processing your request.",
                originalError: error,
            };
        }
    }

    // Should be unreachable due to throw
    return { role: "assistant" as const, content: "" };
};
