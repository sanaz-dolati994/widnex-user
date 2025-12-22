import {useRunAfterUpdate} from "../../../core/hooks/useRunAfterUpdate";
import {onInputValueChangeUtil} from "../../../core/utils/useInputValueChange";
import Text from "../../../core/utils/Text";


const Input = ({ value, onChange, number, placeholder, className= '', hasError = false, error = '' }) => {

    const runAfterUpdate = useRunAfterUpdate()
    const onInputChange = (e) => {
        let v = e?.target?.value
        if (number) v = onInputValueChangeUtil(e, runAfterUpdate)
        onChange(v)
    }


    return (
        <>
            <div className={`rounded-lg border-[1px] ${hasError ? 'border-red-500' : 'border-main border-opacity-20 hover:border-active focus-within:border-active'}  px-4 py-2 cursor-pointer ` + className}>
                <input
                    value={value}
                    onChange={onInputChange}
                    className={'bg-transparent w-full placeholder:text-xs'}
                    placeholder={placeholder}
                />
            </div>
            {hasError &&
                <Text tid={error} className={'text-red-500 text-xs'} />
            }
        </>

    )
}

export default Input
