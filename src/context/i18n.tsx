import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";

import translation from "../translation.json"; // Ensure this path is correct.

interface Recources {
  [key: string]: { [value: string]: string };
}

interface Translation {
  translate: (key: string) => string;
  setLang: (lang: string) => void;
}

const TranslationContext = createContext<Translation>({
  translate: (key: string) => "",
  setLang: (lang: string) => {},
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState(translation.default);

  const wordBook = useMemo(() => {
    const resources = translation.resources as Recources;

    if (!resources[lang]) {
      return {};
    }

    return resources[lang];
  }, [lang]);

  const translate = useCallback(
    (key: string) => {
      if (!wordBook[key]) {
        return "";
      }

      return wordBook[key] || "";
    },
    [lang]
  );

  const setLangAndStore = useCallback((lang: string) => {
    let currentLang = lang;
    if (!Object.keys(translation.resources).includes(lang)) {
      currentLang = translation.default;
    }
    localStorage.setItem("lang", currentLang);
    setLang(currentLang);
  }, []);

  useEffect(() => {
    const storedColorMode = localStorage.getItem("lang");
    if (storedColorMode) {
      setLang(storedColorMode);
    }
  }, []);

  return (
    <TranslationContext.Provider
      value={{ setLang: setLangAndStore, translate }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext(TranslationContext);
};
