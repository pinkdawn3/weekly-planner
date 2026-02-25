import { createContext } from "react";
import { UserInfo } from "../types/UserInfo";

export type UserInfoTypeContext = {
  isLogged: boolean;
  setisLogged: Function;
  user: UserInfo;
  setUser: Function;
  currentUser: UserInfo;
  setCurrentUser: Function;
  users: UserInfo[];
  setUsers: Function;
};

export const UserInfoContext = createContext({} as UserInfoTypeContext);
