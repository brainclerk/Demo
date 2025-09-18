import OpenAI from "openai";
import { Message } from "../types";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export interface ChatCompletionOptions {
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
    retryCount?: number;
    reasoningEffort?: "low" | "medium" | "high";
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getChatCompletion = async (options: ChatCompletionOptions) => {
    const maxRetries = options.retryCount ?? 3;
    const maxOutputTokens = options.max_tokens ?? 1000;
    const reasoningEffort = options.reasoningEffort ?? "low";
    const temperature = options.temperature ?? 0.7;

    // ✅ Convert messages to Responses API input format
    const input = options.messages.map((msg) => {
        if (msg.images && msg.images.length > 0) {
            return {
                role: msg.role,
                content: [
                    { type: "input_text" as const, text: msg.content },
                    ...msg.images.map((image) => ({
                        type: "input_image" as const,
                        image_url: `data:image/jpeg;base64,${image}`,
                    })),
                ],
            };
        }
        return {
            role: msg.role,
            content: [{ type: "input_text" as const, text: msg.content }],
        };
    });

    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const resp = await openai.responses.create({
                model: "gpt-5-mini",
                input,
                temperature,
                max_output_tokens: maxOutputTokens,
                reasoning: { effort: reasoningEffort },
            });

            const text =
                (resp as any).output_text ??
                (resp.output
                    ?.map((block: any) =>
                        (block.content ?? [])
                            .map((part: any) =>
                                part?.type === "output_text" ? part.text : ""
                            )
                            .join("")
                    )
                    .join("\n")) ??
                "";

            return { role: "assistant" as const, content: text };
        } catch (error: any) {
            if (error?.status === 429) {
                retryCount++;
                if (retryCount < maxRetries) {
                    const waitTime = Math.pow(2, retryCount) * 1000;
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

    return { role: "assistant" as const, content: "" };
};
