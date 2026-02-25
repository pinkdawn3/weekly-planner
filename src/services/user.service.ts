import axios from "axios";
import { LoginPetition, UserInfo } from "../types/UserInfo";

const API_URL = "http://192.168.1.101:8082/api/v1";

const login = async (loginRequest: LoginPetition) => {
  const response = await axios.post(`${API_URL}/auth/login`, loginRequest);

  const user: UserInfo = {
    id: response.data.id,
    userName: response.data.username,
    email: response.data.email,
    role: response.data.role,
  };
  return user;
};

const logout = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`);
  return response.data;
};

const register = async (formData: {
  userName: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/user`, formData);
  return response.data;
};

const updateUser = async (
  updatedUser: {
    userName: string;
    email: string;
    password: string;
  },
  userId: number
) => {
  const response = await axios.put(`${API_URL}/user/${userId}`, updatedUser);
  return response.data;
};

const deleteUser = async (userId: number) => {
  const response = await axios.delete(`${API_URL}/user/${userId}`);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

const UserService = {
  login,
  logout,
  register,
  updateUser,
  deleteUser,
  getAllUsers,
};
export default UserService;
