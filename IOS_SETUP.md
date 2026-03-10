# iOS Camera Access Setup

## The Problem

iOS requires **HTTPS** for camera access (except localhost). When accessing the app from your iPhone on your local network (http://10.128.130.16:3000), the camera API is blocked for security reasons.

## Solution 1: Use ngrok (Recommended - Easiest)

ngrok creates a secure HTTPS tunnel to your local server.

### Steps:

1. **Install ngrok** (if not already installed):

   ```bash
   # Using Homebrew
   brew install ngrok

   # Or download from https://ngrok.com/download
   ```

2. **Create an HTTPS tunnel** to your dev server:

   ```bash
   ngrok http 3000
   ```

3. **Use the HTTPS URL** provided by ngrok (looks like `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)
   - Open this URL on your iPhone
   - Grant camera permissions when prompted
   - Enjoy AR features! 🎉

### Example:

```bash
$ ngrok http 3000

ngrok

Session Status                online
Account                       yourname@email.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

Just use the `https://abc123.ngrok-free.app` URL on your iPhone!

## Solution 2: Use localtunnel

An alternative to ngrok:

```bash
# Install
npm install -g localtunnel

# Run
lt --port 3000
```

Use the provided HTTPS URL on your iPhone.

## Solution 3: Self-Signed Certificate (Advanced)

Create a self-signed SSL certificate for local development:

1. Generate certificate:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

2. Update `vite.config.js`:

   ```javascript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import fs from "fs";

   export default defineConfig({
     plugins: [react()],
     server: {
       host: true,
       port: 3000,
       https: {
         key: fs.readFileSync("./key.pem"),
         cert: fs.readFileSync("./cert.pem"),
       },
     },
   });
   ```

3. Access via `https://YOUR_IP:3000` and accept the security warning

## Solution 4: Deploy to a Hosting Service

Deploy your app to any service with HTTPS:

- Vercel (vercel.com) - Free, automatic HTTPS
- Netlify (netlify.com) - Free, automatic HTTPS
- GitHub Pages - Free with HTTPS
- Cloudflare Pages - Free with HTTPS

## Testing Without AR

If you just want to test the canvas editor features:

- Use the desktop version at http://localhost:3000
- Upload images, adjust canvas size
- When you need AR, use one of the HTTPS solutions above

## Quick Test Command

```bash
# Install and run ngrok in one go
npx ngrok http 3000
```

Then use the HTTPS URL on your iPhone! 📱✨
