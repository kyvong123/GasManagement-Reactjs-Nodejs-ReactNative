// import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
// import React, { useEffect } from 'react'
// import { Actions } from 'react-native-router-flux';
// import saver from '../../utils/saver';
// import { useSelector, useDispatch } from 'react-redux';
// import { changeTypeDeliveryAction } from '../../actions/DeliveryActions';
// import { SHIPPING_TYPE } from '../../constants';


// const DriverDelivery = props => {
//     console.log("ABCD", saver);
//     const dispatch = useDispatch();

//     const switchToDriverCameraScreen = () => {
//         saver.setTypeCamera(false);
//         Actions['driverDeliveryScan']({});
//     }


//     return (
//         <View style={{ marginTop: 150 }}>
//             <TouchableOpacity style={styles.button}
//                 onPress={() => {
//                     dispatch(changeTypeDeliveryAction(SHIPPING_TYPE.GIAO_VO))
//                     switchToDriverCameraScreen();
//                 }}>
//                 <Text style={styles.btnTitle}>
//                     Giao vỏ 2
//                 </Text>
//             </TouchableOpacity >
//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={() => {
//                     dispatch(changeTypeDeliveryAction(SHIPPING_TYPE.GIAO_HANG));
//                     switchToDriverCameraScreen();
//                 }}
//             >
//                 <Text style={styles.btnTitle}>
//                     Giao bình
//                 </Text>
//             </TouchableOpacity >
//         </View>
//     )
// }


// export default DriverDelivery

// const styles = StyleSheet.create({
//     button: {
//         margin: 10,
//         backgroundColor: '#ff8000',
//         padding: 15,
//         marginHorizontal: 20,
//         borderRadius: 10
//     },
//     btnTitle: {
//         color: '#ffffff',
//         fontSize: 17,
//         textAlign: 'center',
//         fontWeight: '900'
//     }
// })