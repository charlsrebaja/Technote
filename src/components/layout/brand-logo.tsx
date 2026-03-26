import { Wrench } from "lucide-react";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-sm">
        <Wrench className="size-5" />
      </div>
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
