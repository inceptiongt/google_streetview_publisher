"use client"
import { useEffect, useState } from "react"
import React from 'react';
import { Input } from 'antd';
import {getPhoto} from '@/services'

const Photo = ({ params }: {params: {id: string}}) => {
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