"use client";

import { useActionState } from "react";

import {
  type RepairActionState,
  updateRepairAction,
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

type EditRepairDialogProps = {
  repair: {
    id: string;
    customerName: string;
    device: string;
    issue: string;
    serviceFee: string;
    status: "PENDING" | "ONGOING" | "DONE" | "CLAIMED";
  };
};

const initialState: RepairActionState = {};

const statusOptions = ["PENDING", "ONGOING", "DONE", "CLAIMED"];
const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:h-9";

export function EditRepairDialog({ repair }: EditRepairDialogProps) {
  const [state, formAction, pending] = useActionState(
    updateRepairAction,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            Edit
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Repair</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Update status and fees as work progresses.
        </p>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="id" value={repair.id} />

          <div className="space-y-2">
            <label
              htmlFor={`repair-customer-${repair.id}`}
              className="text-sm font-medium"
            >
              Customer Name
            </label>
            <Input
              id={`repair-customer-${repair.id}`}
              name="customerName"
              defaultValue={repair.customerName}
              placeholder="Juan Dela Cruz"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`repair-device-${repair.id}`}
              className="text-sm font-medium"
            >
              Device
            </label>
            <Input
              id={`repair-device-${repair.id}`}
              name="device"
              defaultValue={repair.device}
              placeholder="iPhone 11"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`repair-issue-${repair.id}`}
              className="text-sm font-medium"
            >
              Issue
            </label>
            <Input
              id={`repair-issue-${repair.id}`}
              name="issue"
              defaultValue={repair.issue}
              placeholder="No display / ghost touch"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`repair-fee-${repair.id}`}
                className="text-sm font-medium"
              >
                Service Fee
              </label>
              <Input
                id={`repair-fee-${repair.id}`}
                name="serviceFee"
                type="number"
                min="0"
                step="0.01"
                defaultValue={repair.serviceFee}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`repair-status-${repair.id}`}
                className="text-sm font-medium"
              >
                Status
              </label>
              <select
                id={`repair-status-${repair.id}`}
                name="status"
                className={selectClassName}
                defaultValue={repair.status}
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
              {pending ? "Updating..." : "Update Repair"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
