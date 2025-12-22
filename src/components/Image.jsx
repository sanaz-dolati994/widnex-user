import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { BASE_URL_V2 } from "../core/constants/urls";
import { useMainContext } from "../core/contexts/main";

async function fetchFileAsDataUrl(fileName, bucketName, token) {
    const url = `${BASE_URL_V2.replace(/\/$/, "")}/private/get-file`;

    const { data } = await axios.post(
        url,
        { fileName, bucketName },
        {
            headers: {
                "x-auth-token": token,
                "Content-Type": "application/json",
            },
            validateStatus: () => true,
        }
    );
    const byteArray = new Uint8Array(data.data.data);
    const blob = new Blob([byteArray]);
    const objectURL = URL.createObjectURL(blob);
    return { data: objectURL };
}

const ImageFromPrivate = ({ path, bucketName, alt = "", ...imgProps }) => {
    const {
        profile: { token },
    } = useMainContext();

    const enabled = !!path && !!bucketName && !!token;

    const { data: dataUrl } = useQuery({
        queryKey: ["private/get-file", token, path, bucketName],
        queryFn: () => fetchFileAsDataUrl(path ?? "", bucketName ?? "", token ?? ""),
        enabled,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });


    return <img {...imgProps} src={dataUrl} alt={alt} />;
};

export default ImageFromPrivate;
