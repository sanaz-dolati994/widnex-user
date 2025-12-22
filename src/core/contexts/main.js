import i18next from "i18next";
import { useContext, createContext, useState, useEffect } from "react";
import cookieService from "../services/cookie";
import { loadPersistedData, persistData } from "../utils/persistor";

const context = createContext({
    main: {
        theme: "dark", setTheme: () => { },
        lang: "fa", setLang: () => { }
    },
    profile: {
        token: null, setToken: () => { }
    }
})

export const useMainContext = () => {
    return useContext(context)
}

const MainContextProvider = ({ children }) => {

    const [market, _setMarket] = useState({ coin: "usdt", pair: "irt" })
    const [theme, setTheme] = useState(loadPersistedData('theme') ? loadPersistedData('theme') : "dark")
    const [lang, setLang] = useState(loadPersistedData('lang') ? loadPersistedData('lang') : "fa")
    const [token, _setToken] = useState(cookieService.get('token', { path: '/' }))

    useEffect(() => {
        persistData('theme', theme)
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme])

    useEffect(() => {
        i18next.changeLanguage(lang)
        persistData('lang', lang)
    }, [lang])

    const setToken = (token, internalNavigation = true) => {
        cookieService.set('token', token, { path: '/' })
        if (internalNavigation) _setToken(token)
    }

    const setMarket = (market) => {
        _setMarket(market)
    }


    return (
        <context.Provider value={{
            main: {
                theme, setTheme, lang, setLang
            },
            profile: {
                token, setToken
            },
            market, setMarket
        }}>
            {children}
        </context.Provider>
    )
}

export default MainContextProvider;
