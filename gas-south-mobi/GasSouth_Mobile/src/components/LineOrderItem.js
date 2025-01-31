import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR} from '../constants';

const widthLine = Dimensions.get('window').width / 2 - 74;

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    height: 1.5,
    borderRadius: 1,
    width: widthLine,
  },
});

export default function LineOrderItem(props) {
  const showLine = props.showLine;
  return (
    <View style={styles.container}>
      <IconMaterialIcons
        name="add-shopping-cart"
        size={26}
        color={COLOR.GREEN_MAIN}
      />
      <View
        style={[
          styles.line,
          {
            backgroundColor:
              showLine == 1 || showLine == 2 ? COLOR.GREEN_MAIN : COLOR.GRAY,
          },
        ]}
      />
      <IconFontAwesome5
        name="user-circle"
        size={26}
        color={showLine == 1 || showLine == 2 ? COLOR.GREEN_MAIN : COLOR.GRAY}
      />
      <View
        style={[
          styles.line,
          {
            backgroundColor: showLine == 2 ? COLOR.GREEN_MAIN : COLOR.GRAY,
          },
        ]}
      />
      <IconMaterialCommunityIcons
        name="timer-outline"
        size={26}
        color={showLine == 2 ? COLOR.GREEN_MAIN : COLOR.GRAY}
      />
    </View>
  );
}
