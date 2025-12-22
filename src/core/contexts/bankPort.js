
import { useContext, createContext, useState } from "react";


const context = createContext({
    port: null,
    setPort: () => { }
})

export const useBankPortContext = () => {
    return useContext(context)
}

const BankPortContextProvider = ({ children }) => {

    const [port, setPort] = useState(null)

    return (
        <context.Provider value={{
            port, setPort
        }}>
            {children}
        </context.Provider>
    )
}

export default BankPortContextProvider;