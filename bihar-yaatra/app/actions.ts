"use server";

export type SaarthiResponse =
    | { ok: true; text: string }
    | { ok: false; error: string };

function getErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null && "message" in err) {
        const message = (err as { message?: unknown }).message;
        if (typeof message === "string" && message.trim()) {
            return message;
        }
    }
    return "Saarthi AI is unavailable right now. Please try again.";
}

function getErrorStatus(err: unknown): number | null {
    if (typeof err === "object" && err !== null && "status" in err) {
        const status = (err as { status?: unknown }).status;
        if (typeof status === "number") {
            return status;
        }
    }
    return null;
}

export async function askSaarthi(prompt: string): Promise<SaarthiResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            ok: false,
            error: "Missing GEMINI_API_KEY. Add a valid key in .env.local and restart the server.",
        };
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction:
                "You are Saarthi, a helpful AI travel guide for Bihar. You specialize in Bihar's history (Nalanda, Rajgir), spirituality (Bodh Gaya), and modern travel tips. Keep responses helpful, culturally respectful, and concise.",
        });

        const result = await model.generateContent(prompt);
        return { ok: true, text: result.response.text() };
    } catch (err) {
        const status = getErrorStatus(err);
        const rawMessage = getErrorMessage(err);
        const lowered = rawMessage.toLowerCase();

        if (status === 403 && lowered.includes("reported as leaked")) {
            return {
                ok: false,
                error: "Configured Gemini API key was revoked after a leak report. Create a new key, set GEMINI_API_KEY in .env.local, and restart the server.",
            };
        }

        if (status === 403) {
            return {
                ok: false,
                error: "Gemini rejected the API key (403 Forbidden). Replace GEMINI_API_KEY with a valid key and restart the server.",
            };
        }

        console.error("askSaarthi failed:", err);
        return {
            ok: false,
            error: "Saarthi AI is unavailable right now. Please try again in a moment.",
        };
    }
}
