import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const dataPath = path.resolve(__dirname, "src/data/siteData.json");

  // API routes
  app.get("/api/site-data", (req, res) => {
    try {
      const data = fs.readFileSync(dataPath, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read site data" });
    }
  });

  app.post("/api/site-data", (req, res) => {
    try {
      const newData = req.body;
      fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2), "utf-8");
      res.json({ message: "Site data updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update site data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
