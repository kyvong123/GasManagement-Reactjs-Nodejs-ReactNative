import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Modal,
    TextInput,
    SafeAreaView, Picker
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getLstChilds } from "../../actions/OrderActions";
import { getToken, getUserInfo } from '../../helper/auth';
import { Actions } from 'react-native-router-flux';
import statisticsApi from '../../api/statistics2';
import Images from "../../constants/image";
import Icon from 'react-native-vector-icons/Ionicons';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import { COLOR } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { confirmationJarError, getDeliveryStatistics, getJarError, getJarErrorDetails, getListJarError } from '../../api/orders_new';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import Toast from 'react-native-toast-message'
import { FACTORY, OWNER, SALESMANAGER, TONG_CONG_TY, TRAM, TRUONG_TRAM } from '../../types';



const StatisticJarErrorDetails = (props) => {
    const visibilityTime = 2500;
    const [isShowLoading, setIsShowLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleView, setModalVisibleView] = useState(false);
    const [checkAccountTruong_tram, setCheckAccountTruong_tram] = useState(false);//kiem tra tai khoản trưởng trạm
    const [checkAccountTPKD, setCheckAccountTPKD] = useState(false);//kiem tra tai khoản trưởng phòng kinh doanh

    //
    const [dataStatistic, setDataStatistic] = useState([])
    const [statisticDeltails, setStatisticDeltails] = useState(null)
    const [listError, setListError] = useState()
    const [body, setBody] = useState({
        idHistoryCylinder: null,
        reasonReturnStationchief: null,
        noteStationchief1: "",
        noteStationchief2: ""
    })

    //date
    const [date, setDate] = useState({ firstDay: null, lastDay: null })
    const now = new Date();

    const checAccount = async () => {
        const userinfor = await getUserInfo()
        //check account 
        if (userinfor.userType == TONG_CONG_TY && userinfor.userRole == SALESMANAGER) {
            setCheckAccountTPKD(true)
        } else if (userinfor.userType == TRAM && userinfor.userRole == TRUONG_TRAM ||
            userinfor.userType == FACTORY && userinfor.userRole == OWNER) {
            setCheckAccountTruong_tram(true)
        }
    }

    //formmat date
    const formatDate = (date) => {
        const newDate = date.split('-')
        const text = newDate[2] + '/' + newDate[1] + '/' + newDate[0]
        return text
    }
    //danh sách lỗi bình
    const getListError = async () => {
        const response = await getJarError()
        if (response.success) {
            setListError(response.data)
        }
    }

    const getStatistic = async () => {
        // if (checkAccountTPKD) {
        //     setDataStatistic(props.detailStatistic.cylinders.filter(e => e.reasonReturnStationchief))
        // }
        setDataStatistic(props.detailStatistic.cylinders)
    }
    //lấy chi tiết bình 
    const getStatisticDetails = async (idHistoryCylinder) => {
        const response = await getJarErrorDetails(idHistoryCylinder)
        if (response.success) {
            setStatisticDeltails(response.data)
            const temp = listError.filter(e => e.name === response.data[0].reasonOfDriver.reason)
            setBody({ ...body, idHistoryCylinder: response.data[0]._id, reasonReturnStationchief: temp[0].id })
        }
    }
    //cập nhật lại danh sách
    const getStatisticConfirmation = async () => {
        try {
            const response = await getListJarError(props.date.firstDay, props.date.lasttDay)
            if (response.success) {
                const temp = response.data.filter(e => e._id === props.detailStatistic._id)
                // console.log(temp)
                setDataStatistic(temp[0].cylinders)
            }
        } catch (err) {
            console.log("LỖI FETCH API,", err);
        }
    }


    //xác nhận 
    const confirmation = async () => {
        if (body.noteStationchief2 != "") {
            setIsShowLoading(true)
            const response = await confirmationJarError(body)
            if (response.success) {
                Toast.show({
                    text1: "Thành công",
                })

                //cập nhật lại danh sách
                getStatisticConfirmation()
                setModalVisible(!modalVisible)
                setIsShowLoading(false)
            } else {
                Toast.show({
                    text1: "Thất bại",
                })
                setIsShowLoading(false)
            }
        } else {
            Toast.show({
                text1: "Nhập giải pháp",
            })
            setIsShowLoading(false)
        }
    }

    useEffect(() => {
        checAccount()
        getStatistic()
        getListError()
        // console.log(props)
    }, [props]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.Nav_container}>
                <TouchableOpacity
                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                    onPress={() => Actions['statisticJarError']({})}
                >
                    <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
                </TouchableOpacity>
                <Text style={styles.Nav_title}>{props.detailStatistic.name}</Text>
                <View style={{ marginRight: 5 }}></View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.viewTitle}>
                    <Text style={[styles.txtItemStatistic, { fontWeight: "bold" }]}>Mã bình</Text>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={[styles.txtItemStatistic, { fontWeight: "bold" }]}>Thời gian báo</Text>
                </View>
                <View style={styles.viewTitle}>
                    <Text style={[styles.txtItemStatistic, { fontWeight: "bold" }]}>Thao Tác</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {dataStatistic ? <>
                    {dataStatistic.map((item, index) =>
                        <>
                            <View style={styles.itemStatistic} >
                                <View style={[styles.viewTitle, { backgroundColor: COLOR.WHITE }]}>
                                    <Text style={styles.txtItemStatistic}>{item.serial}</Text></View>
                                <View style={[styles.viewTitle, { backgroundColor: COLOR.WHITE }]}>
                                    <Text style={styles.txtItemStatistic}> {moment(item.reasonCreatedAt).format("MM:HH DD/MM")}</Text></View>
                                <View style={[styles.viewTitle, { backgroundColor: COLOR.WHITE, }]}>
                                    {checkAccountTruong_tram ?
                                        (item.reasonReturnStationchief ?
                                            <TouchableOpacity style={[styles.btnXN, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                onPress={() => {
                                                    getStatisticDetails(item.idHistory)
                                                    setModalVisibleView(true)
                                                }}>
                                                <Text style={{ color: COLOR.WHITE, fontSize: 13 }}>Đã xác nhận</Text>
                                            </TouchableOpacity> : <TouchableOpacity style={styles.btnXN}
                                                onPress={() => {
                                                    // setItemStatistic(item)
                                                    getStatisticDetails(item.idHistory)
                                                    setModalVisible(true)
                                                }}>
                                                <Text style={{ color: COLOR.DARKGRAY }}>Xác nhận</Text>
                                            </TouchableOpacity>)
                                        : checkAccountTPKD ?
                                            (item.reasonReturnStationchief ?
                                                <TouchableOpacity style={[styles.btnXN, { backgroundColor: COLOR.GREEN_MAIN }]}
                                                    onPress={() => {
                                                        getStatisticDetails(item.idHistory)
                                                        setModalVisibleView(true)
                                                    }}>
                                                    <Text style={{ color: COLOR.WHITE, fontSize: 13 }}> Xem</Text>
                                                </TouchableOpacity> : <View style={styles.btnXN}>
                                                    <Text style={{ color: COLOR.DARKGRAY }}>Đang duyệt</Text>
                                                </View>) : null}
                                </View>
                            </View>

                        </>
                    )}
                </> : null}
                {/* //tài khoản trưởng trạm */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <TouchableOpacity style={styles.centeredView}
                        onPress={() => { setModalVisible(!modalVisible) }}>
                        <View style={[styles.modalView, { marginTop: 100 }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20, }]}>Mã bình:</Text>
                                <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>{statisticDeltails ? statisticDeltails[0].serial : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20 }]}>Tài xế báo:</Text>
                                <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>{statisticDeltails ? statisticDeltails[0].reasonOfDriver.reason : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20, color: COLOR.DARKGRAY }]}>{statisticDeltails ? statisticDeltails[0].reasonOfDriver.driverName : null}</Text>
                                <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>{statisticDeltails ? moment(statisticDeltails[0].reasonOfDriver.createdAt).format("MM:HH DD/MM") : null}</Text>
                            </View>
                            <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>Xác nhận lỗi:</Text>
                            <View style={styles.ViewPicker}>
                                <Picker
                                    selectedValue={body.reasonReturnStationchief}
                                    style={{ height: 40, width: "100%", color: COLOR.GREEN_MAIN, }}
                                    onValueChange={(e) => {
                                        setBody({ ...body, reasonReturnStationchief: e })
                                    }}>
                                    <Picker.Item label="Xì van đầu bình" value={""} />
                                    {listError ? listError.map((item, index) => {
                                        return (<Picker.Item label={item.name} value={item.id} key={index} />)
                                    }) : null}
                                </Picker>
                            </View>
                            <TextInput
                                style={[styles.inputNote, { height: 40 }]}
                                placeholder="Nhập lỗi khác"
                                onChangeText={(e) => { setBody({ ...body, noteStationchief1: e }) }}>
                            </TextInput>
                            <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>Giải pháp xử lý:</Text>
                            <TextInput
                                style={styles.inputNote}
                                placeholder="nhập giải pháp"
                                multiline={true}
                                onChangeText={(e) => { setBody({ ...body, noteStationchief2: e }) }}>
                            </TextInput>
                            {!isShowLoading ? <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => confirmation()}>
                                <Text style={styles.textStyle}>Lưu</Text>
                            </TouchableOpacity> :
                                <View style={{ paddingVertical: 10 }}>
                                    <ActivityIndicator size="large" color="#00ff00" />
                                </View>}
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* //tài khoản trưởng phòng kinh doanh */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleView}
                >
                    <TouchableOpacity style={styles.centeredView}
                        onPress={() => { setModalVisibleView(!modalVisibleView) }}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20, }]}>Mã bình:</Text>
                                <Text style={styles.modalText}>{statisticDeltails ? statisticDeltails[0].serial : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20, color: COLOR.DARKGRAY }]}>Tài xế báo:</Text>
                                <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>{statisticDeltails ? statisticDeltails[0].reasonOfDriver.reason : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20 }]}>{statisticDeltails ? statisticDeltails[0].reasonOfDriver.driverName : null}</Text>
                                <Text style={styles.modalText}>{statisticDeltails ? moment(statisticDeltails[0].reasonOfDriver.createdAt).format("MM:HH DD/MM") : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20, color: COLOR.DARKGRAY }]}>Trưởng trạm xác nhận:</Text>
                                <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>{statisticDeltails ? statisticDeltails[0].reasonOfStationChief.reason : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Text style={[styles.modalText, { marginRight: 20 }]}>Lỗi khác: </Text>
                                        <Text style={styles.modalText}>{statisticDeltails ? statisticDeltails[0].reasonOfStationChief.noteStationchief1 : null}</Text> */}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20 }]}>{statisticDeltails ? statisticDeltails[0].reasonOfStationChief.stationChiefName : null}</Text>
                                <Text style={styles.modalText}>{statisticDeltails ? moment(statisticDeltails[0].reasonOfStationChief.createdAt).format("MM:HH DD/MM") : null}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.modalText, { marginRight: 20, color: COLOR.DARKGRAY }]}>Giải pháp xử lý:</Text>
                                <Text style={[styles.modalText, { color: COLOR.DARKGRAY }]}>{statisticDeltails ? statisticDeltails[0].solution : null}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLOR.ORANGE, marginTop: 20 }]}
                                onPress={() => setModalVisibleView(!modalVisibleView)}
                            >
                                <Text style={styles.textStyle}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
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
export default StatisticJarErrorDetails;

const styles = StyleSheet.create({
    container: {
        // flex: 1

    },
    articleSection: {
        flexDirection: 'row',
        padding: 10,
        paddingVertical: 10,
        backgroundColor: COLOR.GRAY_OPTION
    },
    Nav_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#009347',
        alignItems: 'center'
    },
    Nav_title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'
    },
    itemStatistic: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // // padding: 20,
        // borderBottomColor: COLOR.GRAY_OPTION,
        // borderBottomWidth: 2,
    }, txtItemStatistic: {
        // fontSize: 1,
        color: COLOR.DARKGRAY
    }, viewTitle: {
        flex: 1,
        borderColor: COLOR.GRAY,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOR.GRAY_OPTION
    }, btnXN: {
        backgroundColor: COLOR.GRAY_OPTION,
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 5
    }, button: {
        borderRadius: 10,
        padding: 10,
        // elevation: 2
    },
    buttonClose: {
        backgroundColor: COLOR.GREEN_MAIN,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 10,
        // textAlign: "center"
        fontWeight: 'bold',
        fontSize: 15,
    },
    centeredView: {
        flex: 1,
    },
    modalView: {
        // flex: 1,
        marginTop: 160,
        marginHorizontal: 20,
        backgroundColor: COLOR.GRAY_OPTION,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }, inputNote: {
        height: 100,
        backgroundColor: COLOR.WHITE,
        textAlignVertical: 'top',
        borderRadius: 5,
        marginBottom: 15
    }, ViewPicker: {
        borderColor: COLOR.GRAY,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: COLOR.WHITE
    }
})


