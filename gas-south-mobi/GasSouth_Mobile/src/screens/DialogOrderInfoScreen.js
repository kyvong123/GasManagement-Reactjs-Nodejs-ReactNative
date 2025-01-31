import React, { Component } from 'react';
import {
   View,
   Image,
   Text,
   TouchableOpacity,
   Dimensions,
   StyleSheet,
   Alert
} from 'react-native';
import { setLanguage, getLanguage } from "../helper/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import LineOrderItem from '../../src/components/LineOrderItem';
import { setListOrder } from '../actions/OrderActions';
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';
import Img from '../constants/image'
import { connect } from "react-redux";
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { ScrollView } from 'react-native-gesture-handler';
import IconFontisto from 'react-native-vector-icons/Fontisto';


const { width } = Dimensions.get('window');

const translationGetters = {
   en: () => require('../languages/en.json'),
   vi: () => require('../languages/vi.json')
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFF',
      paddingHorizontal: 15
   },
   infoContainer: {
      marginTop: 15,
      backgroundColor: '#F8F8FF',
      padding: 5,
   },
   item_Flatlist: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "space-between"
   },
   itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 30,
      paddingLeft: 5
   },
   title: {
      fontSize: 20,
      paddingVertical: 10,
      marginBottom: 10,
      color: 'black',
      fontWeight: 'bold'
   },
   tittle: {
      fontSize: 14,
      color: COLOR.GRAY,
      marginBottom: 10
   },
   iconAdd: {
      fontSize: 16,
      color: COLOR.RED,
      fontWeight: 'bold'
   },
   btnContinue: {
      flex: 1,
      backgroundColor: "#009347",
      marginTop: 40,
      padding: 12,
      marginLeft: 50,
      margin: 20,
      borderRadius: 8,
      borderWidth: 0.2,
   },
   btnCancel: {
      flex: 1,
      backgroundColor: "#F6921E",
      marginTop: 40,
      padding: 12,
      marginLeft: 5,
      margin: 20,
      marginRight: 40,
      borderRadius: 8,
      borderWidth: 0.2,
   },
   btnAdd: {
      borderColor: COLOR.RED,
      borderWidth: 2,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center'
   },
   textNotify: {
      color: COLOR.WHITE,
      fontSize: 14,
      textAlignVertical: 'top',
      top: -8,
      right: -3
   },
   shoppingContainer: {
      position: 'absolute',
      left: 10,
      flexDirection: 'row'
   }
})

class DialogOrderInfoScreen extends Component {
   render() {
      return (
         <View style={styles.container}>
            <ScrollView ontentContainerStyle={{ paddingBottom: 65 }}>
               <View style={styles.infoContainer}>
                  <View style={{
                     padding: 20,
                     flex: 1,
                     // backgroundColor: index % 2 == 0 ? '#F8F8FF' : '#ffffff',
                  }}>
                     <View style={styles.item_Flatlist}>
                        <Text
                           style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 18
                           }}>DH080920-0100
                        </Text>
                        <Text
                           style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 18
                           }}>
                           Trạm Tiền Giang
                        </Text>

                     </View>
                     <View style={styles.item_Flatlist}>
                        <Text style={{
                           color: '#000000',
                        }}>
                           <IconFontisto name='clock' size={15} /> 20/09/2020
                        </Text>
                        <Text style={{ color: '#000000', }}>20 tấn </Text>
                     </View>
                  </View>
                  <Text style={{ fontSize: 21, marginLeft: 20, }}>
                     Kho xuất hàng: Trà Nóc-Cần Thơ
                  </Text>
                  <View style={{
                     flexDirection: 'row',
                     justifyContent: "space-between",
                     marginTop: 150
                  }}>
                     <TouchableOpacity style={styles.btnContinue}>
                        <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', alignSelf: 'center' }}>
                           Xác nhận
					         </Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.btnCancel}
                        onPress={() => {
                           Actions['cancelDetail']({
                           })
                        }}>
                        <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', alignSelf: 'center' }}>
                           Hủy
					         </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </ScrollView>
         </View>
      );
   }
}

export default DialogOrderInfoScreen;
