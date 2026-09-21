import type { SVGProps } from "react";

interface ArrowProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
}

export const Arrow = ({
    size = 24,
    strokeWidth = 2,
    className = "",
    ...props
}: ArrowProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide lucide-arrow-right ${className}`}
            {...props}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
};