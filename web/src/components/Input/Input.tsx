import { ReactNode } from "react";

interface IProps {
  type?: string;
  className?: string;
  value: any;
  name: string;
  handleChange?(e: any): void;
  onFocus?(e: any): void;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  ref?: React.RefObject<any>;
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
    ...inputProps
  }) => {
    return (
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
          {...inputProps}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none pr-3">
            {icon}
          </div>
        )}
      </label>
    );
  };
  
  export default Input;