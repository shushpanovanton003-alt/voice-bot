export async function POST(req: Request) {
  const body = await req.json()

  console.log("VK EVENT:", body)

  // VK confirmation
  if (body.type === "confirmation") {
    return new Response("ok")
  }

  // Новое сообщение
  if (body.type === "message_new") {
    const message = body.object.message.text
    const peer_id = body.object.message.peer_id

    // Ответ OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    })

    const openaiData = await openaiResponse.json()

    const reply =
      openaiData.choices?.[0]?.message?.content || "Ошибка ответа"

    // Отправка в VK
    await fetch("https://api.vk.com/method/messages.send", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        peer_id: peer_id.toString(),
        message: reply,
        random_id: Date.now().toString(),
        access_token: process.env.VK_TOKEN || "",
        v: "5.199",
      }),
    })

    return Response.json({ ok: true })
  }

  return Response.json({ ok: true })
}