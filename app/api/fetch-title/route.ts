// pages/api/fetch-title.js
import axios from "axios";
import cheerio from "cheerio";

export async function POST(request: Request) {
  const { url } = await request.json();

  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const pageTitle = $("head title").text();
  return Response.json({ title: pageTitle });
}
