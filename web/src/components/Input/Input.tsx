import { ReactNode } from "react";

interface IProps {
  type?: string;
  className?: string;
  value?: any;
  name: string;
  handleChange?(e: any): void;
  onFocus?(e: any): void;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  ref?: React.RefObject<any>;
  error?: string;
  autoComplete?: 'off' | 'on';
}

const Input: React.FC<IProps> = ({
  type = "text",
  className = "",
  placeholder = "",
  name,
  value,
  icon,
  handleChange,
  onFocus,
  readOnly,
  error,
  ref,
  autoComplete,
  ...inputProps
}) => {
  return (
    <div className={"input-wrapper flex flex-col relative"}>
      <label className="relative block w-72">
        <input
          type={type}
          className={`h-12 pl-4 pr-10 py-2 w-full rounded-md border border-gray-900 focus:ring-2 focus:ring-gold focus:ring-gold-500 focus:border-gold-500 focus:outline-none transition duration-300 text-xs ${className}`}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          readOnly={readOnly}
          onFocus={onFocus}
          autoComplete={autoComplete}
          // ref={ref}
          {...inputProps}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none pr-3">
            {icon}
          </div>
        )}
      </label>
      <p className="absolute top-14 text-xs text-red-600 font-extrabold">{error}</p>
    </div>
  );
};

export default Input;
