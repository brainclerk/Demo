import OpenAI from "openai";
import { Message } from "../types";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export interface ChatCompletionOptions {
    messages: Message[];                  // { role: 'system'|'user'|'assistant'; content: string; images?: string[] }
    max_tokens?: number;                  // visible output tokens
    retryCount?: number;
    reasoningEffort?: "low" | "medium" | "high";
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getChatCompletion = async (options: ChatCompletionOptions) => {
    const maxRetries = options.retryCount ?? 3;
    const maxOutputTokens = options.max_tokens ?? 1000;
    const reasoningEffort = options.reasoningEffort ?? "low";

    // Map to Responses API input, using role-aware part types
    const input = options.messages.map((msg) => {
        const isAssistant = msg.role === "assistant";

        // Build the text part with the correct type by role
        const textPart = isAssistant
            ? ({ type: "output_text", text: msg.content } as const)
            : ({ type: "input_text", text: msg.content } as const);

        // Only user/system/dev messages can include input images
        const imageParts =
            !isAssistant && msg.images?.length
                ? msg.images.map((image) => ({
                    type: "input_image" as const,
                    image_url: `data:image/jpeg;base64,${image}`,
                }))
                : [];

        return {
            role: msg.role,
            content: [textPart, ...imageParts],
        };
    });

    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const resp = await openai.responses.create({
                model: "gpt-5-mini",
                input,
                max_output_tokens: maxOutputTokens,       // visible text cap only
                reasoning: { effort: reasoningEffort },    // control hidden reasoning
            });

            // Prefer SDK convenience; fallback to manual parse
            const text =
                (resp as any).output_text ??
                (resp.output
                    ?.map((block: any) =>
                        (block.content ?? [])
                            .map((part: any) => (part?.type === "output_text" ? part.text : ""))
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
