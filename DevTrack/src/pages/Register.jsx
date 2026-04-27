import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    // Vérifier si un utilisateur existe deja
    const existingUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (existingUser && existingUser.email === email) {
      setError("An account with this email already exists.");
      return;
    }

    // Créer nv  utilisateur
    const newUser = {
      name,
      email,
      password,
    };

    // Sauvegarder dans localStorage
    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    // Connecter automatiquement
    localStorage.setItem("user", JSON.stringify(newUser));

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950">
      <form
        onSubmit={handleRegister}
        className="bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-800 w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-gray-400 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-500 transition text-white font-semibold"
        >
          Register
        </button>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            className="text-indigo-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}