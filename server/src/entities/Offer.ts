import { BaseEntity } from "./BaseEntity";
import UserInput from "./UserInput";

class Offer extends BaseEntity {
    userInput!: UserInput;
    price!: number;
    currency!: string;
}