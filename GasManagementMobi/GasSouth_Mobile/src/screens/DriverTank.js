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
    getAllShippingOrderTankInit
} from '../actions/OrderActions';
// thu vien moi 

import { setLanguage, getLanguage } from "../helper/auth";
import IconEntypo from 'react-native-vector-icons/Entypo';
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
class DriverTank extends Component {
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

    componentDidMount = async () => {

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
            console.log("userTye: FACTORY - userRole: DELIVER");
            this.user = this.props.user.id
            this.props.getAllShippingOrderTankInit(this.user)

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

            if (prevProps.resultGetOrdertank !== this.props.resultGetOrdertank) {

                this.setState({ listOrder: this.props.resultGetOrdertank.ExportOrders })
                console.log('!==hoa day ne', this.state.listOrder);
                let listOrder;
                const list = this.props.resultGetOrdertank.ExportOrders;
                //lọc theo kkho, nếu có

                console.log("ádasdasdasdasdasd", list)
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


        console.log('sauupdate-state.listOrder', this.state.listOrder);
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () {
            if (
                this.props.user.userType === FACTORY &&
                this.props.user.userRole === SUPER_ADMIN
            ) {
                console.log("userTye: FACTORY - userRole: SUPER_ADMIN");

                this.user = this.props.user.id
                this.props.getAllShippingOrderTankInit(this.user)
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
        //const listOrder = this.props.resultGetOrdertank.order
        const listOrder = this.props.resultGetOrdertank.ExportOrders;
        console.log("hoooooooooooooooooooooooooo");
        console.log('tetsss-------', this.state.listOrder);
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
                            break;

                        default:
                            break;
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

        let Type_ = 'Khởi tạo'
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
    Ordertentype(type) {

        let Type_ = 'Đơn'
        switch (type) {
            case 'X':
                Type_ = 'Xuất'
                break
            case 'N':
                Type_ = 'Nhập'
                break
        }
        return <View>
            <Text
               style={styles.title}>
                {' '} {Type_}
            </Text>
        </View>
    }
    OrderItem(data, isWarning = false, style) {


        return <View>
            <TouchableOpacity
                style={[{
                    flexDirection: 'row',
                    justifyContent: 'space-between'

                }, style]}
                onPress={() => {
                    this.setState({ isShowModalSearch: false }, () => {
                        Actions['DriverTankDetail']({
                            exportOrderID: data.id,

                        })
                    })
                }
                }
            >

                <View >
                    <View style={{ flexDirection: 'row' }}>
                        <IconEntypo
                            style={{ marginTop: 5 }}
                            color="#009347"
                            size={25}
                            name="clipboard"
                        >
                            {' '}
                        </IconEntypo>
            {this.Ordertentype(data.type)}
                    </View>



                    <View style={styles.viewFlex} numberOfLines={2}>
                        <Text style={styles.viewTitle}>
                            Ngày giao:</Text>
                        <Text >{data.deliveryDate} {' - '} {data.deliveryHours}</Text>
                    </View>
                    <View style={styles.viewFlex} numberOfLines={2}>
                        <Text style={styles.viewTitle}>
                            Ghi chú:</Text>
                        <Text  >{data.node}</Text>
                    </View>
                </View>





                <View
                    style={{ justifyContent: 'flex-end' }}>
                    {this.OrderType(data.status)}
                </View>
            </TouchableOpacity>

              <View style={{ alignContent: 'center', alignItems: 'center' }}>
                 <View
                    style={{
                        height: 2,
                        backgroundColor: '#009347',
                        marginTop: 10,
                        width: width - 120,
                    }}
                />
         </View>  

        </View>
    }



    render() {
        console.log("tádsdasdasdasdasdasdasd",this.state.listOrder)
        const {
            resultGetOrdertank,
            resultGetOrderHistory,
        } = this.props;
        const {
            exportWareHouse
        } = this.state;
        const listOrder = resultGetOrdertank.ExportOrders
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



    title: {
        fontSize: 25,
        color: '#009347',
        fontWeight: 'bold',
    },
    viewTitle: {
        fontWeight: 'bold',
        marginRight: 10,
        fontSize: 18,
    },
    viewText: {
        fontSize: 16,
    },
    viewFlex: {
        flexDirection: 'row',

    },
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
    console.log('mapresultgetorder', state.order.result_GetAllShippingOrderTankInit);

    return ({
        user: state.auth.user,
        resultGetOrdertank: state.order.result_GetAllShippingOrderTankInit,

        resultGetOrderHistory: state.order.resultGetOrderHistory,
        userInfor: state.auth.user,
    })
}

export default connect(
    mapStateToProps,
    {
        getAllShippingOrderTankInit
    }
)(DriverTank)