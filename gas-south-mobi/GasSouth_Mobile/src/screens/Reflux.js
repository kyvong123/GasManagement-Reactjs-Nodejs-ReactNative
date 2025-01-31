import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux';
import saver from '../utils/saver';
import { useSelector, useDispatch } from 'react-redux';
import { changeTypeRefuxAction } from '../actions/RefluxAction';
import { SHIPPING_TYPE } from '../constants';


const Reflux = props => {
    const userInfo = useSelector(state => state.auth._userInfo);
    const dispatch = useDispatch();

    const switchToDriverCameraScreen = () => {
        saver.setTypeCamera(false);
        Actions['driverScan']({});
    }


    return (
        <View style={{ marginTop: 150 }}>
            <TouchableOpacity style={styles.button}
                onPress={() => {
                    dispatch(changeTypeRefuxAction(SHIPPING_TYPE.TRA_VO))
                    switchToDriverCameraScreen();
                }}>
                <Text style={styles.btnTitle}>
                    Hồi lưu vỏ Gas South
                </Text>
            </TouchableOpacity >
            <TouchableOpacity style={styles.button}
                onPress={() => {
                    saver.setTypeCamera(false);
                    dispatch(changeTypeRefuxAction(SHIPPING_TYPE.TRA_VO_KHAC))
                    if(userInfo.userRole === "Truck"){
                        Actions.push("returnTruckSubmit");
                    }else{
                        Actions.push("driverOtherGasCylinder");
                    }   
                }}>
                <Text style={styles.btnTitle}>
                    Hồi lưu vỏ khác
                </Text>
            </TouchableOpacity >
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    dispatch(changeTypeRefuxAction(SHIPPING_TYPE.TRA_BINH_DAY));
                    switchToDriverCameraScreen();
                }}
            >
                <Text style={styles.btnTitle}>
                    Hồi lưu bình đầy
                </Text>
            </TouchableOpacity >
            {/* <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    dispatch(changeTypeRefuxAction(SHIPPING_TYPE.HOI_LUU_KHO_XE));
                    switchToDriverCameraScreen();
                }}
            >
                <Text style={styles.btnTitle}>
                    Hồi lưu kho xe
                </Text>
            </TouchableOpacity > */}
        </View>
    )
}

export default Reflux

const styles = StyleSheet.create({
    button: {
        margin: 10,
        backgroundColor: '#ff8000',
        padding: 15,
        marginHorizontal: 20,
        borderRadius: 10
    },
    btnTitle: {
        color: '#ffffff',
        fontSize: 17,
        textAlign: 'center',
        fontWeight: '900'
    }
})