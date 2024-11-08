import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps, GetProp, FormProps } from 'antd';
import { Button, Upload, Image, Row, Col, Input, Form, DatePicker } from 'antd';
import ExifReader from 'exifreader';
import { uploadPhoto, createPhoto } from '@/services'
import { writeXmpHandler } from '@/actions'
import { mapValues } from 'lodash'
import dayjs from 'dayjs'
import Gmap from './map';
import PanoView from './PanoView';

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
}

const fixXmpData = new FixXmpData();

const UploadPhoto = () => {
    const [fileList, setFileList] = useState<FileType[]>([]);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('')
    const [metaData, setMetadata] = useState<ExifReader.ExpandedTags>({})

    const handleUpload = async (xmpData: XmpData) => {
        try {
            const formData = new FormData();
            formData.append('photo', fileList[0]);
            formData.append('uid', fileList[0].uid);
            formData.append('xmpData', JSON.stringify(xmpData));
            const base64 = await writeXmpHandler(formData);
            console.log("arrayBuffer", base64)
            const binary = atob(base64);
            const array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(array)], { type: fileList[0].type });
            const editedPhoto = new File([blob], fileList[0].name, { type: fileList[0].type });
            const tags = await ExifReader.load(editedPhoto, { expanded: true });
            console.log("edited tags", tags)
            setMetadata(tags)
            // return
            const ref = await uploadPhoto(editedPhoto)

            if (ref) {
                const latitude = xmpData.Latitude;
                const longitude = xmpData.Longitude;
                const photo = await createPhoto({
                    uploadReference: ref,
                    "pose": {
                        "latLngPair": {
                            "latitude": latitude,
                            "longitude": longitude
                        },
                    }
                })
                console.log('photo', photo)
            }
        } catch (error) {
            console.error('Error in handleUpload:', error);
        }
    }

    const beforeUpload = async (file: FileType) => {
        setFileList([...fileList, file]);

        const url = URL.createObjectURL(file)
        setUrl(url)
        const tags = await ExifReader.load(file, { expanded: true });
        console.log("tags", tags)
        setMetadata(tags)
        return false
    };

    const props: UploadProps = {
        beforeUpload,
        fileList,
        showUploadList: false,
        maxCount: 1,
    };

    const getXmpData: () => XmpData = () => {
        const xmp = mapValues({ width: metaData.file?.['Image Width'], height: metaData.file?.['Image Height'], ...metaData.file, ...metaData.xmp }, 'value')
        return { ...metaData.gps, ...xmp, CroppedAreaImageHeightPixels: xmp.height, CroppedAreaImageWidthPixels: xmp.width, FullPanoHeightPixels: xmp.height, FullPanoWidthPixels: xmp.width } as XmpData
    }

    return (
        <>
            <Row>
                <Col span={12}>
                    <>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                        <div style={{ position: 'relative' }}>
                            <Image src={url}></Image>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: '50%',
                                borderLeft: '2px dashed red',
                                transform: 'translateX(-50%)'
                            }}></div>
                        </div>
                        {/* <PanoView pic={url} /> */}
                    </>
                </Col>
                <Col span={12}>
                    <Gmap />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <PhotoForm
                        xmpData={getXmpData()}
                        submitHandler={handleUpload}
                    />
                </Col>
                <Col span={12} >
                    <Input.TextArea value={JSON.stringify(metaData, null, 4)} autoSize={{ minRows: 2, maxRows: 16 }} />
                </Col>
            </Row>
        </>
    )
}

type PhotoFormType = {
    xmpData: XmpData
    submitHandler: (xmpData: XmpData) => void
}

const PhotoForm: React.FC<PhotoFormType> = ({ xmpData, submitHandler }) => {
    console.log("form render")
    const onFinish: FormProps<XmpData>['onFinish'] = (values) => {
        console.log('Success:', values);
        submitHandler(values)
    };

    const onFinishFailed: FormProps<XmpData>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const xmpdata = new XmpData()
    const [form] = Form.useForm();
    const fieldValue = { ...fixXmpData, ...xmpData, CreateDate: xmpData.CreateDate ? dayjs(xmpData.CreateDate) : undefined }
    console.log("fieldValue", fieldValue)
    useEffect(() => form.setFieldsValue(fieldValue))
    return (
        <Form<XmpData>
            form={form}
            name="basic"
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            // style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {
                Object.keys(xmpdata).map((key) => (
                    <Form.Item<XmpData>
                        key={key}
                        label={key}
                        name={key as keyof XmpData}
                        // valuePropName={key === 'CreateDate' ? 'value' : undefined}
                        // rules={[{ required: true, message: 'Please input your username!' }]}
                        // normalize={(v)=>{console.log("vo"+key,v); return v && v.value}}
                        // getValueProps={v => v}
                        required
                        rules={[{ required: true, message: 'Please input' }]}
                    >
                        {key === 'CreateDate' ? <DatePicker /> : <Input

                            disabled={Object.keys(fixXmpData).includes(key)}
                        />}
                    </Form.Item>
                ))
            }

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>

    )
}

export default UploadPhoto
