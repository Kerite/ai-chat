import { NextRequest } from "next/server"

const mockMessage: { [key: string]: string } = {
    "Hello": "Hello, how can I help you today?",
    "What is your name?": "I am Jessie, your personal assistant.",
    "What is your favorite color?": "I like blue. It's a great color!",
    "What is your favorite food?": "I like pizza. It's delicious!",
    "What is your favorite movie?": "I like Avengers. It's a great movie!",
    "What is your favorite book?": "I like Harry Potter. It's a great book!",
    "What is your favorite song?": "I like the song 'Shape of You'. It's a great song!",
    "What is your favorite game?": "I like the game 'League of Legends'. It's a great game!",
    "What is your favorite sport?": "I like basketball. It's a great sport!",
    "What is your favorite animal?": "I like dogs. They are cute!",
}

const encoder = new TextEncoder();

export const dynamic = 'force-static'

function truncate(q: string) {
    const len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

export async function POST(request: NextRequest) {
    const { message } = await request.json();

    const response = mockMessage[message];
    console.log(`User sent: ${message}, response: ${response}`);
    const salt = crypto.randomUUID();
    const curtime = Math.floor(Date.now() / 1000);
    const rawSign = `${process.env.TRANSLATE_APP_ID}${truncate(response)}${salt}${curtime}${process.env.TRANSLATE_API_KEY}`;
    console.log("Raw sign:", rawSign);
    const sign = await crypto.subtle.digest("SHA-256", encoder.encode(rawSign));
    const signStr = Array.from(new Uint8Array(sign)).map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append("q", response);
    formData.append("from", "auto");
    formData.append("to", "zh-CHS");
    formData.append("appKey", `${process.env.TRANSLATE_APP_ID}`);
    formData.append("salt", salt);
    formData.append("sign", signStr);
    formData.append("signType", "v3");
    formData.append("curtime", curtime.toString());

    const data = await fetch("https://openapi.youdao.com/api", {
        method: "POST",
        body: formData
    });

    const translationResponse = await data.json();
    console.log("Translation api response:", response);
    return Response.json({
        data: {
            reply: response,
            translation: translationResponse.translation[0]
        }
    })
}
