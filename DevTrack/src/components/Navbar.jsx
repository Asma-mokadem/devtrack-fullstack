import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserInitial(user.name.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white flex items-center justify-between px-8">
      <h2 className="text-lg font-semibold tracking-wide">
        Dashboard
      </h2>
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/projects")}
          className="bg-indigo-600 px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition font-semibold"
        >
          Add Project
        </button>
        <button
          onClick={() => navigate("/skills")}
          className="bg-slate-800 px-5 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition font-semibold"
        >
          Add Skill
        </button>
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-semibold hover:bg-slate-600 cursor-pointer transition">
          {userInitial}
        </div>

      </div>
    </header>
  );
}