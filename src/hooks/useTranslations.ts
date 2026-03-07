import { useContext } from "react";
import { UserContext } from "../contexts/User/UserContext";

const translations = {
  en: {
    es: "Spanish",
    en: "English",

    Protein: "Protein",
    Carbohydrates: "Carbohydrates",
    Fibre: "Fibre",
    Fish: "Fish",

    Lunch: "Lunch",
    Dinner: "Dinner",

    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday",
  },

  es: {
    es: "Español",
    en: "Inglés",

    Protein: "Proteína",
    Carbohydrates: "Hidratos",
    Fibre: "Fibra",
    Fish: "Pescado",

    Lunch: "Almuerzo",
    Dinner: "Cena",

    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  },
} as const;

type TranslationKey = keyof typeof translations.en;
export function useTranslate() {
  const { language } = useContext(UserContext);

  return (key: string) => {
    const translationKey = key as TranslationKey;
    return translations[language][translationKey] || key;
  };
}
