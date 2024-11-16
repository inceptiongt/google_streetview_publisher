"use client"
import { Card, Col, message, Popconfirm, Row, Space } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { deletePhoto } from '@/services'
import { useRouter } from 'next/navigation'

import { List } from "antd";
const {Item: ListItem} = List
import Image from "next/image";

const ClientList = ({ photos }: { photos?: gapi.client.streetviewpublish.Photo[] }) => {
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
// const {loading,runAsync} = useRequest(deletePhoto, {manual: true})

    const confirm = async (id?: string) => {

        if (!id) {
            messageApi.error({
                content: '出错了'
            })
            return
        }
        const { ok, result } = await deletePhoto(id, true)
        if (ok) {
            router.refresh()
            messageApi.success({
                content: '删除成功'
            })
        } else {
            messageApi.error({
                content: result.error.message
            })
        }
    };

    return (
        <>
            {contextHolder}
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={photos}
                renderItem={(item) => {
                    return (
                        <ListItem>
                            <Card
                                // hoverable
                                style={{ height: 'auto' }}
                                actions={[
                                    // <SettingOutlined key="setting"/>,
                                    <EyeOutlined key="eys" onClick={() => window.open(`${item.shareLink}`, '_blank')} />,
                                    <EditOutlined key="edit" />,
                                    <Popconfirm
                                        key="delete"
                                        title="Delete the task"
                                        description="Are you sure to delete this task?"
                                        onConfirm={() => confirm(item.photoId?.id)}
                                        // onCancel={cancel}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined key="delete"/>
                                    </Popconfirm>,
                                ]}
                                cover={<Image alt="" src={item.thumbnailUrl ?? ''} width={200} height={100} style={{ height: 'auto' }} />}

                            >
                                {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                                <Row >
                                    <Col span={12}>
                                        <Space>状态：{item.mapsPublishStatus}</Space>
                                    </Col>
                                    <Col span={12}>
                                        <Space>上传时间：{item.uploadTime}</Space>
                                    </Col>
                                    <Col span={12}>
                                        <Space>地点：{item.places?.map(i => i.name).join('') || ' 暂无'}</Space>
                                    </Col>
                                    <Col span={12}>
                                        <Space>拍摄时间：{item.captureTime}</Space>
                                    </Col>
                                    <Col span={12}>
                                        <Space>浏览次数：{item.viewCount || 0}</Space>
                                    </Col>

                                </Row>
                            </Card>
                            {/* <Input.TextArea value={JSON.stringify(item, null, 2)} autoSize /> */}
                        </ListItem>
                    )
                }}
            />
        </>
    );
}

export default ClientList