export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200
      shadow-sm">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {value}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center
          justify-center ${color}`}>
          {Icon && <Icon size={22} />}
        </div>

      </div>

    </div>
  );
}