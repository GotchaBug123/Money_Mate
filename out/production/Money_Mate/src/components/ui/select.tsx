import * as React from "react";
import { cn } from "./utils";

interface SelectProps extends React.ComponentProps<"select"> {
  children: React.ReactNode;
}

function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// Dummy components for compatibility - not used with native select
function SelectTrigger({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  return <></>;
}

function SelectContent({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ className, children, value, ...props }: React.ComponentProps<"option"> & { value?: string }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
