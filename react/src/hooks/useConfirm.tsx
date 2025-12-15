import React, { useCallback, useRef, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

type ConfirmOptions = {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

export default function useConfirm() {
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<Required<ConfirmOptions>>({
    title: "Confirm",
    description: "Are you sure?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    destructive: false,
  });

  const confirm = useCallback((options: ConfirmOptions = {}) => {
    setOpts({
      title: options.title ?? "Confirm",
      description: options.description ?? "Are you sure?",
      confirmText: options.confirmText ?? "Confirm",
      cancelText: options.cancelText ?? "Cancel",
      destructive: options.destructive ?? false,
    });

    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(false);
    resolverRef.current = null;
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(true);
    resolverRef.current = null;
  }, []);

  const Confirm = (
    <ConfirmDialog
      open={open}
      title={opts.title}
      description={opts.description}
      confirmText={opts.confirmText}
      cancelText={opts.cancelText}
      destructive={opts.destructive}
      onClose={handleClose}
      onConfirm={handleConfirm}
    />
  );

  return { confirm, Confirm };
}
