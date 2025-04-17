import React, { useEffect, useState, useRef, useMemo } from 'react';
import View360, { EquirectProjection, Autoplay } from '@egjs/react-view360';
import '@egjs/react-view360/css/view360.min.css';
import { Button, Space } from 'antd'


interface SphereViewProps {
  img: File | undefined;
}

const SphereView: React.FC<SphereViewProps> = ({ img }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewerRef = useRef<View360>(null);
  const view360 = viewerRef.current

  // Create projection using useMemo to prevent recreation on every render
  const projection = useMemo(() => {
    if (!imageUrl) return null;
    return new EquirectProjection({
      src: imageUrl,
    });
  }, [imageUrl]);

  // Create object URL when image changes
  useEffect(() => {
    if (img) {
      setIsLoading(true);
      setError(null);

      const url = URL.createObjectURL(img);
      setImageUrl(url);

      // Clean up URL when component unmounts or image changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl(null);
    }
  }, [img]);

  const initviewHandler = () => {
    // console.log(view360?.camera)
    view360?.camera.animateTo({
      yaw: 0,
      pitch: 0,
      zoom: 0.6
    })
  }

  const aeroviewHandler = () => {
    view360?.camera.animateTo({
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
            onReady={() => setIsLoading(false)}
            onError={() => {
              setError('加载全景图出错');
              setIsLoading(false);
            }}

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