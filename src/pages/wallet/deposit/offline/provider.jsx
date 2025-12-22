import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const provider = (Component) => {
    return () => {
        const form = useForm({
            defaultValues: {
                "userBank": null,
                "amount": "",
                "description": ""
            }
        });

        return (
            <FormProvider {...form}>
                <Component />
            </FormProvider>
        )
    }
}

export default provider