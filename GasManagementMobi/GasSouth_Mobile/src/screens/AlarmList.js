// libs
import React, { Component } from 'react';
import {
  Alert,
  Text,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// thư viện mới
import RadioForm from 'react-native-simple-radio-button';
import { SwipeListView } from 'react-native-swipe-list-view';
//
import {
  cancelAlarmById,
  activateAlarmById,
  deleteAlarmById,
  getAlarms,
} from 'react-native-simple-alarm';


const { height, width } = Dimensions.get('window');

class AlarmList extends Component {
  state = {
    alarms: [],
  };

  async componentDidMount() {
    const alarms = await getAlarms();
    this.setState({
      alarms,
    });
  }

  confirmDeletePress = (data, rowRef) => {
    Alert.alert('Are you sure?', 'Your alarm will be deleted', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => this.handleDeletePress(data, rowRef),
      },
    ]);
  };

  handleAlarmActivation = (value, alarm) => {
    if (value === 0) {
      cancelAlarmById(alarm.id);
    } else if (value === 1) {
      activateAlarmById(alarm.id);
    }
  };

  renderAlarms = ({ item }) => {
    const radio_props = [
      { label: 'On', value: 1 },
      { label: 'Off', value: 0 },
    ];

    if (!item) {
      return null;
    }
    return (
      <View style={styles.alarmContainer}>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <View style={styles.alarm}>
            <TouchableOpacity >
              <Text style={{ fontSize: 40, paddingLeft: 10 }}>
                {moment(item.date).format('hh:mm A')}
              </Text>
              <Text style={{ fontSize: 20, paddingLeft: 15 }}>{moment(item.date).format("DD/MM/YYYY")}</Text>
            </TouchableOpacity>

            <RadioForm
              radio_props={radio_props}
              onPress={(value) => this.handleAlarmActivation(value, item)}
              formHorizontal={true}
              animation={true}
              initial={item.active ? 0 : 1}
              radioStyle={{ paddingRight: 13 }}
              style={{ marginLeft: 60 }}
            />
          </View>

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  handleDeletePress = async (data, rowRef) => {
    const { item } = data;
    await cancelAlarmById(item.id);
    const updatedAlarms = await deleteAlarmById(item.id);
    this.setState({
      alarms: updatedAlarms,
    });
    if (rowRef) {
      rowRef.manuallySwipeRow(0);
    }
  };

  render() {
    return (
      <SwipeListView
        style={{
          width: width,
          height: height,
          backgroundColor: "#fff",
        }}
        data={this.state.alarms}
        renderItem={this.renderAlarms}
        keyExtractor={(item, index) => `list-item-${index}`}
        renderHiddenItem={(data, rowMap) => (
          <View
            style={{
              alignSelf: 'flex-end',
              paddingVertical: 25,
              backgroundColor: 'red',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.confirmDeletePress(data, rowMap[data.item.key])
              }>
              <IconMaterialCommunityIcons
                name={'trash-can-outline'}
                size={50}
                color={'#fff'} />
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-50}
      />
    );
  }
}

const styles = StyleSheet.create({
  alarmContainer: {
    height: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderStyle: 'solid',
    borderColor: 'rgba(235, 235,235, 1)',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    backgroundColor: 'white',
  },
  alarm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default AlarmList;