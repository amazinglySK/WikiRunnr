import type { RequestHandler } from "./$types";
import { fetchWiki } from "$lib/fetchPage";

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  try {
    const page = await fetchWiki(slug);
    const page_content = page.text["*"]
    const head = `
  <head>
    <style>
      a { color: blue !important; text-decoration: none; }
	  a:hover { text-decoration: underline !important }
	  a:visited { color : purple; }
    </style>
	<link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles">
  </head>
`
    const html_response = `
	<!DOCTYPE html>
	<html>
		${head}
		<body>
			<h1>${page.title}</h1>
			${page_content}
		</body>
	</html>
`
    return new Response(html_response, {
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
      },
    });
  } catch (err) {
    console.error("Error fetching page:", err);
    return new Response("Error fetching page", { status: 500 });
  }
}