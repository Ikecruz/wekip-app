import { privateRequest, publicRequest, PrivateRequestProps } from "@/services/axios.service";
import { AxiosError } from "axios";

const RequestMethods = {
    GET: "get",
    POST: "post",
    PATCH: "patch",
    PUT: "put",
    DELETE: "delete"
} as const

type RequestMethods = keyof typeof RequestMethods

interface BasePublicApiProps {
    method: RequestMethods,
    url: string,
    body?: {
        [key: string]: any
    },
}

interface BasePrivateApiProps extends PrivateRequestProps {
    method: RequestMethods,
    url: string,
    body?: {
        [key: string]: any
    },
}

export const makePublicApiCall = async ({
    body,
    method,
    url
}: BasePublicApiProps) => {

    return new Promise( async (resolve, reject) => {

        try {
            const res = await publicRequest[RequestMethods[method]](
                url,
                body
            );
            resolve(res.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                reject(error.response)
            }
        }
    })

}

export const makePrivateApiCall = async ({
    url,
    body,
    method,
    token,
    signOut
}: BasePrivateApiProps) => {

    return new Promise( async (resolve, reject) => {

        try {
            const res = await privateRequest({
                token,
                signOut
            })[RequestMethods[method]](
                url,
                body
            );
            resolve(res.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                reject(error.response)
            }
        }

    })

}