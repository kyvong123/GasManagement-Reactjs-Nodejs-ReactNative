import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions, Linking, TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import {
  getCreateShippingOrderLocation,
} from '../actions/OrderActions';
const keyAPIGoogle = 'AIzaSyCohIQM3q9Cv06LXqSOqdE6wMOmGtMmGu0';
//thu vien moi
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconFon from 'react-native-vector-icons/Fontisto';
import IconFea from 'react-native-vector-icons/Feather';

import * as RNLocalize from 'react-native-localize'
import { setLanguage, getLanguage } from '../helper/auth';
import BackgroundTimer from 'react-native-background-timer';
const translationGetters = {
  en: () => require('../languages/en.json'),
  vi: () => require('../languages/vi.json'),
};

const chooseLanguageConfig = lgnCode => {
  let fallback = { languageTag: 'vi' };
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode };
  }

  const { languageTag } = fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  MapStyle: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  }

});

class GetLocationsiping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverloca: '',
      userLocation: '',
      isLoading: true,
      isLoadinguser: true
    };
    this.mapRef = React.createRef();
  }

  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          'change',
          handleChangeLanguage(languageCode)
        );
      }
    } catch (error) {
      console.log(error);
    }

    const userlocation = {
      latitude: parseFloat(this.props.user.LAT),
      longitude: parseFloat(this.props.user.LNG)
    }
    this.setState({ userLocation: userlocation })
    await this.props.getCreateShippingOrderLocation(this.props.orderShippingID)
    this.onRefresh()
  };

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        'change',
        handleChangeLanguage(languageCode)
      );
    }

  };
  //khi goi action thanh cong thi se luu vi tri vao state
  componentDidUpdate(prevProps, prevState) {
    if (this.props.getShippingLocation !== prevProps.getShippingLocation) {
      this.setState({ isLoading: false, driverloca: this.props.getShippingLocation.driverLocation })

    }
  }
  //goi lai vi tri cua tai xe moi 30s
  onRefresh() {
    BackgroundTimer.runBackgroundTimer(async () => {
      await this.props.getCreateShippingOrderLocation(this.props.orderShippingID)
    }, 30000);

  }
  //goi dien thoai
  openPhoneCall = async (phone) => {
    Linking.openURL(`tel:${phone}`)
  }

  // ------------------------------------------------------------



  render() {

    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View>
            <ActivityIndicator

              style={{ marginTop: 10 }}
            />
            <Text style={{
              alignContent: 'center',
              alignItems: 'center'
            }}>Đang tìm vị trí của tài xế</Text>
          </View>
        ) :
          <View style={{
            width: '100%',
            height: '100%', backgroundColor: '#fff'
          }}>
            <MapView
              ref={this.mapRef}
              showsScale={true}
              zoomEnabled={true}
              initialRegion={{
                latitude: (this.state.userLocation.latitude + this.state.driverloca.latitude) / 2,
                longitude: (this.state.userLocation.longitude + this.state.driverloca.longitude) / 2,
                latitudeDelta: Math.abs(this.state.userLocation.latitude - this.state.driverloca.latitude) >= 0.01
                  ? Math.abs(this.state.userLocation.latitude - this.state.driverloca.latitude) + 0.05
                  : Math.abs(this.state.userLocation.latitude - this.state.driverloca.latitude) + 0.001,
                longitudeDelta: Math.abs(this.state.userLocation.longitude - this.state.driverloca.longitude) >= 0.01
                  ? Math.abs(this.state.userLocation.longitude - this.state.driverloca.longitude) + 0.05
                  : Math.abs(this.state.userLocation.longitude - this.state.driverloca.longitude) + 0.001,
              }}
              provider={PROVIDER_GOOGLE}
              style={styles.MapStyle}>

              <Marker
                coordinate={this.state.userLocation}
                title={'Vị trí của bạn'}>
                <IconFA5 name="map-marker-alt" color={'green'} size={30} />
              </Marker>

              <Marker
                coordinate={this.state.driverloca}
                title={'Vị trí của shipper'}>
                <IconFon name="motorcycle" color={'blue'} size={30} />
              </Marker>

              <MapViewDirections
                resetOnChange={false}
                origin={this.state.userLocation}
                destination={this.state.driverloca}
                apikey={keyAPIGoogle}
                strokeWidth={4}
                strokeColor="hotpink"
              />

            </MapView>

            <Text
              style={{
                fontWeight: 'bold',
                color: 'black', fontSize: 18
              }}
            >Tên tài xế:{this.props.getShippingLocation.Carrier.name}</Text>
            <TouchableOpacity
              style={{
                fontWeight: 'bold', flexDirection: 'row',
                marginRight: 10,
              }}
              onPress={() => {
                this.openPhoneCall(this.props.getShippingLocation.Carrier.phone)
              }}>
              <IconFea color={'green'} name="phone-forwarded" size={20} />
              <Text style={{
                fontWeight: 'bold',
                fontSize: 18
              }}  >{this.props.getShippingLocation.Carrier.phone}</Text>
            </TouchableOpacity>
          </View>
        }

      </View>
    );
  }
}

export const mapStateToProps = state => ({
  user: state.auth.user,
  getShippingLocation: state.order
    .result_getCreateShippingOrderLocation,
});

export default connect(mapStateToProps, {
  getCreateShippingOrderLocation,
})(GetLocationsiping);
