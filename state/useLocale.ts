import { useRouter } from "next/router";
import { en } from "../locales/en";

const localesMap: { [localeKey: string]: any } = {
  en: en,
};

const useLocale = () => {
  const { locale } = useRouter();
  let t = en;
  if (locale && localesMap[locale]) {
    t = localesMap[locale];
  }

  return { t };
};

export default useLocale;
