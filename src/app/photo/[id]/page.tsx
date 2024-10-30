"use client"
import { useEffect, useState } from "react"
import React from 'react';
import { Input } from 'antd';
import {getPhoto} from '@/services'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const Photo = ({ params }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        try {
            const getPhotos = async () => {
                const data = await getPhoto(params.id)
                if(data){

                    setData(data)
                }
            }
            getPhotos()

        } catch (err) {

        }

    }, [params.id])
    return (
        <Input.TextArea value={JSON.stringify(data, null, 4)} autoSize  />
    )
}

export default Photo