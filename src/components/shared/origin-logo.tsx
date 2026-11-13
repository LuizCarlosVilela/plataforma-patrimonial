import { cn } from "@/lib/utils";

interface OriginLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function OriginLogo({ size = 40, showText = true, className }: OriginLogoProps) {
  return (
    <div className={cn("origin-logo inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <circle
          className="logo-outer"
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="#b08a3e"
          strokeWidth="2"
        />
        <circle
          cx="20"
          cy="20"
          r="12"
          fill="none"
          stroke="#cfc6b4"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle
          className="nucleus"
          cx="20"
          cy="20"
          r="5"
          fill="#b08a3e"
        />
      </svg>
      {showText && (
        <span className="text-base font-semibold tracking-widest text-[#efeae0] leading-none">
          ORIGIN
        </span>
      )}
    </div>
  );
}
