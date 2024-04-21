import { isValidUsername } from "6pp";
// enevy validator must have this thing-isvalid:boolean , errormessage:string

export const usernameValidator = (username) => {
  if (!isValidUsername(username))
    return { isvalid: false, errorMessage: "Username Is Invalid" };
};
