import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { getConfiguration, loadFont } from "./utils";
import ChainedBackend from "i18next-chained-backend";

export const setLanguageDirection = async (direction: string) => {
  document.documentElement.dir = direction;
  await loadFont(direction);
};
export interface LanguageType {
  code: string;
  name: string;
}
export const supportedLangauges: LanguageType[] = [
  { name: "english", code: "en" },
  { name: "farsi", code: "fa" },
  { name: "pashto", code: "ps" },
];

const loadLangs = () => {
  i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      ns: ["front_end"],
      defaultNS: "front_end",
      debug: true,
      backend: {
        backends: [LocalStorageBackend, HttpBackend],
        backendOptions: [
          {
            expirationTime: 24 * 60 * 60 * 1000,
          },
          {
            loadPath: `${
              import.meta.env.VITE_API_BASE_URL
            }/api/v1/locales/{{lng}}/{{ns}}`,
          },
        ],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
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
