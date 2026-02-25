import axios from "axios";
import { MenuPetition } from "../types/RecipeType";

const API_URL = "http://192.168.1.101:8082/api/v1";

const createMenu = async (menu: MenuPetition, idUser: number) => {
  const response = await axios.post(`${API_URL}/menu/create/${idUser}`, menu);
  return response.data;
};

const getLastMenu = async (idUser: number) => {
  const response = await axios.get(`${API_URL}/menu/latest/${idUser}`);
  return response.data;
};

const MenuService = {
  createMenu,
  getLastMenu,
};

export default MenuService;
