"use client";

import { useActionState } from "react";

import {
  createRepairAction,
  type RepairActionState,
} from "@/app/(protected)/repairs/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialState: RepairActionState = {};

const statusOptions = ["PENDING", "ONGOING", "DONE", "CLAIMED"];
const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:h-9";

export function CreateRepairDialog() {
  const [state, formAction, pending] = useActionState(
    createRepairAction,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger render={<Button>Add Repair</Button>} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Repair Log</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Log device and issue details clearly so repair progress is easier to
          track.
        </p>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="repair-customer" className="text-sm font-medium">
              Customer Name
            </label>
            <Input
              id="repair-customer"
              name="customerName"
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="repair-device" className="text-sm font-medium">
              Device
            </label>
            <Input
              id="repair-device"
              name="device"
              placeholder="iPhone 11"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="repair-issue" className="text-sm font-medium">
              Issue
            </label>
            <Input
              id="repair-issue"
              name="issue"
              placeholder="No display / ghost touch"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="repair-fee" className="text-sm font-medium">
                Service Fee
              </label>
              <Input
                id="repair-fee"
                name="serviceFee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="repair-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="repair-status"
                name="status"
                className={selectClassName}
                defaultValue="PENDING"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
              {pending ? "Saving..." : "Save Repair"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
