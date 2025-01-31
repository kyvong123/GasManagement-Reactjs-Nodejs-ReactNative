import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Alert,
    TextInput,
    Button as RButton,
    TouchableOpacity,
    // Picker,
    ActivityIndicator,
    Platform,
    // Bluetooth
    Switch,
    Dimensions,
    PermissionsAndroid,
    DeviceEventEmitter,
    NativeEventEmitter,
    ToastAndroid,
    Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTailwind } from 'tailwind-rn';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';

import { VStack, Input, Button, FormControl, Select, Center, CheckIcon, WarningOutlineIcon, Radio } from 'native-base';
import { Formik, Field, FieldArray, useFormikContext } from 'formik';
import { connect } from 'react-redux';
import { testAction } from '../actions/TestActions';
import { useSelector, useDispatch } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { createOrderNew, getArea, getCustomersForDriverSubmitFom, getStation } from '../api/orders_new';
import { driverSubmitForm, getOrders, getCategoryCylinder, getDriverName } from '../api/reflux';
import { CYLINDER_STATUS, SHIPPING_TYPE } from '../constants';
import DriverSignature from '../components/DriverSignature';
import { deleteSignatureAction, setShowOverlayDisableSignatureAction, storeSignatureAction } from '../actions/CurrentSignature';
import Toast from 'react-native-toast-message';
import addLocalCyclinder from './../api/addLocalCyclinder';
import { driverResetSerialsReflux } from '../actions/RefluxAction'
import { cleanAccents } from './../helper/words';
import moment from 'moment';
import {
    BluetoothManager,
    BluetoothEscposPrinter,
    BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import { result } from 'lodash';
import { element } from 'prop-types';


const loaiKH = {
    Dai_ly: {
        name: "đai lý"
    }
    ,
    Tong_dai_ly: {
        name: "Tổng đại lý"
    }
    ,
    Cua_hang_thuoc_tram: {
        name: "Cửa hàng trực thuộc trạm"
    }
    ,
    Cong_ty_Doanh_Nghiep: {
        name: "Công ty - doanh nghiệp"
    },
    Deliver: {
        name: "Tài xế"
    }
};
// Bluetooth
var { height, width } = Dimensions.get("window");

const DRIVER_TYPE = {
    INTERNAL_DRIVER: 'INTERNAL_DRIVER',
    EXTERNAL_DRIVER: 'EXTERNAL_DRIVER'
}

const DriverOtherGasCylinder = (props) => {


    const tw = useTailwind();
    const dispatch = useDispatch();

    const userInfo = useSelector(state => state.auth._userInfo);
    const currentTypeReflux = useSelector(state => state.refluxReducer.currentTypeReflux);
    const listSerialInStore = useSelector(state => state.refluxReducer.storeSerial);
    const isChildOf = useSelector(state => state.auth.isChildOf);
    const customerSignature = useSelector(state => state.currentSignatureReducer.SignBase64);

    //Bluetooth
    const [devices, setDevices] = useState(null);
    const [pairedDs, setPairedDs] = useState([]);
    const [foundDs, setFoundDs] = useState([]);
    const [bleOpend, setBleOpend] = useState(false);
    const [loading, setLoading] = useState(true);
    const [boundAddress, setBoundAddress] = useState("");
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [numberOfCylinder, setNumberOfCylinder] = useState(0);
    const [errorLicensePlate, setErrorLicensePlate] = useState(false);
    const [errorSignature, setErrorSignature] = useState(false);
    const [dragged, setDragged] = useState(false);
    const [isEnableFinish, setIsEnableFinish] = useState(true);
    const [orderid, setOrderid] = useState("");
    const [driverName, setDriverName] = useState("");
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerType, setCustomerType] = useState("");
    const [typeCylinder, setTypeCylinder] = useState("");
    const [customerId, setCustomerId] = useState(undefined);
    const [orders, setOrders] = useState([]);
    const [typeName, setTypeName] = useState(DRIVER_TYPE.INTERNAL_DRIVER);

    const [driverNames, setDriverNames] = useState([]);
    const [categoryCylinder, setCategoryCylinder] = useState([]);

    // API có thể không chính xác
    const [listCustomerInfoFromAPI, setListCustomerInfoFromAPI] = useState([]);
    const [isLoadingSubmitBtn, setLoadSubmitBtn] = useState(false);

    useEffect(() => {
        const _fetchCustomerAPI = async () => {
            const { data } = await getCustomersForDriverSubmitFom();
            if (data) {
                setListCustomerInfoFromAPI(data);
                console.log("Data ne: ", listCustomerInfoFromAPI);
            }

        };
        const _fetchDriverNames = async () => {
            const { data } = await getDriverName(isChildOf);
            setDriverNames(data);
            console.log("driverNames", driverNames);
        }
        _fetchCustomerAPI();
        _fetchDriverNames();

        getCategoryCylinder().then(({ data }) => {
            setCategoryCylinder(data);
        })

    }, []);

    useEffect(() => {
        console.log("customerId change", customerId)
        getOrders(customerId)
            .then(({ data }) => {
                if (data) {
                    setOrders(data.map(item => ({
                        id: item.id,
                        orderCode: item.orderCode,
                    })));
                }
            })
            .catch(err => {
                console.log("get Orders", err);
            })

        const found = listCustomerInfoFromAPI.find(element => element.id == customerId)
        console.log("FOUND", found);
        if (found) {

            setCustomerName(found.name)
            setCustomerAddress(found.address)
        }
    }, [customerId]);



    // useEffect(() => {
    //     const validate = values => {
    //         //console.log("customerName change", customerName1.name)
    //     getCustomersForDriverSubmitFom(isChildOf, values.customerType)
    //     .then(data => {
    //         setCustomerName1(data.data.find(element => element.id == customerId))
    //         setCustomerName2(customerName1.name)
    //         console.log("CUSTOMERNAME",customerName2)

    //         //     setCustomerName1(data.data.find(element => element.id == "5f0fc1f109957e1af095bc3c"))
    //         //     //nho customerName1.name
    //     }); 
    //     }

    // }, [customerId]);

    useEffect(() => {
        _renderRow()
    })

    // useEffect( async () => {
    //     let getData = await addLocalCyclinder.getItem();
    // 	 setCylindersOriginal (getData) ;
    //      return () => { 
    //         console.log('c_return', cylindersOriginal)};
    // },[cylindersOriginal === []])

    // useEffect( ()=>{
    //     (async() => {let getData = await addLocalCyclinder.getItem();
    //         setCylindersOriginal (getData)} ) ();
    //  },[]);
    //  console.log("cylindersOriginal", cylindersOriginal)





    // Bluetooth
    function _renderRow(rows) {
        let items = [];
        for (let i in rows) {
            let row = rows[i];
            if (row.address) {
                items.push(
                    <TouchableOpacity
                        key={new Date().getTime() + i}
                        style={styles.wtf}
                        onPress={() => {
                            setLoading(true)
                            BluetoothManager.connect(row.address).then(
                                (s) => {
                                    setLoading(false),
                                        setBoundAddress(row.address),
                                        setName(row.name || "UNKNOWN")
                                },
                                (e) => {
                                    setLoading(false)
                                    Alert.alert("Oops!", e + "");
                                }
                            );
                        }}
                    >
                        <Text style={styles.name}>{row.name || "UNKNOWN"}</Text>
                        <Text style={styles.address}>{row.address}</Text>
                    </TouchableOpacity>
                );

            }
        }
        return items;

    }



    function _deviceAlreadPaired(rsp) {
        var ds = null;
        if (typeof rsp.devices == "object") {
            ds = rsp.devices;
        } else {
            try {
                ds = JSON.parse(rsp.devices);
            } catch (e) { }
        }
        if (ds && ds.length) {
            let pared = pairedDs;
            pared = pared.concat(ds || []);
            setPairedDs(pared)
        }
    };



    function _deviceFoundEvent(rsp) {
        //alert(JSON.stringify(rsp))
        var r = null;
        try {
            if (typeof rsp.device == "object") {
                r = rsp.device;
            } else {
                r = JSON.parse(rsp.device);
            }
        } catch (e) {
            //alert(e.message);
            //ignore
        }
        //alert('f')
        if (r) {
            let found = foundDs || [];
            if (found.findIndex) {
                let duplicated = found.findIndex(function (x) {
                    return x.address == r.address;
                });
                //CHECK DEPLICATED HERE...
                if (duplicated == -1) {
                    found.push(r);
                    setFoundDs(found)
                }
            }
        }
    }


    useEffect(() => {
        BluetoothManager.isBluetoothEnabled().then(
            (enabled) => {
                setBleOpend(Boolean(enabled)),
                    setLoading(false)

            },
            (err) => {
                //Alert.alert("Opp!",err);
                //alert(err)
            }
        );
    })
    if (Platform.OS === "ios") {
        let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);

        bluetoothManagerEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
            (rsp) => {
                this._deviceAlreadPaired(rsp);
                console.log("_deviceAlreadPaired(rsp)", _deviceAlreadPaired(rsp));
            }

        );

        bluetoothManagerEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_FOUND,
            (rsp) => {
                this._deviceFoundEvent(rsp);
            }

        );

        bluetoothManagerEmitter.addListener(
            BluetoothManager.EVENT_CONNECTION_LOST,
            () => {
                setName(""),
                    setBoundAddress("")

            }

        );
    } else if (Platform.OS === "android") {

        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
            (rsp) => {
                this._deviceAlreadPaired(rsp);
            }

        );

        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_FOUND,
            (rsp) => {
                this._deviceFoundEvent(rsp);
            }

        );

        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_CONNECTION_LOST,
            () => {
                setName(""),
                    setBoundAddress("")
            }

        );

        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
            () => {
                ToastAndroid.show(
                    "Device Not Support Bluetooth !",
                    ToastAndroid.LONG
                );
            }

        );
    };



    const validate = values => {
        if (values.customerType.length > 0) {
            getCustomersForDriverSubmitFom(isChildOf, values.customerType)
                .then(data => {
                    setListCustomerInfoFromAPI(data.data);

                });
        }

        if (values.customerName) {
            setCustomerId(values.customerName);
            // setCustomerAddress(values.address)
            console.log("FromAPI")

        }

        const errors = {};
        if (values.otherCylinders.quatity == '' && currentTypeReflux === SHIPPING_TYPE.TRA_VO_KHAC) {
            errors.quatity = 'Hãy nhập số lượng';
        }

        if (!values.driverName) {
            errors.driverName = 'Tên tài xế không được bỏ trống';
        }

        if (!values.customerName) {
            errors.customerName = 'Hãy chọn tên khách hàng';
        }


        if (!values.customerType) {
            errors.customerType = 'Hãy chọn loại khách hàng';
        }

        // if (!values.address) {
        //     errors.address = 'Hãy chọn địa chỉ';
        // }

        if (!values.licensePlate) {
            errors.licensePlate = "Hãy nhập biển số xe";
        }

        if (values.otherCylinders[0].type == '') {
            errors.quatity = "Hãy chọn loại bình";
        }

        if (values.otherCylinders[0].quantity == '' && currentTypeReflux === SHIPPING_TYPE.TRA_VO_KHAC) {
            errors.quatity = "Hãy chọn số lượng";
        }

        return errors;
    };

    const onSubmit = async form => {
        console.log("FORM BODY: ==>", form);
        console.log("currentTypeReflux ==>", currentTypeReflux);
        console.log("customers", customerId);
        console.log("SIGNATURE", customerSignature);
        if (customerSignature === '') {
            console.log("CHƯA KÝ TÊN")
            Alert.alert("Khách hàng chưa lưu chữ ký");
            return;
        }

        Alert.alert(
            "Bạn có muốn xác nhận hồi lưu không?",
            "Hãy kiểm tra đầy đủ thông tin",
            [
                {
                    text: "HỦY BỎ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "ĐỒNG Ý",
                    onPress: () => postToServer()
                },
            ]
        );

        const postToServer = async () => {
            try {
                setLoadSubmitBtn(true);
                const body = {
                    deliveryAddress: customerAddress,
                    driver: userInfo.id ? userInfo.id : null,
                    driverName: form.driverName,
                    transport: form.licensePlate,
                    shippingType: currentTypeReflux,
                    signature: customerSignature,
                    customers: customerId,
                    orderID: form.orderid,
                    userid: userInfo.id ? userInfo.id : null,
                    cylinderDetail: currentTypeReflux === SHIPPING_TYPE.TRA_VO_KHAC ?
                        form.otherCylinders.map(item => ({
                            category: item.type,
                            status: CYLINDER_STATUS.VO,
                            isShip: false,
                            isReturn: true,
                            mass: item.quantity
                        }))
                        :
                        listSerialInStore.map((cylinder) => ({
                            serial: cylinder.serial,
                            status: currentTypeReflux === SHIPPING_TYPE.TRA_BINH_DAY ? CYLINDER_STATUS.BINH : CYLINDER_STATUS.VO,
                            isShip: false,
                            isReturn: true,
                            reason: cylinder.reason,
                            weight: cylinder?.cylinderMass ? parseFloat(cylinder.cylinderMass) : 0
                        }))
                }
                console.log("DEBUG", body)
                const res = await driverSubmitForm(body);
                console.log("RES===>", res);
                if (res.success) {
                    dispatch(deleteSignatureAction(null));
                    dispatch(driverResetSerialsReflux(null));
                    Alert.alert(
                        `Hồi lưu ${currentTypeReflux === SHIPPING_TYPE.TRA_BINH_DAY ? 'bình đầy' : 'vỏ bình'} thành công`,
                        res.message,
                        [{ text: "OK", onPress: () => Actions["home"]({}) }]
                    );
                } else {
                    Alert.alert(
                        `Hồi lưu ${currentTypeReflux === SHIPPING_TYPE.TRA_BINH_DAY ? 'bình đầy' : 'vỏ bình'} thất bại`,
                        res.message,
                        [{ text: "OK" }]
                    );
                }

            } catch (err) {
                console.log("LỖI HỒI LƯU", err);
                Alert.alert(
                    "Lỗi hồi lưu",
                    "Vui lòng kiểm tra lại",
                );
            } finally {
                setLoadSubmitBtn(false);
                dispatch(setShowOverlayDisableSignatureAction(false));
                dispatch(storeSignatureAction(''));
            }
        }

    };

    function handleB() {
        let EmptyCylinder_50 = [];
        let EmptyCylinder_45 = [];
        let EmptyCylinder_12 = [];

        if (listSerialInStore.length > 0) {
            Promise.all(
                listSerialInStore.map(cylinder => {

                    if (cylinder.cylinderWeight < 18) {
                        let c_Original = listSerialInStore.find(
                            element => element.serial == cylinder.serial,
                        );
                        EmptyCylinder_12.push(
                            Object.assign(cylinder, {
                                weightOriginal: c_Original.cylinderWeight,
                                weightReturn: cylinder.cylinderMass,
                                surplus: ((Number(cylinder.cylinderMass)) - (Number(c_Original.cylinderWeight)))
                            }),
                        );
                        // EmptyCylinder_12.push(cylinder)
                    } else if (
                        cylinder.cylinderWeight >= 18 &&
                        cylinder.cylinderWeight < 39
                    ) {
                        let c_Original = listSerialInStore.find(
                            element => element.serial == cylinder.serial,
                        );
                        EmptyCylinder_45.push(
                            Object.assign(cylinder, {
                                weightOriginal: c_Original.cylinderWeight,
                                weightReturn: cylinder.cylinderMass,
                                surplus: ((Number(cylinder.cylinderMass)) - (Number(c_Original.cylinderWeight)))
                            }),
                        );
                        // EmptyCylinder_45.push(cylinder)
                    } else if (cylinder.cylinderWeight >= 39) {
                        let c_Original = listSerialInStore.find(
                            element => element.serial == cylinder.serial,
                        );
                        EmptyCylinder_50.push(
                            Object.assign(cylinder, {
                                weightOriginal: c_Original.cylinderWeight,
                                weightReturn: cylinder.cylinderMass,
                                surplus: ((Number(cylinder.cylinderMass)) - (Number(c_Original.cylinderWeight)))
                            }),
                        );
                        // EmptyCylinder_50.push(cylinder)
                    }
                    // }
                }),
            );
            let i;
            for (i = 0; i < EmptyCylinder_50.length; i++) {
                [
                    console.log((i + 1).toString() + '. ' + EmptyCylinder_50[i].serial),
                    console.log(EmptyCylinder_50[i].weightOriginal.toString()),
                    console.log(EmptyCylinder_50[i].weightReturn.toString()),
                    console.log(EmptyCylinder_50[i].surplus.toFixed(1).toString())
                ]
            }

            console.log("EmptyCylinder_50", EmptyCylinder_50)
            console.log("EmptyCylinder_45", EmptyCylinder_45)
            console.log("EmptyCylinder_12", EmptyCylinder_12)
            // EmptyCylinder_12, EmptyCylinder_45, EmptyCylinder_50
            // )
        }
    }

    function handleA(values) {
        let weightTest = listSerialInStore.map(cylinder => {
            return cylinder.cylinderMass
        })
        console.log(values)
        console.log("CUSTOMERNAME", customerName)
        console.log("listSerialInStore", listSerialInStore);
        console.log("currentTypeReflux", currentTypeReflux)
        console.log("cylinder.weight", Number(weightTest))
    }

    // function getCustomerName() {
    //     {listCustomerInfoFromAPI.map(()=> 
    //         setCustomerName(name),
    //         console.log("customerName",customerName)
    //     )}
    // }



    return (
        <SafeAreaView>
            <ScrollView>
                <View style={tw('flex items-center justify-between flex-row bg-[#008a00] py-4 px-3')}>
                    <View>
                        <BackIcon onPress={() => Actions.pop()} color={'#FFF'} size={30} name="ios-arrow-back" />
                    </View>
                    <Text style={tw('text-lg text-white font-black ')}>{currentTypeReflux === SHIPPING_TYPE.TRA_VO_KHAC ? 'Hồi lưu vỏ khác' : 'Thông tin khách hàng'}</Text>
                    <View>
                        <HomeIcon onPress={() => Actions['home']({})} name="home-outline" size={30} color="#FFF" />
                    </View>
                </View>
                <View>
                    {/* /////////////////// */}
                    <Formik
                        enableReinitialize
                        initialValues={{
                            otherCylinders: [
                                {
                                    type: null,
                                    quantity: ''
                                }
                            ],
                            driverName: userInfo.name,
                            licensePlate: '',
                            customerType: '',
                            customerName: '',
                            orderid: null,
                        }} onSubmit={onSubmit} validate={validate}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            values,
                            errors
                        }) =>
                            <Center style={tw('mt-7')}>
                                <VStack width="90%" space={4}>

                                    {currentTypeReflux === SHIPPING_TYPE.TRA_VO_KHAC ?
                                        <>
                                            {/* NHẬP SỐ LƯỢNG */}
                                            <View style={{ alignItems: 'center' }}>
                                                <FormControl isRequired isInvalid={'quatity' in errors}>


                                                    <FieldArray
                                                        name="otherCylinders"
                                                        render={arrayHelpers => (
                                                            <View>
                                                                {values.otherCylinders.map(({ item }, index) => (
                                                                    <View style={tw('flex-row items-center justify-center')}>
                                                                        <TouchableOpacity
                                                                            disabled={values.otherCylinders.length == 1 ? true : false}
                                                                            onPress={() => {
                                                                                if (values.otherCylinders.length > 1) {
                                                                                    arrayHelpers.remove(index)
                                                                                    //setFieldValue('otherCylinders', values.otherCylinders)
                                                                                }
                                                                            }}
                                                                            style={{ borderColor: '#bd0b0b', borderWidth: 2, borderRadius: 50, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', marginRight: 20, color: "#bd0b0b" }} >
                                                                            <Text style={{ fontWeight: 'bold', fontSize: 35, color: '#bd0b0b', paddingBottom: 5 }}>-</Text>
                                                                        </TouchableOpacity>
                                                                        <Select selectedValue={values.otherCylinders[index].type} minWidth="45%" placeholder="Chọn loại bình" _selectedItem={{
                                                                            bg: "teal.600",
                                                                            endIcon: <CheckIcon size="5" />
                                                                        }} mt={1} onValueChange={handleChange(`otherCylinders[${index}].type`)}>
                                                                            {categoryCylinder.map(item =>
                                                                                <Select.Item
                                                                                    label={item.name}
                                                                                    value={item.id} />
                                                                            )}
                                                                        </Select>
                                                                        <View style={{ width: "22%", marginHorizontal: 15, marginTop: 9 }}>
                                                                            <Input
                                                                                key={index}
                                                                                keyboardType='number-pad'
                                                                                placeholder='Số lượng'
                                                                                onChangeText={handleChange(`otherCylinders[${index}].quantity`)}
                                                                                onBlur={handleBlur(`otherCylinders[${index}].quantity`)}
                                                                                value={values.otherCylinders[index].quantity.toString()}
                                                                            />
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() => arrayHelpers.insert(index, '')
                                                                                // setFieldValue('otherCylinders', [...values.otherCylinders, {
                                                                                // type: null,
                                                                                // quantity: ''}])
                                                                            }
                                                                            style={{ borderColor: "#0c0cc4", borderWidth: 2, borderRadius: 50, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', color: '#0c0cc4' }} >
                                                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: '#0c0cc4', paddingBottom: 3 }}>+</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                ))}

                                                            </View>

                                                        )}

                                                    />
                                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                        {errors.quatity}
                                                    </FormControl.ErrorMessage>
                                                </FormControl>
                                            </View>
                                        </>
                                        : null
                                    }

                                    {/* NHẬP TÊN TÀI TẾ */}
                                    <FormControl isRequired isInvalid={'driverName' in errors}>
                                        <View>
                                            <Radio.Group
                                                style={tw('flex-row')}
                                                value={typeName}
                                                onChange={value => {
                                                    if (value === DRIVER_TYPE.INTERNAL_DRIVER) {
                                                    }
                                                    setFieldValue("driverName", value === DRIVER_TYPE.EXTERNAL_DRIVER ? value.driverName : userInfo.name);
                                                    setTypeName(value);
                                                }}>
                                                <Radio value={DRIVER_TYPE.INTERNAL_DRIVER} my={1}>
                                                    <FormControl.Label>Tài xế:</FormControl.Label>
                                                </Radio>
                                                <Text>       </Text>
                                                <Radio value={DRIVER_TYPE.EXTERNAL_DRIVER} my={1}>
                                                    <FormControl.Label>Tên tài xế ngoài:</FormControl.Label>
                                                </Radio>
                                            </Radio.Group>
                                            <Input onBlur={handleBlur('driverName')}
                                                placeholder="Nhập tên tài xế ngoài"
                                                onChangeText={handleChange('driverName')}
                                                value={values.driverName}
                                                isDisabled={typeName === DRIVER_TYPE.INTERNAL_DRIVER ? true : false}
                                            />

                                        </View>

                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.driverName}
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    {/* NHẬP BIỂN SỐ XE*/}
                                    <FormControl isRequired isInvalid={'licensePlate' in errors}>
                                        <FormControl.Label>Biển số xe:</FormControl.Label>
                                        <Input onBlur={handleBlur('licensePlate')}
                                            placeholder="Nhập biển số xe"
                                            onChangeText={handleChange('licensePlate')}
                                            value={values.licensePlate ? values.licensePlate.toUpperCase() : undefined}
                                        />
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.licensePlate}
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    {/* NHẬP LOẠI KHÁCH HÀNG */}
                                    <FormControl isRequired isInvalid={'customerType' in errors}>
                                        <FormControl.Label>Loại khách hàng:</FormControl.Label>
                                        <Select selectedValue={values.customerType} minWidth="200" placeholder="Chọn loại khách hàng" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} onValueChange={handleChange('customerType')}>
                                            {/* {[...(new Set((listCustomerInfoFromAPI ? listCustomerInfoFromAPI : []).map(item => item.userRole)))].map(item =>
                                                <Select.Item
                                                    label={loaiKH[`${item}`]?.name ? loaiKH[`${item}`]?.name : item}
                                                    value={item}/>
                                                    //setCustomerType(item.name)
                                            )} */}
                                            <Select.Item
                                                label='Khách hàng công nghiệp bình'
                                                value='Industry'
                                            />
                                            <Select.Item
                                                label='Tổng đại lý'
                                                value='Distribution'
                                            />
                                            <Select.Item
                                                label='Đại lý'
                                                value='Agency'
                                            />
                                        </Select>

                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.customerType}
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    {/* NHẬP TÊN KHÁCH HÀNG */}
                                    <FormControl isRequired isInvalid={'customerName' in errors}>
                                        <FormControl.Label>Tên khách hàng:</FormControl.Label>
                                        <Select selectedValue={customerId} minWidth="200" placeholder="Chọn tên khách hàng" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} onValueChange={handleChange('customerName')}>
                                            {(listCustomerInfoFromAPI ? listCustomerInfoFromAPI : []).map(item =>
                                                <Select.Item
                                                    label={item.name}
                                                    value={item.id} />
                                            )}
                                        </Select>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.customerName}
                                        </FormControl.ErrorMessage>

                                    </FormControl>

                                    {/* CHỌN ĐỊA CHỈ */}
                                    <FormControl isRequired isInvalid={'address' in errors}>
                                        <FormControl.Label>Địa chỉ:</FormControl.Label>
                                        <Select selectedValue={customerAddress} minWidth="200" placeholder="Chọn địa chỉ" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} onValueChange={handleChange('address')}>
                                            {/* {[...(new Set((listCustomerInfoFromAPI ? listCustomerInfoFromAPI : []).map(item => item.address)))].map(address =>
                                               
                                            )} */}
                                            <Select.Item
                                                label={customerAddress}
                                                value={customerAddress} />
                                        </Select>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.address}
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    {/* CHỌN Mã đơn hàng */}
                                    {/* <FormControl isRequired isInvalid={'orderid' in errors}> */}
                                    <FormControl >
                                        <FormControl.Label>Mã đơn hàng:</FormControl.Label>
                                        <Select selectedValue={values.orderid} minWidth="200" placeholder="Chọn mã đơn hàng" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} onValueChange={handleChange('orderid')}>
                                            {orders.map(item =>
                                                <Select.Item
                                                    label={item.orderCode}
                                                    value={item.id} />

                                            )}
                                        </Select>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.orderid}
                                        </FormControl.ErrorMessage>
                                    </FormControl>


                                    <DriverSignature />


                                    <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20, textAlign: 'center' }}>
                                        {customerSignature.length === '' ? "Khách hàng chưa ký tên" : null}
                                    </Text>

                                    <VStack space={0}>


                                        {/* Kết nối BlueTooth */}

                                        <Text style={styles.textAlign = "center"} >Mở Bluetooth</Text>
                                        <Text style={styles.title}>
                                            Trạng thái:{" "}
                                            {bleOpend ? "Bật" : "Tắt"}
                                        </Text>

                                        <View>
                                            <Switch
                                                value={bleOpend}
                                                onValueChange={(v) => {
                                                    setLoading(true);
                                                    if (!v) {
                                                        try {
                                                            BluetoothManager.disableBluetooth().then(
                                                                (r) => {
                                                                    setBleOpend(false),
                                                                        setLoading(false),
                                                                        setFoundDs([]),
                                                                        setPairedDs([]),

                                                                        console.log("bluetooth da tat", r)
                                                                }
                                                            )
                                                        } catch (error) {
                                                            console.log("loi bluetooth", error)
                                                        }

                                                    } else {
                                                        BluetoothManager.enableBluetooth().then(
                                                            (r) => {
                                                                var paired = [];
                                                                if (r && r.length > 0) {
                                                                    for (var i = 0; i < r.length; i++) {
                                                                        try {
                                                                            paired.push(JSON.parse(r[i]));
                                                                        } catch (e) {
                                                                            //ignore
                                                                            console.log(e);
                                                                        }
                                                                    }
                                                                }
                                                                setBleOpend(true),
                                                                    setLoading(false),
                                                                    setPairedDs(paired),

                                                                    console.log("bluetooth da bat", r)
                                                            },
                                                            (err) => {
                                                                setLoading(false),

                                                                    Alert.alert("Oops!", "err", err);

                                                            }
                                                        );
                                                    }
                                                }}
                                            />

                                        </View>
                                        <Text style={styles.title}>
                                            Kết nối đến thiết bị:
                                            <Text style={{ color: "blue" }}>
                                                {!name ? "Không có thiết bị nào" : name}
                                            </Text>
                                        </Text>
                                        <Text style={styles.title}>
                                            Tìm kiếm thiết bị...
                                        </Text>
                                        {loading ? (
                                            <ActivityIndicator animating={true} />
                                        ) : null}
                                        <View style={{ flex: 1, flexDirection: "column" }}>
                                            {_renderRow(foundDs)}
                                        </View>
                                        <Text style={styles.title}>Thiết bị đã ghép đôi: </Text>
                                        {loading ? (
                                            <ActivityIndicator animating={true} />
                                        ) : null}
                                        <View style={{ flex: 1, flexDirection: "column" }}>
                                            {_renderRow(pairedDs)}
                                        </View>

                                    </VStack>
                                    <View style={[tw('flex-row justify-between'), { marginHorizontal: 8, marginBottom: 40 }]}>
                                        <Button width="47%"
                                            disabled={
                                                loading ||
                                                !(bleOpend && boundAddress.length > 0)
                                            }
                                            onPress={async () => {
                                                setIsEnableFinish(false);
                                                let FullCylinder_50 = [];
                                                let FullCylinder_45 = [];
                                                let FullCylinder_12 = [];

                                                let EmptyCylinder_50 = [];
                                                let EmptyCylinder_45 = [];
                                                let EmptyCylinder_12 = [];
                                                let weightTest = listSerialInStore.map(cylinder => {
                                                    return Number(cylinder.cylinderMass)
                                                })


                                                if (listSerialInStore.length > 0) {
                                                    Promise.all(
                                                        listSerialInStore.map(cylinder => {

                                                            if (cylinder.cylinderWeight < 18) {
                                                                let c_Original = listSerialInStore.find(
                                                                    element => element.serial == cylinder.serial,
                                                                );
                                                                EmptyCylinder_12.push(
                                                                    Object.assign(cylinder, {
                                                                        weightOriginal: c_Original.cylinderWeight,
                                                                        weightReturn: cylinder.cylinderMass,
                                                                        surplus: ((Number(cylinder.cylinderMass)) - (Number(c_Original.cylinderWeight)))
                                                                    }),
                                                                );
                                                                // EmptyCylinder_12.push(cylinder)
                                                            } else if (
                                                                cylinder.cylinderWeight >= 18 &&
                                                                cylinder.cylinderWeight < 39
                                                            ) {
                                                                let c_Original = listSerialInStore.find(
                                                                    element => element.serial == cylinder.serial,
                                                                );
                                                                EmptyCylinder_45.push(
                                                                    Object.assign(cylinder, {
                                                                        weightOriginal: c_Original.cylinderWeight,
                                                                        weightReturn: cylinder.cylinderMass,
                                                                        surplus: ((Number(cylinder.cylinderMass)) - (Number(c_Original.cylinderWeight)))
                                                                    }),
                                                                );
                                                                // EmptyCylinder_45.push(cylinder)
                                                            } else if (cylinder.cylinderWeight >= 39) {
                                                                let c_Original = listSerialInStore.find(
                                                                    element => element.serial == cylinder.serial,
                                                                );
                                                                EmptyCylinder_50.push(
                                                                    Object.assign(cylinder, {
                                                                        weightOriginal: c_Original.cylinderWeight,
                                                                        weightReturn: cylinder.cylinderMass,
                                                                        surplus: ((Number(cylinder.cylinderMass)) - (Number(c_Original.cylinderWeight)))
                                                                    }),
                                                                );
                                                                // EmptyCylinder_50.push(cylinder)
                                                            }
                                                            // }
                                                        }),
                                                    );

                                                    console.log("EmptyCylinder_50", EmptyCylinder_50)
                                                    console.log("EmptyCylinder_45", EmptyCylinder_45)
                                                    console.log("EmptyCylinder_12", EmptyCylinder_12)
                                                    // EmptyCylinder_12, EmptyCylinder_45, EmptyCylinder_50
                                                    // )

                                                    try {
                                                        let i;
                                                        await BluetoothEscposPrinter.printerAlign(
                                                            BluetoothEscposPrinter.ALIGN.CENTER,
                                                        );
                                                        await BluetoothEscposPrinter.printText(
                                                            'CONG TY TNHH KHI HOA LONG VIET NAM - VT GAS\n\r',
                                                            {
                                                                //encoding: 'GBK',
                                                                //codepage: 0,
                                                                widthtimes: 3,
                                                                heigthtimes: 3,
                                                                fonttype: 1,
                                                            },
                                                        );
                                                        await BluetoothEscposPrinter.printerAlign(
                                                            BluetoothEscposPrinter.ALIGN.CENTER,
                                                        );
                                                        await BluetoothEscposPrinter.printText(
                                                            '\n\r',
                                                            {
                                                                //encoding: 'GBK',
                                                                //codepage: 0,
                                                                widthtimes: 1,
                                                                heigthtimes: 1,
                                                                fonttype: 0,
                                                            },
                                                        );
                                                        await BluetoothEscposPrinter.printText(
                                                            '\n\rBIEN BAN GIAO NHAN HANG HOA\n\r',
                                                            {},
                                                        );
                                                        await BluetoothEscposPrinter.printText('\n\r', {});

                                                        await BluetoothEscposPrinter.printerAlign(
                                                            BluetoothEscposPrinter.ALIGN.CENTER,
                                                        );

                                                        await BluetoothEscposPrinter.printColumn(
                                                            [13, 2, 33],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                            ],
                                                            [
                                                                'Ten KH',
                                                                ': ',
                                                                customerName ? cleanAccents(customerName) : '',
                                                            ],
                                                            { fonttype: 1 },
                                                        );
                                                        await BluetoothEscposPrinter.printColumn(
                                                            [13, 2, 33],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                            ],
                                                            [
                                                                'Loai KH',
                                                                ': ',
                                                                values.customerType ? cleanAccents(values.customerType) : '',
                                                            ],
                                                            { fonttype: 1 },
                                                        );

                                                        await BluetoothEscposPrinter.printColumn(
                                                            [13, 2, 33],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                            ],
                                                            [
                                                                'Ngay/Gio',
                                                                ': ',
                                                                moment(new Date()).format('DD/MM/YYYY, HH:mm:ss'),
                                                            ],
                                                            { fonttype: 1 },
                                                        );
                                                        await BluetoothEscposPrinter.printColumn(
                                                            [13, 2, 33],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                            ],
                                                            [
                                                                'Dia Chi',
                                                                ': ',
                                                                customerAddress ? cleanAccents(customerAddress) : '',
                                                            ],
                                                            { fonttype: 1 },
                                                        );
                                                        await BluetoothEscposPrinter.printColumn(
                                                            [13, 2, 33],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                            ],
                                                            [
                                                                'Ten tai xe',
                                                                ': ',
                                                                values.driverName ? cleanAccents(values.driverName) : '',
                                                            ],
                                                            { fonttype: 1 },
                                                        );
                                                        await BluetoothEscposPrinter.printColumn(
                                                            [13, 2, 33],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                            ],
                                                            ['So Xe', ': ', values.licensePlate ? values.licensePlate : ''],
                                                            { fonttype: 1 },
                                                        );


                                                        // --- // Tai xe hoi luu
                                                        await BluetoothEscposPrinter.printText(
                                                            '\n\r--------------------------------\n\r',
                                                            {},
                                                        );

                                                        await BluetoothEscposPrinter.printText(
                                                            'GIAO BINH RONG (EMPTY CYLINDER)\n\r',
                                                            {},
                                                        );
                                                        await BluetoothEscposPrinter.printText('\n\r', {});


                                                        await BluetoothEscposPrinter.printColumn(
                                                            [48],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,

                                                            ],
                                                            [
                                                                ` Binh 45 Kg `,
                                                            ],
                                                            {},
                                                        )

                                                        if (EmptyCylinder_50.length > 0) {
                                                            let totalcounnt = EmptyCylinder_50.reduce((s, x) => s + x.surplus, 0);

                                                            await BluetoothEscposPrinter.printColumn(
                                                                [24, 8, 8, 8],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `    Ma Seri`,
                                                                    'TL. LPG',
                                                                    ' TL. Vo',
                                                                    ' Gas du',
                                                                ],
                                                                {},
                                                            );

                                                            await BluetoothEscposPrinter.printColumn(
                                                                [24, 8, 8, 8],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `    Don vi`,
                                                                    'Kg',
                                                                    ' Kg',
                                                                    ' Kg',
                                                                ],
                                                                {},
                                                            );

                                                            for (i = 0; i < EmptyCylinder_50.length; i++) {
                                                                await BluetoothEscposPrinter.printColumn(
                                                                    [24, 8, 8, 8],
                                                                    [
                                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    ],
                                                                    [
                                                                        (i + 1).toString() + '. ' + EmptyCylinder_50[i].serial,
                                                                        EmptyCylinder_50[i].weightOriginal.toString(),
                                                                        EmptyCylinder_50[i].weightReturn.toString(),
                                                                        EmptyCylinder_50[i].surplus.toFixed(1).toString(),
                                                                    ],
                                                                    {},
                                                                )

                                                            }
                                                            await BluetoothEscposPrinter.printColumn(
                                                                [18, 11, 10, 9],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.CENTER,
                                                                    BluetoothEscposPrinter.ALIGN.CENTER,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `Tong: SL: ${EmptyCylinder_50.length} binh`,
                                                                    '',
                                                                    '',
                                                                    totalcounnt.toFixed(1).toString() + ' Kg'
                                                                ],
                                                                {},
                                                            );


                                                        }

                                                        if (EmptyCylinder_45.length > 0) {

                                                            let totalcounnt = EmptyCylinder_45.reduce((s, x) => s + x.surplus, 0);
                                                            await BluetoothEscposPrinter.printColumn(
                                                                [24, 8, 8, 8],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `    Ma Seri `,
                                                                    'TL. LPG',
                                                                    ' TL. Vo',
                                                                    ' Gas du',
                                                                ],
                                                                {},
                                                            );

                                                            await BluetoothEscposPrinter.printColumn(
                                                                [24, 8, 8, 8],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `    Don vi`,
                                                                    'Kg',
                                                                    ' Kg',
                                                                    ' Kg',
                                                                ],
                                                                {},
                                                            );

                                                            for (i = 0; i < EmptyCylinder_45.length; i++) {
                                                                await BluetoothEscposPrinter.printColumn(
                                                                    [24, 8, 8, 8],
                                                                    [
                                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    ],
                                                                    [
                                                                        (i + 1).toString() + '. ' + EmptyCylinder_45[i].cylinder,
                                                                        EmptyCylinder_45[i].weightOriginal.toString(),
                                                                        EmptyCylinder_50[i].weightReturn1.toString(),
                                                                        EmptyCylinder_45[i].surplus.toFixed(1).toString(),

                                                                    ],
                                                                    {},

                                                                );
                                                            }
                                                            await BluetoothEscposPrinter.printColumn(
                                                                [18, 11, 10, 9],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.CENTER,
                                                                    BluetoothEscposPrinter.ALIGN.CENTER,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `tong: SL: ${EmptyCylinder_45.length} binh`,
                                                                    '',
                                                                    '',
                                                                    totalcounnt.toFixed(1).toString() + ' Kg'
                                                                ],
                                                                {},
                                                            );

                                                        }

                                                        await BluetoothEscposPrinter.printColumn(
                                                            [48],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,

                                                            ],
                                                            [
                                                                ` Binh 12 Kg `,
                                                            ],
                                                            {},
                                                        );

                                                        if (EmptyCylinder_12.length > 0) {
                                                            let totalcounnt = EmptyCylinder_12.reduce((s, x) => s + x.surplus, 0);
                                                            await BluetoothEscposPrinter.printColumn(
                                                                [24, 8, 8, 8],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `    Ma Seri `,
                                                                    'TL. LPG',
                                                                    ' TL. Vo',
                                                                    ' Gas du',
                                                                ],
                                                                {},
                                                            );

                                                            await BluetoothEscposPrinter.printColumn(
                                                                [24, 8, 8, 8],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `    Don vi`,
                                                                    'Kg',
                                                                    ' Kg',
                                                                    ' Kg',
                                                                ],
                                                                {},
                                                            );

                                                            for (i = 0; i < EmptyCylinder_12.length; i++) {
                                                                await BluetoothEscposPrinter.printColumn(
                                                                    [24, 8, 8, 8],
                                                                    [
                                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                        BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                    ],
                                                                    [
                                                                        (i + 1).toString() + '. ' + EmptyCylinder_12[i].serial,
                                                                        EmptyCylinder_12[i].weightOriginal.toString(),
                                                                        EmptyCylinder_50[i].weightReturn.toString(),
                                                                        EmptyCylinder_12[i].surplus.toFixed(1).toString(),

                                                                    ],
                                                                    {},
                                                                )

                                                            }
                                                            await BluetoothEscposPrinter.printColumn(
                                                                [18, 11, 10, 9],
                                                                [
                                                                    BluetoothEscposPrinter.ALIGN.LEFT,
                                                                    BluetoothEscposPrinter.ALIGN.CENTER,
                                                                    BluetoothEscposPrinter.ALIGN.CENTER,
                                                                    BluetoothEscposPrinter.ALIGN.RIGHT,
                                                                ],
                                                                [
                                                                    `Tong: SL: ${EmptyCylinder_12.length} binh`,
                                                                    '',
                                                                    '',
                                                                    totalcounnt.toFixed(1).toString() + ' Kg'
                                                                ],
                                                                {},
                                                            );
                                                        }

                                                        await BluetoothEscposPrinter.printText(
                                                            '\n\r--------------------------------\n\r',
                                                            {},
                                                        );


                                                        await BluetoothEscposPrinter.printColumn(
                                                            [27, 6],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.LEFT,
                                                                BluetoothEscposPrinter.ALIGN.RIGHT,
                                                            ],
                                                            [
                                                                'Da kiem tra an toan va thu bang binh xit xa phong',
                                                                '[ ]',
                                                            ],
                                                            {},
                                                        );

                                                        await BluetoothEscposPrinter.printColumn(
                                                            [
                                                                BluetoothEscposPrinter.width58 / 8 / 2,
                                                                BluetoothEscposPrinter.width58 / 8 / 2,
                                                            ],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.CENTER,
                                                                BluetoothEscposPrinter.ALIGN.CENTER,
                                                            ],
                                                            ['Cong Ty Gas South', 'Dai Dien Khach Hang'],
                                                            {},
                                                        );
                                                        await BluetoothEscposPrinter.printColumn(
                                                            [
                                                                BluetoothEscposPrinter.width58 / 8 / 2,
                                                                BluetoothEscposPrinter.width58 / 8 / 2,
                                                            ],
                                                            [
                                                                BluetoothEscposPrinter.ALIGN.CENTER,
                                                                BluetoothEscposPrinter.ALIGN.CENTER,
                                                            ],
                                                            ['(Ky & Ghi ro Ho ten)', '(Ky & Ghi ro Ho ten)'],
                                                            {},
                                                        );
                                                        await BluetoothEscposPrinter.printPic(customerSignature, {
                                                            width: 200,
                                                            left: 20,
                                                        });
                                                    } catch (e) {
                                                        console.log(e)
                                                        Alert.alert("Lỗi",
                                                            [{ text: "lại" }],
                                                            { cancelable: false });
                                                    }
                                                } else {
                                                    Alert.alert("Chưa quét bình nào",
                                                        [{ text: "lại" }],
                                                        { cancelable: false });
                                                }
                                            }}
                                            colorScheme="orange">
                                            In bill
                                        </Button>
                                        <Button width="47%"
                                            isDisabled={isLoadingSubmitBtn}
                                            onPress={handleSubmit}
                                            colorScheme="green">
                                            {isLoadingSubmitBtn ? <ActivityIndicator size="small" color="#00ff00" /> : 'Hoàn thành'}
                                        </Button>
                                    </View>
                                </VStack>
                            </Center>
                        }
                    </Formik>
                    {/* /////////////////// */}
                </View>
                {/* <Button onPress={
                    () => {
                        console.log("Hoi luu ne");
                    }
                }> Test </Button> */}
            </ScrollView>
            <Toast
                backgroundColor="#fffff"
                autoHide={true}
                visibilityTime={500}
                ref={(ref) => {
                    Toast.setRef(ref);
                }}
            />
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    label: {
        fontWeight: '900',
    },
    // Bluetooth
    title: {
        //width:width,
        backgroundColor: "#eee",
        color: "#232323",
        paddingLeft: 8,
        paddingVertical: 4,
        textAlign: "left",
    },
    btnPrint: {
        color: "blue",
    },
    ModalBox: {
        paddingTop: 10,
        backgroundColor: "white",
        justifyContent: "center",
        marginHorizontal: 30,
        marginVertical: 80,
        borderRadius: Platform.OS === "ios" ? 30 : 15,
    },
})


export default DriverOtherGasCylinder;