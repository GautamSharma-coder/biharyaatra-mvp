import { Request, Response } from 'express';
import { genAI } from '../config/gemini';

// POST /api/v1/ai/plan-trip
export const generateTripPlan = async (req: Request, res: Response) => {
  try {
    const { destination, days, budget, interests } = req.body;

    const prompt = `
      Act as "Saarthi", an expert local travel planner for Bihar Tourism.
      Create a highly detailed, day-by-day travel itinerary for a ${days}-day trip to ${destination}.
      The budget level is: ${budget}.
      The user's specific interests are: ${interests?.join(', ') || 'general sightseeing'}.
      
      Provide the response in a structured markdown format including:
      - A brief overview of the trip.
      - Day-by-day itinerary (morning, afternoon, evening).
      - Estimated costs breakdown.
      - Recommended local foods to try.
      - Important travel tips for ${destination}.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ plan: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate trip plan. Please try again later.' });
  }
};
