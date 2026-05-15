import { GoogleGenAI } from '@google/genai';

export const scanReceipt = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ message: 'No image provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Assume imageBase64 has the 'data:image/jpeg;base64,' prefix stripped
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analyze this receipt image and extract the following information. Return ONLY a valid JSON object with the following keys exactly as written, and no markdown formatting or extra text:
      "title": (The name of the merchant/store)
      "amount": (The exact total amount as a number, e.g. 15.99)
      "category": (Pick one of: Food, Transport, Utilities, Entertainment, Health, Other. Try to infer it based on what was bought)
      "date": (The date on the receipt in YYYY-MM-DD format, or today's date if not found)
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg' 
                }
            }
        ]
    });

    let rawText = response.text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(rawText);

    res.json(parsedData);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Failed to process receipt: ' + error.message });
  }
};
