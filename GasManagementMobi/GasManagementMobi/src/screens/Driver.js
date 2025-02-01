import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,

    TouchableOpacity,
    Platform, ActivityIndicator
} from 'react-native'
import {
    FACTORY,
    SUPER_ADMIN, DELIVER
} from "../types";
import { COLOR } from '../constants';
import { Actions } from 'react-native-router-flux';

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { connect } from "react-redux";
import {
    getAllShippingOrderInit
} from '../actions/OrderActions';
// thu vien moi 

import { setLanguage, getLanguage } from "../helper/auth";
// import { getToken, getUserInfo } from "../helper/auth";
// import moment from 'moment'
const { width } = Dimensions.get('window')

const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json')
}

const chooseLanguageConfig = (lgnCode) => {
    let fallback = { languageTag: 'vi' }
    if (Object.keys(translationGetters).includes(lgnCode)) {
        fallback = { languageTag: lgnCode }
    }

    const { languageTag } = fallback

    translate.cache.clear()

    i18n.translations = { [languageTag]: translationGetters[languageTag]() }
    i18n.locale = languageTag
}

const handleChangeLanguage = (lgnCode) => {
    setLanguage(lgnCode);
    chooseLanguageConfig(lgnCode)
}

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)
let listHistory;
class Driver extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: null,
            listOrder: [],

            listBtn: btn,
            isFetching: false,
            valueWareHouse: null,
            exportWareHouse: '',
            searchWord: '',
            isShowModalSearch: false,
            isSearching: false,
            message: 'No result',
            isLoading: true,
            isLoadingdon: true,
            type: '',

        }
        this.user = null
        this.idxClick = 1;
        this.onValue = null;
        this.ExportWareHousepickerCustomRef = React.createRef();

    }
    // onOpened(openResult) { // HERE I WANT TO NAVIGATE TO ANOTHER SCREEN INSTEAD OF HOME SCREEN
    //     this.isNotification = true;

    //     let data = openResult.notification.payload.additionalData;
    //     let inFocus = openResult.notification.isAppInFocus;
    //     if(openResult.notification.payload.title==="Thông báo đơn vận chuyển"){
    //     Actions.DetailForDriver(openResult.notification.payload.additionalData.iddata)
    //     }

    //     // Actions.filter();
    //   }
    componentDidMount = async () => {
        // OneSignal.init("8f2c576d-d40e-4e63-a95b-e64064a8e353");

        // OneSignal.setLogLevel(6, 0);

        // // // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
        // OneSignal.init('YOUR_ONESIGNAL_APP_ID', {
        //   kOSSettingsKeyAutoPrompt: false,
        //   kOSSettingsKeyInAppLaunchURL: false,
        //   kOSSettingsKeyInFocusDisplayOption: 2,
        // });
        // OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

        // // // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
        // OneSignal.promptForPushNotificationsWithUserResponse(this.myiOSPromptCallback);

        // OneSignal.addEventListener('received', this.onReceived);
        // OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.addEventListener('ids', this.onIds);
        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
            }
        }
        catch (error) {
            console.log(error);
        }


        const { userInfor, listWarehouse } = this.props;
        if (
            this.props.user.userType === FACTORY &&
            this.props.user.userRole === DELIVER
        ) {
            this.user = this.props.user.id
            this.props.getAllShippingOrderInit(this.user)

        }


    }

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.user.userType === FACTORY &&
            this.props.user.userRole === DELIVER
        ) {

            if (prevProps.resultGetOrder !== this.props.resultGetOrder) {

                this.setState({ listOrder: this.props.resultGetOrder.ShippingOrder })
                let listOrder;
                const list = this.props.resultGetOrder.ShippingOrder;
                //lọc theo kkho, nếu có
                listOrder = list;
                if (list) {
                    switch (this.idxClick) {
                        case 1:
                            listOrder = listOrder.filter((item) => item.status == '2'


                            )
                            break;

                        case 2:
                            listOrder = listOrder.filter((item) => item.status == '3')
                            break

                        default:
                            break
                    }
                    this.setState({

                        isLoadingdon: false
                    })
                }
                else {

                }
                //lọc theo trạng thái nều có



                this.setState({
                    listOrder: listOrder,
                    isFetching: false,
                    isLoading: false
                })

            }
        }
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () {
            if (
                this.props.user.userType === FACTORY &&
                this.props.user.userRole === SUPER_ADMIN
            ) {

                this.user = this.props.user.id
                this.props.getAllShippingOrderInit(this.user)
            }


            setTimeout(() => {
                this.setState({ isFetching: false })
            }, 1500)
        })
    }

    getTimeDayMonth(time) {
        const date = new Date(time)

        return `${date.getDate()}/${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`
    }

    getDateToCompare(time) {
        const date = new Date(time)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    ItemBottomButton() {
        return (
            [
                {
                    icon: 'truck',
                    text: translate('ISDELIVERING'),
                    color: COLOR.GRAY
                }, {
                    icon: 'shield-check',
                    text: translate('DONE'),
                    color: COLOR.GRAY
                }
            ]
        )
    }

    ButtonBottom(icon, text, color, index) {
        //const listOrder = this.props.resultGetOrder.order
        const listOrder = this.props.resultGetOrder.ShippingOrder;
        return <TouchableOpacity
            style={{
                alignItems: 'center'
            }}
            onPress={() => {
                let list

                this.state.listBtn = []
                this.idxClick = index + 1
                btn.map((item) => this.state.listBtn.push({ ...item, color: COLOR.GRAY }))
                this.state.listBtn[index].color = "#009347"
                list = listOrder
                if (listOrder) {
                    switch (this.idxClick) {
                        case 1:
                            list = list.filter((item) => item.status == '2'


                            )
                            break;

                        case 2:
                            list = list.filter((item) => item.status == '3')
                            break

                        default:
                            break
                    }
                    this.setState({

                        isLoadingdon: false
                    })
                }
                else { }



                this.setState({ ...this.state.listBtn, listOrder: list })
            }}
        >
            <IconMaterialCommunityIcons
                name={icon}
                size={26}
                color={color ? color : COLOR.DARKGRAY} />
            <Text
                style={{
                    color: color ? color : COLOR.DARKGRAY,
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 2
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    }


    //show trạng thái
    OrderType(type) {

        let Type_ = 'Trạng thái'
        switch (type) {
            case 2:
                Type_ = 'Đang giao'
                break
            case 3:
                Type_ = 'Hoàn thành'
                break
        }
        return <View>
            <Text
                style={{ fontSize: 14, color: COLOR.RED, fontWeight: 'bold' }}>
                {' '} {Type_}
            </Text>
        </View>
    }
    OrderItem(data, isWarning = false, style,) {
        let sum = 0

        // const startDayMonth = this.getTimeDayMonth(data.createdAt)
        // const endDayMontn = this.getTimeDayMonth(data.deliveryDate)

        return <TouchableOpacity
            style={[{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }, style]}
            onPress={() => {
                this.setState({ isShowModalSearch: false }, () => {
                    Actions['DetailForDriver']({
                        data: data.id,

                    })
                })
            }
            }
        >
            <View>
                <Text
                    style={{
                        fontSize: 16,
                        color: isWarning ? COLOR.RED : COLOR.BLACK,
                        marginBottom: 5,
                        fontWeight: 'bold'
                    }}
                    numberOfLines={1}
                >
                    {data.nameDriver}
                </Text>





                <Text style={{
                    fontSize: 14,
                    color: COLOR.DARKGRAY,
                    marginBottom: 5,

                }}
                    numberOfLines={1}>

                    Ngày giao: {data.deliveryDate} {' - '} {data.deliveryHours}
                </Text>





            </View>
            <View>


                <Text style={{
                    fontSize: 14,
                    color: COLOR.DARKGRAY,
                    marginBottom: 5,

                }}
                    numberOfLines={1}></Text>

                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {this.OrderType(data.status)}
                </View>
            </View>
        </TouchableOpacity>
    }



    render() {
        const {
            resultGetOrder,
            resultGetOrderHistory,
        } = this.props;
        const {
            exportWareHouse
        } = this.state;
        const listOrder = resultGetOrder.ShippingOrder
        listHistory = resultGetOrderHistory.orderHistories;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLOR.WHITE,
                    paddingTop: 10
                }}
            >

                {
                    this.state.isLoadingdon ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{this.state.isLoading ? <ActivityIndicator /> : <Text>{translate('NO_ORDER')}</Text>}</View>
                        :
                        <FlatList
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            contentContainerStyle={{
                                paddingTop: 10,
                                paddingHorizontal: 20
                            }}
                            data={this.state.listOrder}
                            keyExtractor={(item, index) => 'key ' + item}
                            renderItem={({ item, index }) => {
                                return this.OrderItem(
                                    item,
                                    false, {
                                    marginTop: index > 0 ? 20 : 0
                                })
                            }}
                        />
                }


                <View
                    style={{
                        height: 0.5,
                        backgroundColor: COLOR.GRAY
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: width * 0.11,
                        paddingVertical: 7,
                        marginBottom: Platform.OS === 'ios' ? 20 : 0
                    }}
                >
                    {this.state.listBtn.map((item, index) => {
                        return this.ButtonBottom(item.icon, translate(`${item.text}`), item.color, index)
                    })}
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    pickerContainer: {

    },
    searchCOntainerAdmin: {
        width: '90%',
        height: 40,
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        position: 'absolute',
        top: 68,
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
    searchCOntainerOwner: {
        width: '95%',
        height: 40,
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    todayText: {
        width: '90%',
        position: 'absolute',
        top: 68,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    todayTextFactory: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    }
})

const btn = [
    {
        icon: 'truck',
        text: 'ISDELIVERING',
        color: COLOR.GRAY
    }, {
        icon: 'shield-check',
        text: 'DONE',
        color: COLOR.GRAY
    }
]

export const mapStateToProps = state => {

    return ({
        user: state.auth.user,
        resultGetOrder: state.order.result_GetAllShippingOrderInit,
        resultGetOrderHistory: state.order.resultGetOrderHistory,
        userInfor: state.auth.user,
    })
}

export default connect(
    mapStateToProps,
    {
        getAllShippingOrderInit
    }
)(Driver)