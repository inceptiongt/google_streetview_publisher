import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Typography } from 'antd';
import View360, { EquirectProjection } from '@egjs/react-view360';
import '@egjs/react-view360/css/view360.min.css';

const { Text } = Typography;

interface SphereViewProps {
  img: File | undefined;
}

const SphereView: React.FC<SphereViewProps> = ({ img }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create projection using useMemo to prevent recreation on every render
  const projection = useMemo(() => {
    if (!imageUrl) return null;
    return new EquirectProjection({
      src: imageUrl
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

  if (!img) {
    return <Text type="secondary">请先上传全景图片</Text>;
  }

  return (
    <div style={{ width: '100%', marginTop: 16 }}>
      {isLoading && !error && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <Text>全景图加载中...</Text>
        </div>
      )}
      
      <div 
        ref={containerRef}
        style={{ 
          width: '100%',
          height: '400px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        {projection && (
          <View360
            projection={projection}
            style={{ width: "100%", height: "100%" }}
            onReady={() => setIsLoading(false)}
            onError={() => {
              setError('加载全景图出错');
              setIsLoading(false);
            }}
          />
        )}
      </div>
      
      {error && (
        <div style={{ marginTop: '8px' }}>
          <Text type="danger">{error}</Text>
        </div>
      )}
    </div>
  );
};

export default SphereView;