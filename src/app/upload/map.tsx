import React, { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { Button } from 'antd';
import { Space } from 'antd';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const Gmap = ({setFormData}) => {
    const [latLng, setLatLng] = useState({lat: 0, lng: 0});
    const [placeId, setPlaceId] = useState('');
    return (
        <>
            <Space>
                lat: {latLng.lat}
                lng: {latLng.lng}
                placeId: {placeId}
                <Button type="primary">Button</Button>
            </Space>
            <APIProvider apiKey={API_KEY}>
                <Map
                // style={{ width: '100vw', height: '100vh' }}
                defaultZoom={12}
                defaultCenter={{ lat: 23.128788170495174, lng: 113.34538723489892 }}
                onClick={({detail}) => {
                    setLatLng({lat: detail.latLng?.lat ?? 0, lng: detail.latLng?.lng ?? 0});
                    setPlaceId(detail.placeId ?? '');
                }}
                />
            </APIProvider>
        </>
    );
}
export default Gmap;