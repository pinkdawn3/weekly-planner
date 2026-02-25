export type UserInfo = {
  id: number;
  userName: string;
  email: string;
  password?: string;
  role?: string;
};

export type LoginPetition = {
  userName: string;
  password: string;
};
