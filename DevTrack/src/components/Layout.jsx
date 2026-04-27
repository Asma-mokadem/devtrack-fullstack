import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, title, onSearch }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#0a0f1e]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar title={title} onSearch={onSearch} />
        <main className="flex-1 overflow-auto px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}