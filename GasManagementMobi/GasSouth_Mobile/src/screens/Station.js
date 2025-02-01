import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLOR} from '../constants';

class Station extends Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.viewDate}>
          <View style={styles.textInput}>
            <Text style={styles.text}>Ngày bắt đầu</Text>
            <View style={styles.boxIcon}>
              <Icon size={0.05 * width} style={styles.icon} name="calendar" />
            </View>
          </View>
          <View style={styles.textInput}>
            <Text style={styles.text}>Ngày kết thúc</Text>
            <View style={styles.boxIcon}>
              <Icon size={0.05 * width} style={styles.icon} name="calendar" />
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textButton}>Xem</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reSult}>
          <Text style={styles.textResult}>Tổng số nhập:</Text>
          <Text style={styles.textResult}>600</Text>
        </View>
        <View style={styles.reSult}>
          <Text style={styles.textResult}>Tổng số xuất:</Text>
          <Text style={styles.textResult}>200</Text>
        </View>
        <View style={styles.reSult}>
          <Text style={styles.textResult}>Tổng số tồn kho:</Text>
          <Text style={styles.textResult}>700</Text>
        </View>
        <View style={styles.reSult}>
          <Text style={styles.textResult}>Dung tích còn trống:</Text>
          <Text style={styles.textResult}>200</Text>
        </View>
      </View>
    );
  }
}
const {width, height} = Dimensions.get ('window');
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    width: width,
    height: height,
  },

  viewDate: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
  },
  icon: {
    marginLeft: 2,
    alignItems: 'center',
    color: COLOR.GRAY,
  },
  textInput: {
    flex: 1,
    width: width / 1.5,
    borderColor: COLOR.GRAY,
    borderWidth: 1,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 5,
    position: 'relative',
  },
  text: {
    fontSize: 18,
    marginRight: 20,
    color: 'gray',
  },
  boxIcon: {
    backgroundColor: '#D4D4D4',
    height: '100%',
    width: width / 12,
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
    height: 50,
    backgroundColor: COLOR.ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  textButton: {
    color: COLOR.WHITE,
    fontSize: 18,
  },
  reSult: {
    width: width,
    height: width / 8,
    backgroundColor: '#00DD31',
    justifyContent: 'center',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textResult: {
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    margin: 5,
  },
});

export default Station;
