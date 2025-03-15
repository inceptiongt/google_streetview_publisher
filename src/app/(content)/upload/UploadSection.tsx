import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { UploadProps, GetProp, Button, Upload, Image, Row, Col, Divider, FormInstance } from 'antd';
import { Typography } from 'antd';
import ExifReader from 'exifreader';
import { mapValues } from 'lodash';
import dayjs from 'dayjs';
import { PhotoCreate, FixXmpData } from '@/type';
import SphereView from '@/components/SphereView';

const { Title } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface UploadSectionProps {
  form: FormInstance;
}

const UploadSection: React.FC<UploadSectionProps> = ({ form }) => {
  const [fileList, setFileList] = useState<FileType[]>([]);
  const [mirror, setMirror] = useState(false);
  const [url, setUrl] = useState('');
  
  const fixXmpData = new FixXmpData();

  const getXmpData = (metaData: ExifReader.ExpandedTags): PhotoCreate => {
    const xmp = mapValues({ ...metaData.file, ...metaData.xmp, ...metaData.exif, width: metaData.file?.['Image Width'], height: metaData.file?.['Image Height'] }, 'value');
    return { 
      ...metaData.gps, 
      ...xmp, 
      CroppedAreaImageHeightPixels: xmp.height, 
      CroppedAreaImageWidthPixels: xmp.width, 
      FullPanoHeightPixels: xmp.height, 
      FullPanoWidthPixels: xmp.width,
      CreateDate: xmp.DateTimeOriginal[0]
    } as PhotoCreate;
  };

  const beforeUpload = async (file: FileType) => {
    setFileList([file]);

    const fileUrl = URL.createObjectURL(file);
    setUrl(fileUrl);
    const tags = await ExifReader.load(file, { expanded: true });
    
    const xmpData = getXmpData(tags);
    const fieldValue = { 
      ...fixXmpData, 
      ...xmpData, 
      CreateDate: xmpData.CreateDate ? dayjs(xmpData.CreateDate) : dayjs(new Date('2001-01-01')) 
    };
    form.resetFields();
    form.setFieldsValue({ fileList: [file] });
    form.setFieldsValue(fieldValue);
    return false;
  };

  const uploadProps: UploadProps = {
    beforeUpload,
    fileList,
    showUploadList: false,
    maxCount: 1,
  };

  return (
    <>
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
      <SphereView img={fileList[0]}/>
      <Divider />
      <Row justify={'space-between'}>
        <Col>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>选择图片</Button>
          </Upload>
        </Col>
        <Col>
          <Button onClick={() => { 
            setMirror(!mirror); 
            form.setFieldsValue({ mirror: !mirror }) 
          }}>
            镜像翻转图片
          </Button>
        </Col>
      </Row>
      <Title level={2}>拾取位置</Title>
    </>
  );
};

export default UploadSection; 