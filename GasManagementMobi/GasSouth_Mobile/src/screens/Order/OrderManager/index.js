import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
//
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
//
import HeaderCustom from '../../../components/HeaderCustom';
import { COLOR } from '../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ORDER_STATUS, ORDER_STATUS_CUSTOMERS, ORDER_STATUS_CUSTOMERS_HEADER, ORDER_STATUS_KT, ORDER_STATUS_TNL, ORDER_STATUS_TRAM, ORDER_TYPE } from './utils/statusType';
import { Actions } from 'react-native-router-flux';
import { translate } from '../../../utils/changeLanguage';
import { getListOrderByDate, getOrderByUserId, getSearchOrder } from '../../../api/orders_new';
import CustomStatusBar from '../../../components/CustomStatusBar';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInfo } from '../../../helper/auth';
import { useSelector, useDispatch } from 'react-redux';
import { listOrderofOrderManager } from '../../../actions/listOrderActions';
import { AGENCY, DDT, DDTM, FACTORY, GENERAL, KHACH_HANG, KT, KTVB, KT_TRAM, OWNER, PGD, SALESMANAGER, TNL, TONG_CONG_TY, TRAM, TRUONG_TRAM } from '../../../types';
// import CustomNavbar_New from '../../../components/CustomNavbar_New';
//ROLES
/*
    TKA:Khách hàng
    TKB:Đại diện thương mại(NVKD)
    TKC:Tài khoản tổ nhận lệnh
    TKD:Kế toán - Công ty
    TKE:TÀI KHOẢN TRƯỞNG PHÒNG KINH DOANH _CÔNG TY 
    TKF:TÀI KHOẢN PHÓ GIÁM ĐỐC _CÔNG TY 
    TKG:TÀI KHOẢN TRƯỞNG TRẠM+ KẾ TOÁN TRẠM + GIÁM ĐỐC VÙNG :
    TKH:TÀI KHOẢN KẾ TOÁN VỎ BÌNH 
    TKI:TÀI KHOẢN ĐIỀU ĐỘ 
    TKK:TÀI KHOẢN TÀI XẾ 
  */

const OrderManager = (props) => {

  const [refreshing, setRefreshing] = useState(true);

  const orderOriginal = useRef();
  const [orders, setOrders] = useState();
  const [ordersHeader, setOrdersHeader] = useState();
  const [isShowSearch, setShowSearch] = useState(false);
  const [isShow, setShow] = useState(false);

  const dispatch = useDispatch();
  const listOrderOfDate = useSelector(listOrder => listOrder);
  // const [checkAccount, setCheckAccount] = useState(false);

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

  //check account
  // const userinfo = useRef();
  const checAccountCreateOrder = async () => {
    const userinfor = await getUserInfo()
    // userinfo.current = userinfor
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
    }
    // else if (userType == "Tong_cong_ty" && userRole == "Giam_doc") {
    //     setCheckAccountGD(true)
    // }
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

  const getListOrder = async () => {
    try {
      const response = await getOrderByUserId()
      console.log("RESPONSE là:", response);
      if (response.success) {
        setRefreshing(false);
        // dispatch(listOrderofOrderManager(response.data));
        // setOrders(listOrderOfDate.listOrderReducer.ArrayListOrder);
        setOrders(response.data)
        setOrdersHeader(response.data)
        orderOriginal.current = response.data;
        // listOrderOfDate.listOrderReducer.ArrayListOrder ? setShow(true) : null

      } else {
        setShow(true);
      }
      // {
      //   setShow(true)
      // }

    } catch (err) {
      console.log("LỖI FETCH API,", err);
    }
  }

  const testSetOrder = async () => {
    // setShow(false)
    const response = await getOrderByUserId()
    if (response.success) {
      orderOriginal.current = response.data;
      setOrdersHeader(response.data)
    }
    // setOrders(listOrderOfDate.listOrderReducer.ArrayListOrder)
    setOrders(props.list)
    props.list.length > 0 ? null : setShow(true)
  }

  useEffect(() => {
    setRefreshing(false);
    checAccountCreateOrder();
    props.date ? testSetOrder() : getListOrder();
  }, [props]);

  //xử lý cho bộ lọc
  // useEffect(() => {
  //   // props.date ? setShow(true) : null
  //   testSetOrder()

  // }, [props, listOrderOfDate]);

  const onRefresh = () => {
    getListOrder();
  };


  const statisticsOrderFake = [
    {
      idStatic: 1,
      label: 'Đơn hàng mới (fake)',
      count: 5,
    },
    {
      idStatic: 2,
      label: 'Đang duyệt (fake)',
      count: 5,
    },
    {
      idStatic: 3,
      label: 'Từ chối lần một (fake)',
      count: 5,
    },
    {
      idStatic: 4,
      label: 'Từ chối lần hai (fake)',
      count: 5,
    },
    {
      idStatic: 5,
      label: 'Gửi duyệt lại (fake)',
      count: 5,
    },
    {
      idStatic: 6,
      label: 'Đã duyệt (fake)',
      count: 5,
    },
    {
      idStatic: 7,
      label: 'Đang giao (fake)',
      count: 5,
    },
    {
      idStatic: 8,
      label: 'Đã giao (fake)',
      count: 5,
    },
    {
      idStatic: 9,
      label: 'Không duyệt (fake)',
      count: 5,
    },
  ];

  //State
  const [isChooseType, setIsChooseType] = React.useState(-1);
  const roleUser = {
    type: 'TKA',
  };

  //tim kiem theo id hóa đơn
  const [temp, setTemp] = useState(orders);
  const handleSearch = async (text) => {
    setOrders(orderOriginal.current.filter(item => item.orderCode.toLowerCase().includes(text.toLowerCase())))
    setOrders(ordersHeader.filter(item => item.orderCode.toLowerCase().includes(text.toLowerCase())))
    // const { data } = await getSearchOrder(text.toUpperCase())
    // console.log(data)
    // setOrders(data)
  }
  //filter list header
  const _filter = orderStatusId => {
    if (orderStatusId === 'ALL') {
      setOrders(orderOriginal.current);
      setOrders(ordersHeader);
    } else {
      if (checkAccountKH) {
        if (orderStatusId === "TO_NHAN_LENH_DA_DUYET") {
          setOrders(orderOriginal.current.filter(order => order.status === "TO_NHAN_LENH_DA_DUYET" ||
            order.status === "TU_CHOI_LAN_1" || order.status === "TU_CHOI_LAN_2" ||
            order.status === "GUI_DUYET_LAI" || order.status === "DA_DUYET"));
          setOrders(ordersHeader.filter(order => order.status === "TO_NHAN_LENH_DA_DUYET" ||
            order.status === "TU_CHOI_LAN_1" || order.status === "TU_CHOI_LAN_2" ||
            order.status === "GUI_DUYET_LAI" || order.status === "DA_DUYET"));
        } else if (orderStatusId === "DDTRAMGUI_XACNHAN") {
          setOrders(orderOriginal.current.filter(order => order.status === "DDTRAMGUI_XACNHAN" ||
            order.status === "TNLGUI_XACNHAN"));
          setOrders(ordersHeader.filter(order => order.status === "DDTRAMGUI_XACNHAN" ||
            order.status === "TNLGUI_XACNHAN"));
        } else {
          setOrders(orderOriginal.current.filter(order => order.status === orderStatusId));
          setOrders(ordersHeader.filter(order => order.status === orderStatusId));
        }
      } else {
        setOrders(orderOriginal.current.filter(order => order.status === orderStatusId));
        setOrders(ordersHeader.filter(order => order.status === orderStatusId));
      }
    }
  }

  //Render item header
  const renderItemHeader = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsChooseType(index);
          _filter(item, index);
        }}
        style={styles.itemHeader(index, isChooseType)}>
        <Text style={styles.itemHeaderText(index, isChooseType)}>
          {item === "ALL" ? translate('ALL') : checkAccountKH ? ORDER_STATUS_CUSTOMERS_HEADER.get(item).name :
            checkAccountTNL || checkAccountDDTM ? ORDER_STATUS_TNL.get(item).name :
              checkAccountKT || checkAccountTPKD || checkAccountPGDKD ? ORDER_STATUS_KT.get(item).name :
                checkAccountTruong_tram || checkAccountKeToanTram || checkAccountDDT ? ORDER_STATUS_TRAM.get(item).name :
                  checkAccountKTVB ? ORDER_STATUS.get(item).name : ORDER_STATUS.get(item).name}
        </Text>
      </TouchableOpacity>
    );
  };

  //Render item order
  const renderItemOrder = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          borderBottomWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#ccc',
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
        onPress={() => Actions['OrderDetailNewVersion']({ orderItem: item })}
      >
        <View style={styles.itemOrder} >
          <View style={styles.itemOrderLeft}>
            <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
              {item.orderCode} - {ORDER_TYPE.get(item.orderType).name}
            </Text>
            {/* CreateTime */}
            <View style={[styles.flexRow, { marginBottom: 5 }]}>
              <AntDesign
                name="calendar"
                size={18}
                style={[{ marginRight: 5 }, styles.txtGray]}
              />
              <Text style={styles.itemOrderLeftText}>
                {translate('Creation_date')}: {moment(item.createdAt).format('hh:mm a , DD/MM/YYYY')}
              </Text>
            </View>

            {/* Place */}
            <View style={styles.flexRow}>
              <FontAwesome5
                name="map-marker-alt"
                size={18}
                style={[{ marginRight: 5 }, styles.txtGray]}
              />
              <Text style={styles.itemOrderLeftText}>{item.delivery.length > 0 ? item.delivery[0].deliveryAddress : ''}</Text>
            </View>
          </View>

          <View style={styles.itemOrderRight}>
            <Text style={{
              color: `${checkAccountKH ? ORDER_STATUS_CUSTOMERS.get(item.status).color :
                checkAccountTNL || checkAccountDDTM ? ORDER_STATUS_TNL.get(item.status).color :
                  checkAccountKT || checkAccountTPKD || checkAccountPGDKD ? ORDER_STATUS_KT.get(item.status).color :
                    checkAccountTruong_tram || checkAccountKeToanTram || checkAccountDDT ? ORDER_STATUS_TRAM.get(item.status).color :
                      checkAccountKTVB ? ORDER_STATUS.get(item.status).color : ORDER_STATUS.get(item.status).color}`, fontWeight: 'bold'
            }}>
              {checkAccountKH ? ORDER_STATUS_CUSTOMERS.get(item.status).name :
                checkAccountTNL || checkAccountDDTM ? ORDER_STATUS_TNL.get(item.status).name :
                  checkAccountKT || checkAccountTPKD || checkAccountPGDKD ? ORDER_STATUS_KT.get(item.status).name :
                    checkAccountTruong_tram || checkAccountKeToanTram || checkAccountDDT ? ORDER_STATUS_TRAM.get(item.status).name :
                      checkAccountKTVB ? ORDER_STATUS.get(item.status).name : ORDER_STATUS.get(item.status).name}
            </Text>
            <Text style={[styles.itemOrderRightText, { marginTop: 5 }]}>
              {translate('Delivery_date')}: {'\n'}
              {item.delivery.map(({ deliveryDate }) => `${formatDate(deliveryDate)}\n`)}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, }}>
          <Text style={{ color: COLOR.GRAY, marginRight: 5 }}>{translate('NOTE')}:</Text>
          <Text style={{ color: COLOR.ORANGE, fontSize: 14, flex: 1 }}>{item.note}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //Render item statistics
  const renderItemStatistics = ({ item, index }) => {
    return (
      <View style={styles.itemStatistics}>
        <TouchableOpacity
          style={[styles.flexRow, { justifyContent: 'space-between' }]}>
          <Text style={styles.itemStatisticsText}>{item.label}</Text>
          <Text style={styles.itemStatisticsText}>{item.count} ĐH</Text>
        </TouchableOpacity>
      </View>
    );
  };

  //Main render
  return (
    <>
      {isShowSearch ?
        <TouchableOpacity
          onPress={() => {
            setShowSearch(false);
            setOrders(orderOriginal.current)
            setOrders(ordersHeader)
          }}
          hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
          style={{ margin: 5, marginLeft: 8 }}
        >
          <Icon name='close-circle' color='#000' size={30} />
        </TouchableOpacity>
        :
        <View style={styles.Nav_container}>
          <TouchableOpacity
            hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
            onPress={() => Actions['home']({})}
          >
            <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
          </TouchableOpacity>
          <Text style={styles.Nav_title}>{translate('ORDER_MANAGEMENT')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 30 }}>
              <TouchableOpacity onPress={() => {
                if (orders) {
                  setShowSearch(true)
                  setOrders([])
                }
              }}>
                <Icon name="search" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: 5 }}>
              <TouchableOpacity
                onPress={() => { Actions['FilterOrderScreen']({}) }}>
                <FontAwesome5
                  name="filter"
                  size={18}
                  style={{ color: COLOR.WHITE }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>}
      <SafeAreaView style={{ flex: 1, backgroundColor: isShowSearch ? COLOR.WHITE : COLOR.GRAY_OPTION }}>
        {/* <CustomNavbar_New title="quản lý đơn hàng" backScreenKey='home' /> */}
        <View style={{ flex: 1 }}>
          {/* <HeaderCustom isBack isFilter isSearch label={'Đơn hàng'} /> */}
          {isShowSearch ?
            <View style={styles.GroupSearch}>
              <View style={styles.ViewSearch}>
                <TextInput
                  placeholder={translate('Enter_the_order_code_to_search')}
                  placeholderTextColor={COLOR.GRAY}
                  style={{ height: 40, paddingHorizontal: 10 }}
                  keyboardType={'default'}
                  onChangeText={async (e) => { handleSearch(e) }}
                />
              </View>
            </View>
            :
            <>
              {/* Header */}
              {ordersHeader ? (
                <View style={styles.headerList}>
                  <FlatList
                    style={{ marginHorizontal: 10 }}
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    data={checkAccountKH ? ['ALL', ...ORDER_STATUS_CUSTOMERS_HEADER.keys()] :
                      checkAccountTNL || checkAccountDDTM ? ['ALL', ...ORDER_STATUS_TNL.keys()] :
                        checkAccountKT || checkAccountTPKD || checkAccountPGDKD ? ['ALL', ...ORDER_STATUS_KT.keys()] :
                          checkAccountTruong_tram || checkAccountKeToanTram || checkAccountDDT ?
                            ['ALL', ...ORDER_STATUS_TRAM.keys()] : checkAccountKTVB ?
                              ['ALL', ...ORDER_STATUS.keys()] : ['ALL', ...ORDER_STATUS.keys()]}
                    renderItem={renderItemHeader}
                    ItemSeparatorComponent={() => (
                      <View style={styles.itemSeparatorHeader} />
                    )}
                  />
                </View>
              ) : null}

              {/* Create order */}
              <View style={styles.createOrderContainer}>
                {checkAccountKH == true || checkAccountTNL == true || checkAccountDDTM == true ? (
                  <TouchableOpacity style={{ alignItems: 'center' }}
                    onPress={async () => {
                      checkAccountKH ?
                        Actions['orderScreen']({}) :
                        checkAccountTNL || checkAccountDDTM ?
                          Actions['orderInfoUserScreen']({}) : null
                    }}>
                    <AntDesign
                      name="pluscircleo"
                      size={22}
                      color={COLOR.GREEN_MAIN}
                    />
                    <Text style={{ color: COLOR.GREEN_MAIN, fontWeight: 'bold' }}>
                      {translate('CREATE_ORDER')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[
                    styles.calendarCreateOrder,
                    {
                      justifyContent: 'flex-end'
                    },
                  ]}
                  onPress={async () => {

                  }}
                >
                  <AntDesign
                    name="calendar"
                    size={20}
                    style={[{ marginRight: 5 }, styles.txtGray]}
                  />
                  <Text style={styles.txtGray}>{props.date ? formatDate(props.date.firstDay) + " - " + formatDate(props.date.lastDay) : "_/_/_ - _/_/_"}</Text>
                </TouchableOpacity>
              </View>
            </>
          }

          {/* Body */}
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {roleUser.type == 'TKA' ||
              roleUser.type == 'TKB' ||
              roleUser.type == 'TKG' ||
              roleUser.type == 'TKI' ? (
              /* LIST DATA ORDER */
              orders ? (orders.length === 0 ?
                <View style={{ height: '100%', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center' }}>{translate('There_are_no_matching_orders')}</Text>
                </View>
                // <View style={{ height: '100%', justifyContent: 'center' }}>
                //   <ActivityIndicator size="large" color="#00ff00" />
                // </View>
                : <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  data={orders}
                  renderItem={renderItemOrder}
                  keyExtractor={(item, index) => index.toString()}
                />) : isShow ? <View style={{ height: '100%', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center' }}>{translate('There_are_no_matching_orders')}</Text>
                </View> : <View style={{ height: '100%', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
            ) : (
              /* LIST STATISTICS ORDER */
              <FlatList
                data={statisticsOrderFake}
                renderItem={renderItemStatistics}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </View>
      </SafeAreaView >
    </>
  );
};

export default OrderManager;

const styles = StyleSheet.create({
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
    flex: 1,
  },
  itemOrderLeft: {
    flex: 0.7,
  },
  itemIdOrderText: {
    fontWeight: 'bold',
    color: '#3d3d3d',
  },
  itemOrderLeftText: { fontSize: 14 },
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
    borderWidth: 0.5,
    borderRadius: 10,
    flex: 4.5,
    backgroundColor: COLOR.WHITE
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
  }
});
