"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" dir="ltr">
      <body className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center font-sans">
        <main className="max-w-lg">
          <h1 className="text-3xl font-black text-slate-900">Something went wrong</h1>
          <p className="mt-4 leading-7 text-slate-600">The page could not be loaded. Please try again.</p>
          <button type="button" onClick={reset} className="mt-7 rounded-xl bg-sky-500 px-6 py-3 font-bold text-white">Try again</button>
        </main>
      </body>
    </html>
  );
}
