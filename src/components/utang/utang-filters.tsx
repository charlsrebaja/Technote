"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UtangFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("s") || "";
  const currentStatus = searchParams.get("status") || "ALL";

  const [searchQuery, setSearchQuery] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("s", searchQuery));
    });
  };

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      let params = createQueryString("status", status === "ALL" ? "" : status);
      router.push(pathname + "?" + params);
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = currentSearch.length > 0 || currentStatus !== "ALL";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form
        onSubmit={handleSearch}
        className="relative flex-1 max-w-sm flex items-center"
      >
        <Input
          type="text"
          placeholder="Search customer or description..."
          className="pr-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {!searchQuery ? (
          <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        ) : (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              startTransition(() => {
                router.push(pathname + "?" + createQueryString("s", ""));
              });
            }}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
      <div className="flex gap-2 items-center">
        <div className="flex bg-slate-100 p-1 rounded-md border text-sm">
          <button
            onClick={() => handleStatusChange("ALL")}
            className={`px-3 py-1.5 rounded-sm transition-colors ${
              currentStatus === "ALL"
                ? "bg-white shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusChange("UNPAID")}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentStatus === "UNPAID"
                ? "bg-white shadow-sm font-medium text-amber-600"
                : "text-muted-foreground hover:text-amber-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Unpaid
          </button>
          <button
            onClick={() => handleStatusChange("PAID")}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              currentStatus === "PAID"
                ? "bg-white shadow-sm font-medium text-emerald-600"
                : "text-muted-foreground hover:text-emerald-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Paid
          </button>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
            className="h-9 w-9 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
