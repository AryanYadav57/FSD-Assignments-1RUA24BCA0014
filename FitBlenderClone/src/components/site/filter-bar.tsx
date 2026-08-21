"use client";

type FilterBarProps = {
  groups: Array<{
    label: string;
    options: string[];
  }>;
  active: Record<string, string>;
  onChange: (groupLabel: string, value: string) => void;
};

export function FilterBar({ groups, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 min-w-[110px] text-xs font-bold uppercase tracking-wider text-ink-soft">
            {group.label}:
          </span>
          {group.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className="filter-chip"
              data-active={active[group.label] === opt ? "true" : undefined}
              onClick={() =>
                onChange(group.label, active[group.label] === opt ? "" : opt)
              }
            >
              {opt}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
