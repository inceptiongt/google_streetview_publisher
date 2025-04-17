import React, { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { Button, Col, FormInstance, Row, Space, Divider } from 'antd';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const Gmap: React.FC<{ form: FormInstance }> = ({ form }) => {
    const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
    const [placeId, setPlaceId] = useState('');
    return (
        <>
            <Row style={{ height: '400px' }}>

                {/* <Col span={24} > */}
                <APIProvider apiKey={API_KEY}>
                    <Map
                        // style={{ width: '100vw', height: '100vh' }}
                        defaultZoom={12}
                        defaultCenter={{ lat: 23.128788170495174, lng: 113.34538723489892 }}
                        onClick={({ detail }) => {
                            form.setFieldsValue({
                                Latitude: detail.latLng?.lat ?? 0,
                                Longitude: detail.latLng?.lng ?? 0,
                                PlaceId: detail.placeId ?? ''
                            })
                        }}
                    />
                </APIProvider>
                {/* </Col>
            <Col span={24}> */}
            </Row>


        </>
    );
}
export default Gmap;