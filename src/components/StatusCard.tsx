interface StatusCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trendIcon?: React.ReactNode;
  variant?: "primary" | "success" | "danger";
}

export default function StatusCard({
  title,
  value,
  description,
  trendIcon,
  icon,
  variant,
}: StatusCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md p-6 border border-slate-200 dark:border-primary/30 bg-white dark:bg-background-dark shadow-lg">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
          {title}
        </p>
        {icon}
      </div>
      <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
        {value}
      </p>
      <p
        className={`text-xs font-bold flex items-center gap-1 ${
          variant === "primary"
            ? "text-slate-400"
            : variant === "success"
              ? "text-emerald-500"
              : "text-red-500"
        }`}
      >
        {trendIcon}
        {description}
      </p>
    </div>
  );
}
