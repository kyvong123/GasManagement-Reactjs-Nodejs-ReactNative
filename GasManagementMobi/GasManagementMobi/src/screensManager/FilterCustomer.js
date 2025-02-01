// import React, { useEffect, useState } from 'react';
// import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Picker, ActivityIndicator, ScrollView } from 'react-native';
// import { COLOR } from '../constants';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { translate } from '../utils/changeLanguage';
// // import LineOrderItem from '../../components/LineOrderItem';
// import { Actions } from 'react-native-router-flux';
// import Icon from 'react-native-vector-icons/Ionicons';
// import DatePicker from 'react-native-datepicker'
// import Toast from 'react-native-toast-message'
// import { getDeliveryStatistics, getListOrderByDate, getStation, getCustomers } from '../api/orders_new';
// import { useSelector, useDispatch } from 'react-redux';
// import { listDeliveryStatistics } from '../actions/listOrderActions';
// import { getUserInfo } from '../helper/auth';


// // const widthScreen = Dimensions.get('window').width;
// // const heightScreen = Dimensions.get('window').height;
// // const screenTextSize = 17;


// export default function FilterCustomer() {
//     const dispatch = useDispatch();
//     const [UserInfo, setUserInfo] = useState({});
//     const statistics = useSelector(deliveryStatistics => deliveryStatistics);
//     const visibilityTime = 2000;
//     const [isShow, setShow] = useState(true);
//     const [supplier, setSupplier] = useState("");
//     const [kh, setkh] = useState("");
//     const [dt, setdt] = useState("");
//     const [area, setArea] = useState("");
//     const [temp, setTemp] = useState({
//         listStation: [],//tram
//         listArea: [],//khu vuc
//         lisCustomers: [],
//     })


//     const loaiKH = [
//         {
//             userRole: "Industry",
//             name: "khách hàng công nghiệp"
//         }, {
//             userRole: "Distribution",
//             name: "Hệ thống phân phối"
//         },
//         {
//             userRole: "Agency",
//             name: "Cửa hàng bán lẻ"
//         }]

//     const [doiTuong, setDoiTuong] = useState({
//         customerType: "",
//         customerRole: "",
//     })

//     const [date, setDate] = useState({
//         firstDay: null,
//         lastDay: null
//     })

//     const [date2, setDate2] = useState({
//         firstDay: null,
//         lastDay: null
//     })
//     const now = new Date();
//     const [selected, setSelected] = useState({
//         homNay: "",
//         tuanNay: "",
//         thangNay: "",
//         thangTruoc: "",
//         tuyChon: "",
//     });

//     //formmat date
//     const formatDate = (date) => {
//         let year = date.getFullYear();
//         let month = date.getMonth() + 1;
//         let dt = date.getDate();

//         if (dt < 10) {
//             dt = '0' + dt;
//         }
//         if (month < 10) {
//             month = '0' + month;
//         }

//         const text = year + '-' + month + '-' + dt
//         return text
//     }

//     //formmat date
//     const formatDateIncreaseDay = (date) => {
//         let year = date.getFullYear();
//         let month = date.getMonth() + 1;
//         let dt = date.getDate() + 1;

//         if (dt < 10) {
//             dt = '0' + dt;
//         }
//         if (month < 10) {
//             month = '0' + month;
//         }

//         const text = year + '-' + month + '-' + dt
//         return text
//     }

//     const getToDay = () => {
//         setDate({ ...date, firstDay: formatDate(now), lastDay: formatDate(now) })
//         setDate2({ ...date2, firstDay: formatDate(now), lastDay: formatDateIncreaseDay(now) })
//     }
//     const getThisWeek = () => {
//         const firstDay = new Date(now.setDate(now.getDate() - now.getDay() + 1));
//         const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 7));
//         setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
//         setDate2({ ...date2, firstDay: formatDate(firstDay), lastDay: formatDateIncreaseDay(lastDay) })
//     }
//     const getThisMonth = () => {
//         const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//         const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//         setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
//         setDate2({ ...date2, firstDay: formatDate(firstDay), lastDay: formatDateIncreaseDay(lastDay) })
//     }
//     const getLastMonth = () => {
//         const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
//         setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
//         setDate2({ ...date2, firstDay: formatDate(firstDay), lastDay: formatDateIncreaseDay(lastDay) })
//     }

//     const getStatistic = async () => {
//         try {
//             const response = await getDeliveryStatistics(date2.firstDay, date2.lastDay,
//                 doiTuong.customerType, doiTuong.customerRole, supplier, kh)
//                 console.log(response)
//             if (response.status) {
//                 // dispatch(listDeliveryStatistics(response.data));
//                 // console.log(response.data)
//                 Actions['statisticCustomer']({ date, list: response.data })
//             }
//             else {
//                 Actions['statisticCustomer']({ date, list: [] })
//             }
//         } catch (err) {
//             console.log("LỖI FETCH API,", err);
//         }
//     }

//     const getListStation = async () => {
//         const listStation = await getStation()
//         setTemp({ ...temp, listStation: listStation.data })
//     }

//     const getListCustomers = async (area, userRole) => {
//         try {
//             const listCustomers = await getCustomers(UserInfo.userType === "Tram" || UserInfo.userType === "Factory" ? UserInfo.id : supplier, userRole) //(id trạm, đối tượng)
//             const arrTemp = listCustomers.data
//             console.log(listCustomers)
//             // const newArr = arrTemp.filter(element =>
//             //   element.area === area && element.userRole === userRole && element.isChildOf === state.supplier)
//             setTemp({ ...temp, lisCustomers: arrTemp })
//         } catch (err) {
//             console.log("LỖI FETCH API,", err);
//         }
//     }

//     const getInfor = async () => {
//         const temp = await getUserInfo()
//         setUserInfo(temp)
//         console.log(UserInfo)
//     }

//     useEffect(() => {
//         getListStation()
//         getInfor()

//     }, []);

//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView style={{ flex: 1 }}>
//                 <View style={{ marginHorizontal: 20 }}>
//                     <Text style={styles.TimeTitle}>{translate('TIME')}:</Text>
//                     <View style={{ marginHorizontal: 10 }}>
//                         <View style={{ flexDirection: 'row', }}>
//                             <View style={styles.viewSum}>
//                                 <View style={styles.ViewCheckBox2}>
//                                     <TouchableOpacity style={styles.ViewCheckBox(selected.homNay)}
//                                         hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
//                                         onPress={() => {
//                                             setSelected({
//                                                 ...selected,
//                                                 homNay: "homNay", tuanNay: "",
//                                                 thangNay: "", thangTruoc: "", tuyChon: ""
//                                             })
//                                             getToDay()
//                                         }} />
//                                 </View>
//                                 <Text style={styles.title}>{translate('TODAY')}</Text>
//                             </View>
//                             <View style={{
//                                 flexDirection: 'row', alignItems: 'center', flex: 1,

//                             }}>
//                                 <View style={styles.ViewCheckBox2}>
//                                     <TouchableOpacity style={styles.ViewCheckBox(selected.tuanNay)}
//                                         onPress={() => {
//                                             setSelected({
//                                                 ...selected, homNay: "",
//                                                 tuanNay: "tuanNay", thangNay: "", thangTruoc: "", tuyChon: ""
//                                             })
//                                             getThisWeek()
//                                         }} />
//                                 </View>
//                                 <View>
//                                     <Text style={styles.title}>{translate('THISWEEK')}</Text>
//                                 </View>
//                             </View>
//                         </View>
//                         <View style={{ flexDirection: 'row', marginVertical: 10 }}>
//                             <View style={styles.viewSum}>
//                                 <View style={styles.ViewCheckBox2}>
//                                     <TouchableOpacity style={styles.ViewCheckBox(selected.thangNay)}
//                                         hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
//                                         onPress={() => {
//                                             setSelected({
//                                                 ...selected, homNay: "",
//                                                 tuanNay: "", thangNay: "thangNay", thangTruoc: "", tuyChon: ""
//                                             })
//                                             getThisMonth()
//                                         }} />
//                                 </View>
//                                 <Text style={styles.title}>{translate('THISMONTH')}</Text>
//                             </View>
//                             <View style={styles.viewSum}>
//                                 <View style={styles.ViewCheckBox2}>
//                                     <TouchableOpacity style={styles.ViewCheckBox(selected.thangTruoc)}
//                                         hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
//                                         onPress={() => {
//                                             setSelected({
//                                                 ...selected, homNay: "",
//                                                 tuanNay: "", thangNay: "", thangTruoc: "thangTruoc", tuyChon: ""
//                                             })
//                                             getLastMonth()
//                                         }} />
//                                 </View>
//                                 <View>
//                                     <Text style={styles.title}>{translate('LASTMONTH')}</Text>
//                                 </View>
//                             </View>
//                         </View>
//                         <View style={{ flexDirection: 'row', }}>
//                             <View style={styles.viewSum}>
//                                 <View style={styles.ViewCheckBox2}>
//                                     <TouchableOpacity style={styles.ViewCheckBox(selected.tuyChon)}
//                                         onPress={() => {
//                                             setSelected({
//                                                 ...selected, homNay: "",
//                                                 tuanNay: "", thangNay: "", thangTruoc: "", tuyChon: "tuyChon"
//                                             })
//                                             console.log("(((((((((((", statistics.listOrderReducer.ArrayDeliveryStatistics)



//                                         }} />
//                                 </View>
//                                 <Text style={styles.title}>{translate('CUSTOMRANGE')}</Text>
//                             </View>
//                             <View style={styles.viewSum}>
//                             </View>
//                         </View>
//                     </View>
//                     <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
//                         <View style={{ flex: 1 }}></View>
//                         <View style={{ flex: 1 }}></View>
//                     </View>
//                     <View style={{ flexDirection: 'row', marginVertical: 20 }}>
//                         <DatePicker
//                             style={{ width: '100%', borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
//                             date={date.firstDay}
//                             mode="date"
//                             placeholder='chọn ngày'
//                             format="YYYY-MM-DD"
//                             minDate="2000-06-01"
//                             // maxDate="2016-06-01"
//                             confirmBtnText="Confirm"
//                             cancelBtnText="Cancel"
//                             customStyles={{
//                                 dateIcon: {
//                                     // position: 'absolute',
//                                     left: 0,
//                                     // top: 4,
//                                     marginLeft: 0
//                                 },
//                                 dateInput: {
//                                     marginRight: 10,
//                                     borderWidth: 0,
//                                     borderRightColor: COLOR.GRAY,
//                                     borderRightWidth: 1
//                                 }
//                                 // ... You can check the source to find the other keys.
//                             }}
//                             onDateChange={(e) => {
//                                 setDate({ ...date, firstDay: e })
//                                 setDate2({ ...date2, firstDay: e })
//                             }}
//                         />
//                         <DatePicker
//                             style={{ width: '100%', borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
//                             date={date.lastDay}
//                             mode="date"
//                             placeholder='chọn ngày'
//                             format="YYYY-MM-DD"
//                             minDate="2000-06-01"
//                             // maxDate="2016-06-01"
//                             confirmBtnText="Confirm"
//                             cancelBtnText="Cancel"
//                             customStyles={{
//                                 dateIcon: {
//                                     // position: 'absolute',
//                                     left: 0,
//                                     // top: 4,
//                                     marginLeft: 0
//                                 },
//                                 dateInput: {
//                                     marginRight: 10,
//                                     borderWidth: 0,
//                                     borderRightColor: COLOR.GRAY,
//                                     borderRightWidth: 1
//                                 }
//                                 // ... You can check the source to find the other keys.
//                             }}
//                             onDateChange={(e) => {
//                                 if (e >= date.firstDay) {
//                                     let a = new Date(e)
//                                     setDate({ ...date, lastDay: e })
//                                     setDate2({ ...date2, lastDay: formatDateIncreaseDay(a) })
//                                 } else {
//                                     Toast.show({
//                                         text1: translate('choose_a_bigger_date'),
//                                     })
//                                 }
//                             }}
//                         />
//                     </View>
//                     {UserInfo ? UserInfo.userType == "Agency" || UserInfo.userType == "General" || UserInfo.userType == "Khach_hang" ? null : <>
//                         {UserInfo.userType === "Tram" || UserInfo.userType === "Factory" ? null : <>
//                             <Text style={styles.TimeTitle}>Trạm:</Text>
//                             <View style={{ borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, marginTop: 10 }}>
//                                 <Picker
//                                     selectedValue={supplier}
//                                     style={{ height: 40, width: "100%" }}
//                                     onValueChange={(e) => {
//                                         setSupplier(e)
//                                         setdt("")
//                                         setkh("")
//                                         setDoiTuong({ customerRole: "", customerType: "" })
//                                         // console.log(e)
//                                     }}>
//                                     <Picker.Item label={translate('ALL')} value={""} />
//                                     {temp.listStation ? temp.listStation.map((item, index) => {
//                                         return (<Picker.Item label={item.name} value={item.id} key={index} />)
//                                     }) : null}
//                                 </Picker>
//                             </View>
//                             <Text style={styles.TimeTitle}>Khu vực:</Text>
//                             <View style={{ borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, marginTop: 10 }}>
//                                 <Picker
//                                     selectedValue={area}
//                                     style={{ height: 40, width: "100%" }}
//                                     onValueChange={(e) => {
//                                         // getListCustomers(e)
//                                         // console.log(e)

//                                     }}>
//                                     <Picker.Item label={translate('ALL')} value={""} />
//                                     {/* {temp.lisCustomers ? temp.lisCustomers.map((item, index) => {
//                             return (<Picker.Item label={item.name} value={item} key={index} />)
//                         }) : null} */}
//                                 </Picker>
//                             </View></>}
//                         <Text style={styles.TimeTitle}>Đối tượng:</Text>
//                         <View style={{ borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, marginTop: 10 }}>
//                             <Picker
//                                 selectedValue={dt}
//                                 style={{ height: 40, width: "100%" }}
//                                 onValueChange={(e) => {
//                                     setDoiTuong({ ...doiTuong, customerRole: "SuperAdmin", customerType: e, })
//                                     setdt(e)
//                                     getListCustomers("", e)
//                                     // console.log(e)
//                                     setkh("")

//                                 }}>
//                                 <Picker.Item label={translate('ALL')} value={""} />
//                                 {loaiKH.map((item, index) => {
//                                     return (<Picker.Item label={item.name} value={item.userRole} key={index} />)
//                                 })}
//                             </Picker>
//                         </View>
//                         <Text style={styles.TimeTitle}>khách hàng:</Text>
//                         <View style={{ borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, marginTop: 10 }}>
//                             <Picker
//                                 selectedValue={kh}
//                                 style={{ height: 40, width: "100%" }}
//                                 onValueChange={(e) => {
//                                     setkh(e)
//                                     // getListCustomers(e)
//                                     // console.log(e)

//                                 }}>
//                                 <Picker.Item label={translate('ALL')} value={""} />
//                                 {temp.lisCustomers ? temp.lisCustomers.map((item, index) => {
//                                     return (<Picker.Item label={item.name} value={item} key={index} />)
//                                 }) : null}
//                             </Picker>
//                         </View></> : null}
//                 </View>
//             </ScrollView>
//             <View style={{ justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
//                 <TouchableOpacity
//                     style={styles.btnContinue}
//                     onPress={() => {
//                         setDate({ ...date, firstDay: null, lastDay: null })
//                         setDate2({ ...date2, firstDay: null, lastDay: null })
//                         setDoiTuong({ customerRole: "", customerType: "" })
//                         setSupplier("")
//                         setdt("")
//                         setkh("")
//                     }}>
//                     <Text
//                         style={{
//                             fontSize: 20,
//                             color: COLOR.WHITE
//                         }}
//                     >
//                         {translate('DELETE_ALL')}
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.btnContinue}
//                     onPress={() => {
//                         if ((date.firstDay && date.lastDay)) {
//                             // props.navigation.navigate('OrderManagement', { date });
//                             // setShow(false)
//                             getStatistic()
//                             // setTimeout(() => { Actions['statisticCustomer']({ date,  }) }, 1000)
//                             // geOrderByDate()

//                             // console.log(date, doiTuong)
//                         } else {
//                             Toast.show({
//                                 text1: translate('PLEASE_CHOOSE_A_DATE'),
//                             })
//                         }

//                     }}>
//                     <Text
//                         style={{
//                             fontSize: 20,
//                             color: COLOR.WHITE
//                         }}
//                     >
//                         {translate('APPLY')}
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//             <Toast
//                 backgroundColor="#fffff"
//                 autoHide={true}
//                 visibilityTime={visibilityTime}
//                 ref={(ref) => {
//                     Toast.setRef(ref);
//                 }}
//             />
//         </SafeAreaView >
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLOR.WHITE,
//     },
//     txtNotification: {
//         color: COLOR.BLACK,
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10
//     },
//     btnContinue: {
//         flex: 1,
//         backgroundColor: COLOR.ORANGE,
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 50,
//         marginHorizontal: 10,
//         borderRadius: 50
//     },
//     title: {
//         fontSize: 16,
//         paddingVertical: 2,
//         color: COLOR.DARKGRAY,
//         fontWeight: '600',
//         marginTop: 10,
//         marginLeft: 10
//     },
//     ViewCheckBox: (isChoosing) => {
//         return {
//             marginTop: 2,
//             width: 12,
//             height: 12,
//             borderRadius: 15,
//             borderWidth: 2,
//             borderColor: isChoosing === "" ? COLOR.WHITE : COLOR.DARKGRAY,
//             backgroundColor: isChoosing === "" ? COLOR.WHITE : COLOR.BLACK,

//         };
//     },
//     ViewCheckBox2: {
//         marginTop: 10,
//         width: 20,
//         height: 20,
//         borderRadius: 15,
//         borderWidth: 2,
//         borderColor: COLOR.BLACK,
//         alignItems: 'center'
//     },
//     TimeTitle: {
//         marginTop: 10,
//         fontSize: 16,
//         color: COLOR.RED,
//         fontWeight: '600'
//     },
//     viewSum: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1
//     },
//     Nav_container: {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 16,
//         backgroundColor: '#009347',
//     },
//     Nav_title: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#fff'
//     }
// });