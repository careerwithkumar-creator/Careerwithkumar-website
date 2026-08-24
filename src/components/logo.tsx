// Renders both logo variants; CSS (.theme-only-*, see globals.css) shows
// only the one matching the active theme — no client component needed.
export function Logo({
  className,
  forceDark,
}: {
  className?: string;
  /** Always render the dark-background variant, ignoring the site theme —
   * for contexts that are always navy regardless of theme, like the footer. */
  forceDark?: boolean;
}) {
  if (forceDark) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/logo-dark.svg" alt="Careerwithkumar" className={className} />;
  }

  return (
    <>
      <span className="theme-only-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-light.svg" alt="Careerwithkumar" className={className} />
      </span>
      <span className="theme-only-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dark.svg" alt="Careerwithkumar" className={className} />
      </span>
    </>
  );
}
