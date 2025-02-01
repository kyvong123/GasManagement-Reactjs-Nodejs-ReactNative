
import { Alert, StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTailwind } from 'tailwind-rn';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import SearchIcon from 'react-native-vector-icons/FontAwesome5';
import DeleteIcon from 'react-native-vector-icons/AntDesign';
import { VStack, Input, Button, FormControl, Select, Center, CheckIcon, WarningOutlineIcon, Box } from 'native-base';
import { Formik } from 'formik';
import { Actions } from "react-native-router-flux";
import moment from 'moment';
import { width } from '../../utils/sizeScreen';
import { useSelector, useDispatch } from 'react-redux';
import { driverDeliveryDeleteSerial } from '../../actions/DeliveryActions';
import { SHIPPING_TYPE } from '../../constants';

const DriverDeliveryListSerial = () => {
    const tw = useTailwind();
    const currentTypeDelivery = useSelector(state => state.deliveryReducer.currentTypeDelivery);
    const listSerialInStore = useSelector(state => state.deliveryReducer.storeSerial);
    const dispatch = useDispatch();

    return (
        <SafeAreaView>
            {/* _______START HEADER ________ */}
            <View style={tw('flex items-center justify-between flex-row bg-[#008a00] py-4 px-3')}>
                <View>
                    <BackIcon onPress={() => Actions.pop()} color={'#FFF'} size={30} name="ios-arrow-back" />
                </View>
                <Text style={tw('text-lg text-white font-black ')}>{currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? "Serial bình đầy" : "Serial vỏ bình"}</Text>
                <View>
                    <HomeIcon onPress={() => { Actions['home']({}) }} name="home-outline" size={30} color="#FFF" />
                </View>
            </View>
            {/* _______END HEADER ________ */}
            <View style={{ height: '100%' }}>
                {listSerialInStore.length === 0 ?
                    <Text style={{ height: '75%', fontSize: 15, fontWeight: 'bold', textAlign: 'center', flex: 1, marginTop: '50%' }}>Không có số serial nào được quét</Text>
                    :
                    <ScrollView >
                        <Text></Text>
                        {listSerialInStore.map(itemSerial =>
                            <View style={[tw('flex-row justify-between bg-gray-300 items-center'), { borderRadius: 5, paddingHorizontal: 30, marginVertical: 3, paddingVertical: 1, marginHorizontal: 10 }]}>
                                <View style={tw('w-3/4')}>
                                    <Text style={tw('text-lg font-black')}>{itemSerial.serial}</Text>
                                </View>
                                <View style={[tw('')]}>
                                    <DeleteIcon
                                        onPress={() => { dispatch(driverDeliveryDeleteSerial(itemSerial.serial)) }}
                                        color={'#fc1703'} size={25} name="delete" />
                                </View>
                            </View>
                        )}
                    </ScrollView>
                }
                <View style={[tw('flex-row justify-between'), { height: '25%', marginHorizontal: 20, marginTop: 20 }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, paddingTop: 10 }}>{`Tổng: ${listSerialInStore.length} ${currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? 'bình đầy' : 'vỏ bình'}`}</Text>
                    <Button
                        isDisabled={listSerialInStore.length === 0 ? true : false}
                        onPress={() => Actions.push("driverDeliverySubmit")} //<==================
                        style={[tw(''), { height: 50 }]}
                        colorScheme="orange">

                    </Button>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default DriverDeliveryListSerial

const styles = StyleSheet.create({})