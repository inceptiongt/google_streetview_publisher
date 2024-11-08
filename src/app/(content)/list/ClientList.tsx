"use client"
import { Card, Space } from "antd";

import { List } from "antd";

const ClientList = ({photos}:{ photos: gapi.client.streetviewpublish.Photo[]}) => {
    return (
        <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={photos}
            renderItem={(item) => {
                return(
                    <List.Item>
                        <Card
                            hoverable
                            // style={{ width: 240 }}
                            // actions={[
                            //     <SettingOutlined key="setting"/>,
                            //     <EditOutlined key="edit" />,
                            //     <EllipsisOutlined key="ellipsis" />,
                            // ]}
                            cover={<img alt="example" src={item.thumbnailUrl}/>}
                            // onClick={()=>router.push(`./photo/${item.photoId?.id}`)}
                        >
                            {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                            <Space>
                                {item.mapsPublishStatus}
                                {item.uploadTime}
                                {item.places?.map(i => i.name).join('')}
                            </Space>
                        </Card>
                        {/* <Input.TextArea value={JSON.stringify(item, null, 2)} autoSize /> */}
                    </List.Item>
                )
            }}
        />
    );
}

export default ClientList