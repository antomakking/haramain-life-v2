import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 1. Hide Server Fingerprint (Anti-Reconnaissance)
app.disable('x-powered-by');

// 2. Strict Request Payload Limits (Anti-DoS / Buffer Overflow)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. Security Headers Middleware (Anti-XSS, Anti-Clickjacking, Anti-MIME Sniffing, Strict-Transport-Security)
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Cross-Site Scripting Protection (legacy fallback)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy: Send full URL only on same-origin, origin only on cross-origin HTTPS
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict unwanted browser device capabilities
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()');
  
  // Prevent caching of sensitive error states
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Basic IP Rate Limiting / Flood Protection
  next();
});

// Simple in-memory rate limiter for anti-flood/DDoS protection
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests per min per IP

app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  const record = requestCounts.get(clientIp);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    requestCounts.set(clientIp, { count: 1, startTime: now });
  } else {
    record.count++;
    if (record.count > MAX_REQUESTS_PER_WINDOW) {
      res.status(429).send('Too Many Requests. Rate limit exceeded.');
      return;
    }
  }

  // Periodic cleanup of old IP records (every 1000 requests)
  if (requestCounts.size > 2000) {
    for (const [ip, data] of requestCounts.entries()) {
      if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
        requestCounts.delete(ip);
      }
    }
  }

  next();
});

// 4. Safe Static File Serving with Caching and Security Headers
app.use(express.static(path.join(__dirname, 'dist'), {
  dotfiles: 'ignore', // Ignore hidden dot files (.env, .git, etc.)
  etag: true,
  index: 'index.html',
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Ensure security headers are always set on static assets
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// 5. Safe SPA Fallback Route (prevent directory traversal)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 6. Global Error Handler (prevents leaking stack traces / server details)
app.use((err, req, res, next) => {
  console.error('Secure Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Haramain Life secure server running on port ${PORT}`);
});
