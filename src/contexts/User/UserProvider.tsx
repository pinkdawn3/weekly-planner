import React, { useEffect, useState } from "react";
import { i18n } from "@lingui/core";
import { getLocales } from "expo-localization";

import { messages as enMessages } from "../../locales/en/messages";
import { messages as esMessages } from "../../locales/es/messages";

import { UserTypeContext, UserContext } from "./UserContext";
import { Language, Theme } from "../../types/preferences";
import { I18nProvider } from "@lingui/react";
import {
  getPreference,
  setPreference,
} from "../../services/db/database.service";

i18n.load({ es: esMessages, en: enMessages });

type UserProviderProps = {
  children: React.ReactNode | React.ReactNode[];
};

const deviceLocale = getLocales()[0].languageCode;
const fallbackLocale = ["es", "en"].includes(deviceLocale ?? "")
  ? deviceLocale!
  : "en";

i18n.load({ es: esMessages, en: enMessages });
i18n.activate(fallbackLocale);

function UserProvider(props: UserProviderProps) {
  const { children } = props;

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (getPreference("theme") as Theme) ?? "light";
    } catch {
      return "light";
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (
        (getPreference("language") as Language) ?? (fallbackLocale as Language)
      );
    } catch {
      return fallbackLocale as Language;
    }
  });

  useEffect(() => {
    i18n.activate(language);
  }, [language]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setPreference("theme", newTheme);
  };

  const handleSetLanguage = (lang: Language) => {
    i18n.activate(lang);
    setLanguage(lang);
    setPreference("language", lang);
  };

  const defaultValue: UserTypeContext = {
    theme,
    toggleTheme,
    language,
    handleSetLanguage,
  };

  return (
    <UserContext.Provider value={defaultValue}>
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    </UserContext.Provider>
  );
}

export default UserProvider;
