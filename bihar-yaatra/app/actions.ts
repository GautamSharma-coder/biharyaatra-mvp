"use server";

export async function askSaarthi(prompt: string): Promise<string> {
    // Basic mock since API key shouldn't be exposed on client
    // In actual prod, this would use google generative AI sdk
    // return `Saarthi: You asked about "${prompt}". This is a placeholder server response!`;
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBz9jq7sYtx9UHl0Es5DGkUJBc7ePxzoB0");
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "You are Saarthi, a helpful AI travel guide for Bihar. You specialize in Bihar's history (Nalanda, Rajgir), spirituality (Bodh Gaya), and modern travel tips. Keep responses helpful, culturally respectful, and concise."
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch(err) {
        console.error(err);
        return "Sorry, I am having trouble fetching the response right now.";
    }
}
