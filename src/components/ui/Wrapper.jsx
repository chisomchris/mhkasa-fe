import { cn } from "../../utils/cn";
export const Wrapper = ({ children, className = "" }) => {
  return (
    <div className={cn("mx-auto w-11/12 max-w-[1024px]", className)}>
      {children}
    </div>
  );
};
