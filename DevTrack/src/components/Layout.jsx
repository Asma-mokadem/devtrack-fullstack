import Sidebar from "./Sidebar";

export default function Layout({ children, title, cta }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#0a0f1e]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0d1526]/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h1>
          {cta && <button className="text-sm px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition">{cta}</button>}
        </header>
        <main className="flex-1 overflow-auto px-8 py-7">{children}</main>
      </div>
    </div>
  );
}