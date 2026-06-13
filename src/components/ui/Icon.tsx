import type { SVGProps } from 'react';

/**
 * Inline SVG icon set.
 *
 * Icons are decorative by default (`aria-hidden`) so they never pollute the
 * accessibility tree — text labels always accompany them. Pass `title` to make
 * an icon meaningful to assistive technology. Using inline SVG (rather than an
 * icon font or emoji) keeps the bundle small, the CSP strict, and rendering
 * crisp at any size.
 */

export type IconName =
  | 'leaf'
  | 'car'
  | 'home'
  | 'food'
  | 'shopping'
  | 'plane'
  | 'bolt'
  | 'recycle'
  | 'target'
  | 'chart'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'globe'
  | 'trophy'
  | 'shield'
  | 'spark';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Accessible name. When provided the icon is exposed to AT; otherwise hidden. */
  title?: string;
  size?: number;
}

const PATHS: Record<IconName, React.ReactNode> = {
  leaf: <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7zm0 0c0-3 1-6 6-9" />,
  car: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 3.5C1.2 11.6 1 12 1 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  home: (
    <>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  food: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2" />
      <path d="M5 2v20" />
      <path d="M17 2c-1.7 0-3 2-3 5s1 4 3 4 3-1 3-4-1.3-5-3-5z" />
      <path d="M17 11v11" />
    </>
  ),
  shopping: (
    <>
      <path d="M6 2 3 6v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  plane: <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5S18 3 16.5 4.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />,
  recycle: (
    <>
      <path d="M7 19H5a2 2 0 0 1-1.7-3l1.4-2.3" />
      <path d="m9.2 6.7 1.5-2.6a2 2 0 0 1 3.4 0l2 3.4" />
      <path d="M14 16h4.5a2 2 0 0 0 1.7-3l-1.3-2.2" />
      <path d="m7 19 2-3-3.5-.8M16.5 7.5 17 4l-3.5 1M14 16l-2.5 2.5L14 21" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15v3M12 9v9M17 5v13" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-left': <path d="M19 12H5M11 18l-6-6 6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" />
      <path d="M6 6H4a2 2 0 0 0 0 4h2M18 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M12 14v4M9 21h6M10 18h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />,
};

export function Icon({ name, title, size = 24, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
