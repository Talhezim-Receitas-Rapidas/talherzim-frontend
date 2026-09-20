import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 68"
      fill="none"
      aria-label="Talherzim Logo"
      role="img"
      {...props}
    >
      {/* ícone */}
      <g transform="translate(10, 6)">
        <rect x="4" y="4" width="56" height="56" rx="18" fill="#252525" />

        {/* fundo do ícone */}
        <rect x="0" y="0" width="56" height="56" rx="18" fill="#9F3D00" />

        {/* panela / bowl */}
        <path
          d="M16 35C16 42.5 21.5 47 28 47C34.5 47 40 42.5 40 35V20H16V35Z"
          fill="#FFFDF8"
        />

        <path
          d="M12 24H44"
          stroke="#FFFDF8"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M22 13C22 13 25 16 28 16C31 16 34 13 34 13"
          stroke="#FDE047"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <circle cx="36" cy="22" r="3" fill="#2A9D8F" />
      </g>

      {/* nome */}
      <text
        x="80"
        y="48"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Nunito', 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="32"
        fill="#252525"
        letterSpacing="-0.5"
      >
        Talherzim
        <tspan fill="#9F3D00">.</tspan>
      </text>
    </svg>
  );
}
