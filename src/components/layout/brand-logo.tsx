type BrandLogoProps = {
  compact?: boolean;
};

const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="8" fill="url(#paint0_linear)" />
    <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="white" />
    <path d="M16 20L20 16L24 20L20 24L16 20Z" fill="#2563EB" />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2563EB" />
        <stop offset="0.5" stopColor="#4F46E5" />
        <stop offset="1" stopColor="#10B981" />
      </linearGradient>
    </defs>
  </svg>
);

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <LogoIcon className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0" />
      <div>
        <p className="text-base font-bold tracking-tight text-slate-900">
          Technote Logbook
        </p>
        {!compact ? (
          <p className="text-xs text-muted-foreground">
            Digital store notebook
          </p>
        ) : null}
      </div>
    </div>
  );
}
