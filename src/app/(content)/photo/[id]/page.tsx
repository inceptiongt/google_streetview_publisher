import React from 'react';
import { Input } from 'antd';
import {getPhoto} from '@/services'

const Photo = async ({ params }:{
    params: Promise<{ id: string }>
  }) => {
    // const [data, setData] = useState({})
    const { id } = await params
    const data = await getPhoto(id)

    // useEffect(() => {
    //     try {
    //         const getPhotos = async () => {
    //             const data = await getPhoto(id)
    //             if(data){

    //                 setData(data)
    //             }
    //         }
    //         getPhotos()

    //     } catch (err) {

    //     }

    // }, [id])
    return (
        <Input.TextArea value={JSON.stringify(data, null, 4)} autoSize  />
    )
}

export default Photo