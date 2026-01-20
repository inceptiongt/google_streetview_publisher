import React, { useEffect, useState, useRef, useMemo } from 'react';
import View360, { EquirectProjection, Autoplay } from '@egjs/react-view360';
import '@egjs/react-view360/css/view360.min.css';
import { Button, Space } from 'antd'
import { RcFile } from 'antd/es/upload';


interface SphereViewProps {
  img?: RcFile;
  uid?: string;
}

const SphereView: React.FC<SphereViewProps> = ({ img, uid }) => {

  const viewerRef = useRef<View360>(null);
  const view360 = viewerRef.current

  const projection = new EquirectProjection({
    src: img? URL.createObjectURL(img): '',
  });

  const initviewHandler = () => {
    // console.log(view360?.camera)
    viewerRef.current?.camera.animateTo({
      yaw: 0,
      pitch: 0,
      zoom: 0.6
    })
  }

  const aeroviewHandler = () => {
    viewerRef.current?.camera.animateTo({
      yaw: 0,
      pitch: -90,
      zoom: 0.6
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent:'center',
        alignItems: 'center',
        width: '100%',
        height: '400px',
        position: 'relative',
        backgroundColor: '#f0f0f0',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >

      {img ? (
        <
        // ref={containerRef}

        >
          <View360
            ref={viewerRef}
            // autoplay={{disableOnInterrupt: true,canInterrupt:true,pauseOnHover: true}}
            // autoplay
            initialZoom={0.6}
            projection={projection}
            property=''
            style={{ width: "100%", height: "100%" }}
            className='is-2by1'
          />
          <Space style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
            <Button color="default" variant="outlined" size='small' onClick={aeroviewHandler}>俯瞰视角</Button>
            <Button color="default" variant="outlined" size='small' onClick={initviewHandler}>初始视角</Button>

          </Space>
        </>
      ) : <span>请先上传全景图片</span>}
    </div>
  );
};

export default SphereView;