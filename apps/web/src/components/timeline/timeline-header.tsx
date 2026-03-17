"use client";

interface TimelineHeaderProps {
  weeks: Date[];
  dayWidth: number;
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function TimelineHeader({ weeks, dayWidth }: TimelineHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex border-b bg-background">
      {weeks.map((weekStart, i) => {
        const month = SHORT_MONTHS[weekStart.getMonth()];
        const day = weekStart.getDate();
        return (
          <div
            key={i}
            className="flex-shrink-0 border-r px-1 py-1.5 text-xs text-muted-foreground"
            style={{ width: dayWidth * 7 }}
          >
            {month} {day}
          </div>
        );
      })}
    </div>
  );
}
