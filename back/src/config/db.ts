import mongoose from "mongoose";

// Fonction async qui se connecte à MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // process.env.MONGO_URI vient de notre fichier .env
    const mongoURI = process.env.MONGO_URI;

    // Si la variable n'est pas définie, on arrête tout
    if (!mongoURI) {
      throw new Error("MONGO_URI n'est pas défini dans le fichier .env");
    }

    // Connexion à MongoDB via Mongoose
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    // On arrête le serveur si la DB ne répond pas
    process.exit(1);
  }
};

export default connectDB;