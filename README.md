# testRigor Slow Blank Page Fixture

Deterministic HTTP fixtures for testing testRigor's **Wait until page is not blank** behavior.

The key endpoint, `/slow-blank`, keeps the HTTP response open for **35 seconds** and sends no HTML during that time. After the delay, it returns a completely empty HTML document.

## Endpoints

### `GET /healthy`

Returns immediately with detectable HTML content.

```text
https://YOUR-HOST/healthy
```

### `GET /blank`

Returns immediately with a completely empty HTML document.

```text
https://YOUR-HOST/blank
```

### `GET /slow-blank`

Keeps the HTTP response open for **35 seconds**, sending no response body during that time.

```text
https://YOUR-HOST/slow-blank
```

This is the endpoint intended for the testRigor regression scenario.

### `GET /slow-blank?delayMs=5000`

Same behavior with a shorter delay for local testing.

```text
http://localhost:3000/slow-blank?delayMs=5000
```

## Local setup

Requires Node.js 20+.

```bash
npm install
npm start
```

The server listens on:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/healthy
```

Slow fixture:

```text
http://localhost:3000/slow-blank
```

## Docker

Build:

```bash
docker build -t testrigor-slow-blank-page-fixture .
```

Run:

```bash
docker run --rm -p 3000:3000 testrigor-slow-blank-page-fixture
```

## Render deployment

This repository includes `render.yaml`.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint.
3. Select the GitHub repository.
4. Render reads `render.yaml`.
5. Deploy.
6. Verify `/healthy`.
7. Then use `/slow-blank`.

The Docker deployment uses the included `Dockerfile`.

## testRigor regression scenario

Before the product fix, create a test case containing:

```text
open url "https://YOUR-RENDER-DOMAIN/slow-blank"
```

With:

```text
Wait until page is not blank:
And stop execution if it never loads
```

Expected:

```text
[CRASH] No inputs, buttons or text found after 30 seconds. This might indicate a broken page.
```

After the product fix, run the exact same test again. It should still fail after approximately 30 seconds.

The PDF and image regression tests should pass.

Expected matrix:

| Scenario | Expected after fix |
|---|---|
| Slow HTML navigation (`/slow-blank`) | Fails after ~30 seconds |
| PDF preview | Passes |
| Image | Passes |

## Why this fixture is useful

The slow endpoint does not rely on third-party sites, browser JavaScript, images, iframes, or random behavior.

The server itself controls the delay.

During the 35-second delay:

- no HTML is sent;
- no text is sent;
- no button is sent;
- no input is sent;
- the HTTP response remains pending.

This makes the fixture specifically useful for proving that the existing 30-second protection remains active for genuinely slow HTML navigation.

## Deployment note

The deployment platform must allow an HTTP request to remain open for at least 35 seconds. If a proxy/platform terminates requests earlier, the fixture cannot reproduce the intended behavior.
