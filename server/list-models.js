import "dotenv/config";

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

const r = await fetch(url);
const data = await r.json();

console.log("Status:", r.status);
console.log(JSON.stringify(data, null, 2));