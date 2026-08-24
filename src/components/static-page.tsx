export function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-text">{title}</h1>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-2">
        {children}
      </div>
    </div>
  );
}
