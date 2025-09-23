
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn("text-primary", className)}
      fill="currentColor"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM72,128a56,56,0,0,1,56-56,8,8,0,0,1,0,16,40,40,0,0,0-40,40,8,8,0,0,1-16,0Zm113.3,41.29a8,8,0,0,1-11.3,0l-28-28a8,8,0,0,1,0-11.31,8,8,0,0,1,11.31,0l28,28A8,8,0,0,1,185.3,169.29ZM176,128a48,48,0,0,1-48,48,8,8,0,0,1,0-16,32,32,0,0,0,32-32,8,8,0,0,1,16,0Z" />
    </svg>
  );
}
