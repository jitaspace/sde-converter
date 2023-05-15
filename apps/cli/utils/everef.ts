import { parse } from "node-html-parser";

export async function getEveRefDataDirectoryContents(url: string) {
  // normalize URL to end with a slash
  if (!url.endsWith("/")) {
    url += "/";
  }

  // fetch the index page
  const response = await fetch(url);

  // parse the index page to fetch the HTML <pre> element
  const text = await response.text();
  const root = parse(text);
  const pre = root.querySelector("pre")!.text;
  const inner = parse(pre);

  // parse the entries from the <pre> element
  const entries = inner.querySelectorAll(".data-file").map((entry) => {
    const name = entry.querySelector(".data-file-url")!.text;
    const size = parseInt(
      entry.querySelector(".data-file-size-bytes")!.text.replaceAll(",", ""),
    );
    const lastModified = new Date(
      entry.querySelector(".data-file-last-modified")!.text,
    );
    return { name, size, lastModified, url: url + name };
  });

  return entries;
}
