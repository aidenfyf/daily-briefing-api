export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { weather, emailSummary } = req.body;

  if (!weather || !emailSummary) {
    return res.status(400).json({ error: "Missing weather or emailSummary" });
  }

  return res.status(200).json({
    success: true,
    briefing: `Weather: ${weather}. Emails: ${emailSummary}.`,
  });
}
