import { useRunAfterUpdate } from "../../../core/hooks/useRunAfterUpdate";
import { onInputValueChangeUtil } from "../../../core/utils/useInputValueChange";
import Text from "../../../core/utils/Text";
import { p2e } from "../../../core/utils/common";
import getBankInfo from "../../../packages/bank-service/Bank";
import { useCallback, useMemo } from "react";
import { useMainContext } from "../../../core/contexts/main";


const Input = ({ value, onChange, number, placeholder, className = '', hasError = false, error = '', type = 'normal' }) => {

    const { main: { lang } } = useMainContext()

    const runAfterUpdate = useRunAfterUpdate()
    const onInputChange = (e) => {
        let v = e?.target?.value
        if (number) v = onInputValueChangeUtil(e, runAfterUpdate)
        onChange(v)
    }

    const onCardValueChange = (e) => {
        let value
        value = p2e(e?.target?.value)
        value = value.replace(/[^\d]/g, "").substring(0, 16)
        value = value.match(/\d{1,4}/g);
        if (value !== null) {
            value = value.join(' ')
        }
        onChange(value)
    }

    const onShebaValueChange = (e) => {
        let value = p2e(e?.target?.value)
        onChange(value)
    }

    const func = useCallback((e) => {
        if (type === 'card') return onCardValueChange(e)
        if (type === 'sheba') return onShebaValueChange(e)
        return onInputChange(e)
    }, [type])


    const dir = useMemo(() => {
        if (lang === 'en') return 'ltr'
        else return type === 'normal' ? 'rtl' : 'ltr'
    }, [lang, type])

    return (
        <>
            <div dir={dir} className={`flex items-center gap-2 rounded border-[1px] ${hasError ? 'border-red-500' : 'border-main border-opacity-20 hover:border-active focus-within:border-active'}  px-4 py-2 cursor-pointer ` + className}>
                {type === 'sheba' ?
                    <Text tid={'IR'} className={'mt-1'} />
                    : null}
                <input
                    value={value}
                    onChange={func}
                    className={`bg-transparent ${type === 'card' && 'text-center'} w-full placeholder:text-xs ${(type === 'sheba' || type === 'card') && 'mt-1'}`}
                    placeholder={placeholder}
                    maxLength={type === 'sheba' && 24}
                />
            </div>
            {hasError &&
                <Text tid={error} className={'text-red-500 text-xs'} />
            }
        </>

    )
}

export default Input
