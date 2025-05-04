import i18n from "i18next";

import translationEN from "@/assets/locales/en.json";
import translationFA from "@/assets/locales/fa.json";
import translationPS from "@/assets/locales/ps.json";
import { initReactI18next } from "react-i18next";
import { getConfiguration, loadFont } from "./utils";

export interface LanguageType {
  code: string;
  name: string;
}
export const supportedLangauges: LanguageType[] = [
  { name: "english", code: "en" },
  { name: "farsi", code: "fa" },
  { name: "pashto", code: "ps" },
];

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  fa: {
    translation: translationFA,
  },
  ps: {
    translation: translationPS,
  },
};
export const setLanguageDirection = async (direction: string) => {
  document.documentElement.dir = direction;
  await loadFont(direction);
};

const loadLangs = () => {
  i18n.use(initReactI18next).init({
    fallbackLng: "en",
    // lng: language, // default language
    debug: true,
    returnObjects: true,
    resources: resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // backend: {
    //   requestOptions: {
    //     cache: "no-store",
    //   },
    // },
  });

  const conf = getConfiguration();
  let direction = "rtl";
  if (conf?.language) {
    i18n.changeLanguage(conf?.language);
    direction = conf?.language === "en" ? "ltr" : "rtl";
  } else {
    direction = i18n.language === "en" ? "ltr" : "rtl";
  }
  setLanguageDirection(direction);
};
loadLangs();

export default i18n;
