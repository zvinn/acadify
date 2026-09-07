import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-20 text-center">
      <div className="max-w-lg">
        <p className="text-7xl font-black text-brand-primary/30">404</p>
        <h1 className="mt-3 text-3xl font-black text-brand-secondary sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 leading-7 text-text-muted">
          The address may be incorrect or the page may have moved.
        </p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-brand-primary px-6 py-3 font-bold text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
