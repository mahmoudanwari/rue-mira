// Minimal static server for ./out that behaves like GitHub Pages:
// /path/ -> /path/index.html, unknown paths -> 404.html with status 404.
// Usage: node scripts/serve-out.mjs [port]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  let file = normalize(join(root, pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { Location: pathname + "/" }).end();
      return;
    }
    file = join(file, "index.html");
  }
  let status = 200;
  if (!existsSync(file)) {
    status = 404;
    file = join(root, "404.html");
  }
  res.writeHead(status, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ./out on http://localhost:${port}`));
