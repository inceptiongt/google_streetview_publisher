"use client"

import React from 'react';
import { Typography } from 'antd';
import { Row, Col, Form } from 'antd';
import Gmap from './map';
import PhotoForm from './PhotoForm';
import UploadSection from './UploadSection';

const { Title } = Typography;

const UploadPhoto = () => {
    const [form] = Form.useForm();

    return (
        <>
            <Row gutter={[24, 24]} >
                <Col span={12}>
                    <UploadSection form={form} />
                    <Gmap form={form} />
                </Col>

                <Col span={12}>
                    <Title level={2}>设置元数据</Title>
                    <PhotoForm form={form} />
                </Col>
            </Row>
        </>
    );
};

export default UploadPhoto;
