"use client";

import { Button } from "@taskforge/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
