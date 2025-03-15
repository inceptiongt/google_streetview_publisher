import React from 'react';
import { FormProps, FormInstance, Button, Form, Input, DatePicker, Switch } from 'antd';
import { PhotoCreate, FixXmpData } from '@/type';
import { useRequest } from 'ahooks';
import { uploadPhoto, createPhoto } from '@/services';
import { writeXmpHandler } from '@/actions';
import { omit } from 'lodash';
import Link from 'next/link';
import { message, notification } from 'antd';

const fixXmpData = new FixXmpData();
const photoCreate = new PhotoCreate();

interface PhotoFormProps {
    form: FormInstance;
}

const PhotoForm: React.FC<PhotoFormProps> = ({ form }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    
    const handleUpload = async (xmpData: PhotoCreate) => {
        // Get the file from the form data
        const fileList = form.getFieldValue('fileList');
        if (!fileList || fileList.length === 0) {
            messageApi.error("请先上传照片");
            return;
        }
        
        const formData = new FormData();
        formData.append('photo', fileList[0]);
        formData.append('uid', fileList[0].uid);
        formData.append('photoCreateData', JSON.stringify(omit(xmpData, ['Latitude', 'Longitude', 'PlaceId'])));
        const res = await writeXmpHandler(formData);
        let path;
        if (res.ok) {
            path = res.data.path;
            messageApi.success(
                "设置 XMP metedata 成功"
            );
        } else {
            notificationApi.error({
                message: res.message,
                duration: 0
            });
            return;
        }
        const refRst = await uploadPhoto(path);

        if (refRst.ok) {
            messageApi.success("上传成功");
            const latitude = xmpData.Latitude;
            const longitude = xmpData.Longitude;
            const placeId = xmpData.PlaceId;
            const photo: gapi.client.streetviewpublish.Photo = {
                uploadReference: refRst.result,
                "pose": {
                    "latLngPair": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                }
            };
            if(placeId) {
                photo.places=[{placeId}];
            }
            const cRst = await createPhoto(photo);
            if (cRst.ok) {
                notificationApi.success({
                    message: '创建成功',
                    description: (<Link href={cRst.result.shareLink ?? ''} target={'_blank'}>在 Google Map 中查看</Link>),
                    duration: 0,
                });
            } else {
                notificationApi.error({
                    message: "创建失败" + cRst.statusText + cRst.result.error.message,
                    duration: 0
                });
            }
        } else {
            messageApi.error("上传失败" + refRst.statusText + refRst.result.error.message);
        }
    };
    
    const { loading, run: runHandleUpload } = useRequest(handleUpload, { manual: true });
    
    const onFinish: FormProps<PhotoCreate>['onFinish'] = (values) => {
        runHandleUpload(values);
    };

    const onFinishFailed: FormProps<PhotoCreate>['onFinishFailed'] = () => {
        // Handle form validation failure
    };

    const renderFormItem = () => {
        const renderItem = (key: keyof PhotoCreate) => {
            switch (key) {
                case 'CreateDate':
                    return <DatePicker />;
                case 'mirror':
                    return <Switch disabled />;
                default:
                    return <Input disabled={Object.keys(fixXmpData).includes(key)} />;
            }
        };

        return Object.keys(photoCreate).map((key) => (
            <Form.Item<PhotoCreate>
                key={key}
                label={key}
                name={key as keyof PhotoCreate}
                required={["mirror","PlaceId"].includes(key)? false: true}
                rules={[{ required: ["mirror","PlaceId"].includes(key)? false: true, message: 'Please input' }]}
            >
                {renderItem(key as keyof PhotoCreate)}
            </Form.Item>
        ));
    };

    return (
        <>
            {contextHolder}
            {notificationContextHolder}
            <Form<PhotoCreate>
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {renderFormItem()}

                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button size='large' type="primary" htmlType="submit" loading={loading} disabled={loading}>
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default PhotoForm; 