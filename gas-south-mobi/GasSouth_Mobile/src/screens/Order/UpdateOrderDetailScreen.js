import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, Picker } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLOR } from '../../constants';
import { translate } from '../../utils/changeLanguage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { ORDER_STATUS } from '../Order/OrderManager/utils/statusType';
import { apiGetStatusOrder, delOrderDetail, DieuDoTram_Gui_Duyet, getListColorGas, getListCylinder, getListManufacture, getListValve, getOrderDetail, getPrice, sendNotification, updateNote, updateOrder, updateOrderNew } from '../../api/orders_new';
import { getToken, getUserInfo } from '../../helper/auth';
import Toast from 'react-native-toast-message'
import { AGENCY, DDT, DDTM, GENERAL, KHACH_HANG, TNL, TONG_CONG_TY, TRAM } from '../../types';

const UpdateOrderDetailScreen = ({ orderItem }) => {

    // const Temp = orderItem.orderDetail.map((
    //     { createdAt, deletedAt, deletedBy, isDeleted, orderGSId, updatedAt, ...temp }) => ({ ...temp }));

    // const [orderDetail2, setOrderDetail2] = useState();
    const [order, setOrder] = useState({ orderDetail: null });
    const visibilityTime = 3000;
    const [checkAccountDDT, setCheckAccountDDT] = useState(false);//kiem tra tai khoản điều độ trạm
    const [checkAccountKH, setCheckAccountKH] = useState(false);//khách hàng
    const [checkAccountTNL, setCheckAccountTNL] = useState(false);//Tổ nhận lệnh
    const [checkAccountDDTM, setCheckAccountDDTM] = useState(false);//đại diện thương mại

    const [isShow, setIsShow] = useState(false)
    const [sumQutity, setSumQutity] = useState(0)
    const userinfo1 = useRef();
    const [note, setNote] = useState({ note: "" })
    const [noteKH, setNoteKH] = useState({ note: "" })

    const checAccount = async () => {
        const userinfor = await getUserInfo()
        userinfo1.current = userinfor
        //check account 
        // userinfor.userType == TRAM && userinfor.userRole == DDT ? setCheckAccountDDT(true) : null
        // userinfor.userType == "Factory" || userinfor.userType == "Tram" ||
        // userinfor.userType == "Factory" && userinfor.userRole == "Owner" 
        if (userinfor.userType == AGENCY || userinfor.userType == GENERAL || userinfor.userType == KHACH_HANG) {
            setCheckAccountKH(true)
        } else if (userinfor.userType == TRAM && userinfor.userRole == DDT) {
            setCheckAccountDDT(true)
        } else if (userinfor.userType == TONG_CONG_TY && userinfor.userRole == TNL) {
            setCheckAccountTNL(true)
        } else if (userinfor.userType == TONG_CONG_TY && userinfor.userRole == DDTM) {
            setCheckAccountDDTM(true)
        }
    }
    //lấy trạng thái đơn hàng
    const getStatusOrder = async () => {
        const status = ''
        try {
            const response = await apiGetStatusOrder(orderItem.id)
            if (response.success) {
                return response.data.status
            }
        } catch (err) {
            console.log("LỖI FETCH API 2222,", err);
        }
        return status
    }

    //lấy danh sách thương hiệu, Loại bình, màu sắc, loại van
    const [temp, setTemp] = useState({
        manufacture: [],
        categoryCylinder: [],
        colorGas: [],
        valve: [],
    });
    const getList = async () => {
        const arraytManufacture = await getListManufacture()
        const arrayCategoryCylinder = await getListCylinder()
        const arrayColorGas = await getListColorGas()
        const arrayValue = await getListValve()
        setTemp({
            ...temp, manufacture: arraytManufacture.data,
            categoryCylinder: arrayCategoryCylinder.data,
            colorGas: arrayColorGas.data,
            valve: arrayValue.data
        })
    }

    const getOrder = async () => {
        try {
            const response = await getOrderDetail(orderItem.id);

            let output = response.data.map(item => ({
                valve: item.valve.id,
                categoryCylinder: item.categoryCylinder.id,
                colorGas: item.colorGas.id,
                manufacture: item.manufacture.id,
                price: item.price,
                quantity: item.quantity,
                id: item.id,
            }))
            // console.log(response.data[0].orderGSId.customers)
            setOrder({ ...order, orderDetail: output })
            setNoteKH({ note: response.data[0].orderGSId.note });
            setSumQutity(output.reduce((acc, { quantity }) => acc + quantity, 0))
        } catch (err) {
            console.log("LỖI FETCH API Order detail,", err);
        }
    }

    const setAddOder = (index, item) => {
        // if (checkAccountDDT) {
        const tempAddOrder = {
            manufacture: item.manufacture,
            valve: item.valve,
            colorGas: item.colorGas,
            categoryCylinder: item.categoryCylinder,
            quantity: 0,
            id: "",
            price: item.price
        }
        const arrayOder = [...order.orderDetail]
        arrayOder.splice(index + 1, 0, tempAddOrder)
        setOrder({ ...order, orderDetail: arrayOder })
        // } else {
        //     const tempAddOrder = {
        //         manufacture: item.manufacture,
        //         valve: item.valve,
        //         colorGas: item.colorGas,
        //         categoryCylinder: item.categoryCylinder,
        //         quantity: 0,
        //         id: "",
        //         price: item.price
        //     }
        //     //danh sach don hang
        //     const arrayOder = [...order.orderDetail]
        //     // arrayOder.push(tempAddOrder)
        //     arrayOder.splice(index + 1, 0, tempAddOrder)
        //     setOrder({ ...order, orderDetail: arrayOder })
        // }
    }

    const setDelOder = (item, index) => {
        //xóa sản phẩm theo id
        order.orderDetail[index].id != "" ? delOrderDetail(order.orderDetail[index].id) : null
        //danh sach don hang
        const arrayOder = [...order.orderDetail]
        arrayOder.splice(index, 1)
        setOrder({ ...order, orderDetail: arrayOder })
        // console.log(arrayOder)
        Toast.show({
            text1: translate('DELETE') + " " + translate('SUCCESS'),
        })
    }

    const setDelOderDDT = (item, index) => {
        const arrayOder = [...order.orderDetail]
        arrayOder.splice(index, 1)
        setOrder({ ...order, orderDetail: arrayOder })
    }

    //kiểm tra trùng sản phẩm
    const hasAllUniqueChars = (s) => {
        for (let c = 0; c < s.length; c++) {
            for (let d = c + 1; d < s.length; d++) {
                if ((s[c].manufacture === s[d].manufacture) &&
                    (s[c].categoryCylinder === s[d].categoryCylinder) &&
                    (s[c].colorGas === s[d].colorGas) &&
                    (s[c].valve === s[d].valve)) {
                    return false;
                }
            }
        }
        return true;
    }

    //tính tổng tiền
    const sum = (arr) => {
        var money = 0
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].price != null) {
                    money += arr[i].price * arr[i].quantity
                }
            }
        }
        return money
    }

    //lấy đơn giá 
    const getListPrice = async () => {

        const response = await getOrderDetail(orderItem.id);
        // console.log(response.data[0].orderGSId.customers)

        // const userinfo = await getUserInfo()
        let date = orderItem.delivery[0].deliveryDate
        //lấy id theo id khách hàng hoặc id của khách hàng mà tổ nhận lệnh chọn
        let temID = response.data[0].orderGSId.customers
        // userinfo.userType == "Tong_cong_ty" && userinfo.userRole == "To_nhan_lenh" ||
        //     userinfo.userType == "Tong_cong_ty" && userinfo.userRole == "phongKD" ?
        //     temID = orderItem.customers.id : temID = userinfo.id

        const responsePrice = await getPrice(date, temID, orderItem.orderType === "KHONG" ? "BINH" : "VO")
        if (responsePrice.success) {
            // console.log(responsePrice.data)
            let arrTemp = order.orderDetail
            for (let i = 0; i < arrTemp.length; i++) {
                // response.data.map(q => {
                //     const obj = q.priceDetail.find(e => e.manufacture === arrTemp[i].manufacture &&
                //         e.categoryCylinder === arrTemp[i].categoryCylinder);
                //     if (obj !== undefined) {
                //         arrTemp[i].price = obj.price;
                //     }
                //     else {
                //         arrTemp[i].price = null
                //     }
                // })
                for (let j = 0; j < responsePrice.data.length; j++) {
                    const obj = responsePrice.data[j].priceDetail.find(e => e.manufacture === arrTemp[i].manufacture &&
                        e.categoryCylinder === arrTemp[i].categoryCylinder);
                    if (obj !== undefined) {
                        arrTemp[i].price = obj.price;
                        break;
                    } else {
                        arrTemp[i].price = null
                    }
                }
            }

            setOrder({ ...order, orderDetail: arrTemp })
            // console.log(order.orderDetail)
        }
        //xử lý giao diện
        // setOrderDetail2(arrTemp)
    }
    //formmat date
    const formatDate = (date) => {
        const newDate = date.split('-')
        if (newDate.length > 1) {
            const text = newDate[2] + '/' + newDate[1] + '/' + newDate[0]
            return text
        } else {
            return date
        }
    }

    //formatPrice
    const formatPrice = (price) => {
        const text = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " VNĐ";
        return text
    }

    const update_Order_DDT = async () => {
        if (note.note != "") {
            setIsShow(true)
            let tepm1 = false
            let tepm2 = false
            //cập nhật lại đơn hàng
            order.orderDetail.map(async (value, index) => {
                //gọi api khi sửa sản phẩm
                if (value.id == "") {
                    let body = {
                        orderGSId: orderItem.id,
                        manufacture: value.manufacture,
                        categoryCylinder: value.categoryCylinder,
                        colorGas: value.colorGas,
                        valve: value.valve,
                        quantity: value.quantity,
                        price: value.price,
                    };
                    var response1 = await updateOrderNew(body)
                    if (response1.success) {
                        tepm1 = true
                    }
                } else {
                    //gọi api khi thêm sản phẩm mới
                    let body2 = {
                        manufacture: value.manufacture,
                        categoryCylinder: value.categoryCylinder,
                        colorGas: value.colorGas,
                        valve: value.valve,
                        quantity: value.quantity,
                        price: value.price,
                    };
                    // console.log("##########", order.orderDetail)
                    var response2 = await updateOrder(value.id, orderItem.id, body2)
                    if (response2.success) {
                        tepm2 = true
                    }
                }
            })
            //điều độ trạm gửi duyệt lại khách hàng
            const idOrder = orderItem.id
            const responseGui_Duyet = await DieuDoTram_Gui_Duyet(idOrder, note)
            console.log("@@@@@", responseGui_Duyet)
            if (responseGui_Duyet.success) {
                console.log("########", responseGui_Duyet)
                Toast.show({
                    text1: 'thành công',
                })
                //thông báo
                const body2 = {
                    title: "Bạn có đơn hàng cần duyệt lại",
                    data: `Đơn hàng số : ${responseGui_Duyet.data.orderCode}`,
                    device: `${orderItem.customers.playerID},${orderItem.customers.playerIDWeb ?? ''}`,
                    appname: "Gassouth",
                    iddata: responseGui_Duyet.data.id
                }
                const response2 = await sendNotification(body2)
                Actions['OrderManagement']({})
            } else {
                setIsShow(false)
                Toast.show({
                    text1: 'Thất bại',
                })
            }
        } else {
            Toast.show({
                text1: 'Nhập ghi chú',
            })
        }
    }

    const update_Order = async () => {

        setIsShow(true)
        //khách hàng sửa ghi chú
        checkAccountKH ? updateNote(orderItem.id, noteKH) : null
        // const response3 = await updateNote(orderItem.id, noteKH)
        // console(response3)
        let tepm1 = false
        let tepm2 = false
        //cập nhật lại đơn hàng
        order.orderDetail.map(async (value, index) => {
            //gọi api khi sửa sản phẩm
            if (value.id == "") {
                let body = {
                    orderGSId: orderItem.id,
                    manufacture: value.manufacture,
                    categoryCylinder: value.categoryCylinder,
                    colorGas: value.colorGas,
                    valve: value.valve,
                    quantity: value.quantity,
                    price: value.price,
                };
                var response1 = await updateOrderNew(body)
                if (response1.success) {
                    tepm1 = true
                }
            } else {
                //gọi api khi thêm sản phẩm mới
                let body2 = {
                    manufacture: value.manufacture,
                    categoryCylinder: value.categoryCylinder,
                    colorGas: value.colorGas,
                    valve: value.valve,
                    quantity: value.quantity,
                    price: value.price,
                };
                // console.log("##########", order.orderDetail)
                var response2 = await updateOrder(value.id, orderItem.id, body2)
                if (response2.success) {
                    tepm2 = true
                }
            }
            if (tepm1 || tepm2) {
                Actions['OrderDetailNewVersion']({ orderItem })
            }
        })
    }

    useEffect(() => {
        checAccount()
        getOrder()
        getList()
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.Nav_container}>
                <TouchableOpacity
                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                    onPress={() => {
                        // console.log(order.orderDetail)
                        Actions['OrderDetailNewVersion']({ orderItem })
                    }}
                >
                    <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
                </TouchableOpacity>
                <Text style={styles.Nav_title}>{translate('ORDER_DETAILS')}</Text>
                <View style={{ width: 30 }}></View>
            </View>
            <ScrollView>
                <View style={{
                    backgroundColor: '#ebebeb',
                    borderRadius: 10,
                    margin: 10,
                }}>
                    <View style={styles.itemOrder}>
                        <View style={styles.itemOrderLeft}>
                            <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
                                {orderItem.orderCode}
                            </Text>
                            <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
                                {orderItem.customers.name}
                            </Text>
                            {/* CreateTime */}
                            <View style={[styles.flexRow, { marginBottom: 5 }]}>
                                <AntDesign
                                    name="calendar"
                                    size={15}
                                    style={{ marginRight: 5, color: "#000000" }}
                                />
                                <Text style={[styles.itemOrderLeftText]}>
                                    {translate('Creation_date')}: {moment(orderItem.createdAt).format('hh:mm a , DD/MM/YYYY')}
                                </Text>
                            </View>
                            {/* Place */}
                            <View style={styles.flexRow}>
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={15}
                                    style={{ marginRight: 5, color: "#000000" }}
                                />
                                <Text style={styles.itemOrderLeftText}>{orderItem.customers.address}</Text>
                            </View>
                            {userinfo1.current ? userinfo1.current.userType == "Factory" || userinfo1.current.userType == "Tram" ? null :
                                <Text style={styles.Sum}>{translate('TOTAL2')}: {order.orderDetail ? formatPrice(sum(order.orderDetail)) : null} </Text> : null}
                        </View>
                        <View style={styles.itemOrderRight}>
                            {/* <Text style={{ color: `${ORDER_STATUS.get(orderItem.status).color}`, fontWeight: 'bold' }}>
                                {ORDER_STATUS.get(orderItem.status).name}
                            </Text> */}
                            <Text style={[styles.itemOrderRightText, { marginTop: 5 }]}>
                                {translate('Delivery_date')}: {'\n'}
                                {orderItem.delivery.map(({ deliveryDate }) => `${formatDate(deliveryDate)}\n`
                                )}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.listGas}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>{translate('ORDER_INFORMATION')}:</Text>
                            {checkAccountDDT || checkAccountTNL ?
                                <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>
                                    {translate('TOTAL')} {translate('Amount')}:{' '}
                                    {order.orderDetail ? sumQutity : null}
                                </Text> :
                                <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>
                                    {translate('TOTAL')} {translate('Amount')}:{' '}
                                    {order.orderDetail ? order.orderDetail.reduce((acc, { quantity }) => acc + quantity, 0) : null}
                                </Text>}
                        </View>
                        {order.orderDetail ? order.orderDetail.map((item, index) =>
                            <View style={{ marginBottom: 15, paddingHorizontal: 5 }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flex: 0.6 }}>
                                        {checkAccountDDT || checkAccountTNL ? null :
                                            <TouchableOpacity style={{ padding: 5, alignItems: 'center' }}
                                                onPress={() => { setAddOder(index, item) }}>
                                                <FontAwesome5
                                                    name="plus-circle"
                                                    size={20}
                                                    style={styles.txtGray}
                                                />
                                            </TouchableOpacity>}
                                    </View>
                                    {!checkAccountDDT ?
                                        <View style={styles.sPicker1}>
                                            <Picker
                                                selectedValue={order.orderDetail[index].manufacture}
                                                enabled={checkAccountDDT || checkAccountTNL ? false : true}
                                                style={{ height: "100%", }}
                                                onValueChange={(e) => {
                                                    let arrtemp = [...order.orderDetail]
                                                    arrtemp[index].manufacture = e
                                                    setOrder({ ...order, orderDetail: arrtemp })
                                                    getListPrice()
                                                }}>
                                                {temp.manufacture.map((item, index) => {
                                                    return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                                })}
                                            </Picker>
                                        </View> ://điều độ trạm  ẩn thương hiệu 
                                        (checkAccountDDT && item.id != "" || checkAccountTNL && item.id != "" ?
                                            <View style={styles.sPicker1}>
                                                <Picker
                                                    selectedValue={order.orderDetail[index].manufacture}
                                                    enabled={checkAccountDDT || checkAccountTNL ? false : true}
                                                    style={{ height: "100%" }}
                                                    onValueChange={(e) => {
                                                        let arrtemp = [...order.orderDetail]
                                                        arrtemp[index].manufacture = e
                                                        setOrder({ ...order, orderDetail: arrtemp })
                                                        getListPrice()
                                                    }}>
                                                    {temp.manufacture.map((item, index) => {
                                                        return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                                    })}
                                                </Picker>
                                            </View> : null)}
                                    {!checkAccountDDT ?
                                        <View style={styles.sPicker2}>
                                            <Picker
                                                selectedValue={order.orderDetail[index].categoryCylinder}
                                                enabled={checkAccountDDT || checkAccountTNL ? false : true}
                                                style={{ height: "100%", }}
                                                onValueChange={(e) => {
                                                    let arrtemp = [...order.orderDetail]
                                                    arrtemp[index].categoryCylinder = e
                                                    setOrder({ ...order, orderDetail: arrtemp })
                                                    getListPrice()
                                                }}>
                                                {temp.categoryCylinder.map((item, index) => {
                                                    return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                                })}
                                            </Picker>
                                        </View> ://điều độ trạm ẩn loại bình
                                        (checkAccountDDT && item.id != "" || checkAccountTNL && item.id != "" ? <View style={styles.sPicker2}>
                                            <Picker
                                                selectedValue={order.orderDetail[index].categoryCylinder}
                                                enabled={checkAccountDDT || checkAccountTNL ? false : true}
                                                style={{ height: "100%", }}
                                                onValueChange={(e) => {
                                                    let arrtemp = [...order.orderDetail]
                                                    arrtemp[index].categoryCylinder = e
                                                    setOrder({ ...order, orderDetail: arrtemp })
                                                    getListPrice()
                                                }}>
                                                {temp.categoryCylinder.map((item, index) => {
                                                    return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                                })}
                                            </Picker>
                                        </View> : null)}
                                    <View style={{ flex: 1 }}>
                                        {order.orderDetail.length > 1 ?
                                            (checkAccountDDT || checkAccountTNL ? null :
                                                <TouchableOpacity style={{ padding: 5, alignItems: 'center' }}
                                                    onPress={async () => {
                                                        const status = await getStatusOrder()
                                                        if (status !== orderItem.status) {
                                                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                            Actions['OrderManagement']({})
                                                        } else {
                                                            setDelOder(item, index)
                                                        }
                                                    }}>
                                                    <FontAwesome5
                                                        name="minus-circle"
                                                        size={20}
                                                        style={styles.txtGray}
                                                    />
                                                </TouchableOpacity>
                                            )
                                            : null}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <View style={{ flex: 0.6 }}>
                                        {checkAccountDDT || checkAccountTNL ?
                                            (item.id != "" ?
                                                <TouchableOpacity style={{ padding: 5, alignItems: 'center' }}
                                                    onPress={() => {
                                                        //điều độ trạm thêm 
                                                        setAddOder(index, item)
                                                    }}>
                                                    <FontAwesome5
                                                        name="plus-circle"
                                                        size={20}
                                                        style={styles.txtGray}
                                                    />
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ padding: 5, alignItems: 'center' }}
                                                    onPress={() => {
                                                        //điều độ trạm xóa 
                                                        setDelOderDDT(item, index)
                                                    }}>
                                                    <FontAwesome5
                                                        name="minus-circle"
                                                        size={20}
                                                        style={styles.txtGray}
                                                    />
                                                </TouchableOpacity>) : null}
                                    </View>
                                    <View style={styles.sPicker1}>
                                        <Picker
                                            selectedValue={order.orderDetail[index].colorGas}
                                            style={{ height: "100%", }}
                                            // enabled={checkAccountTNL ? false : true}
                                            onValueChange={(e) => {
                                                let arrtemp = [...order.orderDetail]
                                                arrtemp[index].colorGas = e
                                                setOrder({ ...order, orderDetail: arrtemp })
                                            }}>
                                            {temp.colorGas.map((item, index) => {
                                                return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                            })}
                                        </Picker>
                                    </View>
                                    <View style={styles.sPicker2}>
                                        <Picker
                                            selectedValue={order.orderDetail[index].valve}
                                            // enabled={checkAccountTNL ? false : true}
                                            style={{ height: "100%", }}
                                            onValueChange={(e) => {
                                                let arrtemp = [...order.orderDetail]
                                                arrtemp[index].valve = e
                                                setOrder({ ...order, orderDetail: arrtemp })
                                            }}>
                                            {temp.valve.map((item, index) => {
                                                return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                            })}
                                        </Picker>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={styles.inpuSL}
                                            // editable={checkAccountDDT ? false : true}
                                            keyboardType="numeric"
                                            placeholder={translate('Amount')}
                                            value={String(order.orderDetail[index].quantity) || "0"}
                                            // defaultValue={order.orderDetail[index].quantity}
                                            onChangeText={(e) => {
                                                let arrtemp = [...order.orderDetail]
                                                const temp = e || 0
                                                arrtemp[index].quantity = parseInt(temp)
                                                setOrder({ ...order, orderDetail: arrtemp })
                                            }} />
                                    </View>
                                </View>
                                {userinfo1.current ? userinfo1.current.userType == "Factory" || userinfo1.current.userType == "Tram" ? null :
                                    <View style={{
                                        marginTop: 10,
                                        alignItems: 'center',
                                        marginHorizontal: 5,
                                        justifyContent: 'center'
                                    }}>

                                        <Text>{translate('UNIT_PRICE')} :  {item.price ? formatPrice(item.price) :
                                            <Text style={{ color: COLOR.ORANGE }}>{translate('EMPTY_UNIT_PRICE')}</Text>}</Text>
                                    </View> : null}
                            </View>
                        ) : <View style={{ marginBottom: 10 }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>}
                    </View>
                </View>
                {checkAccountDDT || checkAccountTNL ?//ghi chú cho điều độ trạm, tổ nhận lệnh , đại diện thương mại
                    <View style={{ marginHorizontal: 10, marginVertical: 10, }}>
                        <TextInput
                            placeholder={translate('IMPORT_NOTES')}
                            style={styles.inputNote}
                            multiline={true}
                            onChangeText={(e) => { setNote({ note: e }) }} />
                    </View> : null}
                {checkAccountKH ?//ghi chú cho khách hàng
                    <View style={{ marginHorizontal: 10, marginBottom: 10, }}>
                        <Text style={[styles.itemIdOrderText, { marginLeft: 5, marginBottom: 5 }]}>
                            {translate('NOTE')}:
                        </Text>
                        <TextInput
                            placeholder={translate('IMPORT_NOTES')}
                            value={noteKH.note}
                            style={styles.inputNote}
                            multiline={true}
                            onChangeText={(e) => { setNoteKH({ note: e }) }} />
                    </View> : null}
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: COLOR.RED }]}
                    onPress={() => {
                        Actions['OrderDetailNewVersion']({ orderItem })
                    }}>
                    <Text style={styles.btnText}>{translate('CANCEL')}</Text>
                </TouchableOpacity>
                {!isShow ? <TouchableOpacity style={[styles.btn,
                { backgroundColor: checkAccountDDT || checkAccountTNL ? COLOR.ORANGE : COLOR.GREEN_MAIN, }]}
                    onPress={async () => {
                        const status = await getStatusOrder()
                        if (status !== orderItem.status) {
                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                            Actions['OrderManagement']({})
                        } else {
                            if (hasAllUniqueChars(order.orderDetail) == false) {//kiễm tra trùng sản phẩm
                                Toast.show({
                                    text1: translate('DUPLICATE_PRODUCT'),
                                })
                            } else {
                                const checkPrice = order.orderDetail.some(el => el.price === null)
                                const checkSumQuatity = order.orderDetail.reduce((acc, { quantity }) => acc + quantity, 0)
                                if (checkPrice != true) {//kiễm tra khi đơn giá rỗng
                                    if (checkAccountDDT) {//điều độ trạm
                                        if (sumQutity == checkSumQuatity) {//kiểm tra khi tổng số lượng sản phẩm = với số lượng tổng ban đầu
                                            order.orderDetail.some(element => element.quantity <= 0) ?
                                                Toast.show({
                                                    text1: translate('ENTER_THE_AMOUNT'),
                                                }) : update_Order_DDT()
                                        } else {
                                            Toast.show({
                                                text1: `tổng số lượng phải bằng : ${sumQutity}`,
                                            })
                                        }
                                    } else if (checkAccountTNL) {//
                                        if (sumQutity >= checkSumQuatity) {//kiểm tra khi tổng số lượng sản phẩm  nhỏ hơn hoặc bằng với số lượng tổng ban đầu
                                            order.orderDetail.some(element => element.quantity <= 0) ?
                                                Toast.show({
                                                    text1: translate('ENTER_THE_AMOUNT'),
                                                }) : update_Order_DDT()
                                        } else {
                                            Toast.show({
                                                text1: `tổng số lượng nhỏ hơn hoặc bằng : ${sumQutity}`,
                                            })
                                        }
                                    } else {
                                        order.orderDetail.some(element => element.quantity <= 0) ?
                                            Toast.show({
                                                text1: translate('ENTER_THE_AMOUNT'),
                                            }) : update_Order()
                                    }

                                } else {
                                    Toast.show({
                                        text1: translate('EMPTY_UNIT_PRICE'),
                                    })
                                }
                            }
                        }
                    }}>
                    <Text style={styles.btnText}>{checkAccountDDT || checkAccountTNL ? 'Gửi KH xác nhận' : translate('UPDATE')}</Text>
                </TouchableOpacity> :
                    <View style={{ paddingVertical: 10, flex: 1 }}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>}
            </View>
            <Toast
                backgroundColor="#fffff"
                autoHide={true}
                visibilityTime={visibilityTime}
                ref={(ref) => {
                    Toast.setRef(ref);
                }}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Nav_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#009347',
    },
    Nav_title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 10
    },
    btnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLOR.WHITE
    },
    itemOrder: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    itemOrderLeft: {
        flex: 0.7,
    },
    itemIdOrderText: {
        fontWeight: 'bold',
        color: '#3d3d3d',
    },
    itemOrderLeftText: {},
    itemOrderRightText: {},
    itemOrderRight: {
        flex: 0.3,
        marginLeft: '10%',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtGray: {
        color: COLOR.GRAY,
    },
    listGas: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#bdbfbd',
        margin: 10,
        color: '#000000',
        marginBottom: 20,
        paddingBottom: 10
    }, sPicker1: {
        height: 40,
        borderColor: COLOR.GRAY,
        borderWidth: 1, borderRadius: 5,
        flex: 2
    }, sPicker2: {
        height: 40,
        borderColor: COLOR.GRAY,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 5,
        flex: 2
    },
    inpuSL: {
        borderRadius: 5,
        borderColor: COLOR.GRAY,
        borderWidth: 1,
        height: 40,
        // marginRight: 5,
        fontSize: 12,
        textAlign: 'center'
    },
    Sum: {
        color: COLOR.BLACK,
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputNote: {
        height: 160,
        borderWidth: 1,
        borderColor: COLOR.GRAY,
        textAlignVertical: 'top',
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 10,
    },
    itemIdOrderText: {
        fontWeight: 'bold',
        color: '#3d3d3d',
    },
});

export default UpdateOrderDetailScreen;