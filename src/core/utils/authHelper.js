import { validEmailRegex } from "../constants/common";
import { useQueryContext } from "../contexts/query";


export const validateMeliCode = (input) => {
    if (
        !/^\d{10}$/.test(input) ||
        input === "0000000000" ||
        input === "1111111111" ||
        input === "2222222222" ||
        input === "3333333333" ||
        input === "4444444444" ||
        input === "5555555555" ||
        input === "6666666666" ||
        input === "7777777777" ||
        input === "8888888888" ||
        input === "9999999999"
    )
        return false;
    var check = parseInt(input[9]);
    var sum = 0;
    var i;
    for (i = 0; i < 9; ++i) {
        sum += parseInt(input[i]) * (10 - i);
    }
    sum %= 11;
    return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
};


export const initialState = {
    step1: {
        mobile: "", email: "", mode: null, validation: "normal"
    },
    step2: {
        data: {
            firstName: "", lastName: "", fatherName: "",
            idNo: "", gender: "", birthDate: "", phonePrefix: "", phone: "",
            address: { country: "ir", county: "", city: "", line: "", zip: "" }
        },
        validation: {
            firstName: "normal", lastName: "normal",
            fatherName: "normal", idNo: "normal", zip: "normal",
            line: "normal"
        }
    },
    step3: { file: "" },
    step4: { file: "" },
    step5: { data: {}, mode: null },
}

export const authReducer = (state, action) => {
    let newState;
    switch (action.type) {
        case "1-data":
            newState = { ...state }
            if (newState.step1.mode)
                newState.step1[newState.step1.mode] = action.payload
            return newState
        case "1-mode":
            newState = { ...state }
            newState.step1.mode = action.payload
            return newState
        case "1-validation":
            newState = { ...state }
            newState.step1.validation = action.payload
            return newState
        case "2-data":
            newState = { ...state }
            newState.step2.data = action.payload
            return newState
        case "2-validation":
            newState = { ...state }
            newState.step2.validation = action.payload
            return newState
        case 3:
            newState = { ...state }
            newState.step3 = action.payload
            return newState
        case 4:
            newState = { ...state }
            newState.step4 = action.payload
            return newState
        case 5:
            return { ...state, data: action.payload }
        default:
            return state
    }
}



export const onInputValueChange = (data) => {

    const { value, type, authData, setAuthData, active } = data

    let payload;
    switch (active) {
        case 0:
            if (authData.step1.mode === "email") {
                const valid = validEmailRegex.test(value)
                if (valid) setAuthData({ type: "1-validation", payload: "valid" })
                else setAuthData({ type: "1-validation", payload: "error" })
            } else {
                if (value.length === 11) setAuthData({ type: "1-validation", payload: "valid" })
                else setAuthData({ type: "1-validation", payload: "error" })
            }
            setAuthData({ type: "1-data", payload: value })
            break
        case 1:
            payload = { ...authData.step2.validation }

            // validation will change according to type
            if (type === "firstName" || type === "lastName" || type === "fatherName") payload[type] = value.length >= 3 ? "valid" : "error"
            if (type === "idNo") payload[type] = validateMeliCode(value) ? "valid" : "error"
            if (type === "zip") payload[type] = value.length === 10 ? "valid" : "error"
            if (type === 'line') payload[type] = value.length > 3 ? "valid" : "error"
            setAuthData({ type: "2-validation", payload })

            payload = { ...authData.step2.data }
            if (type === "county" || type === "city" || type === "line" || type === "zip") payload.address[type] = value
            else payload[type] = value

            setAuthData({ type: "2-data", payload })
            break
        default:
            break
    }
}


export const onSubmitClicked = (data, setToast) => {

    const {
        updateProfile, updateMeliCard,
        updateSelfi, authData,
        active
    } = data


    switch (active) {
        case 1:
            if (
                authData.step2.validation.firstName === "valid" &&
                authData.step2.validation.lastName === "valid" &&
                authData.step2.validation.fatherName === "valid" &&
                authData.step2.validation.idNo === "valid" &&
                authData.step2.data.gender &&
                authData.step2.data.birthDate &&
                authData.step2.data.address.line
            ) {
                const payload = { ...authData.step2.data }
                payload.phone = payload.phonePrefix + payload.phone
                updateProfile(payload)
            } else {
                setToast({
                    isError: true,
                    show: true,
                    message: 'fill-input-error'
                })
            }
            break
        case 2:
            if (authData.step3.file) {
                const files = new FormData();
                files.append("idCard", authData.step3.file);
                updateMeliCard(files)
            }
            break
        case 3:
            if (authData.step4.file) {
                const files = new FormData();
                files.append("selfi", authData.step4.file)
                updateSelfi(files)
            }
            break
        default:
            break
    }
}
