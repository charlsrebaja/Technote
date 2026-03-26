"use client";

import { useActionState } from "react";

import {
  createSaleAction,
  type SaleActionState,
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

const initialState: SaleActionState = {};

export function CreateSaleDialog() {
  const [state, formAction, pending] = useActionState(
    createSaleAction,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger render={<Button>Add Sale</Button>} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Sale Log</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Record every transaction to keep daily income accurate.
        </p>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="sale-customer" className="text-sm font-medium">
              Customer Name
            </label>
            <Input
              id="sale-customer"
              name="customerName"
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sale-description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="sale-description"
              name="description"
              placeholder="Tempered glass + installation"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="sale-amount" className="text-sm font-medium">
                Amount
              </label>
              <Input
                id="sale-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sale-date" className="text-sm font-medium">
                Date
              </label>
              <Input id="sale-date" name="date" type="date" required />
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
              {pending ? "Saving..." : "Save Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
