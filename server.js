// server.js
const path = require("path");
const express = require("express");
const compression = require("compression");

const app = express();
const port = process.env.PORT || 3000;
const buildDir = path.join(__dirname, "build");

app.use(compression());

// Serve static files that CRA emitted (built with PUBLIC_URL=/user)
app.use(
  "/user",
  express.static(buildDir, {
    index: false,
    maxAge: "1y",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-store");
    },
  })
);

// Redirect bare "/" to "/user/"
app.get(/^\/$/, (_req, res) => res.redirect(301, "/user/"));

/**
 * SPA fallback: for ANY /user/... path that didn't match a static file,
 * serve index.html so React Router can render lazy routes (register-signin, etc.)
 *
 * Using RegExp avoids path-to-regexp's stricter v6 string parsing.
 */
app.get(/^\/user(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

// Optional: if someone visits routes without /user prefix, redirect them.
app.get(/^\/(register-signin|login|signup|dashboard)(?:\/.*)?$/, (req, res) => {
  res.redirect(301, "/user" + req.originalUrl);
});

app.listen(port, () =>
  console.log(`Serving SPA at http://localhost:${port}/user/`)
);
