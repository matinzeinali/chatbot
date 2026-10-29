interface Props {
  className?: string;
}

// Paper plane outline traced from the design.
export default function SendIcon({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="1408 571 26 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1417.68 582.429L1410 575.289C1417.46 573.458 1425.19 572.915 1432.83 573.683C1429.68 580.689 1425.34 587.105 1420.03 592.654L1417.68 582.429ZM1417.68 582.429L1425.02 578.193" />
    </svg>
  );
}
