export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-6 py-24" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="mb-8 h-10 w-2/5 rounded-xl bg-slate-200" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-44 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
