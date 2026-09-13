"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change appearance">
          {mounted && theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : mounted && theme === "system" ? (
            <Laptop className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4" />
          Light
          {mounted && theme === "light" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4" />
          Dark
          {mounted && theme === "dark" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="h-4 w-4" />
          System
          {mounted && theme === "system" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppearancePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
              active ? "border-foreground/60 ring-2 ring-foreground/20" : "border-border hover:border-foreground/30",
            )}
          >
            <span
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-lg border",
                opt.value === "light" && "bg-[#f5f5f7] border-black/10",
                opt.value === "dark" && "bg-[#242426] border-white/10",
                opt.value === "system" &&
                  "bg-[linear-gradient(135deg,#f5f5f7_50%,#242426_50%)] border-black/10",
              )}
            >
              <opt.icon className={cn("h-4 w-4", opt.value === "dark" ? "text-white" : "text-black/70")} />
            </span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
