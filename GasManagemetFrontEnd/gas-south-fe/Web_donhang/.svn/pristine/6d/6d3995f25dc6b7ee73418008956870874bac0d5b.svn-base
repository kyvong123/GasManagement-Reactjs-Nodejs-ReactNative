import React, { Component } from 'react';
import { Icon } from 'antd';
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';

const trackLocation = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
      return onError(new Error('Geolocation is not supported by your browser.'));
    }
  
    // Use watchPosition instead.
    return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
};

class PopupCoodinatorMap extends Component {
    constructor(props){
        super(props);
        this.state = {
            process: [],
            lat: 0,
            long: 0,
            error: "",
            locationDriver: {}
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.locationDriver){
            this.setState({
                lat: nextProps.lat,
                long: nextProps.long,
                locationDriver: nextProps.locationDriver
            });
        }
    }
    componentWillMount(){
        this.watchLocation()
    }
    watchLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.watchPosition(position => {
                this.setState(prevState => ({
                    locationDriver: {
                        ...prevState.locationDriver,
                        lat: position.coords.latitude,
                        long: position.coords.longitude                        
                    }
                }));
                console.log("LocationDriver", this.state.locationDriver)
            })
        } else{
            this.setState({
                error: ERROR.noGeoLocation
            });
        }
        console.log("ERROR", this.state.error)
    }

    render() {
        const { nameDriver } = this.props;
        const { locationDriver } = this.state;
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{ 
                lat: parseFloat(locationDriver.lat) ? parseFloat(locationDriver.lat) : 0, 
                lng: parseFloat(locationDriver.long) ? parseFloat(locationDriver.long) : 0 
            }}
        >
            {props.isMarkerShown && 
                <MarkerWithLabel 
                    position={{ 
                        lat: parseFloat(locationDriver.lat) ? parseFloat(locationDriver.lat) : 0, 
                        lng: parseFloat(locationDriver.long) ? parseFloat(locationDriver.long) : 0 
                    }}
                    labelAnchor={new google.maps.Point(0, 0)}
                    labelStyle={{backgroundColor: "white", fontSize: "0.8rem", padding: "5px"}}
                >
                    <div>{nameDriver}</div>
                </MarkerWithLabel>
            }
        </GoogleMap>
        ));    
        return (
            <div className="modal fade" id="coodinator-detail-map" tabindex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header table__head rounded-0">
                        <h4 
                            className="modal-title text-white" 
                            data-toggle="modal" 
                            data-target="#detail-coodinator-modal"
                            data-dismiss="modal"
                            style={{cursor: "pointer"}}
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

export default PopupCoodinatorMap;