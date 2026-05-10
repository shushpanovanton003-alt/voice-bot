import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply("бот жив"));

export async function POST(req: Request) {
  try {
    console.log("WEBHOOK HIT");

    const body = await req.json();

    console.log(JSON.stringify(body, null, 2));

    await bot.handleUpdate(body);

    console.log("UPDATE HANDLED");

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("ERROR:", e);

    return new Response("error", { status: 500 });
  }
}