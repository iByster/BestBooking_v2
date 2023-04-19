import { Option, Select } from "@material-tailwind/react";
import React from "react";

interface IProps {
  childId: number;
  age?: number;
  handleAgeChange(
    childAgeKey: number,
    roomKey: number,
    age: string | undefined
  ): void;
  roomKey: number;
}

const childAgesOptions = [
  "Under 1",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
];

const ChildAgeSelect: React.FC<IProps> = ({
  childId,
  age,
  handleAgeChange,
  roomKey,
}) => {
  return (
    <div className="w-4">
      <Select
        color="yellow"
        label={`Child ${childId + 1} age`}
        value={age ? age.toString() : ""}
        onChange={(value) => handleAgeChange(childId, roomKey, value)}
        // selected={}
        selected={() =>
          <span>{age}</span>
        }
      >
        <div className="h-44">
          {childAgesOptions.map((childAge: string) => (
            <Option key={childAge} value={childAge}>
              {childAge}
            </Option>
          ))}
        </div>
      </Select>
    </div>
  );
};

export default ChildAgeSelect;
