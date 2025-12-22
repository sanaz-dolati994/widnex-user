import useCreateCrisp from "../utils/useCreateCrisp";


const CrispProvider = (props) => {

    const { children } = props
    useCreateCrisp()

    return (
        <>
            {children}
        </>
    )
}

export default CrispProvider
