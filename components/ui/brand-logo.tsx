// components/ui/brand-logo.tsx
import { cn } from "@/lib/utils"; // 确保你有这个 tailwind-merge 工具

export const BrandLogo = ({ className, showIcon = true }: { className?: string, showIcon?: boolean }) => {
  return (
    <div className={cn("flex items-center gap-3 text-brand-primary", className)}>
      {showIcon && (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform duration-700 hover:rotate-180"
        >
          {/* 极简几何拱门设计 */}
          <path d="M12 2C6.477 2 2 6.477 2 12v10h20V12c0-5.523-4.477-10-10-10z" />
          <path d="M12 12v10" />
          <path d="M8 12h8" />
        </svg>
      )}
      <span className="font-serif text-lg tracking-[0.25em] uppercase font-medium">
        Luxe Paradise
      </span>
    </div>
  );
};