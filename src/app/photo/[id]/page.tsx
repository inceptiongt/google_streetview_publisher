"use client"
import { useEffect, useState } from "react"
import React from 'react';
import { Card, List, Input, Space } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import {fetchGoogleApi} from '@/app/services'

const Photo = ({ params }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        try {
            const getPhotos = async () => {
                const data = await fetchGoogleApi(`https://streetviewpublish.googleapis.com/v1/photo/${params.id}?view=BASIC`)
                setData(data)
            }
            getPhotos()

        } catch (err) {

        }

    }, [params.id])
    return (
        <Input.TextArea value={JSON.stringify(data, null, 2)} autoSize />
    )
}

export default Photo