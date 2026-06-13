import type { ReactNode } from 'react';

export interface ChartFrameProps {
  title: string;
  /** Plain-language summary, used as the figure's accessible caption. */
  summary: string;
  /** The visual chart. It is marked decorative; the table carries the data. */
  children: ReactNode;
  /** Accessible data-table equivalent of the chart. */
  table: ReactNode;
}

/**
 * Wraps every chart with its accessible equivalents.
 *
 * The chart itself is hidden from assistive tech (`aria-hidden`) because color and
 * shape don't translate; instead a text `summary` and a real `<table>` (revealed
 * via a keyboard-operable `<details>`) convey the same information. This is how we
 * satisfy "never rely on color alone" and provide a table alternative for each chart.
 */
export function ChartFrame({ title, summary, children, table }: ChartFrameProps) {
  return (
    <figure className="m-0">
      <figcaption className="sr-only">{summary}</figcaption>
      <div aria-hidden="true">{children}</div>
      <details className="group mt-3">
        <summary className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span className="group-open:hidden">Show data table</span>
          <span className="hidden group-open:inline">Hide data table</span>
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{title}</caption>
            {table}
          </table>
        </div>
      </details>
    </figure>
  );
}

/** Shared table styling helpers so each chart's fallback looks consistent. */
export const thClass = 'border-b border-primary/15 px-3 py-2 text-left font-semibold text-ink';
export const tdClass = 'border-b border-primary/10 px-3 py-2 text-ink/80';
