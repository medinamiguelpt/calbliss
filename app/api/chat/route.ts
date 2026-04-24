import Anthropic from "@anthropic-ai/sdk"
import { chatSchema, parseBody } from "@/lib/schemas"

const client = new Anthropic()

const SYSTEM = `You are a helpful, concise assistant for TimeBookingPro — an AI voice agent service for barbershops and small businesses.

Key facts:
- AI agents handle bookings 24/7 via phone calls
- Pricing (EUR): Light €99/mo (100 min), Standard €179/mo (250 min), Busy €299/mo (500 min), Heavy €499/mo (1,000 min) — 20% off annually. Hard cap on minutes, no overage — calls route to voicemail when the monthly bucket is spent. EU-only (EUR, SEK, DKK, PLN).
- Live in under 24 hours — zero technical setup required
- Works with Google Calendar, Calendly, Acuity Scheduling
- Voice powered by ElevenLabs — sounds completely natural. We pick the voice during setup.
- No long-term contracts, cancel any time
- GDPR compliant, data encrypted at rest and in transit
- 7 languages supported: Greek, English, Spanish, Portuguese, French, German, Arabic

Rules:
- Keep every reply to 2–3 sentences max
- Be warm, direct, and human — not corporate
- If someone wants to sign up, say: "Scroll to the bottom of the page and drop your email — we'll have you live within 24 hours."
- Never make up features or pricing that aren't listed above
- If you don't know something, say "That's a great question — email us at hello@timebookingpro.com and we'll get back to you quickly."`

export async function POST(req: Request) {
  const parsed = parseBody(chatSchema, await req.json())
  if (parsed.error) return new Response("Invalid messages", { status: 400 })
  const { messages } = parsed.data

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: SYSTEM,
    messages: messages.slice(-10),
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
