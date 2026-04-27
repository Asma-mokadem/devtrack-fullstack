export default function StatCard({ label, value, sub, icon: Icon, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
    purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    green:  "bg-green-50  dark:bg-green-950/40  text-green-600  dark:text-green-400",
    amber:  "bg-amber-50  dark:bg-amber-950/40  text-amber-600  dark:text-amber-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}