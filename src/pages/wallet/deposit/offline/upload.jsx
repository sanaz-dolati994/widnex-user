import { ImageGetter } from '../../../../styles/AuthenticationStyles'
import { ReceiptIcon } from '../../../../components/common/icons'
import Text from '../../../../core/utils/Text'
import { useMutation } from 'react-query';
import { postApiWithTokenV2 } from "./../../../../core/services/fetch-api/post";
import { useMainContext } from '../../../../core/contexts/main';
import Image from "./../../../../components/Image";
import React from 'react';
import { CgSpinner } from 'react-icons/cg';
const mutationFn = async ({ file, bucketName, token }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucketName", bucketName);
    const response = await postApiWithTokenV2(formData, token, "private/send-file");
    return response.data
}

const Upload = ({ onSuccess, value }) => {
    const { profile: { token } } = useMainContext();

    const { data, mutateAsync, isLoading } = useMutation({
        mutationKey: ["file-upload"],
        mutationFn: ({ file, bucketName }) => mutationFn({ file, bucketName, token }),
        onSuccess: (e) => onSuccess({
            bucketName: "deposit",
            fileName: e.data?.fileName
        })
    })

    const onChange = async (e) => {
        await mutateAsync({
            file: e.target.files[0],
            bucketName: "deposit"
        })
    }

    return (
        <div className='mt-5 w-full h-52 relative flex items-center justify-between bg-cBlue/10 rounded-xl px-4 py-2 cursor-pointer overflow-hidden'>
            <div className='mx-auto flex items-center justify-center flex-col h-full w-full'>
                {isLoading ? (<CgSpinner className='animate-spin size-10' />) : (
                    <React.Fragment>
                        {value && data?.data?.fileName ? (
                            <Image
                                bucketName={"deposit"}
                                path={data?.data?.fileName}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <React.Fragment>
                                <ReceiptIcon className="stroke-cBlue fill-transparent my-2" />
                                <Text tid='upload-receipt-image' className='text-sm  text-cBlue cursor-pointer' />
                                <Text tid='acceptable-formats-jpg-png' className='text-2xs mt-2 text-cBlue cursor-pointer' />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
            <ImageGetter
                className='border-cBlue cursor-pointer'
                accept=".png,.jpg,.jpeg,.svg"
                onChange={onChange}
                type='file'
                id='idCard'
                name='idCard'
            />
        </div>
    )
}

export default Upload