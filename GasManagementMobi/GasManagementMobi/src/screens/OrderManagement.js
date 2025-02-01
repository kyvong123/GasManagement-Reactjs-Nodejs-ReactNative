import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Alert,
    TouchableOpacity,
    Platform, TextInput, ActivityIndicator
} from 'react-native'
import {
    FACTORY,
    SUPER_ADMIN, FIXER
} from "../types";
import { COLOR } from '../constants';
import { Actions } from 'react-native-router-flux';
import PickerCustom from './../components/PickerCustom';

import Icon from 'react-native-vector-icons/FontAwesome'
import IconFontisto from 'react-native-vector-icons/Fontisto'

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { connect } from "react-redux";
import Modal from 'react-native-modal';
import {
    getOrder,
    getOrderSuccess,
    getOrderFail,
    getOrderHistory,
    getOrderHistorySuccess,
    getOrderHistoryFail,
    getOrderFactory,
    getLstWareHouses
} from '../actions/OrderActions';
import { setLanguage, getLanguage } from "../helper/auth";
import { getToken, getUserInfo } from "../helper/auth";
import moment from 'moment'
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
class OrderManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: null,
            listWareHouse: [],
            listOrder: [],
            listOrder_org: [],
            listBtn: btn,
            isFetching: false,
            valueWareHouse: null,
            exportWareHouse: '',
            searchWord: '',
            listOrder2: [],
            search_result: [],
            isShowModalSearch: false,
            isSearching: false,
            message: 'No result',
            isLoading: true,
            type: ''
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

        // this.user = await getUserInfo();
        const { userInfor, listWarehouse } = this.props;
        let a = await this.props.getLstWareHouses(userInfor.id);

        if (
            (this.props.user.userType === SUPER_ADMIN &&
                this.props.user.userRole === SUPER_ADMIN

            ) || (this.props.user.userType === FACTORY &&
                this.props.user.userRole === SUPER_ADMIN)

        ) {
            this.user = this.props.user.id
            this.props.getOrder(this.user)
        }
        else if (this.props.user.userRole === "Owner" || this.props.user.userType === FIXER || this.props.user.userType === "General") {
            console.log("owner_role");
            this.user = this.props.user.id
            await this.props.getOrderFactory(this.user)
        }


        // }
        // if (this.props.onOrderSuccess) {
        //   this.setState({ listOrder: [] })
        // }
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
            this.props.user.userRole === SUPER_ADMIN
        ) {
            if (prevProps.resultGetOrder !== this.props.resultGetOrder) {
                this.setState({ listOrder: this.props.resultGetOrder.order })
                this.props.resultGetOrder.order.map((item) => {
                    let check = false
                    this.state.listWareHouse.map((e) => {
                        //console.log('TEST3  ' + JSON.stringify(item))
                        if ((item.warehouseId != null) && (e.label == item.warehouseId.name)) check = true
                    })
                    if (!check)
                        if (item.warehouseId != null) {
                            this.state.listWareHouse.push({
                                label: item.warehouseId.name, value: item.warehouseId.name
                            })
                        }
                })

                let listOrder;
                const list = this.props.resultGetOrder.order;
                //lọc theo kkho, nếu có
                if (this.onValue) {
                    listOrder = list.slice().filter((item) => item.warehouseId.name == this.onValue)
                }
                else listOrder = list;
                //lọc theo trạng thái nều có
                switch (this.idxClick) {
                    case 1:
                        listOrder = listOrder.filter((item) => (item.status == 'INIT' || item.status == 'CONFIRMED' || item.status == 'CANCELLED' || item.status == 'REQUEST')


                        )
                        break;

                    case 2:
                        listOrder = listOrder.filter((item) => (item.status == 'DELIVERING' || item.status == 'PROCESSING')
                        )
                        break
                    case 3:
                        listOrder = listOrder.filter((item) => item.status == 'DELIVERED')
                        break

                    default:
                        break
                }


                this.setState({
                    ...this.state.listWareHouse,
                    listOrder: listOrder,
                    listOrder_org: listOrder,
                    isFetching: false,
                    listOrder2: this.props.resultGetOrder.order,
                    isLoading: false
                })

            }
        }
        else if (this.props.user.userRole === "Owner" || this.props.user.userType === FIXER || this.props.user.userType === "General") {
            if (prevProps.resultGetOrderFactory !== this.props.resultGetOrderFactory) {

                let listOrder = this.props.resultGetOrderFactory.order;
                //lọc theo trạng thái
                switch (this.idxClick) {
                    case 1:
                        listOrder = listOrder.filter((item) => (item.status == 'INIT' || item.status == 'CONFIRMED' || item.status == 'CANCELLED' || item.status == 'REQUEST')


                        )
                        break;

                    case 2:
                        listOrder = listOrder.filter((item) => (item.status == 'DELIVERING' || item.status == 'PROCESSING')
                        )
                        break
                    case 3:
                        listOrder = listOrder.filter((item) => item.status == 'DELIVERED')
                        break

                    default:
                        break
                }

                this.setState({
                    listOrder: listOrder,
                    listOrder_org: listOrder,
                    isFetching: false,
                    listOrder2: this.props.resultGetOrderFactory.order,
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
                this.props.getOrder(this.user)
            }
            else if (this.props.user.userRole === "Owner" || this.props.user.userType === FIXER || this.props.user.userType === "General") {
                this.user = this.props.user.id
                this.props.getOrderFactory(this.user)
                this.state.listBtn[0].color = "#009347"
                this.state.listBtn[1].color = COLOR.GRAY
                this.state.listBtn[2].color = COLOR.GRAY

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
                    icon: 'format-list-numbered',
                    text: translate('Order'),
                    color: "#009347"
                },
                {
                    icon: 'truck',
                    text: translate('DELIVERING'),
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
        const listOrder = this.props.user.userType === FACTORY && this.props.user.userRole === SUPER_ADMIN ? this.props.resultGetOrder.order : this.props.resultGetOrderFactory.order;
        return <TouchableOpacity
            style={{
                alignItems: 'center',
            }}
            onPress={() => {
                let list
                //alert(this.onValue)
                // if (this.onValue) {
                //   this.setState({ listOrder: this.state.listOrder_org.slice().filter((item) => item.warehouseId.name == this.onValue) })
                //   this.setState({ listOrder2: this.state.listOrder_org.slice().filter((item) => item.warehouseId.name == this.onValue) })
                // } else {
                //   this.setState({ listOrder: this.state.listOrder_org })
                //   this.setState({ listOrder2: this.state.listOrder_org })
                // }
                this.state.listBtn = []
                this.idxClick = index + 1
                btn.map((item) => this.state.listBtn.push({ ...item, color: COLOR.GRAY }))
                this.state.listBtn[index].color = "#009347"
                if (this.onValue)
                    list = listOrder.slice().filter((item) => item.warehouseId.name == this.onValue)
                else list = listOrder
                switch (this.idxClick) {
                    case 1:
                        list = list.filter((item) => (item.status == 'INIT' || item.status == 'CONFIRMED' || item.status == 'CANCELLED' || item.status == 'REQUEST')
                        )
                        break;
                    case 2:
                        list = list.filter((item) => (item.status == 'DELIVERING' || item.status == 'PROCESSING')
                        )
                        break
                    case 3:
                        list = list.filter((item) => item.status == 'DELIVERED')
                        break;
                    default:
                        break
                }
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

    TimeItem(time, style, status) {
        let iconStatus = 'clock'
        switch (status) {
            case 'DELIVERING':
                iconStatus = 'truck'
                break
            case 'COMPLETED':
                iconStatus = 'checkbox-active'
                break
            case 'INIT':
                iconStatus = 'hourglass-start'
                break
            case 'DELIVERED':
                iconStatus = 'checkbox-active'
                break
            case 'CANCELLED':
                iconStatus = 'close'
                break
            case 'REQUEST':
                iconStatus = 'safari'
                break
            case 'PROCESSING':
                iconStatus = 'truck'
                break
            default:
                iconStatus = 'clock'
                break
        }
        return <View
            style={[{
                flexDirection: 'row',
                alignItems: 'center'
            }, style]}
        >
            <IconFontisto
                name={iconStatus}
                size={16}
                color={COLOR.DARKGRAY} />
            <Text
                style={{
                    fontSize: 14,
                    color: COLOR.DARKGRAY,
                    marginLeft: 5
                }}
            >
                {time}
            </Text>
        </View>
    }
    OrderType(type) {

        let Type_ = 'Sản phẩm'
        switch (type) {
            case 'V':
                Type_ = 'Vỏ'
                break
            case 'B':
                Type_ = 'Bình'
                break
        }
        return <View>
            <Text
                style={{ fontSize: 14, color: COLOR.DARKGRAY, fontWeight: 'bold' }}>
                {' '} {Type_}
            </Text>
        </View>
    }

    OrderItem(data, isWarning = false, style,) {
        let sum = 0
        data.listCylinder.map((item) => {
            sum += +item.numberCylinders
            type = item.type
        })
        const startDayMonth = this.getTimeDayMonth(data.createdAt)
        const endDayMontn = this.getTimeDayMonth(data.deliveryDate)

        return <TouchableOpacity
            style={[{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }, style]}
            onPress={() => {
                this.setState({ isShowModalSearch: false }, () => {
                    Actions['OrderDetails']({
                        data: data, start: startDayMonth, end: endDayMontn, number: sum
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
                    {data.orderCode}
                </Text>





                <View>






                    {/* <Text style={{
                                fontSize: 14,
                                color: COLOR.DARKGRAY,
                                marginBottom: 5,

                            }}
                                numberOfLines={1}>
                               
                               
                            </Text> */}

                    <Text style={{
                        fontSize: 14,
                        color: COLOR.DARKGRAY,
                        marginBottom: 5,

                    }}
                        numberOfLines={1}>
                        {/* {data.customerId.name} */}
                        {/* do bên customerid bị null nên sẽ bị lỗi */}
                        Người khởi tạo: {data.createdBy.name}
                    </Text>

                </View>


                {
                    this.TimeItem(endDayMontn)
                }
            </View>
            <View>
                {this.TimeItem(startDayMonth, { marginBottom: 5 }, data.status)}

                <Text style={{
                    fontSize: 14,
                    color: COLOR.DARKGRAY,
                    marginBottom: 5,

                }}
                    numberOfLines={1}></Text>

                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: COLOR.DARKGRAY,
                            textAlign: 'right'
                        }}
                    >
                        {sum}
                    </Text>

                    {this.OrderType(data.type)}
                </View>
            </View>
        </TouchableOpacity>
    }

    onSearch() {
        let e = this.state.searchWord;
        // search trên ds nào, listOrder ds đang hiển thị, listOrder2 ds API trả về
        let filterArray = this.state.listOrder2.filter(value => {
            let code = `${value.orderCode}`
            let name = `${value.customerId.name}`

            let date = new Date(value.createdAt);
            let s = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            date = new Date(value.deliveryDate);
            let end = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            let stringSum = `${code}${s}${end}${name}`

            // console.log('string', stringSum);

            return stringSum.toLowerCase().indexOf(e.toLowerCase()) != -1;
        });
        this.setState({ search_result: filterArray, isSearching: false, message: `${filterArray.length} ${translate('RESULT_FOR')} '${e}'` })
    };

    render() {
        const {
            resultGetOrder,
            resultGetOrderHistory,
        } = this.props;
        const {
            exportWareHouse
        } = this.state;
        const listOrder = resultGetOrder.order
        listHistory = resultGetOrderHistory.orderHistories;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLOR.WHITE,
                    paddingTop: 10
                }}
            >
                <View
                    style={{
                        paddingHorizontal: 15
                    }}
                >
                    {
                        this.props.user.userType === FACTORY && this.props.user.userRole === SUPER_ADMIN ?

                            <View>
                                <PickerCustom
                                    placeholder={translate('CHOOSE_EXPORT_WAREHOUSE')}
                                    value={exportWareHouse}
                                    //error={this.state.error}
                                    error=''
                                    ref={this.ExportWareHousepickerCustomRef}
                                    listItem={this.state.listWareHouse?.map(item => ({
                                        value: item,
                                        label: item.label,
                                    }))}
                                    setValue={value => {
                                        if (value.value) {
                                            this.onValue = value.value.value;

                                            this.state.listOrder = listOrder.slice().filter((item) => item.warehouseId.name == value.value.value)
                                            switch (this.idxClick) {

                                                case 1:
                                                    this.state.listOrder = this.state.listOrder.filter((item) => (item.status == 'INIT' || item.status == 'CONFIRMED' || item.status == 'CANCELLED' || item.status == 'REQUEST')
                                                    )

                                                    //  (item.status == 'INIT' &&
                                                    //     (
                                                    //         (this.getDateToCompare(item.createdAt) == this.getDateToCompare(new Date())) || (this.getDateToCompare(item.deliveryDate) == this.getDateToCompare(new Date())))
                                                    // )
                                                    // )
                                                    break;

                                                case 2:
                                                    this.state.listOrder = this.state.listOrder.filter((item) => (item.status == 'DELIVERING' || item.status == 'PROCESSING')
                                                    )
                                                    break;
                                                case 3:
                                                    this.state.listOrder = this.state.listOrder.filter((item) => item.status == 'DELIVERED')
                                                    break;

                                                default:
                                                    break;
                                            }
                                            this.setState({
                                                exportWareHouse: value.value,
                                                listOrder: this.state.listOrder,
                                            });
                                        }
                                    }}
                                />
                            </View>
                            : null
                    }
                    {/*
            //thanh search khi kho đăng nhập
            this.props.user.userRole === "Owner" ? 
            <TouchableOpacity onPress={() => this.setState({ isShowModalSearch:true, search_result:[], searchWord:'', message:translate('SEARCH') })} style={styles.searchCOntainerOwner}>
              <View style={{width:50, alignItems:'center', justifyContent:'center', backgroundColor:'#f2f2f2', borderTopLeftRadius:50, borderBottomLeftRadius:50, }}>
                <IconFontisto color='gray' size={25} name='search'/>
              </View>
              <TextInput 
                  editable={false}
                  style={{flex:1}}
                  placeholder={translate('SEARCH')+'...'}/>
            </TouchableOpacity>
            : null
          */}

                </View>
                {
                    this.state.listOrder.length == 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{this.state.isLoading ? <ActivityIndicator /> : <Text>{translate('NO_ORDER')}</Text>}</View>
                        :
                        <FlatList
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            contentContainerStyle={{
                                paddingTop: 10,
                                paddingHorizontal: 20
                            }}
                            //this.props.resultGetOrder.order
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
                {/* thanh search khi superAdmin đăng nhập */}
                {/* this.props.user.userType === FACTORY && this.props.user.userRole === SUPER_ADMIN ?
        //  <TouchableOpacity onPress={() => this.setState({ isShowModalSearch:true, search_result:[], searchWord:'', message:translate('SEARCH') })} style={styles.searchCOntainerAdmin}>
        //         <View style={{width:50, alignItems:'center', justifyContent:'center', backgroundColor:'#f2f2f2', borderTopLeftRadius:50, borderBottomLeftRadius:50, }}>
        //            <IconFontisto color='gray' size={25} name='search'/>
        //         </View>
        //         <TextInput 
        //             editable={false}
        //             style={{flex:1}}
        //             placeholder={translate('SEARCH') + '...'}/>
        // </TouchableOpacity>
        : null
       */}

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

                <Modal
                    onBackdropPress={() => { this.setState({ isShowModalSearch: false }) }}
                    isVisible={this.state.isShowModalSearch}>
                    <TouchableOpacity style={{ width: 50 }} onPress={() => this.setState({ isShowModalSearch: false })}>
                        <Icon name='close' size={50} color='gray' style={{ alignSelf: 'flex-start' }} />
                    </TouchableOpacity>
                    <View style={{ width: '100%', height: '90%', alignItems: 'center', backgroundColor: '#f2f2f2' }}>

                        <View style={{ width: '95%', height: 40, borderRadius: 50, borderColor: 'gray', borderWidth: 0.5, flexDirection: 'row', marginTop: 10 }}>

                            <TouchableOpacity onPress={() => this.setState({ search_result: [] }, () => this.onSearch())} style={{ width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCDCDC', borderTopLeftRadius: 50, borderBottomLeftRadius: 50, }}>
                                <IconFontisto color={"#009347"} size={25} name='search' />
                            </TouchableOpacity>

                            <TextInput
                                value={this.state.searchWord}
                                onChangeText={(text) => this.setState({ searchWord: text })}
                                style={{ paddingLeft: 5, flex: 1 }}
                                placeholder={translate('SEARCH')} />

                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: 30 }} onPress={() => { this.setState({ searchWord: '' }); }}>
                                <IconFontisto name='close' size={20} color='#DCDCDC' />
                            </TouchableOpacity>
                        </View>


                        <Text style={{ alignSelf: 'center' }}>{this.state.message}</Text>
                        <View style={{ flex: 1, width: '100%', paddingHorizontal: 5 }}><FlatList
                            contentContainerStyle={{
                                paddingTop: 15,
                                paddingHorizontal: 0
                            }}
                            showsVerticalScrollIndicator={false}
                            data={this.state.search_result}
                            keyExtractor={(item, index) => 'key ' + item}
                            renderItem={({ item, index }) => {
                                return this.OrderItem(
                                    item,
                                    false, {
                                    marginTop: index > 0 ? 20 : 0
                                })
                            }} />
                        </View>

                    </View>
                </Modal>
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
        icon: 'format-list-numbered',
        text: 'ORDERS',
        color: '#009347'
    },
    {
        icon: 'truck',
        text: 'DELIVERING',
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
        // resultGetOrder: state.auth.user.userType === FACTORY && state.auth.user.userRole === SUPER_ADMIN ? state.order.resultGetOrder : [],
        resultGetOrderHistory: state.order.resultGetOrderHistory,
        userInfor: state.auth.user,
        //resultGetOrderFactory: (state.auth.user.userRole === "Owner"||state.auth.user.userType === FIXER ||state.auth.user.userType === "General") ? state.order.result_getOrderFactory : [],
        listWarehouse: state.order.result_getWareHouse,
        resultGetOrder: state.order.resultGetOrder,
        resultGetOrderFactory: state.order.result_getOrderFactory,
    })
}

export default connect(
    mapStateToProps,
    {
        getOrder, getOrderSuccess, getOrderFail,
        getOrderHistory, getOrderHistorySuccess, getOrderHistoryFail,
        getOrderFactory,
        getLstWareHouses
    }
)(OrderManagement)
