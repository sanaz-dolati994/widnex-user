import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import {loadPersistedData, persistData} from "./utils/persistor";

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: loadPersistedData('lang') || persistData('lang', 'fa'),
        fallbackLng: loadPersistedData('lang') || persistData('lang', 'fa'),
        backend: {
            loadPath: '/user/locales/{{lng}}/{{ns}}.json'
        }
    });

export default i18n;