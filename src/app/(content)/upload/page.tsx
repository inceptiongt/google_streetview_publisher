"use client"

import React, { useState } from 'react';
import { Typography, Row, Col, Form, Upload, Button, Divider } from 'antd';
import type { UploadProps, GetProp, UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import ExifReader from 'exifreader';
import { mapValues, without } from 'lodash';
import dayjs from 'dayjs';
import { FormItems } from '@/type';
import SphereView from '@/components/SphereView';
import Gmap from './map';
import PhotoForm from './PhotoForm';

const { Title } = Typography;

type FileType = RcFile;

const UploadPhoto = async () => {
    const [form] = Form.useForm<FormItems>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    let createExiv2Module: any = null;
    // Prefer loading the ESM bundle from the public path to avoid package-relative `dist/dist` issues.
    try {
        /*@ts-ignore*/
        const esm = await import(/* webpackIgnore: true */ /* @vite-ignore */ '/exiv2-wasm/dist/exiv2.esm.js');
        createExiv2Module = (esm.createExiv2Module ?? esm.default) as any;
    } catch (e) {
        // Fallback to package import (keeps behavior for environments where public copy isn't available)
        const mod = await import('exiv2-wasm');
        createExiv2Module = (mod.createExiv2Module ?? mod.default) as any;
    }

    const exiv2 = await createExiv2Module({
        locateFile: (fileName: string) => `/exiv2-wasm/dist/${fileName}`
    });

    const getXmpData = (metaData: ExifReader.ExpandedTags) => {
        const xmp = mapValues({ ...metaData.file, ...metaData.xmp, ...metaData.exif, width: metaData.file?.['Image Width'], height: metaData.file?.['Image Height'] }, 'value');
        return {
            ...metaData.gps,
            ...xmp,
            FullPanoHeightPixels: xmp.height,
            FullPanoWidthPixels: xmp.width,
            CreateDate: xmp.DateTimeOriginal[0],
            PosteHeadingDegrees: xmp.PoseHeadingDegrees,
        }
    };

    const beforeUpload = async (file: FileType) => {
        const uploadFile: UploadFile = {
            uid: file.uid,
            name: file.name,
            status: 'done',
            originFileObj: file
        };
        setFileList([uploadFile]);

        const tags = await ExifReader.load(file, { expanded: true });

        const xmpData = getXmpData(tags);
        const fieldValue = {
            ...xmpData,
            CreateDate: xmpData.CreateDate ? dayjs(xmpData.CreateDate) : dayjs(new Date('2001-01-01'))
        };
        form.resetFields(['FullPanoHeightPixels', 'FullPanoWidthPixels', 'CreateDate','PoseHeadingDegrees']);
        form.setFieldsValue({ ...fieldValue, fileList: [uploadFile] });
        // form.setFieldsValue(fieldValue);
        return false;
    };

    const uploadProps: UploadProps = {
        beforeUpload,
        fileList,
        // showUploadList: false,
        maxCount: 1,
    };

    return (
        <>
            <Row
                style={{
                    padding: '12px',
                    paddingTop: '0'
                }}
            // gutter={[12,0]}
            >
                <Col
                    span={8}

                >
                    <Title level={2}>上传照片</Title>

                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>选择图片</Button>
                    </Upload>
                    <Title level={2}>设置元数据</Title>
                    <PhotoForm form={form} exiv2={exiv2}/>
                </Col>
                <Col span={16}>
                    <Row
                        style={{padding:"12px 0 0 12px"}}
                        gutter={[0, 8]}
                    >
                        <Col span={24}>
                            <SphereView img={fileList[0]?.originFileObj} uid={fileList[0]?.originFileObj?.uid} />
                        </Col>
                        <Col span={24}>

                            <Gmap form={form} />
                        </Col>
                    </Row>

                </Col>
            </Row>
        </>
    );
};

export default UploadPhoto;
