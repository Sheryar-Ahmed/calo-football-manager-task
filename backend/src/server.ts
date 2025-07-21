import db from "./models";
import "./workers/team-worker"; // ✅ Add this line to start worker
import app from './app';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ DB connection OK");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  }
}

startServer();
