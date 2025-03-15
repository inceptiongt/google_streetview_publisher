import React from 'react';
import { Alert } from 'antd';
import { getPhotoList } from '@/services'
import ClientList from "./ClientList";

// import { useRouter } from 'next/navigation'

const ViewList = async (searchParams) => {
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
    console.log('+++++++++++++list page')
    const res = await getPhotoList()
    if (res) {
        const { ok, status, statusText, result } = res
        // if (!ok) {
        //     return (<Alert
        //         message={`${status} ${statusText}`}
        //         description={result.error.message}
        //         type="error"
        //         showIcon
        //     />)
        // }

        return <ClientList photos={result.photos} />
        // return (
        //     <List
        //         grid={{ gutter: 16, column: 4 }}
        //         // dataSource={res.result.photos}
        //         // renderItem={}
        //     >
        //         {
        //             res.result.photos?.map((item) => {
        //                 return (
        //                     <List.Item key={item.photoId?.id}>
        //                         <Card
        //                             hoverable
        //                             style={{ height: 'auto' }}
        //                             actions={[
        //                                 // <SettingOutlined key="setting"/>,
        //                                 <EditOutlined key="edit" />,
        //                                 <Popconfirm
        //                                     key="delete"
        //                                     title="Delete the task"
        //                                     description="Are you sure to delete this task?"
        //                                     onConfirm={() => confirm(item.photoId?.id)}
        //                                     // onCancel={cancel}
        //                                     okText="Yes"
        //                                     cancelText="No"
        //                                 >
        //                                     <DeleteOutlined key="delete" />
        //                                 </Popconfirm>,
        //                             ]}
        //                             cover={<Image alt="" src={item.thumbnailUrl} width={200} height={100} style={{ height: 'auto' }} />}
        //                         // onClick={()=>router.push(`./photo/${item.photoId?.id}`)}
        //                         >
        //                             {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
        //                             <div><Space>状态：{item.mapsPublishStatus}</Space></div>
        //                             <div><Space>时间：{item.uploadTime}</Space></div>
        //                             <div></div><Space>地点：{item.places?.map(i => i.name).join('') || '无'}</Space>
        //                         </Card>
        //                         {/* <Input.TextArea value={JSON.stringify(item, null, 2)} autoSize /> */}
        //                     </List.Item>
        //                 )
        //             })
        //         }
        //     </List>
        // )

    }

}



export default ViewList