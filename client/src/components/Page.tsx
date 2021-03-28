import { forwardRef } from "react";

interface PageProps {
  children: any;
  className?: any;
  title?: string;
  rest?: any;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...rest }, ref): any => {
    return (
      <div ref={ref} {...rest}>
        <title>{title}</title>
        {children}
      </div>
    );
  }
);
