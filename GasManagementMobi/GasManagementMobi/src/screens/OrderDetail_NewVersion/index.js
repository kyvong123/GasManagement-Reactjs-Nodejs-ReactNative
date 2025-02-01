import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { KH_XacNhanDon, DieuDoTramXN, DieuDoTramXN_DHHT, getListNoteOrder, getOrderDetail, getPlayid, newOrderConfirmation, rejectOrder, sendNotification, customersRejectOrder, apiGetStatusOrder } from '../../api/orders_new';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../constants';
import { ORDER_STATUS, ORDER_STATUS_CUSTOMERS, ORDER_STATUS_HISTORY, ORDER_STATUS_TRAM, USER_ROLE } from '../Order/OrderManager/utils/statusType';
import CustomNavbar_New from '../../components/CustomNavbar_New';
import { translate } from '../../utils/changeLanguage';
import { getUserInfo } from '../../helper/auth';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-toast-message';
import { useTailwind } from 'tailwind-rn';
import { getDetailHistoryOrderItem, getHistoryOrders } from '../../api/orders_new';
import DeliveryHistoryOrderItem from '../Delivery/HistoryDelivery/DeliveryHistoryOrderItem';
import { SHIPPING_TYPE } from '../../constants';
import { AGENCY, DDT, DDTM, FACTORY, GENERAL, GIAM_DOC, KHACH_HANG, KT, KTVB, KT_TRAM, OWNER, PGD, SALESMANAGER, TNL, TONG_CONG_TY, TRAM, TRUONG_TRAM } from '../../types';

const OrderDetail_NewVersion = ({ orderItem }) => {

    const tw = useTailwind();
    const [deliveryHistorys, setDeliveryHistorys] = useState();

    const [orderDetail, setOrderDetail] = useState();
    const [isDropdown, setDropdown] = useState(true);
    const [isDropdownListNote, setDropdownListNote] = useState(false);
    const [isShow_TNL, setIsShow_TNL] = useState({ TCD: false, XND: false });
    const [isShow_KT, setIsShow_KT] = useState({ TCD: false, XND: false });
    const [isShow_PGD, setIsShow_PGD] = useState({ TCD: false, GDL: false });
    const [isShow_TPKD, setIsShow_TPKD] = useState({ TCD: false, GDL: false });
    const [isShow_DDT, setIsShow_DDT] = useState({ XNHT: false, XND: false });
    const [totalGasCylinderNotDelivery, setTotalGasCylinderNotDelivery] = useState(null);

    const [checkAccountTNL, setCheckAccountTNL] = useState(false);//kiem tra tai khoản tổ nhận lệnh
    const [checkAccountKH, setCheckAccountKH] = useState(false);//kiem tra tai khoản khách hàng
    const [checkAccountDDTM, setCheckAccountDDTM] = useState(false);//kiem tra tai khoản nhan vien kinh doanh
    const [checkAccountKT, setCheckAccountKT] = useState(false);//kiem tra tai khoản kế toán
    const [checkAccountTPKD, setCheckAccountTPKD] = useState(false);//kiem tra tai khoản trưởng phòng kinh doanh
    const [checkAccountPGDKD, setCheckAccountPGDKD] = useState(false);//kiem tra tai khoản phó giám đốc kinh doanh
    const [checkAccountTruong_tram, setCheckAccountTruong_tram] = useState(false);//kiem tra tai khoản trưởng trạm
    const [checkAccountKeToanTram, setCheckAccountKeToanTram] = useState(false);//kiem tra tai khoản kế toán trạm
    const [checkAccountKTVB, setCheckAccountKTVB] = useState(false);//kiem tra tai khoản kế toán vỏ bình
    const [checkAccountDDT, setCheckAccountDDT] = useState(false);//kiem tra tai khoản điều độ trạm
    const [checkAccountGD, setCheckAccountGD] = useState(false);//kiem tra tai khoản giám đốc

    useEffect(() => {
        if (orderDetail) {
            getHistoryOrders(orderItem.id)
                .then(data => {
                    if (data.success && data.data.length > 0) {
                        setDeliveryHistorys(data.data);
                    } else {
                        setDeliveryHistorys(null);
                    }
                    return getTotalGasCylinderNotDelivery(data.data);
                })
                .then(quantity => {
                    setTotalGasCylinderNotDelivery(quantity);
                })
                .catch(err => {
                    console.log("LỖI ", err)
                })
        }
    }, [orderDetail]);

    //✅
    const getTotalGasCylinder = () => orderDetail ? orderDetail.reduce((acc, { quantity }) => acc + quantity, 0) : null;

    const getTotalGasCylinderNotDelivery = async data => {
        const arrDetailHistoryOrderItem = await Promise.all(data.map(item => getDetailHistoryOrderItem(item.id, item.shippingType)))
        console.log("ooopppp++++>", arrDetailHistoryOrderItem)
        const totalGasCylinderDeliveryed = arrDetailHistoryOrderItem.filter(item => item.shippingType === SHIPPING_TYPE.GIAO_HANG || item.shippingType === SHIPPING_TYPE.GIAO_VO).reduce((sum, item) => sum + item.data.reduce((sum, item) => sum + item.count, 0), 0)
        return getTotalGasCylinder() - (totalGasCylinderDeliveryed || 0);
    }

    const userinfo1 = useRef();
    const visibilityTime = 2000;

    //note khi từ chối hoặc không duyệt đơn
    const [note, setNote] = useState({ note: "" })
    const [noteDDT, setNoteDDT] = useState({ note: "Điều độ trạm xác nhận đơn hoàn thành" })
    const [noteDDT_XNDH, setNoteDDT_XNDH] = useState({ note: "Điều độ trạm xác nhận đơn hàng" })
    const [listNote, setListNote] = useState([])

    //check account
    const checAccountCreateOrder = async () => {
        const userinfor = await getUserInfo()
        userinfo1.current = userinfor

        const userRole = userinfor.userRole
        const userType = userinfor.userType
        //check account 
        if (userType == TONG_CONG_TY && userRole == TNL) {
            setCheckAccountTNL(true)
        } else if (userType == TONG_CONG_TY && userRole == DDTM) {
            setCheckAccountDDTM(true)
        } else if (userType == TONG_CONG_TY && userRole == KT) {
            setCheckAccountKT(true)
        } else if (userType == TONG_CONG_TY && userRole == SALESMANAGER) {
            setCheckAccountTPKD(true)
        } else if (userType == TONG_CONG_TY && userRole == PGD) {
            setCheckAccountPGDKD(true)
        } else if (userType == TRAM && userRole == TRUONG_TRAM || userType == FACTORY && userRole == OWNER) {
            setCheckAccountTruong_tram(true)
        } else if (userType == TRAM && userRole == KT_TRAM) {
            setCheckAccountKeToanTram(true)
        } else if (userType == TONG_CONG_TY && userRole == KTVB) {
            setCheckAccountKTVB(true)
        } else if (userType == TRAM && userRole == DDT) {
            setCheckAccountDDT(true)
        } else if (userType == AGENCY || userType == GENERAL || userType == KHACH_HANG) {
            setCheckAccountKH(true)
        } else if (userType == TONG_CONG_TY && userRole == GIAM_DOC) {
            setCheckAccountGD(true)
        }


    }

    const getOrder = async () => {
        try {
            const response = await getOrderDetail(orderItem.id);
            setOrderDetail(response.data);
            // console.log(response.data)
        } catch (err) {
            console.log("LỖI FETCH API Order detail,", err);
        }
    }

    //lấy danh sach ghi chu cua don hang
    const getListNote = async () => {
        try {
            const response = await getListNoteOrder(orderItem.id)
            if (response.success) {
                if (userinfo1.current.userType == AGENCY || userinfo1.current.userType == GENERAL || userinfo1.current.userType == KHACH_HANG) {
                    setListNote(response.data.filter(e => e.updatedBy.userType === TONG_CONG_TY && e.updatedBy.userRole === TNL || e.updatedBy.userType === TRAM && e.updatedBy.userRole === DDT))
                    setDropdownListNote(true)
                } else {
                    setListNote(response.data)
                }
            }
        } catch (err) {
            console.log("LỖI FETCH API 111 ,", err);
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
    //gửi thông báo
    const checkApiSuccess = async (response, acctions, titles, userType, userRole) => {
        if (response.success) {
            Toast.show({
                text1: "Thành công",
            })
            let tempDevice = null
            if (userinfo1.current.userType === TONG_CONG_TY && userinfo1.current.userRole === KTVB) {
                if (response.data.status === "DA_DUYET") {
                    temp // tempDevice = orderItem.customers.playerID
                    const playid = await getPlayid(userType, userRole)
                    // playid.success ? tempDevice = playid.data[0].playerID : null
                    if (playid.success) {
                        //gửi về điều độ trạm khi kế toán duyệt
                        const getPlayerId = playid.data.filter(e => e.isChildOf === orderItem.customers.isChildOf)
                        tempDevice = getPlayerId
                        //thông báo
                        for (let i = 0; i < tempDevice.length; i++) {
                            const body2 = {
                                title: titles,
                                data: `Đơn hàng số : ${response.data.orderCode}`,
                                device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                                appname: "Gassouth",
                                iddata: response.data.id
                            }
                            const response2 = await sendNotification(body2)
                        }
                    }
                } else {
                    const playid = await getPlayid(userType, userRole)
                    // playid.success ? tempDevice = playid.data[0].playerID : null
                    if (playid.success) {
                        //(.filter(e => e.isChildOf === userinfo1.current.isChildOf))
                        const getPlayerId = playid.data
                        tempDevice = getPlayerId
                        //thông báo
                        for (let i = 0; i < tempDevice.length; i++) {
                            const body2 = {
                                title: titles,
                                data: `Đơn hàng số : ${response.data.orderCode}`,
                                device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                                appname: "Gassouth",
                                iddata: response.data.id
                            }
                            const response2 = await sendNotification(body2)
                        }
                    }
                }
            } else if (userinfo1.current.userType === TONG_CONG_TY && userinfo1.current.userRole === TNL) {
                if (response.data.status === "KHONG_DUYET") {
                    // tempDevice = orderItem.customers.playerID
                    tempDevice = orderItem.customers
                    //thông báo
                    const body2 = {
                        title: titles,
                        data: `Đơn hàng số : ${response.data.orderCode}`,
                        device: `${tempDevice.playerID},${tempDevice.playerIDWeb ?? ''}`,
                        appname: "Gassouth",
                        iddata: response.data.id
                    }
                    const response2 = await sendNotification(body2)
                } else {
                    const playid = await getPlayid(userType, userRole)
                    // playid.success ? tempDevice = playid.data[0].playerID : null
                    if (playid.success) {
                        //.filter(e => e.isChildOf === userinfo1.current.isChildOf)
                        const getPlayerId = playid.data
                        tempDevice = getPlayerId
                        //thông báo
                        for (let i = 0; i < tempDevice.length; i++) {
                            const body2 = {
                                title: titles,
                                data: `Đơn hàng số : ${response.data.orderCode}`,
                                device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                                appname: "Gassouth",
                                iddata: response.data.id
                            }
                            const response2 = await sendNotification(body2)
                        }
                    }
                }
            } else if (userinfo1.current.userType === TONG_CONG_TY && userinfo1.current.userRole === KT) {
                if (response.data.status === "DA_DUYET") {
                    // tempDevice = orderItem.customers.playerID
                    const playid = await getPlayid(userType, userRole)
                    // playid.success ? tempDevice = playid.data[0].playerID : null
                    if (playid.success) {
                        //gửi về điều độ trạm khi kế toán duyệt
                        const getPlayerId = playid.data.filter(e => e.isChildOf === orderItem.customers.isChildOf)
                        tempDevice = getPlayerId
                        //thông báo
                        for (let i = 0; i < tempDevice.length; i++) {
                            const body2 = {
                                title: titles,
                                data: `Đơn hàng số : ${response.data.orderCode}`,
                                device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                                appname: "Gassouth",
                                iddata: response.data.id
                            }
                            const response2 = await sendNotification(body2)
                        }
                    }
                } else {
                    const playid = await getPlayid(userType, userRole)
                    // playid.success ? tempDevice = playid.data[0].playerID : null
                    if (playid.success) {
                        //.filter(e => e.isChildOf === userinfo1.current.isChildOf)
                        const getPlayerId = playid.data
                        tempDevice = getPlayerId
                        //thông báo
                        for (let i = 0; i < tempDevice.length; i++) {
                            const body2 = {
                                title: titles,
                                data: `Đơn hàng số : ${response.data.orderCode}`,
                                device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                                appname: "Gassouth",
                                iddata: response.data.id
                            }
                            const response2 = await sendNotification(body2)
                        }
                    }
                }
            } else if (userinfo1.current.userType === TONG_CONG_TY && userinfo1.current.userRole === SALESMANAGER ||
                userinfo1.current.userType === TONG_CONG_TY && userinfo1.current.userRole === PGD) {
                if (response.data.status === "KHONG_DUYET") {
                    tempDevice = orderItem.customers
                    //thông báo
                    const body2 = {
                        title: titles,
                        data: `Đơn hàng số : ${response.data.orderCode}`,
                        device: `${tempDevice.playerID},${tempDevice.playerIDWeb ?? ''}`,
                        appname: "Gassouth",
                        iddata: response.data.id
                    }
                    const response2 = await sendNotification(body2)
                } else {
                    const playid = await getPlayid(userType, userRole)
                    // playid.success ? tempDevice = playid.data[0].playerID : null
                    if (playid.success) {
                        //.filter(e => e.isChildOf === userinfo1.current.isChildOf)
                        const getPlayerId = playid.data
                        tempDevice = getPlayerId
                        //thông báo
                        for (let i = 0; i < tempDevice.length; i++) {
                            const body2 = {
                                title: titles,
                                data: `Đơn hàng số : ${response.data.orderCode}`,
                                device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                                appname: "Gassouth",
                                iddata: response.data.id
                            }
                            const response2 = await sendNotification(body2)
                        }
                    }
                }
            }
            else if (userinfo1.current.userType === TRAM && userinfo1.current.userRole === DDT) {
                tempDevice = orderItem.customers
                //thông báo
                const body2 = {
                    title: titles,
                    data: `Đơn hàng số : ${response.data.orderCode}`,
                    device: `${tempDevice.playerID},${tempDevice.playerIDWeb ?? ''}`,
                    appname: "Gassouth",
                    iddata: response.data.id
                }
                const response2 = await sendNotification(body2)
            }
            else if (userinfo1.current.userType === GENERAL && userinfo1.current.userRole === "SuperAdmin" ||
                userinfo1.current.userType === AGENCY && userinfo1.current.userRole === "SuperAdmin") {
                // const playid = await getPlayid(userType, userRole)

                const playidNoteOrder = await getListNoteOrder(orderItem.id)
                if (playidNoteOrder.success) {
                    const getPlayerId = playidNoteOrder.data.filter(e => e.action === orderItem.status)
                    //thông báo
                    const body2 = {
                        title: titles,
                        data: `Đơn hàng số : ${response.data.orderCode}`,
                        device: `${getPlayerId[0].updatedBy.playerID},${getPlayerId[0].updatedBy.playerIDWeb ?? ''}`,
                        appname: "Gassouth",
                        iddata: response.data.id
                    }
                    const response2 = await sendNotification(body2)
                }
                // if (playid.success) {
                //     //lấy phayerId của điều độ trạm theo khách hàng
                //     const getPlayerId = playid.data.filter(e => e.isChildOf === userinfo1.current.isChildOf)
                //     tempDevice = orderItem.status === "DON_HANG_MOI" || orderItem.status === "TNLGUI_XACNHAN"
                //         ? playid.data : getPlayerId

                //     //thông báo
                //     for (let i = 0; i < tempDevice.length; i++) {
                //         const body2 = {
                //             title: titles,
                //             data: `Đơn hàng số : ${response.data.orderCode}`,
                //             device: `${tempDevice[i].playerID},${tempDevice[i].playerIDWeb ?? ''}`,
                //             appname: "Gassouth",
                //             iddata: response.data.id
                //         }
                //         const response2 = await sendNotification(body2)
                //     }
                // }
            }
            // //thông báo
            // const body2 = {
            //     title: titles,
            //     data: `Đơn hàng số : ${response.data.orderCode}`,
            //     device: tempDevice,
            //     appname: "Gassouth",
            //     iddata: response.data.id
            // }
            // const response2 = await sendNotification(body2)
            Actions[acctions]({})
        } else {
            Toast.show({
                text1: "Thất bại",
            })
            setIsShow_TNL({ TCD: false, XND: false })
            setIsShow_KT({ TCD: false, XND: false });
            setIsShow_PGD({ TCD: false, GDL: false });
            setIsShow_TPKD({ TCD: false, GDL: false });
            setIsShow_DDT({ XND: false, XNHT: false });
        }
    }
    useEffect(() => {
        checAccountCreateOrder()
        getOrder();
        getListNote();
        console.log(orderItem)
    }, []);

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <CustomNavbar_New title={translate('ORDER_DETAILS')} backScreenKey='OrderManagement' />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.itemOrder}>
                        <View style={styles.itemOrderLeft}>
                            <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
                                {orderItem.orderCode}
                            </Text>
                            <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
                                {orderItem.customers.code} - {orderItem.customers.name}
                            </Text>
                            {/* CreateTime */}
                            <View style={[styles.flexRow, { marginBottom: 5 }]}>
                                <AntDesign
                                    name="calendar"
                                    size={15}
                                    style={{ marginRight: 5, color: "#000000" }}
                                />
                                <Text style={[styles.itemOrderLeftText]}>
                                    {translate('Creation_date')}: {moment(orderItem.createdAt).format("DD/MM/YYYY")}
                                </Text>
                            </View>

                            {/* Place */}
                            {/* {orderItem.delivery.map(({ deliveryAddress }) =>
                                <View style={styles.flexRow}>
                                    <FontAwesome5
                                        name="map-marker-alt"
                                        size={15}
                                        style={{ marginRight: 5, color: "#000000" }}
                                    />
                                    <Text style={styles.itemOrderLeftText}>{deliveryAddress}</Text>
                                </View>
                            )} */}
                            <View style={styles.flexRow}>
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={15}
                                    style={{ marginRight: 5, color: "#000000" }}
                                />
                                <Text style={styles.itemOrderLeftText}>{orderItem.delivery.length > 0 ? orderItem.delivery[0].deliveryAddress : ''}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text style={[styles.itemIdOrderText, {}]}>
                                    {translate('NOTE')}:
                                </Text>
                                <Text style={{ color: COLOR.ORANGE }}> {orderDetail ? orderDetail[0].orderGSId.note : null}</Text></View>

                            {userinfo1.current ? userinfo1.current.userType == FACTORY || userinfo1.current.userType == TRAM ? null :
                                <Text style={[styles.itemIdOrderText, { marginTop: 10, fontSize: 16, }]}>
                                    {translate('TOTAL2')}: {orderDetail ? formatPrice(sum(orderDetail)) : null}
                                </Text> : null
                            }
                        </View>
                        <View style={styles.itemOrderRight}>
                            <Text style={{
                                color: `${checkAccountKH ? ORDER_STATUS_CUSTOMERS.get(orderItem.status).color :
                                    checkAccountDDT ? ORDER_STATUS_TRAM.get(orderItem.status).color : ORDER_STATUS.get(orderItem.status).color}`, fontWeight: 'bold'
                            }}>
                                {checkAccountKH ? ORDER_STATUS_CUSTOMERS.get(orderItem.status).name :
                                    checkAccountDDT ? ORDER_STATUS_TRAM.get(orderItem.status).name : ORDER_STATUS.get(orderItem.status).name}
                            </Text>
                            <Text style={[styles.itemOrderRightText, { marginTop: 5 }]}>
                                {translate('Delivery_date')}: {'\n'}
                                {orderItem.delivery.map(({ deliveryDate }) => `${formatDate(deliveryDate)}\n`)}
                            </Text>

                        </View>
                    </View>

                    {isDropdown ?//hiển thị danh sách đơn hàng
                        <>
                            <View style={styles.listGas}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 14, color: '#e80909' }}>{translate('ORDER_INFORMATION')}:</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>
                                        {translate('TOTAL')} {translate('Amount')}: {getTotalGasCylinder()}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10, marginHorizontal: 10 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>Chưa giao: {totalGasCylinderNotDelivery}</Text>
                                </View>

                                {orderDetail ? orderDetail.sort((a, b) => (a.categoryCylinder.name > b.categoryCylinder.name || a.manufacture.name > b.manufacture.name) ? 1 : -1).map((item, index) =>
                                    <View style={{ marginBottom: 10 }}>
                                        <View style={{ marginHorizontal: 10, marginTop: 10, flexDirection: 'row', }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000', flex: 2 }}>
                                                {item.manufacture.name} - {item.categoryCylinder.name}
                                            </Text>
                                            {userinfo1.current ? userinfo1.current.userType == FACTORY || userinfo1.current.userType == TRAM ? null :
                                                <Text style={{ color: COLOR.GRAY, flex: 1.5 }}>
                                                    {translate('UNIT_PRICE')}: {formatPrice(item.price || 0)}
                                                </Text> : null}
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <Text>{translate('COLOR')}: {item.colorGas.name}</Text>
                                            <Text>{translate('VALVE_TYPE')}: {item.valve.name}</Text>
                                            <Text>{translate('Amount')}: {item.quantity}</Text>
                                        </View>
                                    </View>
                                ) : <View style={{ marginBottom: 10 }}>
                                    <ActivityIndicator size="large" color="#00ff00" />
                                </View>}
                            </View>

                            <>
                                {/* Lịch sử đơn hàng */}
                                <View>
                                    <View style={[tw('flex-row ml-5 items-center'), { marginLeft: 10 }]}>
                                        <FontAwesome5
                                            name="truck"
                                            size={15}
                                            style={{ marginRight: 5, color: "#000000" }}
                                        />
                                        <Text style={{ fontWeight: 'bold', marginLeft: 2, color: "#000000" }}>Lịch sử giao nhận</Text>
                                    </View>
                                    {deliveryHistorys != null && deliveryHistorys != undefined ?
                                        <ScrollView
                                        >
                                            {(deliveryHistorys ? deliveryHistorys : []).map(item => <DeliveryHistoryOrderItem {...item} />)}
                                        </ScrollView> :
                                        deliveryHistorys == null ?
                                            <Text style={{ textAlign: 'center', marginVertical: 10 }}>Không có lịch sử giao nhận</Text> : null
                                    }
                                </View>
                            </>
                        </> : null
                    }
                    <TouchableOpacity
                        hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                        style={styles.iconDropdown}
                        onPress={() => setDropdown(!isDropdown)}
                    >
                        <AntDesign
                            name={isDropdown ? 'up' : 'down'}
                            size={15}
                            color='#000'
                        />
                    </TouchableOpacity>
                </View >
                {//check tài khoản hiển thị ghi chú
                    checkAccountKH == true ||
                        checkAccountTNL == true && orderItem.status != "DON_HANG_MOI" ||
                        checkAccountDDTM == true && orderItem.status != "DON_HANG_MOI" ||
                        checkAccountKT == true ||
                        checkAccountTPKD == true ||
                        checkAccountPGDKD == true ||
                        checkAccountGD == true ||
                        checkAccountTruong_tram == true ||
                        checkAccountKeToanTram == true ||
                        checkAccountKTVB == true && orderItem.status != "DON_HANG_MOI" ?
                        <View style={[styles.container, { padding: 10, marginTop: 0, marginHorizontal: 10 }]}>
                            <Text style={styles.titleListNote}> {translate('List_of_notes')}:</Text>
                            {isDropdownListNote ? <>
                                {//danh sách ghi chú
                                    listNote ? listNote.map((item, index) =>
                                        <View style={{
                                            backgroundColor: '#ffffff',
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: '#bdbfbd',
                                            marginVertical: 5,
                                            padding: 10,
                                            color: '#000000'
                                        }}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <View style={{ flex: 1.2 }}>
                                                    <Text style={styles.titleListNote}>{translate('Execution_account')}:</Text>
                                                    <Text style={{}}>{item.updatedBy.email}</Text>
                                                </View>
                                                <View style={{ flex: 0.8, paddingLeft: 5 }}>
                                                    <Text style={styles.titleListNote}>{translate('Role')}:</Text>
                                                    <Text style={{}}>{USER_ROLE.get(item.updatedBy.userRole).name}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                                                <View style={{ flex: 1.2, }}>
                                                    <Text style={styles.titleListNote}>{translate('Act')}:</Text>
                                                    <Text style={{}}>{ORDER_STATUS_HISTORY.get(item.action).name}</Text>
                                                </View>
                                                <View style={{ flex: 0.8, paddingLeft: 5 }}>
                                                    <Text style={styles.titleListNote}>Ngày thực hiện:</Text>
                                                    <Text style={{}}> {moment(item.createdAt).format('hh:mm a , DD/MM/YYYY')}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.titleListNote}>{translate('CONTENT')}:</Text>
                                                    <Text style={{ color: COLOR.ORANGE }}>{item.note}</Text>
                                                </View>
                                            </View>
                                        </View>) : <View style={{ marginBottom: 10 }}>
                                        <ActivityIndicator size="large" color="#00ff00" />
                                    </View>}
                            </> : null}
                            <TouchableOpacity
                                hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                                style={{
                                    alignSelf: 'flex-end',
                                    paddingRight: 5,
                                }}
                                onPress={() => setDropdownListNote(!isDropdownListNote)}
                            >
                                <AntDesign
                                    name={isDropdownListNote ? 'up' : 'down'}
                                    size={15}
                                    color='#000'
                                />
                            </TouchableOpacity>
                        </View> : null}
                {// ghi chú khi từ chối đơn hàng
                    checkAccountTNL == true && orderItem.status === "DON_HANG_MOI" ||
                        // checkAccountTNL == true && orderItem.status === "TU_CHOI_LAN_1" ||
                        // checkAccountTNL == true && orderItem.status === "GUI_DUYET_LAI" && orderItem.status2 === "TU_CHOI_LAN_1" ||
                        checkAccountKT == true && orderItem.status === "TO_NHAN_LENH_DA_DUYET" ||
                        checkAccountKT == true && orderItem.status === "GUI_DUYET_LAI" && orderItem.status2 === "TU_CHOI_LAN_1" ||
                        checkAccountKTVB == true && orderItem.status === "TO_NHAN_LENH_DA_DUYET" ||
                        checkAccountKTVB == true && orderItem.status === "GUI_DUYET_LAI" && orderItem.status2 === "TU_CHOI_LAN_1" ||
                        checkAccountTPKD == true && orderItem.status === "TU_CHOI_LAN_1" ||
                        checkAccountPGDKD == true && orderItem.status === "TU_CHOI_LAN_2" ||
                        checkAccountKH == true && orderItem.status === "DDTRAMGUI_XACNHAN" ||
                        checkAccountKH == true && orderItem.status === "TNLGUI_XACNHAN" ||
                        checkAccountKH == true && orderItem.status === "DON_HANG_MOI" ? (
                        <>
                            <View style={{ marginHorizontal: 10, marginVertical: 20, }}>
                                <TextInput
                                    placeholder={translate('IMPORT_NOTES')}
                                    style={styles.inputNote}
                                    multiline={true}
                                    onChangeText={(e) => { setNote({ note: e }) }} />
                            </View>
                        </>
                    ) : null}
            </ScrollView>
            {//tài khoản tổ nhận lệnh
                checkAccountTNL == true && orderItem.status === "DON_HANG_MOI"
                    //checkAccountTNL == true && orderItem.status === "TU_CHOI_LAN_1"|| 
                    // checkAccountTNL == true && orderItem.status === "GUI_DUYET_LAI" && orderItem.status2 === "TU_CHOI_LAN_1"
                    ? (
                        <View style={{ paddingBottom: 10, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {!isShow_TNL.TCD ? <TouchableOpacity
                                    style={[styles.btn, { backgroundColor: COLOR.RED }]}
                                    //tổ nhận lệnh từ chối đơn hàng 
                                    onPress={async () => {
                                        const status = await getStatusOrder()
                                        if (status !== orderItem.status) {
                                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                            Actions['OrderManagement']({})
                                        } else {
                                            if (note.note === "") {
                                                Toast.show({
                                                    text1: translate('ADD_NOTES'),
                                                })
                                            } else {
                                                setIsShow_TNL({ ...isShow_TNL, TCD: true })
                                                const idOrder = orderItem.id
                                                const response = await rejectOrder(idOrder, note)
                                                checkApiSuccess(response, 'OrderManagement', 'Đơn hàng của bạn bị từ chối')
                                            }
                                        }
                                    }}>
                                    <Text style={styles.btnText}>{translate('ORDER_CANCEL_SUCCESS')}</Text>
                                </TouchableOpacity> :
                                    <View style={{ paddingVertical: 10, flex: 1 }}>
                                        <ActivityIndicator size="large" color="#00ff00" />
                                    </View>}
                                <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.ORANGE }]}
                                    onPress={async () => {
                                        const status = await getStatusOrder()
                                        if (status !== orderItem.status) {
                                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                            Actions['OrderManagement']({})
                                        } else {
                                            Actions['UpdateOrderDetailScreen']({ orderItem })
                                        }
                                    }}>
                                    <Text style={styles.btnText}>{translate('UPDATE_ORDERS')}</Text>
                                </TouchableOpacity>
                            </View>
                            {!isShow_TNL.XND ? <TouchableOpacity style={styles.btnXN}
                                onPress={async () => {
                                    //tổ nhận lệnh chấp nhận đơn hàng
                                    const status = await getStatusOrder()
                                    if (status !== orderItem.status) {
                                        Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                        Actions['OrderManagement']({})
                                    } else {
                                        setIsShow_TNL({ ...isShow_TNL, XND: true })
                                        const idOrder = orderItem.id
                                        const response = await newOrderConfirmation(idOrder, note)
                                        if (response.success) {
                                            if (orderItem.orderType != "KHONG") {
                                                const playid = await getPlayid('Tong_cong_ty', 'Ke_toan_vo_binh')
                                                //thông báo
                                                for (let i = 0; i < playid.data.length; i++) {
                                                    const body2 = {
                                                        title: 'Tổ nhận lệnh đã xác nhận',
                                                        data: `Đơn hàng số : ${response.data.orderCode}`,
                                                        device: `${playid.data[i].playerID},${playid.data[i].playerIDWeb ?? ''}`,
                                                        appname: "Gassouth",
                                                        iddata: response.data.id
                                                    }
                                                    sendNotification(body2)
                                                }
                                            }
                                        }
                                        checkApiSuccess(response, 'OrderManagement', 'Tổ nhận lệnh đã xác nhận', 'Tong_cong_ty', 'Ke_toan')
                                    }
                                }}
                            >
                                <Text style={styles.btnText}>{translate('SUBMITORDER')}</Text>
                            </TouchableOpacity> :
                                <View style={{ paddingVertical: 10, }}>
                                    <ActivityIndicator size="large" color="#00ff00" />
                                </View>}
                        </View>
                    ) : //tài khoản khách hàng và điều độ trạm
                    checkAccountKH == true && orderItem.status === "DON_HANG_MOI" ||
                        checkAccountDDTM == true && orderItem.status === "DON_HANG_MOI" ||
                        checkAccountDDT == true && orderItem.status === "DA_DUYET" ?
                        (<View style={{ paddingBottom: 10, }}>
                            <View style={{ flexDirection: 'row' }}>
                                {checkAccountKH == true && orderItem.status === "DON_HANG_MOI" ?
                                    // khách hàng hủy đơn đối vói đơn hàng mới
                                    (!isShow_TNL.TCD ? <TouchableOpacity
                                        style={[styles.btnXN, { backgroundColor: COLOR.RED, flex: 1 }]}
                                        //khách hàng hủy đơn hàng
                                        onPress={async () => {
                                            const status = await getStatusOrder()
                                            if (status !== orderItem.status) {
                                                Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                Actions['OrderManagement']({})
                                            } else {
                                                if (note.note === "") {
                                                    Toast.show({
                                                        text1: translate('ADD_NOTES'),
                                                    })
                                                } else {
                                                    setIsShow_TNL({ ...isShow_TNL, TCD: true })
                                                    const idOrder = orderItem.id
                                                    const response = await customersRejectOrder(idOrder, note)
                                                    checkApiSuccess(response, 'OrderManagement', 'Khách hàng đã hủy', 'Tong_cong_ty', 'To_nhan_lenh')
                                                }
                                            }
                                        }}>
                                        <Text style={styles.btnText}>Hủy đơn</Text>
                                    </TouchableOpacity> :
                                        <View style={{ paddingVertical: 10, flex: 1 }}>
                                            <ActivityIndicator size="large" color="#00ff00" />
                                        </View>) : null}
                                <TouchableOpacity style={[styles.btnXN, { backgroundColor: COLOR.ORANGE, flex: 1 }]}
                                    onPress={async () => {
                                        const status = await getStatusOrder()
                                        if (status !== orderItem.status) {
                                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                            Actions['OrderManagement']({})
                                        } else {
                                            Actions['UpdateOrderDetailScreen']({ orderItem })
                                        }
                                    }}>
                                    <Text style={styles.btnText}>{translate('UPDATE_ORDERS')}</Text>
                                </TouchableOpacity>
                                {checkAccountDDT == true && orderItem.status === "DA_DUYET" ?
                                    (!isShow_DDT.XND ? <View style={{ flex: 1 }}>
                                        <TouchableOpacity style={[styles.btnXN, { backgroundColor: COLOR.GREEN_MAIN, flex: 1 }]}
                                            onPress={async () => {
                                                const status = await getStatusOrder()
                                                if (status !== orderItem.status) {
                                                    Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                    Actions['OrderManagement']({})
                                                } else {
                                                    // điều độ trạm xác nhận đơn hàng
                                                    setIsShow_DDT({ ...isShow_DDT, XND: true })
                                                    const idOrder = orderItem.id
                                                    const response = await DieuDoTramXN(idOrder, noteDDT_XNDH)
                                                    // console.log(response)
                                                    checkApiSuccess(response, 'OrderManagement', 'Đơn hàng đã được duyệt')
                                                }
                                            }}>
                                            <Text style={styles.btnText}>Xác nhận đơn hàng</Text>
                                        </TouchableOpacity></View> :
                                        <View style={{ paddingVertical: 10, flex: 1 }}>
                                            <ActivityIndicator size="large" color="#00ff00" />
                                        </View>) :
                                    null}
                            </View>
                        </View>) : //điều độ tram 
                        checkAccountDDT == true && orderItem.status === "DDTRAM_DUYET" ?
                            (!isShow_DDT.XNHT ? <TouchableOpacity style={[styles.btnXN, { marginBottom: 10 }]}
                                onPress={async () => {
                                    const status = await getStatusOrder()
                                    if (status !== orderItem.status) {
                                        Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                        Actions['OrderManagement']({})
                                    } else {
                                        //điều độ tram xác nhận hoàn thành
                                        Alert.alert(
                                            "Thông báo",
                                            "Bạn có muốn xác nhận đơn hàng hoàn thành không?",
                                            [{
                                                text: "Hủy",
                                            },
                                            {
                                                text: "Xác nhận", onPress: async () => {
                                                    setIsShow_DDT({ ...isShow_DDT, XNHT: true })
                                                    const response = await DieuDoTramXN_DHHT(orderItem.id, noteDDT)
                                                    if (response.success) {
                                                        Toast.show({
                                                            text1: "Thành công",
                                                        })
                                                        Actions['OrderManagement']({})
                                                    } else {
                                                        setIsShow_DDT({ ...isShow_DDT, XNHT: false })
                                                        Toast.show({
                                                            text1: response.message,
                                                        })
                                                    }
                                                }
                                            }])
                                    }
                                }}
                            >
                                <Text style={styles.btnText}>Xác nhận hoàn thành</Text>
                            </TouchableOpacity> : <View style={{ marginVertical: 10 }}>
                                <ActivityIndicator size="large" color="#00ff00" />
                            </View>) : //khách hàng duyệt lại đơn điiều độ trạm gửi
                            checkAccountKH == true && orderItem.status === "DDTRAMGUI_XACNHAN" ||
                                checkAccountKH == true && orderItem.status === "TNLGUI_XACNHAN" ?
                                <View style={{ paddingBottom: 10, }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        {!isShow_TNL.TCD ? <TouchableOpacity
                                            style={[styles.btn, { backgroundColor: COLOR.RED }]}
                                            //khách hàng hủy đơn hàng
                                            onPress={async () => {
                                                const status = await getStatusOrder()
                                                if (status !== orderItem.status) {
                                                    Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                    Actions['OrderManagement']({})
                                                } else {
                                                    if (note.note === "") {
                                                        Toast.show({
                                                            text1: translate('ADD_NOTES'),
                                                        })
                                                    } else {
                                                        setIsShow_TNL({ ...isShow_TNL, TCD: true })
                                                        const idOrder = orderItem.id
                                                        const response = await customersRejectOrder(idOrder, note)
                                                        orderItem.status === "TNLGUI_XACNHAN" ?
                                                            checkApiSuccess(response, 'OrderManagement', 'Đơn hàng của bạn bị từ chối', 'Tong_cong_ty', 'To_nhan_lenh') :
                                                            checkApiSuccess(response, 'OrderManagement', 'Đơn hàng của bạn bị từ chối', 'Tram', 'Dieu_do_tram')
                                                    }
                                                }
                                            }}>
                                            <Text style={styles.btnText}>{translate('ORDER_CANCEL_SUCCESS')}</Text>
                                        </TouchableOpacity> :
                                            <View style={{ paddingVertical: 10, flex: 1 }}>
                                                <ActivityIndicator size="large" color="#00ff00" />
                                            </View>}
                                        {!isShow_TNL.XND ? <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.GREEN_MAIN }]}
                                            //khách hàng xác nhân đơn của điều độ trạm
                                            onPress={async () => {
                                                const status = await getStatusOrder()
                                                if (status !== orderItem.status) {
                                                    Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                    Actions['OrderManagement']({})
                                                } else {
                                                    setIsShow_TNL({ ...isShow_TNL, XND: true })
                                                    const idOrder = orderItem.id
                                                    const response = await KH_XacNhanDon(idOrder, note)
                                                    orderItem.status === "TNLGUI_XACNHAN" ?
                                                        checkApiSuccess(response, 'OrderManagement', 'Khách hàng đã duyệt', 'Tong_cong_ty', 'To_nhan_lenh') :
                                                        checkApiSuccess(response, 'OrderManagement', 'Khách hàng đã duyệt', 'Tram', 'Dieu_do_tram')
                                                }
                                            }}>
                                            <Text style={styles.btnText}>{translate('SUBMITORDER')}</Text>
                                        </TouchableOpacity> :
                                            <View style={{ paddingVertical: 10, flex: 1 }}>
                                                <ActivityIndicator size="large" color="#00ff00" />
                                            </View>}
                                    </View>
                                </View> ://tài khoản kế toán
                                checkAccountKT == true ||
                                    checkAccountKTVB == true ?
                                    (<View style={{ paddingBottom: 10, }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {orderItem.status === "TO_NHAN_LENH_DA_DUYET" ?
                                                <>
                                                    {!isShow_KT.TCD ? <TouchableOpacity
                                                        style={[styles.btn, { backgroundColor: COLOR.ORANGE }]}
                                                        onPress={async () => {
                                                            const status = await getStatusOrder()
                                                            if (status !== orderItem.status) {
                                                                Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                                Actions['OrderManagement']({})
                                                            } else {
                                                                //kế toán từ chối lần 1
                                                                if (note.note === "") {
                                                                    Toast.show({
                                                                        text1: translate('ADD_NOTES'),
                                                                    })
                                                                } else {
                                                                    setIsShow_KT({ ...isShow_KT, TCD: true })
                                                                    const idOrder = orderItem.id
                                                                    const response = await rejectOrder(idOrder, note)
                                                                    checkApiSuccess(response, 'OrderManagement', 'kế toán từ chối lần 1', 'Tong_cong_ty', 'Truong_phongKD')
                                                                }
                                                            }
                                                        }}>
                                                        <Text style={styles.btnText}>{translate('ORDER_CANCEL_FIRST')}</Text>
                                                    </TouchableOpacity> :
                                                        <View style={{ paddingVertical: 10, flex: 1 }}>
                                                            <ActivityIndicator size="large" color="#00ff00" />
                                                        </View>}
                                                    {!isShow_KT.XND ? <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                        onPress={async () => {
                                                            const status = await getStatusOrder()
                                                            if (status !== orderItem.status) {
                                                                Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                                Actions['OrderManagement']({})
                                                            } else {
                                                                //kế toán duyệt đơn hàng 
                                                                setIsShow_KT({ ...isShow_KT, XND: true })
                                                                const idOrder = orderItem.id
                                                                const response = await newOrderConfirmation(idOrder, note)

                                                                checkApiSuccess(response, 'OrderManagement', 'Đơn hàng mới', 'Tram', 'Dieu_do_tram')
                                                            }
                                                        }}>
                                                        <Text style={styles.btnText}>{translate('SUBMITORDER')}</Text>
                                                    </TouchableOpacity> :
                                                        <View style={{ paddingVertical: 10, flex: 1 }}>
                                                            <ActivityIndicator size="large" color="#00ff00" />
                                                        </View>}
                                                </> :
                                                orderItem.status === "GUI_DUYET_LAI" && orderItem.status2 === "TU_CHOI_LAN_1" ?
                                                    <>
                                                        {!isShow_KT.TCD ? <TouchableOpacity
                                                            style={[styles.btn, { backgroundColor: COLOR.ORANGE }]}
                                                            onPress={async () => {
                                                                const status = await getStatusOrder()
                                                                if (status !== orderItem.status) {
                                                                    Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                                    Actions['OrderManagement']({})
                                                                } else {
                                                                    //kế toán  từ chối lần 2
                                                                    if (note.note === "") {
                                                                        Toast.show({
                                                                            text1: translate('ADD_NOTES'),
                                                                        })
                                                                    } else {
                                                                        setIsShow_KT({ ...isShow_KT, TCD: true })
                                                                        const idOrder = orderItem.id
                                                                        const response = await rejectOrder(idOrder, note)
                                                                        checkApiSuccess(response, 'OrderManagement', 'kế toán từ chối lần 2', 'Tong_cong_ty', 'Pho_giam_docKD')
                                                                    }
                                                                }
                                                            }}>
                                                            <Text style={styles.btnText}>{translate('ORDER_CANCEL_2ND')}</Text>
                                                        </TouchableOpacity> :
                                                            <View style={{ paddingVertical: 10, flex: 1 }}>
                                                                <ActivityIndicator size="large" color="#00ff00" />
                                                            </View>}
                                                        {!isShow_KT.XND ? <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                            onPress={async () => {
                                                                const status = await getStatusOrder()
                                                                if (status !== orderItem.status) {
                                                                    Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                                    Actions['OrderManagement']({})
                                                                } else {
                                                                    //kế toán duyệt đơn hàng khi đơn hàng từ chối lần 1
                                                                    // if (note.note === "") {
                                                                    //     Toast.show({
                                                                    //         text1: translate('ADD_NOTES'),
                                                                    //     })
                                                                    // } else {
                                                                    setIsShow_KT({ ...isShow_KT, XND: true })
                                                                    const idOrder = orderItem.id
                                                                    const response = await newOrderConfirmation(idOrder, note)
                                                                    checkApiSuccess(response, 'OrderManagement', 'Đơn hàng mới', 'Tram', 'Dieu_do_tram')
                                                                    // }
                                                                }
                                                            }}>
                                                            <Text style={styles.btnText}>{translate('SUBMITORDER')}</Text>
                                                        </TouchableOpacity> :
                                                            <View style={{ paddingVertical: 10, flex: 1 }}>
                                                                <ActivityIndicator size="large" color="#00ff00" />
                                                            </View>}
                                                    </> : orderItem.status === "GUI_DUYET_LAI" && orderItem.status2 === "TU_CHOI_LAN_2"
                                                        ? <>
                                                            {!isShow_KT.XND ? <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                                onPress={async () => {
                                                                    const status = await getStatusOrder()
                                                                    if (status !== orderItem.status) {
                                                                        Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                                        Actions['OrderManagement']({})
                                                                    } else {
                                                                        //kế toán bắt buộc duyệt
                                                                        setIsShow_KT({ ...isShow_KT, XND: true })
                                                                        const idOrder = orderItem.id
                                                                        const response = await newOrderConfirmation(idOrder, note)
                                                                        checkApiSuccess(response, 'OrderManagement', 'Đơn hàng mới', 'Tram', 'Dieu_do_tram')
                                                                    }
                                                                }}>
                                                                <Text style={styles.btnText}>{translate('SUBMIT')}</Text>
                                                            </TouchableOpacity> :
                                                                <View style={{ paddingVertical: 10, flex: 1 }}>
                                                                    <ActivityIndicator size="large" color="#00ff00" />
                                                                </View>}
                                                        </> : null}
                                        </View>
                                    </View>) : //tài khoản trưởng phòng kinh doanh
                                    checkAccountTPKD == true && orderItem.status === "TU_CHOI_LAN_1" ?
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                                            {!isShow_TPKD.TCD ? <TouchableOpacity
                                                style={[styles.btn, { backgroundColor: COLOR.ORANGE }]}
                                                onPress={async () => {
                                                    const status = await getStatusOrder()
                                                    if (status !== orderItem.status) {
                                                        Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                        Actions['OrderManagement']({})
                                                    } else {
                                                        if (note.note === "") {
                                                            Toast.show({
                                                                text1: translate('ADD_NOTES'),
                                                            })
                                                        } else {
                                                            setIsShow_TPKD({ ...isShow_TPKD, TCD: true })
                                                            const idOrder = orderItem.id
                                                            const response = await rejectOrder(idOrder, note)
                                                            checkApiSuccess(response, 'OrderManagement', 'Đơn hàng của bạn bị từ chối')
                                                        }
                                                    }
                                                }}>
                                                <Text style={styles.btnText}>{translate('DO_NOT_BROWSE')}</Text>
                                            </TouchableOpacity> :
                                                <View style={{ paddingVertical: 10, flex: 1 }}>
                                                    <ActivityIndicator size="large" color="#00ff00" />
                                                </View>}
                                            {!isShow_TPKD.GDL ? <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                onPress={async () => {
                                                    const status = await getStatusOrder()
                                                    if (status !== orderItem.status) {
                                                        Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                        Actions['OrderManagement']({})
                                                    } else {
                                                        //trưởng phòng kinh doanh gửi duyệt lại
                                                        setIsShow_TPKD({ ...isShow_TPKD, GDL: true })
                                                        const idOrder = orderItem.id
                                                        const response = await newOrderConfirmation(idOrder, note)
                                                        if (response.success) {
                                                            if (orderItem.orderType != "KHONG") {
                                                                const playid = await getPlayid('Tong_cong_ty', 'Ke_toan_vo_binh')
                                                                //thông báo
                                                                for (let i = 0; i < playid.data.length; i++) {
                                                                    const body2 = {
                                                                        title: 'Bạn có đơn hàng cần duyệt lại',
                                                                        data: `Đơn hàng số : ${response.data.orderCode}`,
                                                                        device: `${playid.data[i].playerID},${playid.data[i].playerIDWeb ?? ''}`,
                                                                        appname: "Gassouth",
                                                                        iddata: response.data.id
                                                                    }
                                                                    sendNotification(body2)
                                                                }
                                                            }
                                                        }
                                                        checkApiSuccess(response, 'OrderManagement', 'Bạn có đơn hàng cần duyệt lại', 'Tong_cong_ty', 'Ke_toan')
                                                    }
                                                }}>
                                                <Text style={styles.btnText}>{translate('RESEND_FOR_REVIEW')}</Text>
                                            </TouchableOpacity> :
                                                <View style={{ paddingVertical: 10, flex: 1 }}>
                                                    <ActivityIndicator size="large" color="#00ff00" />
                                                </View>}
                                        </View> : //tài khoản phó giám đốc kinh doanh
                                        checkAccountPGDKD == true && orderItem.status === "TU_CHOI_LAN_2" ?
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                                                {!isShow_PGD.TCD ? <TouchableOpacity
                                                    style={[styles.btn, { backgroundColor: COLOR.ORANGE }]}
                                                    onPress={async () => {
                                                        const status = await getStatusOrder()
                                                        if (status !== orderItem.status) {
                                                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                            Actions['OrderManagement']({})
                                                        } else {
                                                            if (note.note === "") {
                                                                Toast.show({
                                                                    text1: translate('ADD_NOTES'),
                                                                })
                                                            } else {
                                                                setIsShow_PGD({ ...isShow_PGD, TCD: true })
                                                                const idOrder = orderItem.id
                                                                const response = await rejectOrder(idOrder, note)
                                                                checkApiSuccess(response, 'OrderManagement', 'Đơn hàng của bạn bị từ chối')
                                                            }
                                                        }
                                                    }}>
                                                    <Text style={styles.btnText}>{translate('DO_NOT_BROWSE')}</Text>
                                                </TouchableOpacity> :
                                                    <View style={{ paddingVertical: 10, flex: 1 }}>
                                                        <ActivityIndicator size="large" color="#00ff00" />
                                                    </View>}
                                                {!isShow_PGD.GDL ? <TouchableOpacity style={[styles.btn, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                    onPress={async () => {
                                                        const status = await getStatusOrder()
                                                        if (status !== orderItem.status) {
                                                            Alert.alert('Thông báo', 'Trạng thái đơn hàng đã thay đổi!')
                                                            Actions['OrderManagement']({})
                                                        } else {
                                                            // if (note.note === "") {
                                                            //     Toast.show({
                                                            //         text1: translate('ADD_NOTES'),
                                                            //     })
                                                            // } else {
                                                            //phó giám đốc gửi duyệt lại
                                                            setIsShow_PGD({ ...isShow_PGD, GDL: true })
                                                            const idOrder = orderItem.id
                                                            const response = await newOrderConfirmation(idOrder, note)
                                                            //thông báo
                                                            if (response.success) {
                                                                if (orderItem.orderType != "KHONG") {
                                                                    const playid = await getPlayid('Tong_cong_ty', 'Ke_toan_vo_binh')
                                                                    //thông báo
                                                                    for (let i = 0; i < playid.data.length; i++) {
                                                                        const body2 = {
                                                                            title: 'Bạn có đơn hàng cần duyệt lại ',
                                                                            data: `Đơn hàng số : ${response.data.orderCode}`,
                                                                            device: `${playid.data[i].playerID},${playid.data[i].playerIDWeb ?? ''}`,
                                                                            appname: "Gassouth",
                                                                            iddata: response.data.id
                                                                        }
                                                                        sendNotification(body2)
                                                                    }
                                                                }
                                                            }
                                                            checkApiSuccess(response, 'OrderManagement', 'Bạn có đơn hàng cần duyệt lại', 'Tong_cong_ty', 'Ke_toan')
                                                            // }
                                                        }
                                                    }}>
                                                    <Text style={styles.btnText}>{translate('RESEND_FOR_REVIEW')}</Text>
                                                </TouchableOpacity> :
                                                    <View style={{ paddingVertical: 10, flex: 1 }}>
                                                        <ActivityIndicator size="large" color="#00ff00" />
                                                    </View>}
                                            </View> : null
            }
            <Toast
                backgroundColor="#fffff"
                autoHide={true}
                visibilityTime={visibilityTime}
                ref={(ref) => {
                    Toast.setRef(ref);
                }}
            />
        </SafeAreaView >
    )
}

export default OrderDetail_NewVersion;


const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        margin: 10,
    },

    iconDropdown: {
        alignSelf: 'flex-end',
        paddingRight: 15,
        paddingBottom: 10,
    },

    listGas: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#bdbfbd',
        margin: 10,
        color: '#000000'
    },

    headerList: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemHeader: (index, isChooseType) => {
        return {
            backgroundColor: index === isChooseType ? COLOR.ORANGE : '#fff',
            flexDirection: 'row',
            borderWidth: index === isChooseType ? 0 : 1,
            borderColor: '#ccc',
            borderRadius: 15,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
        };
    },
    itemSeparatorHeader: {
        width: 5,
    },
    itemHeaderText: (index, isChooseType) => {
        return {
            fontWeight: '600',
            color: index === isChooseType ? '#FFF' : COLOR.GRAY,
            textAlign: 'center',
        };
    },
    createOrderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    calendarCreateOrder: {
        flexDirection: 'row',
        flex: 1,
    },
    txtGray: {
        color: COLOR.GRAY,
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
    itemStatistics: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderColor: '#ccc',
    },
    itemStatisticsText: {
        color: COLOR.DARKGRAY,
        fontWeight: 'bold',
    },
    GroupSearch: {
        flexDirection: 'row',
        paddingTop: 10,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    ViewSearch: {
        borderColor: COLOR.GRAY,
        borderWidth: 0.5,
        borderRadius: 10,
        flex: 4.5,
        backgroundColor: COLOR.WHITE
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
    btnXN: {
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 10,
        backgroundColor: COLOR.GREEN_MAIN,
        alignItems: 'center',
        marginTop: 10
    },
    txtShowListNote: {
        marginLeft: 10,
        fontWeight: "bold",
        fontSize: 14,
        color: '#000000'
    },
    titleListNote: {
        fontWeight: "bold",
        fontSize: 14,
        color: '#000000'
    }
});