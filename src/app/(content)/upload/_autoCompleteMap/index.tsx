import React, { useState } from 'react';
import { APIProvider, Map, ControlPosition, MapControl, MapMouseEvent } from '@vis.gl/react-google-maps';
import { Button, Col, FormInstance, Row, Space, Divider } from 'antd';

import { AutocompleteCustom } from './components/autocomplete-custom';
import AutocompleteResult from './autocomplete-result';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const Gmap: React.FC<{ form: FormInstance }> = ({ form }) => {
    const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
    const [placeId, setPlaceId] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

    const setForm = ({ detail }: MapMouseEvent) => {
        if (detail.placeId) {
            form.setFieldsValue({
                Latitude: detail.latLng?.lat ?? 0,
                Longitude: detail.latLng?.lng ?? 0,
                PlaceId: detail.placeId
            })
        } else {
            form.setFieldsValue({
                Latitude: detail.latLng?.lat ?? 0,
                Longitude: detail.latLng?.lng ?? 0,
            })
        }
    }

    return (
        <>
            <Row style={{ height: '400px' }}>

                {/* <Col span={24} > */}
                <APIProvider apiKey={API_KEY}>
                    <Map
                        // style={{ width: '100vw', height: '100vh' }}
                        mapId={'4eb4e80ea4aff2633c0823f0'}
                        defaultZoom={12}
                        defaultCenter={{ lat: 23.128788170495174, lng: 113.34538723489892 }}
                        // disableDefaultUI={true}
                        onClick={setForm}
                    >
                        <MapControl position={ControlPosition.TOP_CENTER}>
                            <AutocompleteCustom onPlaceSelect={setSelectedPlace} setForm={setForm}/>

                        </MapControl>
                        <AutocompleteResult place={selectedPlace} />
                    </Map>
                </APIProvider>
                {/* </Col>
            <Col span={24}> */}
            </Row>


        </>
    );
}
export default Gmap;