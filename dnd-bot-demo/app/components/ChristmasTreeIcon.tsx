export default function ChristmasTreeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80 hover:opacity-100 transition-all duration-300 group-hover:stroke-[#00ff00] dark:group-hover:stroke-[#00ff00]"
    >
      <path d="M12 2L3 19H21L12 2Z" className="group-hover:animate-pulse" />
      <path d="M12 6L7 14H17L12 6Z" className="group-hover:animate-pulse" />
      <path d="M12 10L9 15H15L12 10Z" className="group-hover:animate-pulse" />
      <rect x="11" y="19" width="2" height="3" className="group-hover:animate-pulse" />
    </svg>
  );
}
