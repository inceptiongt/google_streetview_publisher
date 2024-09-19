"use client"
import { useEffect, useState } from "react"
import React from 'react';
import { Card, List, Input, Space } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import {fetchGoogleApi} from '@/app/services'
import { useRouter } from 'next/navigation'
import Image from "next/image";

const ViewList = () => {
    const [data, setData] = useState([])
    const router = useRouter()

    useEffect(() => {
        try {
            const getPhotos = async () => {
                const data = await fetchGoogleApi("https://streetviewpublish.googleapis.com/v1/photos?view=BASIC")
                setData(data.photos)
            }
            getPhotos()

        } catch (err) {

        }

    }, [])
    return (
        <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        hoverable
                        // style={{ width: 240 }}
                        // actions={[
                        //     <SettingOutlined key="setting"/>,
                        //     <EditOutlined key="edit" />,
                        //     <EllipsisOutlined key="ellipsis" />,
                        // ]}
                        cover={<Image alt="example" src={item.thumbnailUrl} />}
                        onClick={()=>router.push(`./photo/${item.photoId.id}`)}
                    >
                        {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                        <Space>
                            {item.mapsPublishStatus}
                            {item.uploadTime}
                            {item.places.map(i => i.name).join('')}
                        </Space>
                    </Card>
                    {/* <Input.TextArea value={JSON.stringify(item, null, 2)} autoSize /> */}
                </List.Item>
            )}
        />
    );
}

export default ViewList