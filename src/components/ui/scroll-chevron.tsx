export const ScrollChevron = () => {
  return (
    <div
      className="flex flex-col items-center text-text-tertiary"
      aria-hidden="true"
      style={{ animation: "bounce-chevron 2s ease-in-out infinite" }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
