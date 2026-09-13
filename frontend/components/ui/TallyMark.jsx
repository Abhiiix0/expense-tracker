
function TallyMark({ size = 24 }) {
  return (
    <svg
      width={size}
      height={(size * 20) / 26}
      viewBox="0 0 26 20"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="var(--color-margin)" strokeWidth="2" strokeLinecap="round">
        <path d="M3 3v14M8.5 3v14M14 3v14M19.5 3v14" />
        <path d="M1.5 16.5 21.5 3.5" />
      </g>
    </svg>
  );
}

export default TallyMark