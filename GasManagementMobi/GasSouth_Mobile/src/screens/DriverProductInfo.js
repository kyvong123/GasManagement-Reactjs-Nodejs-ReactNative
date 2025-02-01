import { Alert, StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTailwind } from 'tailwind-rn';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import SearchIcon from 'react-native-vector-icons/FontAwesome5';
import { getReturnReasons, getProductInfo } from "../api/reflux";
import { VStack, Input, Button, FormControl, Select, Center, CheckIcon, WarningOutlineIcon, Box } from 'native-base';
import { Formik } from 'formik';
import { Actions } from "react-native-router-flux";
import moment from 'moment';
import { width } from '../utils/sizeScreen';
import { useSelector, useDispatch } from 'react-redux';
import { storeSerialAction } from '../actions/RefluxAction';
import { SHIPPING_TYPE } from '../constants';

const validate = values => {
    const errors = {};
    if (!values.reason) {
        errors.reason = 'Chọn lý do đổi trả';
    }

    return errors;
};

const DriverProductInfo = (props) => {
    const tw = useTailwind();
    const currentTypeReflux = useSelector(state => state.refluxReducer.currentTypeReflux);
    const listSerialInStore = useSelector(state => state.refluxReducer.storeSerial);
    const dispatch = useDispatch();

    const [returnReasons, setReturnReasons] = useState([]);
    const [productInfor, setProductInfo] = useState();
    const [serial_code, setSerial_code] = useState(props.serial[0]);

    const [cylinderMass, setCylinderMass] = useState('');
    const [cylinderWeight, setCylinderWeight] = useState(0);
    const [cylinderWeightReturn, setCylinderWeightReturn] = useState(0);
    const [isErrorCylinderMass, setErrorCylinderMass] = useState(false);

    const _getProductInfo = async (serial_code) => {
        try {
            const res = await getProductInfo(serial_code);
            // if (res && currentTypeReflux !== SHIPPING_TYPE.TRA_BINH_DAY) {
            //     dispatch(storeSerialAction({
            //         serial: serial_code,
            //         type: currentTypeReflux,
            //     }));
            // }
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
            setProductInfo(productProperties);
            setCylinderMass(productProperties.arr[3].value);
            setCylinderWeight(res.weight);
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

    useEffect(() => {
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
        dispatch(storeSerialAction({
            serial: serial_code,
            type: currentTypeReflux,
            reason: data.reason,
            cylinderMass: cylinderMass,
            cylinderWeight: cylinderWeight
        }));
        Actions.push('driverListSerial')
    };

    const onSubmit_Vo_gas = () => {
        if (cylinderMass.length === 0) {
            setErrorCylinderMass(true);
            return;
        }
        dispatch(storeSerialAction({
            serial: serial_code,
            type: currentTypeReflux,
            cylinderMass: cylinderMass,
            cylinderWeight: cylinderWeight
        }));
        Actions.push('driverListSerial')
    }

    const onNextScan_Vo_Gas = () => {
        dispatch(storeSerialAction({
            serial: serial_code,
            type: currentTypeReflux,
            cylinderMass: cylinderMass,
            cylinderWeight: cylinderWeight
        }));
        Actions['driverScan']({});
    }

    const handleNextScan = (reason, errors) => {
        dispatch(storeSerialAction({
            serial: serial_code,
            type: currentTypeReflux,
            reason: reason,
            cylinderMass: cylinderMass,
            cylinderWeight: cylinderWeight
        }));
        if (reason) {
            Actions['driverScan']({})
        } else {
            errors.reason = 'Hãy chọn lý do đổi trả';
        }
    }

    const getTitleScreen = () => {
        switch (currentTypeReflux) {
            case SHIPPING_TYPE.TRA_BINH_DAY:
                return "Hồi lưu bình đầy";
            case SHIPPING_TYPE.TRA_VO:
                return "Hồi lưu vỏ";
            case SHIPPING_TYPE.HOI_LUU_KHO_XE:
                return "Hồi lưu kho xe";
            default:
                return "Lỗi get title";
        }
    }

    return (
        <SafeAreaView>
            {/* _______START HEADER ________ */}
            <View style={tw('flex items-center justify-between flex-row bg-[#008a00] py-4 px-3')}>
                <View>
                    <BackIcon onPress={() => Actions.pop()} color={'#FFF'} size={30} name="ios-arrow-back" />
                </View>
                <Text style={tw('text-lg text-white font-black ')}>{getTitleScreen()}</Text>
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
                                {currentTypeReflux === SHIPPING_TYPE.TRA_VO || currentTypeReflux === SHIPPING_TYPE.HOI_LUU_KHO_XE ?
                                    <>
                                        {console.log(productInfor.arr[3].value)}
                                        <View style={tw('flex-row justify-between flex-wrap items-center')}>
                                            <Text style={tw('text-blue-600 font-black text-sm w-8/12')} width="60%">Cân nặng bình khi hồi lưu (kg)</Text>
                                            <Input
                                                keyboardType='numeric'
                                                placeholder='khối lượng'
                                                value={cylinderMass.toString()}
                                                onChangeText={text => {
                                                    if (cylinderMass.length !== 0) {
                                                        setErrorCylinderMass(false);
                                                    } else {
                                                        setCylinderMass(true);
                                                    }
                                                    setCylinderMass(text);

                                                    setCylinderWeightReturn(text);
                                                }} width="30%" />
                                        </View>
                                        {isErrorCylinderMass ?
                                            <View>
                                                <Text style={{ color: "red", fontWeight: "bold", textAlign: "right" }}>Nhập khối lượng</Text>
                                            </View> : null
                                        }
                                        <View style={tw('flex-1 bg-gray-300 h-px my-3')} />
                                    </>
                                    :
                                    null
                                }
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

                            {currentTypeReflux === SHIPPING_TYPE.TRA_BINH_DAY ?
                                <View style={tw('self-center mt-8 w-10/12')}>
                                    <Formik initialValues={{
                                        reason: '',
                                    }} onSubmit={onSubmit} validate={validate}>

                                        {({
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            values,
                                            errors
                                        }) =>
                                            <>
                                                <FormControl isRequired isInvalid={'reason' in errors}>
                                                    <FormControl.Label><Text style={styles.label}>Chọn lý do hồi lưu bình đầy:</Text></FormControl.Label>
                                                    <Select selectedValue={values.reason} minWidth="200" placeholder="Chọn lý do đổi trả" _selectedItem={{
                                                        bg: "teal.600",
                                                        endIcon: <CheckIcon size="5" />
                                                    }} mt={1} onValueChange={handleChange('reason')}>
                                                        {returnReasons.map(({ name, id }) => <Select.Item label={name} value={id} />)}
                                                    </Select>
                                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                        {errors.reason}
                                                    </FormControl.ErrorMessage>
                                                </FormControl>
                                                <View style={tw('items-center my-12')}>
                                                    <Button width="45%"
                                                        onPress={() => handleNextScan(values.reason, errors)}
                                                        colorScheme="orange">
                                                        Tiếp tục quét
                                                    </Button>
                                                    <Button style={tw('mt-4')} width="45%" onPress={handleSubmit} colorScheme="green">
                                                        Kết thúc quét
                                                    </Button>
                                                </View>

                                                <Text></Text>
                                                <Text></Text>
                                                <Text></Text>
                                                <Text></Text>
                                                <Text></Text>
                                            </>
                                        }
                                    </Formik>
                                </View>
                                :
                                <View style={tw('items-center my-12')}>
                                    <Button width="45%"
                                        onPress={onNextScan_Vo_Gas}
                                        colorScheme="orange">
                                        Tiếp tục quét
                                    </Button>
                                    <Button
                                        // isDisabled={productInfor === 0 ? true : false}
                                        style={[tw('mt-4'), { marginBottom: 50 }]} width="45%"
                                        onPress={onSubmit_Vo_gas}
                                        colorScheme="green">
                                        Kết thúc quét
                                    </Button>
                                </View>
                            }
                        </>
                        :
                        productInfor === null ?
                            <Text style={[tw('text-center text-lg mt-10 pt-10'), { textAlign: 'center', fontWeight: 'bold' }]}>Không tìm thấy</Text>
                            :
                            <View style={{ flex: 1, height: '100%', justifyContent: 'center', marginTop: '30%' }}>
                                <ActivityIndicator size="large" color="#00ff00" />
                            </View>
                    }

                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default DriverProductInfo

const styles = StyleSheet.create({
    label: {
        fontWeight: 'bold'
    }
})