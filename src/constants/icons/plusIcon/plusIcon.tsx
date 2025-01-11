import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";
import { IconSvgProps } from "../../../types/Icons";

export const PlusIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps & JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    width={width || size}
    role="presentation"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M12 6v12" />
      <path d="M6 12h12" />
    </g>
  </svg>
);
