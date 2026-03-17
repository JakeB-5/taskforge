"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
} from "./dialog";

// Command context
interface CommandContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const CommandContext = React.createContext<CommandContextValue>({
  search: "",
  setSearch: () => {},
});

// Command root
interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, ...props }, ref) => {
    const [search, setSearch] = React.useState("");

    return (
      <CommandContext.Provider value={{ search, setSearch }}>
        <div
          ref={ref}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = "Command";

// Command Dialog
interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function CommandDialog({ children, ...props }: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[data-command-input-wrapper]]:border-b">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Command Input
interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => {
    const { search, setSearch } = React.useContext(CommandContext);

    return (
      <div
        className="flex items-center border-b px-3"
        data-command-input-wrapper=""
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={ref}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

// Command List
const CommandList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

// Command Empty
const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-6 text-center text-sm", className)}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

// Command Group
interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[data-command-group-heading]]:px-2 [&_[data-command-group-heading]]:py-1.5 [&_[data-command-group-heading]]:text-xs [&_[data-command-group-heading]]:font-medium [&_[data-command-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {heading && <div data-command-group-heading="">{heading}</div>}
      {children}
    </div>
  )
);
CommandGroup.displayName = "CommandGroup";

// Command Separator
const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

// Command Item
interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onSelect?: () => void;
  value?: string;
  keywords?: string[];
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  (
    { className, disabled, onSelect, value, keywords = [], children, ...props },
    ref
  ) => {
    const { search } = React.useContext(CommandContext);

    // Filter logic
    const textContent = value || (typeof children === "string" ? children : "");
    const searchableText = [textContent, ...keywords]
      .join(" ")
      .toLowerCase();
    const isMatch =
      !search || searchableText.includes(search.toLowerCase());

    if (!isMatch) return null;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={false}
        aria-disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          className
        )}
        onClick={() => {
          if (!disabled && onSelect) onSelect();
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = "CommandItem";

// Command Shortcut
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
