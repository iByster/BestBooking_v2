import { forwardRef, ReactNode, Ref } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { VscCalendar } from "react-icons/vsc";
import Input from "../Input";
import "./DateInput.css";

interface IProps {
  type?: string;
  className?: string;
  value: any;
  name: string;
  placeholder?: string;
  handleChange(e: any): void;
  minDate: Date;
}

const DateInput: React.FC<IProps> = ({
  handleChange,
  name,
  value,
  className,
  placeholder,
  minDate,
}) => {
  const InputRef = forwardRef(
    (
      { onClick, value }: { onClick: () => void; value: any },
      ref: Ref<HTMLDivElement>
    ) => (
      <div onClick={onClick} ref={ref}>
        <Input
          placeholder={placeholder}
          value={value}
          name={name}
          readOnly
          icon={<VscCalendar size={25} color="gray" />}
        />
      </div>
    )
  );

  return (
    <ReactDatePicker
      onChange={(date) => handleChange(date)}
      wrapperClassName={"datepicker-wrapper"}
      selected={value}
      minDate={minDate}
      dateFormat="dd/MM/yyyy"
      className={`${className}`}
      customInput={<InputRef value={value} onClick={() => {}}/>}
    />
  );
};

export default DateInput;
