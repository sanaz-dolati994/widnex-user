import { useState } from "react"

export const HIDDEN_CONST = "******"

const useBalanceViewState = () => {

    // TODO: Persist view-hidden
    const [viewHidden, setViewHidden] = useState(false)

    const setAndPersistViewHidden = () => {
        setViewHidden(state => !state)
    }

    return [viewHidden, setAndPersistViewHidden]
}

export default useBalanceViewState;