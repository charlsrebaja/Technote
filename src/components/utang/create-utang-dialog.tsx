"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  createUtangAction,
  type UtangActionState,
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

const initialState: UtangActionState = {};

export function CreateUtangDialog() {
  const [open, setOpen] = useState(false);
  const wasPendingRef = useRef(false);
  const [state, formAction, pending] = useActionState(
    createUtangAction,
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
      <DialogTrigger render={<Button>Add Utang</Button>} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Utang Record</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Track unpaid balances so collection and follow-up become easier.
        </p>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="utang-customer" className="text-sm font-medium">
              Customer Name
            </label>
            <Input
              id="utang-customer"
              name="customerName"
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="utang-description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="utang-description"
              name="description"
              placeholder="Phone case and charger"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="utang-total" className="text-sm font-medium">
                Total Amount
              </label>
              <Input
                id="utang-total"
                name="totalAmount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="utang-paid" className="text-sm font-medium">
                Paid Amount
              </label>
              <Input
                id="utang-paid"
                name="paidAmount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
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
              {pending ? "Saving..." : "Save Utang"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
