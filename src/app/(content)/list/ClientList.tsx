"use client"
import { Button, Card, message, Popconfirm, PopconfirmProps, Space } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { deletePhoto } from '@/services'
import { useRouter } from 'next/navigation'

import { List } from "antd";
import Image from "next/image";

const ClientList = ({ photos }: { photos?: gapi.client.streetviewpublish.Photo[] }) => {
    const router = useRouter()

    const confirm = async(id?: string) => {
        if(!id) {
            return
        }
        console.log('id',id)
        await deletePhoto(id, true)
        // message.success('Click on Yes');
        router.refresh()
    };
    
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('Click on No');
    };
    return (
        <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={photos}
            renderItem={(item) => {
                return (
                    <List.Item>
                        <Card
                            hoverable
                            style={{ height: 'auto' }}
                            actions={[
                                // <SettingOutlined key="setting"/>,
                                <EditOutlined key="edit" />,
                                <Popconfirm
                                    key="delete"
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={()=>confirm(item.photoId?.id)}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined key="delete" />
                                </Popconfirm>,
                            ]}
                            cover={<Image alt="" src={item.thumbnailUrl} width={200} height={100} style={{ height: 'auto' }} />}
                        // onClick={()=>router.push(`./photo/${item.photoId?.id}`)}
                        >
                            {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                            <div><Space>状态：{item.mapsPublishStatus}</Space></div>
                            <div><Space>时间：{item.uploadTime}</Space></div>
                            <div></div><Space>地点：{item.places?.map(i => i.name).join('') || '无'}</Space>
                        </Card>
                        {/* <Input.TextArea value={JSON.stringify(item, null, 2)} autoSize /> */}
                    </List.Item>
                )
            }}
        />
    );
}

export default ClientList