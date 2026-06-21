"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search…" }: SearchBarProps) {
  return (
    <div
      role="search"
      style={{ position: "relative", width: "min(100%, 340px)" }}
    >
      {/* Magnifier icon */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "var(--space-4)",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-soft)",
          pointerEvents: "none",
          display: "flex",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: "100%",
          padding: "10px var(--space-5) 10px calc(var(--space-4) + 22px)",
          fontSize: "var(--text-sm)",
          border: "1.5px solid var(--border-soft)",
          borderRadius: "var(--radius-pill)",
          background: "var(--surface-card)",
          color: "var(--text-default)",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--accent-olive)"; }}
        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-soft)"; }}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: "var(--space-3)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-soft)",
            padding: 4,
            display: "flex",
            borderRadius: "50%",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
