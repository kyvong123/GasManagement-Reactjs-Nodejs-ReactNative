import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { COLOR } from '../../constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { translate } from '../../utils/changeLanguage';
// import LineOrderItem from '../../components/LineOrderItem';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-toast-message'
import { getListJarError, getListOrderByDate } from '../../api/orders_new';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../../helper/auth';
import { FACTORY, OWNER, SALESMANAGER, TONG_CONG_TY, TRAM, TRUONG_TRAM } from '../../types';
// import { listOrderofOrderManager } from '../../actions/listOrderActions';

const FilterStatisticJarError = (props) => {

    // const dispatch = useDispatch();
    // const listOrderOfDate = useSelector(listOrder => listOrder);
    const visibilityTime = 2000;
    const [checkAccountTruong_tram, setCheckAccountTruong_tram] = useState(false);//kiem tra tai khoản trưởng trạm
    const [checkAccountTPKD, setCheckAccountTPKD] = useState(false);//kiem tra tai khoản trưởng phòng kinh doanh

    const [date, setDate] = useState({
        firstDay: null,
        lastDay: null
    })
    const [date2, setDate2] = useState({
        firstDay: null,
        lastDay: null
    })
    const now = new Date();
    const [selected, setSelected] = useState({
        homNay: "",
        tuanNay: "",
        thangNay: "",
        thangTruoc: "",
        tuyChon: "",
    });

    const checAccount = async () => {
        const userinfor = await getUserInfo()
        //check account 
        if (userinfor.userType == TONG_CONG_TY && userinfor.userRole == SALESMANAGER) {
            setCheckAccountTPKD(true)
        } else if (userinfor.userType == TRAM && userinfor.userRole == TRUONG_TRAM||
            userinfor.userType == FACTORY && userinfor.userRole == OWNER) {
            setCheckAccountTruong_tram(true)
        }
    }
    //formmat date
    const formatDate = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        const text = year + '-' + month + '-' + dt
        return text
    }
    const formatDate2 = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate() + 1;

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        const text = year + '-' + month + '-' + dt
        return text
    }

    const getToDay = () => {
        setDate({ ...date, firstDay: formatDate(now), lastDay: formatDate(now) })
        setDate2({ ...date2, firstDay: formatDate(now), lastDay: formatDate2(now) })
    }
    const getThisWeek = () => {
        const firstDay = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 7));
        setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
        setDate2({ ...date2, firstDay: formatDate(firstDay), lastDay: formatDate2(lastDay) })
    }
    const getThisMonth = () => {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
        setDate2({ ...date2, firstDay: formatDate(firstDay), lastDay: formatDate2(lastDay) })
    }
    const getLastMonth = () => {
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

        setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
        setDate2({ ...date2, firstDay: formatDate(firstDay), lastDay: formatDate2(lastDay) })
    }

    const geOrderByDate = async () => {
        try {
            const data = await getListJarError(date2.firstDay, date2.lastDay)
            if (data.success) {
                if (checkAccountTPKD) {
                    // const temp = data.data.filter(e => e.cylinders.find(a => a?.reasonReturnStationchief != undefined))
                    // const temp2 = temp.map(e => e.cylinders.find(a => a?.reasonReturnStationchief != undefined))
                    // const temp3 = { ...temp[0], cylinders: temp2 }
                    // console.log(data.data)
                    // console.log("2222", temp)
                    props.navigation.navigate('statisticJarError', { date, list: data.data, date2 })
                } else {
                    props.navigation.navigate('statisticJarError', { date, list: data.data, date2 })
                }

            } else {
                props.navigation.navigate('statisticJarError', { date, list: [] })
            }
        } catch (err) {
            console.log("LỖI FETCH API,", err);
        }
        // props.navigation.navigate('statisticJarError', { date })
    }
    useEffect(() => {
        checAccount()
    }, [props]);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.Nav_container}>
                <TouchableOpacity
                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                    onPress={() => Actions['statisticJarError']({})}
                >
                    <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
                </TouchableOpacity>
                <Text style={styles.Nav_title}>{translate('FILTER')}</Text>
                <View style={{ width: 30 }}></View>
            </View>
            <View style={{ flex: 9, marginHorizontal: 20 }}>
                <Text style={styles.TimeTitle}>{translate('TIME')}:</Text>
                <View style={{ marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.viewSum}>
                            <View style={styles.ViewCheckBox2}>
                                <TouchableOpacity style={styles.ViewCheckBox(selected.homNay)}
                                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                                    onPress={() => {
                                        setSelected({
                                            ...selected,
                                            homNay: "homNay", tuanNay: "",
                                            thangNay: "", thangTruoc: "", tuyChon: ""
                                        })
                                        getToDay()
                                    }} />
                            </View>
                            <Text style={styles.title}>{translate('TODAY')}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', flex: 1,

                        }}>
                            <View style={styles.ViewCheckBox2}>
                                <TouchableOpacity style={styles.ViewCheckBox(selected.tuanNay)}
                                    onPress={() => {
                                        setSelected({
                                            ...selected, homNay: "",
                                            tuanNay: "tuanNay", thangNay: "", thangTruoc: "", tuyChon: ""
                                        })
                                        getThisWeek()
                                    }} />
                            </View>
                            <View>
                                <Text style={styles.title}>{translate('THISWEEK')}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <View style={styles.viewSum}>
                            <View style={styles.ViewCheckBox2}>
                                <TouchableOpacity style={styles.ViewCheckBox(selected.thangNay)}
                                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                                    onPress={() => {
                                        setSelected({
                                            ...selected, homNay: "",
                                            tuanNay: "", thangNay: "thangNay", thangTruoc: "", tuyChon: ""
                                        })
                                        getThisMonth()
                                    }} />
                            </View>
                            <Text style={styles.title}>{translate('THISMONTH')}</Text>
                        </View>
                        <View style={styles.viewSum}>
                            <View style={styles.ViewCheckBox2}>
                                <TouchableOpacity style={styles.ViewCheckBox(selected.thangTruoc)}
                                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                                    onPress={() => {
                                        setSelected({
                                            ...selected, homNay: "",
                                            tuanNay: "", thangNay: "", thangTruoc: "thangTruoc", tuyChon: ""
                                        })
                                        getLastMonth()
                                    }} />
                            </View>
                            <View>
                                <Text style={styles.title}>{translate('LASTMONTH')}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.viewSum}>
                            <View style={styles.ViewCheckBox2}>
                                <TouchableOpacity style={styles.ViewCheckBox(selected.tuyChon)}
                                    onPress={() => {
                                        setSelected({
                                            ...selected, homNay: "",
                                            tuanNay: "", thangNay: "", thangTruoc: "", tuyChon: "tuyChon"
                                        })
                                        // console.log("@@@@@@", listOrderOfDate.listOrderReducer.ArrayListOrder)
                                    }} />
                            </View>
                            <Text style={styles.title}>{translate('CUSTOMRANGE')}</Text>
                        </View>
                        <View style={styles.viewSum}>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                    <DatePicker
                        style={{ width: '100%', borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
                        date={date.firstDay}
                        mode="date"
                        placeholder='chọn ngày'
                        format="YYYY-MM-DD"
                        minDate="2000-06-01"
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                // position: 'absolute',
                                left: 0,
                                // top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginRight: 10,
                                borderWidth: 0,
                                borderRightColor: COLOR.GRAY,
                                borderRightWidth: 1
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(e) => {
                            setDate({ ...date, firstDay: e })
                            setDate2({ ...date2, firstDay: e })
                        }}
                    />
                    <DatePicker
                        style={{ width: '100%', borderColor: COLOR.GRAY, borderWidth: 1, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
                        date={date.lastDay}
                        mode="date"
                        placeholder='chọn ngày'
                        format="YYYY-MM-DD"
                        minDate="2000-06-01"
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                // position: 'absolute',
                                left: 0,
                                // top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginRight: 10,
                                borderWidth: 0,
                                borderRightColor: COLOR.GRAY,
                                borderRightWidth: 1
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(e) => {

                            if (e >= date.firstDay) {
                                let a = new Date(e)
                                // console.log(formatDate2(a))
                                setDate({ ...date, lastDay: e })
                                setDate2({ ...date2, lastDay: formatDate2(a) })
                            } else {
                                Toast.show({
                                    text1: translate('choose_a_bigger_date'),
                                })
                            }
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <TouchableOpacity
                    style={styles.btnContinue}
                    onPress={() => {
                        if ((date.firstDay && date.lastDay)) {
                            geOrderByDate()
                            // setTimeout(() => { props.navigation.navigate('OrderManagement', { date }); }, 2000)
                            // Actions['OrderManagement']({date})
                        } else {
                            Toast.show({
                                text1: translate('PLEASE_CHOOSE_A_DATE'),
                            })
                        }

                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            color: COLOR.WHITE
                        }}
                    >
                        {translate('APPLY')}
                    </Text>
                </TouchableOpacity>
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
        backgroundColor: COLOR.WHITE,
    },
    txtNotification: {
        color: COLOR.BLACK,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    btnContinue: {
        backgroundColor: COLOR.ORANGE,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginHorizontal: 70,
        borderRadius: 50
    },
    title: {
        fontSize: 16,
        paddingVertical: 2,
        color: COLOR.DARKGRAY,
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 10
    },
    ViewCheckBox: (isChoosing) => {
        return {
            marginTop: 2,
            width: 12,
            height: 12,
            borderRadius: 15,
            borderWidth: 2,
            borderColor: isChoosing === "" ? COLOR.WHITE : COLOR.DARKGRAY,
            backgroundColor: isChoosing === "" ? COLOR.WHITE : COLOR.BLACK,

        };
    },
    ViewCheckBox2: {
        marginTop: 10,
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLOR.BLACK,
        alignItems: 'center'
    },
    TimeTitle: {
        marginTop: 10,
        fontSize: 15,
        color: COLOR.DARKGRAY,
        fontWeight: '600'
    },
    viewSum: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
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


export default FilterStatisticJarError;