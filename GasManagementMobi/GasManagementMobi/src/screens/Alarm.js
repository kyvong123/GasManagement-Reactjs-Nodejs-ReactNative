import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Platform
} from 'react-native';

import i18n from 'i18n-js';
import { Actions } from 'react-native-router-flux';
import memoize from 'lodash.memoize';

//thư viện mới
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';
import { createAlarm, editAlarm } from 'react-native-simple-alarm';
import ModalSelector from 'react-native-modal-selector';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const translationGetters = {
  en: () => require('../languages/en.json'),
  vi: () => require('../languages/vi.json')
}

const chooseLanguageConfig = (lgnCode) => {
  let fallback = { languageTag: 'vi' }
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode }
  }

  const { languageTag } = fallback

  translate.cache.clear()

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)


const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  setting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  editButton: {
    height: 40,
    width: 160,
    borderRadius: 10,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#009347",
  },
  btn: { textAlign: 'center', color: "#fff", fontWeight: 'bold', fontSize: 20, margin: 5 }

})
export default class Alarm extends Component {//16/9 thay đổi 
  //class OrderStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      time: this.props.edit
        ? moment(this.props.edit.date).startOf('minute').format('hh:mm A')
        : moment().startOf('minute').format('hh:mm A'),
      date: this.props.edit
        ? this.props.edit.date
        : moment().startOf('minute').format(),
      message: this.props.edit ? this.props.edit.message : '',
      springSpeed: 500,
      snooze: this.props.edit ? Number(this.props.edit.snooze) : 1,
      snoozePicker: false,
    };

    this.pickerCustomRef = React.createRef();



  }


  // componentDidMount() {
  //   if (Platform.OS === 'ios') {
  //     PushNotificationIOS.checkPermissions((permissions) => {
  //       if (!permissions.alert) {
  //         alert('Please enable push notifications for the alarm to work');
  //       }
  //     });
  //   } else {
  //     PushNotification.checkPermissions((permissions) => {
  //       if (!permissions.alert) {
  //         alert('Please enable push notifications for the alarm to work');
  //       }
  //     });
  //   }
  // }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _hideSnoozePicker = () => this.setState({ snoozePicker: false });

  _showSnoozePicker = () => this.setState({ snoozePicker: true });
  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
    }
  }
  onShowMore(index) {
    const states = this.state
    states.listCode[index].isChoose = states.listCode[index].isChoose ? false : true
    this.setState({ ...states.listCode })
  }

  _handleDatePicked = (date) => {
    this._hideDateTimePicker();
    const time = moment(date).startOf('minute').format('hh:mm A');
    const newDate = moment(date).startOf('minute').format();

    this.setState({
      time,
      date: newDate,
    });
  };

  _addAlarm = async () => {
    let { time, date, message, snooze } = this.state;

    if (!time) {
    } else {
      let newDate = date;
      if (moment(date).isBefore(moment().startOf('minute'))) {
        date = moment(date).add(1, 'days').startOf('minute').format();
      }
      await createAlarm({
        active: true,
        date: newDate,
        message,
        snooze
      });

      Actions.homeAlarm();
    }
  };
  _editAlarm = async () => {
    const { edit } = this.props;
    let { time, date, message, snooze } = this.state;

    if (!time) {
    } else {
      let id = edit.id;
      let newDate = date;

      // bug with react-native-push-notification where if the date is before the current time, it will get executed
      if (moment(date).isBefore(moment().startOf('minute'))) {
        newDate = moment(date).add(1, 'days').startOf('minute').format();
      }

      await editAlarm({
        id,
        date: newDate,
        snooze,
        message,
        active: true,
      });

    }
  };
  snoozeModal() {
    let { snooze } = this.state;
    let data = [{ key: 0, section: true, label: 'Snooze Time' }];
    for (let i = 0; i < 60; i++) {
      data.push({
        key: i + '',
        label: i + '',
        accessibilityLabel: i + '',
      });
    }
    return (
      <View style={styles.setting}>
        <ModalSelector
          data={data}
          initValue="Select an Instrument"
          supportedOrientations={['portrait']}
          accessible={true}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          style={{ flex: 1 }}
          onChange={({ label }) => {
            this.setState({ snooze: label });
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 20 }}>Nhăc Lại</Text>

            <Text style={{ fontSize: 20 }}>
              {snooze} minute{snooze > 1 ? 's' : null}
            </Text>
          </View>
        </ModalSelector>
      </View>
    );
  }


  render() {
    let { time, isDateTimePickerVisible, date } = this.state;
    let { edit } = this.props;
    return (

      <View style={{ display: 'flex', flex: 1 }}>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            flexGrow: 1,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{ fontSize: 60, color: '#000' }}>{time}</Text>
              <Text style={{ fontSize: 20, color: '#000', textAlign: 'center' }}>{moment(date).format("DD/MM/YYYY")}</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.editButton}
                onPress={this._showDateTimePicker}
                accessibilityLabel="Edit Alarm"
                color={Platform.OS === 'ios' ? 'white' : null}>
                <Text style={styles.btn}>Chọn giờ</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDateTimePickerVisible}
                mode='datetime'
                locale={'vi'}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                minimumDate={new Date()}
                confirmTextIOS="Chọn"
                cancelTextIOS="Bỏ chọn"
                headerTextIOS="Chọn thời gian"
              />

            </View>
          </View>

          <View
            style={{
              flexGrow: 1.5,
              flexDirection: 'column',
              alignSelf: 'center',
            }}>
            <TextInput
              style={{
                height: 40,
                width: 300,
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: 'white',
                textAlign: 'center',
                alignSelf: 'center',
              }}
              onChangeText={(message) => this.setState({ message })}
              value={this.state.message}
              placeholder="Lời nhắc"
              maxLength={30}
            />

            <View
              style={{
                display: 'flex',
                flex: 0.4,
                flexDirection: 'column',
              }}>
              <View>{this.snoozeModal()}</View>
            </View>
          </View>

          <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>

            <TouchableOpacity
              onPress={
                this._addAlarm
              }
              accessibilityLabel="Save Alarm"
              style={{ backgroundColor: '#009347', height: 50 }} >

              <Text style={styles.btn}>Lưu</Text>

            </TouchableOpacity>

          </View>
        </View>
      </View>
    )
  }
}
