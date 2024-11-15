import { useEffect, useState } from "react"
import React from 'react';
import { Alert, Card, List, Space } from 'antd';
import { getPhotoList } from '@/services'
import ClientList from "./ClientList";
// import { useRouter } from 'next/navigation'

const ViewList = async () => {
    // const [data, setData] = useState<gapi.client.streetviewpublish.Photo[]>()
    // const router = useRouter()

    // useEffect(() => {
    //     try {
    //         const getPhotos = async () => {
    //             setData(data.photos)
    //         }
    //         getPhotos()

    //     } catch (err) {

    //     }

    // }, [])
    const res = await getPhotoList()
    if (res) {
        const { ok, status, statusText, result } = res
        if (!ok) {
            return (<Alert
                message={`${status} ${statusText}`}
                description={result.error.message}
                type="error"
                showIcon
            />)
        }
        
        return <ClientList photos={result.photos} />
    }
   
}



export default ViewList