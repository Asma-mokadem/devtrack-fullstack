
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] dark:bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md animate-pulse">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.3"/>
            </svg>
          </div>
          <p className="text-sm text-gray-400 dark:text-slate-500">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}