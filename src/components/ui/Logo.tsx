import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 80"
      fill="none"
      aria-label="Talherzim Logo"
      role="img"
      {...props}
    >
      {/* Ícone */}
      <g transform="translate(10, 12)">
        <rect x="4" y="4" width="56" height="56" rx="18" fill="#252525" />

        {/* Fundo do ícone */}
        <rect x="0" y="0" width="56" height="56" rx="18" fill="#9F3D00" />

        {/* Panela / Bowl */}
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

      {/* Nome */}
      <text
        x="80"
        y="44"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Nunito', 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="32"
        fill="#252525"
        letterSpacing="-0.5"
      >
        Talherzim
        <tspan fill="#9F3D00">.</tspan>
      </text>

      {/* Descrição*/}
      <text
        x="82"
        y="66"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif"
        fontWeight="700"
        fontSize="16"
        fill="#78716C"
        letterSpacing="1.2"
      >
        DA DESPENSA AO PRATO
      </text>
    </svg>
  );
}
