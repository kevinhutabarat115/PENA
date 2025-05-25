const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 8080;

// Kumpulkan metrik default dari Node.js (CPU, memory, dsb)
promClient.collectDefaultMetrics();

// Buat metrik khusus untuk menghitung HTTP request
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path'],
});

// Middleware untuk menghitung setiap request masuk
app.use((req, res, next) => {
  httpRequestCounter.inc({ method: req.method, path: req.path });
  next();
});

// Endpoint /metrics untuk Prometheus scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Endpoint utama
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>PENA App</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 800px;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            margin-bottom: 10px;
            font-size: 28px;
            color: #333;
          }
          p {
            font-size: 18px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hi I'm Kevin Polin Hutabarat</h1>
          <p>This is App NodeJS for Technical Test DevOps Engineer from PENA Team/Mr.Scraper.</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
