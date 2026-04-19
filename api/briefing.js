import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { weather, emailSummary } = req.body;

  if (!weather || !emailSummary) {
    return res.status(400).json({ error: "Missing weather or emailSummary" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Create a brief morning briefing. Weather: ${weather}. Emails: ${emailSummary}. Keep it under 100 words.`,
        },
      ],
    });

    const briefing = response.content[0].type === "text" ? response.content[0].text : "No response";

    return res.status(200).json({
      success: true,
      briefing: briefing,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Claude API failed",
      details: error.message,
    });
  }
}
