import React, { Component } from 'react';
import { Icon } from 'antd';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';

class PopupShippingMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    render() {
        const { locationDriver } = this.state;
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                defaultZoom={16}
                defaultCenter={{
                    lat: parseFloat(this.props.latLocation) ? parseFloat(this.props.latLocation) : 0,
                    lng: parseFloat(this.props.longLocation) ? parseFloat(this.props.longLocation) : 0
                }}
            >
                {props.isMarkerShown &&
                    <MarkerWithLabel
                        position={{
                            lat: parseFloat(this.props.latLocation) ? parseFloat(this.props.latLocation) : 0,
                            lng: parseFloat(this.props.longLocation) ? parseFloat(this.props.longLocation) : 0
                        }}
                        labelAnchor={new google.maps.Point(0, 0)}
                        labelStyle={{ color: "red",backgroundColor: "white", fontSize: "0.7rem", padding: "5px" }}
                        icon={{
                            url: '../../../../assets/img/truck.png',
                        }}
                    >
                        <div>{this.props.nameDrivers}</div>
                    </MarkerWithLabel>
                }
            </GoogleMap>
        ));
        return (
            <div className="modal fade" id="shipping-map" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header table__head rounded-0">
                            <h4
                                className="modal-title text-white"
                                data-toggle="modal"
                                data-target="#detail-coodinator-modal"
                                data-dismiss="modal"
                                style={{ cursor: "pointer" }}
                            >
                                <Icon type="arrow-left" className="fa" /> Quay lại
                        </h4>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="text-white">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <MyMapComponent
                                isMarkerShown
                                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkVHLujkgnqgqAktD5xqcKurzWB8t55Pk&callback=initMap&libraries=geometry,places&v=weekly"
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `400px` }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopupShippingMap;