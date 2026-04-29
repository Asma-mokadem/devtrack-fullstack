import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();