"use client"

import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { UploadProps, GetProp, FormProps, FormInstance, message, Typography, Divider, Switch, notification } from 'antd';
import { Button, Upload, Image, Row, Col, Input, Form, DatePicker } from 'antd';
import ExifReader from 'exifreader';
import { uploadPhoto, createPhoto } from '@/services'
import { writeXmpHandler } from '@/actions'
import { mapValues, omit } from 'lodash'
import { useRequest } from 'ahooks';
import dayjs from 'dayjs'
import Gmap from './map';
import Link from 'next/link';

const { Title } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
class FixXmpData {
    UsePanoramaViewer = 'true' as const;
    ProjectionType = 'equirectangular' as const;
    InitialViewHeadingDegrees: number = 0;
    CroppedAreaLeftPixels: number = 0;
    CroppedAreaTopPixels: number = 0;
}

export class XmpData extends FixXmpData {
    CaptureSoftware?: string;
    StitchingSoftware?: string;
    PoseHeadingDegrees: number = 0;
    PosePitchDegrees?: number;
    PoseRollDegrees?: number;
    InitialViewPitchDegrees?: number;
    InitialViewRollDegrees?: number;
    InitialHorizontalFOVDegrees?: number;
    InitialVerticalFOVDegrees?: number;
    FirstPhotoDate?: Date;
    LastPhotoDate?: Date;
    SourcePhotosCount?: number;
    ExposureLockUsed?: boolean;
    CroppedAreaImageWidthPixels: number = 0;
    CroppedAreaImageHeightPixels: number = 0;
    FullPanoWidthPixels: number = 0;
    FullPanoHeightPixels: number = 0;
    InitialCameraDolly?: number;
    Latitude: number = 0;
    Longitude: number = 0;
    CreateDate: string = new Date().toISOString();
    PlaceId: string = ''
}

export class PhotoCreate extends XmpData {
    mirror: boolean = false
}

const fixXmpData = new FixXmpData();
const photoCreate = new PhotoCreate();

const UploadPhoto = () => {
    const [fileList, setFileList] = useState<FileType[]>([]);
    const [mirror, setMirror] = useState(false);
    const [url, setUrl] = useState('')
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const handleUpload = async (xmpData: PhotoCreate) => {
        // try {
        const formData = new FormData();
        formData.append('photo', fileList[0]);
        formData.append('uid', fileList[0].uid);
        formData.append('photoCreateData', JSON.stringify(omit(xmpData, ['Latitude', 'Longitude', 'PlaceId'])));
        const res = await writeXmpHandler(formData);
        let path
        if (res.ok) {
            path = res.data.path
            messageApi.success(
                "设置 XMP metedata 成功"
            )
        } else {
            notificationApi.error({
                message: res.message,
                duration: 0
            })
            return
        }
        const refRst = await uploadPhoto(path)

        if (refRst.ok) {
            messageApi.success("上传成功")
            const latitude = xmpData.Latitude;
            const longitude = xmpData.Longitude;
            const placeId = xmpData.PlaceId
            const cRst = await createPhoto({
                uploadReference: refRst.result,
                "pose": {
                    "latLngPair": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                },
                "places": [
                    {
                        "placeId": placeId,

                    }
                ],
            })
            if (cRst.ok) {
                notificationApi.success({
                    message: '创建成功',
                    description: (<Link href={cRst.result.shareLink} target={'_blank'}>在 Google Map 中查看</Link>),
                    duration: 0,
                });
            } else {
                messageApi.error("创建失败" + cRst.statusText + cRst.result.error.message)
            }
        } else {
            messageApi.error("上传失败" + refRst.statusText + refRst.result.error.message)
        }
        // } catch (error) {
        //     console.error('Error in handleUpload:', error);
        // }
    }

    const beforeUpload = async (file: FileType) => {
        setFileList([file]);

        const url = URL.createObjectURL(file)
        setUrl(url)
        const tags = await ExifReader.load(file, { expanded: true });
        
        const xmpData = getXmpData(tags)
        const fieldValue = { ...fixXmpData, ...xmpData, CreateDate: xmpData.CreateDate ? dayjs(xmpData.CreateDate) : dayjs(new Date('2001-01-01')) }
        form.resetFields()
        form.setFieldsValue(fieldValue)
        // setMetadata(tags)
        return false
    };

    const props: UploadProps = {
        beforeUpload,
        fileList,
        showUploadList: false,
        maxCount: 1,
    };

    const getXmpData: (metaData: ExifReader.ExpandedTags) => PhotoCreate = (metaData) => {
        const xmp = mapValues({ width: metaData.file?.['Image Width'], height: metaData.file?.['Image Height'], ...metaData.file, ...metaData.xmp }, 'value')
        return { ...metaData.gps, ...xmp, CroppedAreaImageHeightPixels: xmp.height, CroppedAreaImageWidthPixels: xmp.width, FullPanoHeightPixels: xmp.height, FullPanoWidthPixels: xmp.width } as PhotoCreate
    }

    const { loading, run: runHandleUpload } = useRequest(handleUpload, { manual: true })

    return (
        <>
            {contextHolder}
            {notificationContextHolder}
            <Row gutter={[24, 24]} >
                <Col span={12}>
                    <Title level={2}>上传照片</Title>
                    {fileList.length > 0 && (
                        <>
                            <div style={{ position: 'relative' }}>
                                <Image src={url} style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}></Image>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: '50%',
                                    borderLeft: '2px dashed red',
                                    transform: 'translateX(-50%)'
                                }}></div>
                            </div>
                            {fileList[0].name}
                        </>
                    )}
                    <Divider />
                    <Row justify={'space-between'}>
                        <Col>
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>选择图片</Button>
                            </Upload>

                        </Col>
                        <Col>

                            <Button onClick={() => { setMirror(!mirror); form.setFieldsValue({ mirror: !mirror }) }}>镜像翻转图片</Button>
                        </Col>
                    </Row>

                    <Title level={2}>拾取位置</Title>
                    <Gmap form={form} />
                </Col>

                <Col span={12}>
                    <Title level={2}>设置元数据</Title>
                    <PhotoForm
                        // xmpData={getXmpData()}
                        submitHandler={runHandleUpload}
                        form={form}
                        loading={loading}
                    />
                    {/* <Input.TextArea value={JSON.stringify(metaData, null, 4)} autoSize={{ minRows: 2, maxRows: 16 }} /> */}
                </Col>

            </Row>
        </>
    )
}

type PhotoFormType = {
    // xmpData: PhotoCreate
    submitHandler: (xmpData: PhotoCreate) => void
    form: FormInstance
    loading: boolean
}

const PhotoForm: React.FC<PhotoFormType> = ({ submitHandler, form, loading }) => {
    
    const onFinish: FormProps<PhotoCreate>['onFinish'] = (values) => {
        
        submitHandler(values)
    };

    const onFinishFailed: FormProps<PhotoCreate>['onFinishFailed'] = (errorInfo) => {
        
    };

    // const [form] = Form.useForm();
    // const fieldValue = { ...fixXmpData, ...xmpData, CreateDate: xmpData.CreateDate ? dayjs(xmpData.CreateDate) : dayjs(new Date()) }
    // console.log("fieldValue", fieldValue)
    // useEffect(() => form.setFieldsValue(fieldValue))
    const renderFormItem = () => {

        const renderItem = (key: keyof PhotoCreate) => {
            switch (key) {
                case 'CreateDate':
                    return <DatePicker />;
                case 'mirror':
                    return <Switch disabled />
                default:
                    return <Input disabled={Object.keys(fixXmpData).includes(key)} />;
            }
        }

        return Object.keys(photoCreate).map((key) => (
            <Form.Item<PhotoCreate>
                key={key}
                label={key}
                name={key as keyof PhotoCreate}
                // valuePropName={key === 'CreateDate' ? 'value' : undefined}
                // rules={[{ required: true, message: 'Please input your username!' }]}
                // normalize={(v)=>{console.log("vo"+key,v); return v && v.value}}
                // getValueProps={v => v}
                required
                rules={[{ required: true, message: 'Please input' }]}
            >
                {renderItem(key as keyof PhotoCreate)}
            </Form.Item>
        ))



    }
    return (
        <Form<PhotoCreate>
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {
                renderFormItem()
            }

            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button size='large' type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    创建
                </Button>
            </Form.Item>
        </Form>

    )
}

export default UploadPhoto
