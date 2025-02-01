import { Alert, StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTailwind } from 'tailwind-rn';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import SearchIcon from 'react-native-vector-icons/FontAwesome5';
import { getProductInfo } from "../../api/reflux";
import { VStack, Input, Button, FormControl, Select, Center, CheckIcon, WarningOutlineIcon, Box } from 'native-base';
import { Formik } from 'formik';
import { Actions } from "react-native-router-flux";
import moment from 'moment';
import { width } from '../../utils/sizeScreen';
import { useSelector, useDispatch } from 'react-redux';
import { deliveryStoreSerialTruckAction } from '../../actions/TruckDeliveryActions';
import { SHIPPING_TYPE } from '../../constants';
import { element } from 'prop-types';

const TruckDeliveryProductInfo = (props) => {
    const tw = useTailwind();
    const currentTypeDelivery = useSelector(state => state.truckDeliveryReducer.currentTypeDelivery);
    const listSerialInStore = useSelector(state => state.truckDeliveryReducer.storeSerial);
    const dispatch = useDispatch();

    const [productInfor, setProductInfo] = useState();
    const [serial_code, setSerial_code] = useState(props.serial[0]);
    //const [weightGas, setWeightGas] = useState();

    
    const _getProductInfo = async (serial_code) => {
        console.log("SERIAL:",serial_code);
        console.log("currentTypeDelivery", currentTypeDelivery);
        try {
            const res = await getProductInfo(serial_code);
            let weight = 0;
            if (res) {
                dispatch(deliveryStoreSerialTruckAction({
                    serial: serial_code,
                    type: currentTypeDelivery,
                    //weightGas
                }));
            } 

            const productProperties = {
                arr: [
                    {
                        title: 'Sản phẩm của',
                        value: res.current.name
                    }, {
                        title: 'Hạn kiểm định',
                        value: moment(res.checkedDate).format("MM:HH DD/MM/YYYY")
                    }, {
                        title: 'Màu sắc - loại van',
                        value: res.color
                    }, {
                        title: 'Trọng lượng (kg)',
                        value: res.weight
                    }, {
                        title: 'Trạng thái',
                        value: res.status
                    }                   
                ],                 
                manufacture: {
                    name: res.manufacture.name,
                    address: res.manufacture.address,
                    logo: res.manufacture.logo,
                    phone: res.manufacture.phone
                }
                

            };
           
            // const getWeightGas = productProperties.arr.find((element, index) => index == 3)
            // console.log("getWeightGas", getWeightGas);
            // if(getWeightGas){
            //     setWeightGas(getWeightGas.value);
            //     console.log("weightGasssss",weightGas)
            //     dispatch(deliveryStoreSerialAction({
            //         weightTest: weightGas
            //     }));
            // }

            setProductInfo(productProperties);
        } catch (err) {
            setProductInfo(null);
            Alert.alert(
                "Không tìm thấy serial này",
                "Vui lòng kiểm tra lại",
                [
                    {
                        text: "OK",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "QUAY LẠI", onPress: () => Actions.pop() }
                ]
            );
        }
    };
    //console.log("weightGas",weightGas);

    console.log("hahaha");
    useEffect(() => {
        console.log("hehhe");
        const getReasons = async () => {
            const { data } = await getReturnReasons();
            setReturnReasons(data);
        };
        getReasons();
        _getProductInfo(serial_code);
    }, []);

    const handleSearch = () => {
        setProductInfo(undefined);
        _getProductInfo(serial_code);
    }

    const onSubmit = data => {
        console.log('submiting with ', data);
        Actions.push('truckDeliveryListSerial')
    };
    

    return (
        <SafeAreaView>
            {/* _______START HEADER ________ */}
            <View style={tw('flex items-center justify-between flex-row bg-[#008a00] py-4 px-3')}>
                <View>
                    <BackIcon onPress={() => Actions.pop()} color={'#FFF'} size={30} name="ios-arrow-back" />
                </View>
                <Text style={tw('text-lg text-white font-black ')}>{currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? "Giao bình đầy" : "Giao vỏ"}</Text>
                <View>
                    <HomeIcon onPress={() => { Actions['home']({}) }} name="home-outline" size={30} color="#FFF" />
                </View>
            </View>
            {/* _______END HEADER ________ */}
            <ScrollView>
                <View>
                    <View style={tw('bg-[#008a00] flex-row justify-between items-center py-5 px-2')} >
                        <TextInput onChangeText={text => setSerial_code(text)} value={serial_code.toString()} style={tw('bg-white w-9/12 h-10 rounded')} placeholder="Nhập mã bình gas" />
                        <ScanIcon onPress={() => { Actions['driverScan']({}) }} style={tw('mr-2')} name="scan1" size={30} color="#FFF" />
                        <SearchIcon onPress={handleSearch} name='search' size={30} color="#FFF" />
                    </View>
                    <View style={tw('bg-[#008a00] flex-row justify-between px-2 pb-2')}>
                        <Text style={tw('text-white')}>Seri vỏ chai LPG</Text>
                        <Text style={tw('text-white')}>{serial_code}</Text>
                    </View>
                    {productInfor ?
                        <>
                            <View style={tw('mt-4 px-4')}>
                                {productInfor.arr.map((item, index) => (
                                    <>
                                        <View key={index} style={tw('flex-row justify-between flex-wrap')}>
                                            <Text style={tw('text-blue-600 font-black text-sm')}>{item.title}</Text>
                                            <Text style={tw('text-blue-600 font-black text-sm')}>{item.value}</Text>
                                        </View>
                                        <View style={tw('flex-1 bg-gray-300 h-px my-3')} />
                                    </>
                                ))}
                            </View>
                            <View style={tw('flex-row justify-between items-center px-2 bg-[#008a00]')}>
                                <Text style={tw('text-white')}>Thương hiệu</Text>
                                <Image style={{ width: 50, height: 50, marginRight: 30, marginVertical: 5 }} source={{ uri: productInfor.manufacture.logo }} />
                            </View>

                            <Text style={[tw('text-blue-600 my-4 px-2'), { fontWeight: 'bold' }]}>Sản phẩm của {productInfor.manufacture.name}</Text>
                            <View style={tw('flex-row px-4')}>
                                <Text style={tw('text-blue-600 mr-4')}>Địa chỉ</Text>
                                <View style={tw('w-11/12')}><Text style={tw('text-blue-600')}>{productInfor.manufacture.address}</Text></View>
                            </View>

                            <View style={tw('flex-row px-4 mt-3')}>
                                <Text style={tw('text-blue-600 mr-4')}>Hotline</Text>
                                <View style={tw('w-11/12')}><Text style={tw('text-blue-600')}>{productInfor.manufacture.phone}</Text></View>
                            </View>

                            <View style={tw('items-center my-12')}>
                                <Button width="45%"
                                    onPress={() => Actions['truckDeliveryScan']({})}
                                    colorScheme="orange">
                                    Tiếp tục quét
                                </Button>
                                <Button style={[tw('mt-4'), { marginBottom: 200 }]} width="45%" onPress={() => { Actions['truckDeliveryListSerial']({}) }} colorScheme="green">
                                    Kết thúc quét
                                </Button>
                            </View>
                        </>
                        :
                        productInfor === null ?
                            <Text style={[tw('text-center text-lg mt-10 pt-10'), { textAlign: 'center', fontWeight: 'bold' }]}>Không tìm thấy</Text>
                            :
                            <View style={{ flex: 1, height: '100%', justifyContent: 'center', marginTop: '30%' }}>
                                <ActivityIndicator size="small" color="#00ff00" />
                            </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default TruckDeliveryProductInfo

const styles = StyleSheet.create({
    label: {
        fontWeight: 'bold'
    }
})