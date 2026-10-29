interface Props {
  className?: string;
}

// Three stacked dots (1.5px radius), 6px apart.
export default function DotsVerticalIcon({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 4 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 2.25h.01M2 8.25h.01M2 14.25h.01" />
    </svg>
  );
}
