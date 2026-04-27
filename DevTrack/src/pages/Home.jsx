import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full top-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Track Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Developer Growth
          </span>
        </h1>

        <p className="text-slate-400 text-lg mb-10">
          DevTrack helps you analyze your projects, skills, and coding time
          with powerful analytics and real performance insights.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 rounded-xl text-lg font-semibold shadow-lg shadow-indigo-500/20 hover:scale-105 transition duration-300"
          >
            Get Started 
          </button>
        </div>
      </div>
    </div>
  );
}