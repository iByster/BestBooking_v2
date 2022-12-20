import { IRoom, IUserInput } from "../types";

class UserInput implements IUserInput {
    locationName!: string;
    checkIn!: Date;
    checkOut!: Date;
    rooms!: IRoom[];
}

export default UserInput;