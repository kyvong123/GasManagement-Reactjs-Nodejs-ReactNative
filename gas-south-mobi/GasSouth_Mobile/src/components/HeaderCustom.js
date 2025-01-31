import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HeaderCustom = ({ isUser, isBack, label, isFilter, isSearch }) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Btn left */}
          {isUser ? (
            <TouchableOpacity
              style={styles.btnLeft}
            >
              <FontAwesome name="user-circle" size={25} color={'white'} />
            </TouchableOpacity>
          ) : null}
          {isBack ? (
            <TouchableOpacity
              style={styles.btnLeft}
            >
              <MaterialIcons name="arrow-back-ios" size={25} color={'white'} />
            </TouchableOpacity>
          ) : null}

          {/* Middle label */}
          <Text style={styles.label}>{label ? label : 'Trang chủ'}</Text>

          {/* Btn right */}
          <View style={styles.viewBtnRight}>
            {isSearch ? (
              <TouchableOpacity style={styles.btnRight}>
                <FontAwesome name="search" size={25} color={'white'} />
              </TouchableOpacity>
            ) : null}
            {isFilter ? (
              <TouchableOpacity style={styles.btnRight}>
                <FontAwesome name="filter" size={25} color={'white'} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderCustom;

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#009347',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  btnLeft: {
    position: 'absolute',
    justifyContent: 'center',
    left: 0,
  },
  viewBtnRight: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
  btnRight: {
    width: 50,
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
