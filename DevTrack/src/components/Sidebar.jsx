import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 text-white flex flex-col p-6">
      <div className="mb-14">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          DevTrack
        </h1>
        <p className="text-slate-400 text-sm">
          Developer Analytics
        </p>
      </div>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`text-left px-4 py-3 rounded-xl font-medium transition
              ${i === 0 
                ? "bg-indigo-600 shadow-lg shadow-indigo-600/20 hover:bg-indigo-500" 
                : "hover:bg-slate-800"}` 
            }
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-10 text-xs text-slate-500">
        © 2026 DevTrack
      </div>
    </aside>
  );
}