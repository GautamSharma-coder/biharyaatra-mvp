require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    try {
        const apiKey = process.env.GOOGLE_AI_KEY;
        console.log("Key:", apiKey ? "Loaded" : "Missing");
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Testing with gemini-2.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("Calling Gemini 2.5...");
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error with gemini-2.5-flash:", error.message);
    }

    try {
        const apiKey = process.env.GOOGLE_AI_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Testing with gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Calling Gemini 1.5...");
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);
    }
}

testGemini();
