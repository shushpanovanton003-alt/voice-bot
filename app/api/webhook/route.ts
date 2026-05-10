export async function POST(req: Request) {
  const body = await req.json()

  console.log("TG UPDATE:", JSON.stringify(body, null, 2))

  return Response.json({ ok: true })
}