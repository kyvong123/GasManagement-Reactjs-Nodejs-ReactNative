import React, { Component } from "react";
import { compose } from "recompose";
import GetImexLocationCylindersImex from "../../../api/GetImexLocationCylindersImex"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import getUserCookies from "../../helpers/getUserCookies";

const MapWithAMarker = compose(
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <GoogleMap
      defaultZoom={5}
      defaultCenter={{ lat: 14.058324, lng: 108.277199 }}
    >
      {props.markers.map((marker) => {
        const onClick = props.onClick.bind(this, marker);
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            position={{ lat: Number.isNaN(marker.LAT) ?
              marker.LAT : parseFloat(marker.LAT),
              lng: Number.isNaN(marker.LNG) ?
              marker.LNG : parseFloat(marker.LNG) }}
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div >
                <b style={{ fontWeight: 'bold' }}>{marker.Factory_Name}</b> 
                  <br></br>
                   Khai báo mới :  <b style={{ fontWeight: 'bold' }}>{marker.Declaration}</b>
                   <br></br>
                   Xuất hàng : <b style={{ fontWeight: 'bold' }}>{marker.Export}</b>
                   <br></br>
                   Hồi lưu : <b style={{ fontWeight: 'bold' }}>{marker.TURN_BACK}</b>
                   <br></br>
                   Tồn kho  : <b style={{ fontWeight: 'bold' }}>{marker.Inventory}</b>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
});

export default class GoogleMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelters: [],
      selectedMarker: false,
    };
  }

  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let objectId = user_cookie.user.id;
    let data = await GetImexLocationCylindersImex(objectId);
      console.log('GG-Res', data.data.Factories)
      if (data.data.Factories.length <= 0) {
        this.setState({
          shelters: [
            {
              name: "empty",
              soluong: 0
            }
          ]
        })
      }
      else {
        let array=[];
        data.data.Factories.map((item,index)=>{
          array.push({
            Declaration: item.Declaration.toLocaleString("nl-BE"),
            Export: item.Export.toLocaleString("nl-BE"),
            Factory_Name: item.Factory_Name,
            Inventory: item.Inventory.toLocaleString("nl-BE"),
            LAT: item.LAT,
            LNG: item.LNG,
            TURN_BACK: item.TURN_BACK.toLocaleString("nl-BE")
            });
        })
        // console.log("data.data.Factories",array);
        this.setState({
          shelters: array
        }, ()=>console.log("shelter", this.state.shelters))
      }
    
  }

  handleClick = (marker, event) => {
    console.log( 'ggMarker', marker )
    this.setState({ selectedMarker: marker });
  };

  render() {
    return (
      <MapWithAMarker
        selectedMarker={this.state.selectedMarker}
        markers={this.state.shelters}
        onClick={this.handleClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQijKBn8WZi84WmijJBy5c0qT9Rmk7rzE&libraries=geometry,drawing,places&language=vi&region=VN"
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={
          <div 
            className="map"
            style={{
              position: "absolute",
              top: 64,
              left: 260,
              bottom: 0,
              right: 0,
            }}
          />
        }
        mapElement={<div style={{ height: "100%" }} />}
      />
    );
  }
}
