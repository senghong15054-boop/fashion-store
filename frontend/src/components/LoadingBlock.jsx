export default function LoadingBlock({ label = "Loading..." }) {
  return (
    <div className="glass-panel rounded-[2rem] p-8 text-center text-sm text-black/60 dark:text-white/60">
      {label}
    </div>
  );
}
