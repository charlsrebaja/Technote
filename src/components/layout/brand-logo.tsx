type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="Technote Logo"
        className="w-10 h-10 object-contain drop-shadow-sm"
      />
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
