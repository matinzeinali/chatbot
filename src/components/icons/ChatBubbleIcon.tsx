interface Props {
  className?: string;
}

// Speech bubble with a centred tail, traced from the design (viewBox keeps original coordinates).
export default function ChatBubbleIcon({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="46.25 185.25 21 19.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M52.25 191.25H61.25M52.25 194.25H56.75M47 195.76C47 197.36 48.123 198.754 49.707 198.987C50.836 199.153 51.977 199.28 53.13 199.366C53.48 199.392 53.8 199.576 53.995 199.867L56.75 204L59.505 199.867C59.6016 199.723 59.7298 199.603 59.8797 199.517C60.0295 199.43 60.1972 199.378 60.37 199.366C61.5152 199.281 62.6569 199.154 63.793 198.987C65.377 198.754 66.5 197.361 66.5 195.759V189.741C66.5 188.139 65.377 186.746 63.793 186.513C61.461 186.171 59.107 185.999 56.75 186C54.358 186 52.006 186.175 49.707 186.513C48.123 186.746 47 188.14 47 189.741V195.759V195.76Z" />
    </svg>
  );
}
