"use client";
export default function JobsError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl p-8" role="alert">
      <h1 className="text-xl font-bold">Jobs are temporarily unavailable</h1>
      <p className="mt-3">
        Please try again shortly. Always verify recruitment information with the
        official employer.
      </p>
      <button
        className="mt-4 rounded bg-blue px-4 py-2 text-white"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
