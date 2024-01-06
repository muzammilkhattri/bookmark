// pages/api/fetch-title.js
import axios from "axios";
import cheerio from "cheerio";

export async function POST(request: Request) {
  const { url } = await request.json();
  const response = await axios.get(url);
  const pageTitle = cheerio.load(response.data)("head title").text();
  return Response.json({ title: pageTitle });
}
