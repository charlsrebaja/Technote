"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  type SaleActionState,
  updateSaleAction,
} from "@/app/(protected)/sales/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type EditSaleDialogProps = {
  sale: {
    id: string;
    customerName: string;
    description: string;
    amount: string;
    dateValue: string;
  };
};

const initialState: SaleActionState = {};

export function EditSaleDialog({ sale }: EditSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const wasPendingRef = useRef(false);
  const [state, formAction, pending] = useActionState(
    updateSaleAction,
    initialState,
  );

  useEffect(() => {
    if (pending) {
      wasPendingRef.current = true;
      return;
    }

    if (wasPendingRef.current) {
      wasPendingRef.current = false;

      if (!state.error) {
        setOpen(false);
      }
    }
  }, [pending, state.error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            Edit
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Sale</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Adjust details if this sale was entered incorrectly.
        </p>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="id" value={sale.id} />

          <div className="space-y-2">
            <label
              htmlFor={`sale-customer-${sale.id}`}
              className="text-sm font-medium"
            >
              Customer Name
            </label>
            <Input
              id={`sale-customer-${sale.id}`}
              name="customerName"
              defaultValue={sale.customerName}
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`sale-description-${sale.id}`}
              className="text-sm font-medium"
            >
              Description
            </label>
            <Input
              id={`sale-description-${sale.id}`}
              name="description"
              defaultValue={sale.description}
              placeholder="Tempered glass + installation"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`sale-amount-${sale.id}`}
                className="text-sm font-medium"
              >
                Amount
              </label>
              <Input
                id={`sale-amount-${sale.id}`}
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={sale.amount}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`sale-date-${sale.id}`}
                className="text-sm font-medium"
              >
                Date
              </label>
              <Input
                id={`sale-date-${sale.id}`}
                name="date"
                type="date"
                defaultValue={sale.dateValue}
                required
              />
            </div>
          </div>

          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              {pending ? "Updating..." : "Update Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
