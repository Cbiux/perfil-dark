export function PosterMarks() {
  return (
    <div
      className="pointer-events-none absolute top-10 right-8 flex items-center gap-5 sm:top-14 sm:right-14"
      aria-hidden
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M6 22.5 14 5.5 22 22.5Z"
          fill="#1ED4B0"
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10.2" fill="#1ED4B0" stroke="white" strokeWidth="1.6" />
        <rect x="11.1" y="10.6" width="2.2" height="6.8" rx="1.1" transform="rotate(-28 12.2 14)" fill="black" />
        <rect x="15.2" y="10.6" width="2.2" height="6.8" rx="1.1" transform="rotate(-28 16.3 14)" fill="black" />
      </svg>
    </div>
  );
}
