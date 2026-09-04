import type { ReactNode } from "react";

type Props = {
  text: string;
  children: ReactNode;
};

const SimpleTooltip = ({ text, children }: Props) => {
  return (
    <div className="relative group inline-block">
      {children}

      <div className="tooltip-content
      ">
        {text}
      </div>
    </div>
  );
};

export default SimpleTooltip;