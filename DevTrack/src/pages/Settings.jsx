import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const settings = [
    {
      title: "Profile",
      desc: "Update your profile information",
      shadow: "hover:shadow-indigo-500/30",
    },
    {
      title: "Account",
      desc: "Change your password or email settings",
      shadow: "hover:shadow-pink-500/30",
    },
    {
      title: "Notifications",
      desc: "Manage your notification preferences",
      shadow: "hover:shadow-yellow-500/30",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen text-white p-10">
      <PageHeader title="Settings" />

      {user && (
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg mb-10">
          <h3 className="text-slate-400 text-sm mb-2">
            Logged in as
          </h3>
          <p className="text-xl font-semibold">
            {user.name} ({user.email})
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {settings.map((item, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-lg transition bg-slate-900 ${item.shadow}`}
          >
            <h2 className="text-xl font-semibold mb-2">
              {item.title}
            </h2>
            <p className="text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-semibold w-fit"
      >
        Logout
      </button>
    </div>
  );
}