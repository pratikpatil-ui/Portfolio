export function Logo() {
  return (
    <svg
      width="50"
      height="32"
      viewBox="0 0 50 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pratik Patil"
      className="block"
    >
      <text
        x="0"
        y="25"
        fontFamily="var(--font-mono), ui-monospace, 'Geist Mono', monospace"
        fontWeight={600}
        fontSize={28}
        letterSpacing={-1.4}
        fill="var(--color-logo-text)"
      >
        PP
      </text>
      <rect
        className="logo-cursor"
        x="38"
        y="19"
        width="6"
        height="6"
        fill="var(--color-ai)"
      />
    </svg>
  )
}
