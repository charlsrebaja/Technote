"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  type UtangActionState,
  updateUtangAction,
} from "@/app/(protected)/utang/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type EditUtangDialogProps = {
  utang: {
    id: string;
    customerName: string;
    description: string;
    totalAmount: string;
    paidAmount: string;
  };
};

const initialState: UtangActionState = {};
export function EditUtangDialog({ utang }: EditUtangDialogProps) {
  const [open, setOpen] = useState(false);
  const wasPendingRef = useRef(false);
  const [state, formAction, pending] = useActionState(
    updateUtangAction,
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
          <DialogTitle>Edit Utang</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Update payment progress and amounts to keep balances accurate.
        </p>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="id" value={utang.id} />

          <div className="space-y-2">
            <label
              htmlFor={`utang-customer-${utang.id}`}
              className="text-sm font-medium"
            >
              Customer Name
            </label>
            <Input
              id={`utang-customer-${utang.id}`}
              name="customerName"
              defaultValue={utang.customerName}
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`utang-description-${utang.id}`}
              className="text-sm font-medium"
            >
              Description
            </label>
            <Input
              id={`utang-description-${utang.id}`}
              name="description"
              defaultValue={utang.description}
              placeholder="Phone case and charger"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`utang-total-${utang.id}`}
                className="text-sm font-medium"
              >
                Total Amount
              </label>
              <Input
                id={`utang-total-${utang.id}`}
                name="totalAmount"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={utang.totalAmount}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`utang-paid-${utang.id}`}
                className="text-sm font-medium"
              >
                Paid Amount
              </label>
              <Input
                id={`utang-paid-${utang.id}`}
                name="paidAmount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={utang.paidAmount}
                placeholder="0.00"
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
              {pending ? "Updating..." : "Update Utang"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
