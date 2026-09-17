const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_DELAY_MS = 35_000;
const MAX_DELAY_MS = 90_000;

app.disable("x-powered-by");

app.get("/healthy", (_req, res) => {
  res.status(200).type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"><title>Fixture Healthy</title></head>
<body><p>Fixture server is healthy.</p></body></html>`);
});

app.get("/blank", (_req, res) => {
  res.status(200).type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"><title></title></head>
<body></body></html>`);
});

app.get("/slow-blank", (req, res) => {
  const requestedDelay = Number(req.query.delayMs);
  const delayMs = Number.isFinite(requestedDelay)
    ? Math.min(Math.max(requestedDelay, 0), MAX_DELAY_MS)
    : DEFAULT_DELAY_MS;

  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(200).type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"><title></title></head>
<body></body></html>`);
    }
  }, delayMs);

  req.on("close", () => clearTimeout(timer));
});

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "testRigor slow blank page fixture",
    endpoints: {
      healthy: "/healthy",
      blank: "/blank",
      slowBlank: "/slow-blank",
      slowBlankCustom: "/slow-blank?delayMs=5000"
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Fixture server listening on port ${PORT}`);
});
