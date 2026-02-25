import React from "react";
import {
  UserInfoTypeContext,
  UserInfoContext,
} from "../contexts/UserInfoContext";
import { UserInfo } from "../types/UserInfo";

type UserInfoProviderProps = {
  children: JSX.Element | JSX.Element[];
};

function UserInfoProvider(props: UserInfoProviderProps) {
  const { children } = props;

  const [isLogged, setisLogged] = React.useState(false);

  let userDefault: UserInfo = {
    id: 0,
    userName: "",
    email: "",
    password: "",
    role: "",
  };

  const [user, setUser] = React.useState(userDefault);
  const [users, setUsers] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(userDefault);

  const defaultValue: UserInfoTypeContext = {
    isLogged,
    setisLogged,
    user,
    setUser,
    currentUser,
    setCurrentUser,
    users,
    setUsers,
  };

  return (
    <UserInfoContext.Provider value={defaultValue}>
      {children}
    </UserInfoContext.Provider>
  );
}

export default UserInfoProvider;
