import { createContext } from "react";
import { Language, Theme } from "../../types/preferences";

export type UserTypeContext = {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  handleSetLanguage: (value: Language) => void;
};

export const UserContext = createContext({} as UserTypeContext);
