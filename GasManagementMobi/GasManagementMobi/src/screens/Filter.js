import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {round} from 'react-native-reanimated';
import {Actions} from 'react-native-router-flux';
import {COLOR} from '../constants';

class Filter extends Component {
  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          {/* box 1 */}
          <View style={styles.box}>
            <Text style={styles.text}>Chi nhánh miền tây</Text>
            {/* child box */}
            <View style={styles.MT}>
              <TouchableOpacity
                style={styles.button}
                onPress={Actions['station']}
              >
                <Text>Cần Thơ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Cà Mau</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Tiền Giang</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Chi nhánh miền trung</Text>
            {/* child box */}
            <View style={styles.MT}>
              <TouchableOpacity style={styles.button}>
                <Text>Đà Nẵng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Quảng Ngãi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Bình Định</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Chi nhánh miền nam trung bộ</Text>
            {/* child box */}
            <View style={styles.MT}>
              <TouchableOpacity style={styles.button}>
                <Text>Nha Trang</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>ĐakLak</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Gia Lai</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Chi nhánh VT-Gas</Text>
            {/* child box */}
            <View style={styles.MT}>
              <TouchableOpacity style={styles.button}>
                <Text>Biên Hòa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Vũng Tàu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Bình Phước</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.MT}>
              <TouchableOpacity style={styles.button}>
                <Text>Tây Ninh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Bình Thuận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text>Vĩnh Lộc</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewButton}>
            <TouchableOpacity style={styles.press} onPress={Actions['station']}>
              <Text style={styles.textButton}>Xem</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    );
  }
}
const {width, height} = Dimensions.get ('window');
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: width,
    height: height,
  },
  box: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
  item: {
    borderWidth: 2,
    width: 80,
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    width: 60,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 3,
    alignItems: 'center',
    paddingTop: 15,
    margin: 10,
  },
  MT: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  press: {
    alignItems: 'center',
    backgroundColor: COLOR.ORANGE,
    width: width / 3.5,
    height: width / 8,
    borderRadius: 5,
    marginTop: width / 20,
    justifyContent: 'center',
    marginBottom: width / 20,
  },
  textButton: {
    color: COLOR.WHITE,
    fontSize: 20,
    margin: 15,
  },
});

export default Filter;
