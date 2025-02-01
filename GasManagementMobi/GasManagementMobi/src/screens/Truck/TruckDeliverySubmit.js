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
    Keyboard,
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

import { VStack, Input, Button, FormControl, Select, Center, CheckIcon, WarningOutlineIcon, Box } from 'native-base';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { createOrderNew, getArea, getCustomers, getStation, getAddressForDelivery } from '../../api/orders_new';
import { getDriver } from '../../api/customer';
import { driverSubmitForm } from '../../api/reflux';
import { SHIPPING_TYPE, CYLINDER_STATUS } from "../../constants";
import { Radio } from "native-base";
import { deleteSignatureAction, setShowOverlayDisableSignatureAction, storeSignatureAction } from '../../actions/CurrentSignature';
import DriverSignature from '../../components/DriverSignature';
import Toast from 'react-native-toast-message';
import { truckResetListSerialOrder } from '../../actions/TruckDeliveryActions';
import { cleanAccents } from '../../helper/words';
import moment from 'moment';
import {
    BluetoothManager,
    BluetoothEscposPrinter,
    BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import { result } from 'lodash';
import { element } from 'prop-types';

const TruckDeliverySubmit = (props) => {
    const tw = useTailwind();
    const dispatch = useDispatch();

    // Bluetooth
    var { height, width } = Dimensions.get("window");

    const DRIVER_TYPE = {
        INTERNAL_DRIVER: 'INTERNAL_DRIVER',
        EXTERNAL_DRIVER: 'EXTERNAL_DRIVER'
    }

    const currentTypeDelivery = useSelector(state => state.truckDeliveryReducer.currentTypeDelivery);
    const listSerialInStore = useSelector(state => state.truckDeliveryReducer.storeSerial);
    const userInfo = useSelector(state => state.auth._userInfo);
    const currentOrderSelection = useSelector(state => state.truckDeliveryReducer.currentOrderSelection);
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
    const [quantity, setQuantity] = useState("");
    const [cylinderName, setCylinderName] = useState("");
    const [customerType, setCustomerType] = useState("");
    const [typeCylinder, setTypeCylinder] = useState("");
    const [price, setPrice] = useState(0);

    const [form, setForm] = useState({
        driverName: '',
        truck: userInfo.id,
        driverId: '',
        driverIsChildOf: userInfo.isChildOf,
        licensePlate: userInfo.license_plate,
        address: '',
        orderid: currentOrderSelection.orderOverview.id,
        customers: currentOrderSelection.orderOverview.customers.id,
    });

    //console.log("currentOrderSelection",currentOrderSelection);

    const [errInput, setErrInput] = useState({
    });
    const [typeName, setTypeName] = React.useState(DRIVER_TYPE.INTERNAL_DRIVER);
    const [addresses, setAddresses] = useState([]);
    const [driverList, setDriverList] = useState([]);

    const [isLoadingSubmitBtn, setLoadSubmitBtn] = useState(false);



    useEffect(() => {
        getAddressForDelivery(form.orderid)
            .then(({ data }) => {
                setAddresses(data);
            })
            .catch(err => {
                console.log("LỖI getAddressForDelivery()", err);
            })
    }, []);

    useEffect(() => {
        getDriver(form.driverIsChildOf)
            .then(({ data }) => {
                setDriverList(data);
            })
            .catch(err => {
                console.log("LỖI getDriver()", err);
            })
    }, []);

    useEffect(() => {
        const data = currentOrderSelection.orderDetail.map((item) => {
            const {
                categoryCylinder,
                quantity,
                price,
            } = item;
            return {
                quantity,
                price,
                cylinderName: categoryCylinder.name
            }
        });

        console.log("dataaaa", data);

        setCustomerName(currentOrderSelection.orderOverview.customers.name)

        setCylinderName(data[0].cylinderName)
        setQuantity(data[0].quantity)
        setPrice(data[0].price)





    }, [])

    // console.log("----------------------");
    // console.log("customerNameeee",customerName);
    // console.log("CylinderName",cylinderName);
    // console.log("quantityyyyyy",quantity);
    // console.log("priceeeee",price);


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




    const onSubmit = async () => {
        console.log("SIGNATURE", customerSignature);
        console.log("currentOrderSelection", currentOrderSelection);
        if (customerSignature === '') {
            console.log("CHƯA KÝ TÊN")
            Alert.alert("Khách hàng chưa lưu chữ ký");
            return;
        }


        Alert.alert(
            "Bạn có muốn xác nhận đơn hàng không?",
            "Hãy kiểm tra đầy đủ thông tin",
            [
                {
                    text: "HỦY BỎ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "ĐỒNG Ý",
                    onPress: () => postToServer() // chạy đúng yêu cầu
                    // onPress:  postToServer // postToServer thực thi trước khi ấn
                },
            ]
        );

        const postToServer = async () => {
            try {
                setLoadSubmitBtn(true);
                const body = {
                    deliveryAddress: form.address,
                    driver: form.driverId ? form.driverId : null,
                    driverName: form.driverName,
                    transport: form.licensePlate,
                    shippingType: currentTypeDelivery,
                    userid: form.truck ? form.truck : null,
                    signature: customerSignature,
                    customers: form.customers,
                    orderID: form.orderid,
                    vehicle: form.truck ? form.truck : null,
                    cylinderDetail: listSerialInStore.map(({ serial }) => ({
                        serial: serial,
                        status: currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? CYLINDER_STATUS.BINH : CYLINDER_STATUS.VO,
                        isShip: true,
                        isReturn: false,
                        reason: null
                    }))
                }
                console.log("BODY:", body);
                // return;
                const res = await driverSubmitForm(body, form.orderid);
                console.log("RES===>", res);
                if (res.success) {
                    dispatch(deleteSignatureAction(null));
                    dispatch(truckResetListSerialOrder());
                    Alert.alert(
                        `Giao ${currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? 'bình đầy' : 'vỏ bình'} thành công`,
                        res.message,
                        [{ text: "OK", onPress: () => Actions["home"]({}) }]
                    );
                } else {
                    Alert.alert(
                        `Giao ${currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? 'bình đầy' : 'vỏ bình'} thất bại`,
                        res.message,
                        [{ text: "OK" }]
                    );
                }

            } catch (err) {
                console.log("LỖI GIAO HÀNG", err);
                Alert.alert(
                    "Lỗi giao hàng",
                    "Vui lòng kiểm tra lại",
                );
            } finally {
                setLoadSubmitBtn(false);
                dispatch(setShowOverlayDisableSignatureAction(false));
                dispatch(storeSignatureAction(''));
            }
        }

    };

    const isValidate = () => {
        if (form.driverName == '') {
            setErrInput({
                ...errInput,
                driverName: "Hãy nhập tên tài xế"
            })
            return false;
        }
        if (form.licensePlate == '') {
            setErrInput({
                ...errInput,
                licensePlate: "Hãy nhập biển số xe"
            })
            return false;
        }
        if (form.address == '') {
            setErrInput({
                ...errInput,
                address: "Hãy chọn địa chỉ"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = () => {
        if (isValidate()) {
            // Toast.show({
            //     text1: 'Vui lòng chờ',
            //     text2: 'Đang tải dữ liệu'
            // });
            onSubmit();
        } else {
            console.log("lỗi validate")
        }
    }

    function handleA(form) {
        console.log(form)
        //console.log("cylinderDetail",cylinderDetail)
        console.log("listSerialInStore", listSerialInStore);
        console.log("serial", listSerialInStore.map(element => element.serial).join(' '));
        console.log("testMang", listSerialInStore[0].serial);

        //console.log("currentTypeReflux", currentTypeReflux)
        // console.log("cylinder.weight", Number(weightTest))
    }

    return (
        <SafeAreaView onPress={Keyboard.dismiss}>
            <ScrollView>
                <View style={tw('flex items-center justify-between flex-row bg-[#008a00] py-4 px-3')}>
                    <View>
                        <BackIcon onPress={() => Actions.pop()} color={'#FFF'} size={30} name="ios-arrow-back" />
                    </View>
                    <Text style={tw('text-lg text-white font-black ')}>{currentTypeDelivery === SHIPPING_TYPE.GIAO_HANG ? 'Giao bình đầy' : 'Giao vỏ'}</Text>
                    <View>
                        <HomeIcon onPress={() => Actions['home']({})} name="home-outline" size={30} color="#FFF" />
                    </View>
                </View>
                <View>
                    {/* /////////////////// */}
                    <View style={[tw(), { paddingHorizontal: 30, marginTop: 20 }]}>
                        <View>
                            <Radio.Group
                                style={tw('flex-row')}
                                value={typeName}
                                onChange={value => {
                                    if (value === DRIVER_TYPE.INTERNAL_DRIVER) {
                                        setErrInput({
                                            ...errInput,
                                            licensePlate: undefined
                                        })
                                    }
                                    setForm({
                                        ...form,
                                        licensePlate: value === DRIVER_TYPE.EXTERNAL_DRIVER ? '' : userInfo.license_plate
                                    })
                                    setTypeName(value);
                                }}>
                                <Radio value={DRIVER_TYPE.INTERNAL_DRIVER} my={1}>
                                    <Text>Xe</Text>
                                </Radio>
                                <Text>       </Text>
                                <Radio value={DRIVER_TYPE.EXTERNAL_DRIVER} my={1}>
                                    <Text>Xe ngoài</Text>
                                </Radio>
                            </Radio.Group>
                            {typeName === DRIVER_TYPE.INTERNAL_DRIVER ?
                                <Input isDisabled value={form.licensePlate} />
                                :
                                <Input
                                    onChangeText={value => {
                                        setForm({
                                            ...form,
                                            licensePlate: value
                                        })
                                    }
                                    }
                                />
                            }
                            {errInput.licensePlate ?
                                <Text style={[{ color: 'red' }]}>Hãy nhập biển số xe ngoài</Text>
                                : null
                            }
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text>Tên tài xế:</Text>
                            {typeName === DRIVER_TYPE.INTERNAL_DRIVER ?
                                <View>
                                    <Select selectedValue={form.driverId} minWidth="200" placeholder="Chọn tên" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1}
                                        onValueChange={(value) => {
                                            setErrInput({
                                                ...errInput,
                                                driverName: undefined
                                            });
                                            console.log("select:", value);
                                            const id = value;
                                            const { name } = driverList.find(driver => driver.id === id)
                                            setForm({
                                                ...form,
                                                driverName: name,
                                                driverId: id,
                                            });
                                        }}
                                    >
                                        {driverList.map(driver => {
                                            return <Select.Item
                                                key={driver.id}
                                                label={driver.name}
                                                value={driver.id}
                                            />
                                        }
                                        )}
                                    </Select>
                                </View>
                                :
                                <View>
                                    <Input
                                        onChangeText={value => {
                                            setErrInput({
                                                ...errInput,
                                                driverName: undefined
                                            })
                                            setForm({
                                                ...form,
                                                driverName: value
                                            })
                                        }}
                                        value={form.driverName} />
                                </View>
                            }

                            {errInput.driverName ?
                                <Text style={[{ color: 'red' }]}>Thiếu tên tài xế</Text>
                                : null
                            }


                        </View>

                        <View style={{ marginTop: 20 }} >
                            <Text>Địa chỉ:</Text>
                            <Select selectedValue={form.address} minWidth="200" placeholder="Chọn địa chỉ" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1}
                                onValueChange={value => {
                                    setErrInput({
                                        ...errInput,
                                        address: undefined
                                    });
                                    setForm({
                                        ...form,
                                        address: value
                                    });
                                }}
                            >
                                {addresses.map(address => {
                                    //console.log("ADDRESS+", address);
                                    return <Select.Item
                                        key={address.id}
                                        label={address.deliveryAddress}
                                        value={address.deliveryAddress}
                                    />
                                }
                                )}
                            </Select>
                            {errInput.address ?
                                <Text style={[{ color: 'red' }]}>Hãy chọn địa chỉ</Text>
                                : null
                            }
                        </View>

                        <DriverSignature />


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

                        {/* <Button
                    onPress={() => handleA(form)}>
                    In
                  </Button> */}





                        <View style={[tw('items-center'), { marginVertical: 10, marginBottom: 30 }]}>
                            <Button style={tw('mt-10')} width="45%"
                                disabled={
                                    loading ||
                                    !(bleOpend && boundAddress.length > 0)
                                }
                                onPress={async () => {
                                    setIsEnableFinish(false);
                                    const Cylinder_50 = listSerialInStore.map((item) => {
                                        const {
                                            serial,
                                            type
                                        } = item;
                                        return {
                                            serial,
                                            type
                                        }
                                    });

                                    //console.log("Cylinder_50[i].serial",Cylinder_50)

                                    if (listSerialInStore.length > 0) {

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
                                                ['Ma Don Hang', ': ', form.orderid ? form.orderid : ''],
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
                                                    form.address ? cleanAccents(form.address) : '',
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
                                                    form.driverName ? cleanAccents(form.driverName) : '',
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
                                                ['So Xe', ': ', form.licensePlate ? form.licensePlate : ''],
                                                { fonttype: 1 },
                                            );


                                            // --- // Tai xe hoi luu
                                            await BluetoothEscposPrinter.printText(
                                                '\n\r--------------------------------\n\r',
                                                {},
                                            );
                                            await BluetoothEscposPrinter.printText(

                                                listSerialInStore[0].type,
                                                {},
                                            );

                                            await BluetoothEscposPrinter.printText('\n\r', {});

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
                                                    '',
                                                    '',
                                                    '',
                                                ],
                                                {},
                                            );
                                            await BluetoothEscposPrinter.printText('\n\r', {});
                                            // Tony fixing
                                            for (i = 0; i < listSerialInStore.length; i++) {
                                                await BluetoothEscposPrinter.printColumn(
                                                    [24, 8, 8, 8],
                                                    [
                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                        BluetoothEscposPrinter.ALIGN.LEFT,
                                                    ],
                                                    [
                                                        (i + 1).toString() + '. ' + Cylinder_50[i].serial,
                                                        '',
                                                        '',
                                                        '',

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
                                                    `Tong: SL: ${Cylinder_50.length} binh`,
                                                    '',
                                                    '',
                                                    '',
                                                ],
                                                {},
                                            );





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
                            <Button isDisabled={isLoadingSubmitBtn} style={tw('mt-4 mb-10')} width="45%" onPress={handleSubmit} colorScheme="green">
                                {isLoadingSubmitBtn ? <ActivityIndicator size="large" color="#00ff00" /> : 'Hoàn thành'}
                            </Button>
                        </View>

                    </View>
                    {/* /////////////////// */}
                </View>
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

export default TruckDeliverySubmit;
