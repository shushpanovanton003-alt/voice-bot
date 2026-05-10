export async function POST(req) {
  const body = await req.json()

  // подтверждение VK
  if (body.type === "confirmation") {
    return new Response(process.env.VK_CONFIRMATION_CODE)
  }

  // новое сообщение
  if (body.type === "message_new") {
    console.log(body)
  }

  return new Response("ok")
}