export type Recipe = {
  id: number | undefined;
  name: string;
  description: string;
  label: "hidratos" | "fibra" | "proteína" | "pescado";
  ingredients: string;
  steps: string;
  weekDay: string;
};

export type Preferences = {
  hidratos: number;
  fibra: number;
  proteína: number;
  pescado: number;
};

export type MenuPetition = {
  recipeDtoList: Recipe[];
};

export type Menu = {
  id: number;
  created: string;
  recipes: Recipe[];
};
