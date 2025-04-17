import React from 'react';
import { FormProps, FormInstance, Button, Form, Input, DatePicker, Switch, Row, Col, Tooltip } from 'antd';
import {
    QuestionCircleFilled,
} from '@ant-design/icons';
import { EditablePublishInitXmpData } from '@/type';
import { useRequest } from 'ahooks';
import { uploadPhoto, createPhoto } from '@/services';
import { writeXmpHandler } from '@/actions';
import { omit } from 'lodash';
import Link from 'next/link';
import { message, notification } from 'antd';


interface PhotoFormProps {
    form: FormInstance;
}

export interface FormItems extends EditablePublishInitXmpData {
    isMirror: boolean
}

const PhotoForm: React.FC<PhotoFormProps> = ({ form }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const handleUpload = async (xmpData: FormItems) => {
        // Get the file from the form data
        const fileList = form.getFieldValue('fileList');
        if (!fileList || fileList.length === 0) {
            messageApi.error("请先上传照片");
            return;
        }

        const formData = new FormData();
        formData.append('photo', fileList[0].originFileObj);
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
            if (placeId) {
                photo.places = [{ placeId }];
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

    const onFinish: FormProps<FormItems>['onFinish'] = (values) => {
        runHandleUpload(values);
    };

    const onFinishFailed: FormProps<FormItems>['onFinishFailed'] = () => {
        // Handle form validation failure
    };

    return (
        <>
            {contextHolder}
            {notificationContextHolder}
            <Form<FormItems>
                form={form}
                name="basic"
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
            >
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item<FormItems>
                            key="FullPanoWidthPixels"
                            label="FullPanoWidthPixels"
                            name="FullPanoWidthPixels"
                            layout='vertical'
                            required={true}
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <Input disabled={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FormItems>
                            key="FullPanoHeightPixels"
                            label="FullPanoHeightPixels"
                            name="FullPanoHeightPixels"
                            layout='vertical'
                            required={true}
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <Input disabled={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={
                                <Tooltip title="可在右侧地图内点选">
                                    Latitude <QuestionCircleFilled />
                                </Tooltip>
                            }
                            key="Latitude"
                            layout='vertical'
                            required={true}
                            name="Latitude"
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <Input disabled={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={
                                <Tooltip title="可在右侧地图内点选">
                                    Longitude <QuestionCircleFilled />
                                </Tooltip>
                            }
                            key="Longitude"
                            layout='vertical'
                            required={true}
                            name="Longitude"
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <Input disabled={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={
                                <Tooltip title="可在右侧地图内点选">
                                    PlaceId <QuestionCircleFilled />
                                </Tooltip>
                            }
                            key="PlaceId"
                            layout='vertical'
                            required={true}
                            name="PlaceId"
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <Input disabled={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FormItems>
                            key="PoseHeadingDegrees"
                            label="PoseHeadingDegrees"
                            name="PoseHeadingDegrees"
                            layout='vertical'
                            required={true}
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <Input disabled={false} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FormItems>
                            key="CreateDate"
                            label="CreateDate"
                            name="CreateDate"
                            layout='vertical'
                            required={true}
                            rules={[{ required: true, message: 'Please input' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FormItems>
                            key="isMirror"
                            label="isMirror"
                            name="isMirror"
                            layout='vertical'
                            required={false}
                            rules={[{ required: false, message: 'Please input' }]}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={24}>

                        <Form.Item
                            // wrapperCol={{ offset: 8 }}
                            layout='vertical'
                        >
                            <Button size='large' type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                创建
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </>
    );
};

export default PhotoForm; 