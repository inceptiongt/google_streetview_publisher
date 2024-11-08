import { useEffect, useState } from "react"
import React from 'react';
import { Card, List, Space } from 'antd';
import {getPhotoList} from '@/services'
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
    const {photos} = await getPhotoList() || {}
    // const photos = data?.photos
    return <ClientList photos={photos}/>
}



export default ViewList