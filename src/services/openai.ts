import OpenAI from 'openai';
import { Message } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, you should handle API calls through a backend
});

export interface ChatCompletionOptions {
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
    retryCount?: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getChatCompletion = async (options: ChatCompletionOptions) => {
    const maxRetries = options.retryCount || 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4.1",
                messages: options.messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: options.temperature || 0.42,
                max_tokens: options.max_tokens || 1000
            });

            return completion.choices[0].message;
        } catch (error: any) {
            // Check if it's a rate limit error
            if (error.status === 429) {
                retryCount++;
                if (retryCount < maxRetries) {
                    // Exponential backoff: wait longer between each retry
                    const waitTime = Math.pow(2, retryCount) * 1000;
                    await delay(waitTime);
                    continue;
                }
            }

            // If we've exhausted retries or it's a different error, throw it
            throw {
                message: error.status === 429
                    ? "We're experiencing high demand. Please try again in a few moments."
                    : "Sorry, we encountered an error processing your request.",
                originalError: error
            };
        }
    }
}; 