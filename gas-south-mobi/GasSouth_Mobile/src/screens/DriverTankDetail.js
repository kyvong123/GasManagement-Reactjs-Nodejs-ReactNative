import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,
    InteractionManager,
    FlatList,
    ActivityIndicator,
    Alert,
    Dimensions,
    Linking
} from 'react-native';

import {

    Button,

} from '@ant-design/react-native';
import { connect } from 'react-redux';
import {
    getAllShippingOrderTankDetailInit,
    getUpdateShippingOrderTankDetailInit,
    setCreateShippingOrderTankLocation, getOrderRequest
} from '../actions/OrderActions';

import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import IconFea from 'react-native-vector-icons/Feather';
import { showLocation } from 'react-native-map-link';
import { FACTORY, SUPER_ADMIN, DELIVER } from '../types';
import GetLocation from 'react-native-get-location';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconAwersome from 'react-native-vector-icons/FontAwesome';
import BackgroundTimer from 'react-native-background-timer';
import { setLanguage, getLanguage } from '../helper/auth';

const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json'),
};

const chooseLanguageConfig = lgnCode => {
    let fallback = { languageTag: 'vi' };
    if (Object.keys(translationGetters).includes(lgnCode)) {
        fallback = { languageTag: lgnCode };
    }

    const { languageTag } = fallback;

    translate.cache.clear();

    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: '#009347',
        fontWeight: 'bold',
    },
    viewFlex: {
        flexDirection: 'row',
    },
    viewTitle: {
        fontWeight: 'bold',
        marginRight: 10,

    },
    button: {
        backgroundColor: '#009347',
        borderRadius: 50,
        width: width - 100,
        alignItems: 'center',
        position: 'relative',
    },
});

class DriverTankDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOrder: [],
            shippingorder: '',
            isFetching: true,
            isLoading: true,
            trangthai: '',
            batdaugiao: 'DELIVERING',
            hoanthanh: 'DELIVERED',
            huy: 'PROCESSING',
            updateOrderStatus: '',
            title: "Thông báo đơn hàng đang giao",
            appname: 'Gassouth',
        };
    }

    componentDidMount = async () => {
        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener(
                    'change',
                    handleChangeLanguage(languageCode)
                );
            }
        } catch (error) {
            console.log(error);
        }

        if (
            this.props.user.userType === FACTORY &&
            this.props.user.userRole === DELIVER
        ) {
            this.user = this.props.user.id;
            this.props.getAllShippingOrderTankDetailInit(this.props.exportOrderID);
        }
    };

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener(
                'change',
                handleChangeLanguage(languageCode)
            );
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.user.userType === FACTORY &&
            this.props.user.userRole === DELIVER
        ) {
            if (prevProps.resultGetOrderDetail !== this.props.resultGetOrderDetail) {
                this.setState({
                    listOrder: this.props.resultGetOrderDetail.ExportOrderDetail,
                });
                this.setState({
                    isFetching: false,
                    isLoading: false,
                });
            }
            if (
                prevProps.resultUpdateOrderDetail !== this.props.resultUpdateOrderDetail
            ) {
                this.onRefresh();
            }

        }
    }
    onRefresh() {
        this.setState({ isFetching: true }
            , function () {


                this.props.getAllShippingOrderTankDetailInit(this.props.exportOrderID)
                setTimeout(() => {
                    this.setState({ isFetching: false })

                }, 1500)
            }
        )

    }
    //tai xe thay doi vi tri cua don hang va gui thong bao
    postDriverLocation = async (
        exportOrderDetailID,
        orderTankID,
        createdBy, updateOrderStatus
    ) => {
        // await this.props.getOrderRequest(
        //     this.state.title,
        //     'Tài xế đang giao hàng đến'
        //     ,
        //     this.state.appname,
        //     playerID, iddata
        // );
        await this.props.getUpdateShippingOrderTankDetailInit(
            updateOrderStatus
        )
        BackgroundTimer.runBackgroundTimer(() => {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
            })
                .then(async location => {

                    await this.props.setCreateShippingOrderTankLocation(
                        exportOrderDetailID,
                        orderTankID,
                        location.latitude,
                        location.longitude,
                        new Date(),
                        createdBy
                    );
                })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                });
        }, 15000);
    };

    getTimeDayMonth(time) {
        const date = new Date(time);

        return `${date.getDate()}/${date.getMonth() + 1} - ${date.getHours()}:${date.getMinutes()}`;
    }

    getDateToCompare(time) {
        const date = new Date(time);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    // ------------------------------------------------------------

    OrderType(type) {
        let Type_ = 'Loại';
        switch (type) {
            case 'V':
                Type_ = 'Vỏ';
                break;
            case 'B':
                Type_ = 'Bình';
                break;
        }
        return Type_;
    }
    //goi dien
    openPhoneCall = async (phone) => {
        Linking.openURL(`tel:${phone}`)
    }
    // ------------------------------------------------------------
    OrderItem(data, isWarning = false, style) {

        return (

            <View >
                {data.map((item, index) => {
                    return [
                        <View style={{ marginBottom: 10 }}>
                            <View>
                                <View style={styles.viewFlex}>
                                    <IconEntypo
                                        style={{ marginTop: 5 }}
                                        color="#009347"
                                        size={18}
                                        name="clipboard"
                                    >
                                        {' '}
                                    </IconEntypo>
                                    <Text style={styles.title}>
                                        Mã đơn hàng: {item.orderCode}
                                    </Text>
                                </View>
                                <View style={styles.viewFlex}>
                                    <Text style={styles.viewTitle}>
                                        Thời gian giao:
                                    </Text>
                                    <Text>{item.todeliveryDate} {item.deliveryHours}</Text>
                                </View>
                            </View>

                            <View>
                                <View style={styles.viewFlex}>
                                    <IconAwersome
                                        style={{ marginTop: 5 }}
                                        name="user-circle-o"
                                        size={18}
                                        color="#009347"
                                    >
                                        {' '}
                                    </IconAwersome>
                                    <Text style={styles.title}>Thông tin nơi nhận:</Text>
                                </View>
                                <View style={styles.viewFlex} numberOfLines={2}>
                                    <Text style={styles.viewTitle}>
                                        Tên nơi nhận:
                                    </Text>
                                    <Text >{item.customergasId.name}</Text>
                                </View>
                                <View style={styles.viewFlex}>
                                    <TouchableOpacity
                                        style={styles.viewTitle}
                                        onPress={() => {
                                            //api chua co sdt
                                            this.openPhoneCall(item.customergasId.phone)
                                        }}>
                                        <IconFea color={'green'} name="phone-forwarded" size={18} />
                                        <Text>
                                            {item.customergasId.phone}

                                        </Text>
                                    </TouchableOpacity>




                                </View>
                                <View style={styles.viewFlex} numberOfLines={2}>
                                    <Text style={styles.viewTitle}>
                                        Địa chỉ:
                                    </Text>
                                    <Text numberOfLines={2}>{item.customergasId.address}</Text>
                                </View>
                                <View style={styles.viewFlex} numberOfLines={2}>
                                    <Text style={styles.viewTitle}>
                                        Ghi chú:
                                    </Text>
                                    <Text numberOfLines={2}>{item.note}</Text>
                                </View>

                            </View>
                            {/* chuyen sang screen vi tri cua tai xe */}
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    onPress={() => {
                                        //api ko co vi tri
                                        showLocation({
                                            latitude: item.customergasId.LAT,
                                            longitude: item.customergasId.LNG,
                                            googleForceLatLon: false,
                                            googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',
                                            alwaysIncludeGoogle: true,
                                        });
                                    }}
                                    style={styles.button}
                                >
                                    {/* pi chưa có vị trí */}
                                    {/* <IconFA5 name="map-marked-alt" size={20} /> */}
                                    <IconFea
                                        name="map"
                                        color={'#ffffff'}
                                        size={18}
                                        style={{ position: 'absolute' }}
                                    >
                                        {' '}
                                    </IconFea>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            marginLeft: 10,
                                            color: '#ffffff',
                                        }}
                                    >
                                        Xem chỉ đường
                                    </Text>
                                </Button>
                            </View>
                            <View>
                                {/* {item.type} */}
                                <View style={styles.viewFlex}>
                                    <IconEntypo
                                        style={{ marginTop: 5 }}
                                        name="box"
                                        size={18}
                                        color="#009347"
                                    >
                                        {' '}
                                    </IconEntypo>
                                    <Text style={styles.title}>phẩm:</Text>
                                </View>
                                <View style={styles.viewFlex}>
                                    <Text style={styles.viewTitle}>Loại: </Text>
                                    <Text> {item.typeproduct} </Text>
                                </View>


                                <Text style={styles.textBlack} numberOfLines={1}>
                                    {`${item.quantity} `}
                                </Text>
                                {/* khi web gửi đơn cho tài xế sẽ là trạng thái này */}
                                {item.exportId.status === 'PROCESSING' ?
                                    (<View>
                                        <Button
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'red',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingVertical: 15,
                                                margin: 5,
                                            }}
                                            onPress={() => {

                                                const updateOrderStatus = {
                                                    updatedBy: this.props.user.id,
                                                    orderStatus: this.state.batdaugiao,
                                                    orderId: item.id,
                                                    exportOrderDetailID: item.exportId.id,
                                                    exportOrderID: item.exportId.exportOrderId,
                                                };

                                                this.postDriverLocation(
                                                    item.exportId.id,
                                                    item.id,
                                                    this.props.user.id,
                                                    updateOrderStatus
                                                )


                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: 'white',
                                                }}
                                            >
                                                Bắt đầu
                                            </Text>
                                        </Button>

                                    </View>)
                                    :
                                    null
                                }


                                {/* nếu trạng thái đang giao thì sẽ hiện button hoàn thành và hủy */}
                                {item.exportId.status === 'DELIVERING'
                                    ?
                                    (<View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Button
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'red',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingVertical: 15,
                                                margin: 5,
                                            }}
                                            onPress={async () => {
                                                const updateOrderStatus = {
                                                    updatedBy: this.props.user.id,
                                                    orderStatus: this.state.hoanthanh,
                                                    orderId: item.id,
                                                    exportOrderDetailID: item.exportId.id,
                                                    exportOrderID: item.exportId.exportOrderId,

                                                };

                                                Alert.alert(
                                                    'Thông báo!',
                                                    'Bạn có chắc đã hoàn thành đơn hàng?',
                                                    [
                                                        {
                                                            text: 'Hủy',
                                                            onPress: () => null,
                                                            style: 'cancel',
                                                        },
                                                        {
                                                            text: 'Đòng ý',
                                                            onPress: async () =>
                                                                await this.props.getUpdateShippingOrderTankDetailInit(
                                                                    updateOrderStatus
                                                                ),

                                                        },
                                                    ]
                                                );
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: 'white',
                                                }}
                                            >
                                                Hoàn Thành
                                            </Text>
                                        </Button>
                                        <Button
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'red',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingVertical: 15,
                                                margin: 5,
                                            }}
                                            onPress={async () => {
                                                const updateOrderStatus = {
                                                    updatedBy: this.props.user.id,
                                                    orderStatus: this.state.huy,
                                                    orderId: item.id,
                                                    exportOrderDetailID: item.exportId.id,
                                                    exportOrderID: item.exportId.exportOrderId,

                                                };
                                                Alert.alert(
                                                    'Thông báo!',
                                                    'Bạn có muốn hủy đơn hàng?',
                                                    [
                                                        {
                                                            text: 'Hủy',
                                                            onPress: () => null,
                                                            style: 'cancel',
                                                        },
                                                        {
                                                            text: 'Đồng ý',
                                                            onPress: async () =>
                                                                await this.props.getUpdateShippingOrderTankDetailInit(
                                                                    updateOrderStatus
                                                                )

                                                        },
                                                    ]
                                                );
                                                //edit
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: 'white',
                                                }}
                                            >
                                                Hủy đơn
                                            </Text>
                                        </Button>





                                    </View>)

                                    : null}



                                {item.exportId.status == 'DELIVERED'
                                    ? <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'red',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingVertical: 15,
                                            margin: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffffff',
                                                fontSize: 20,
                                            }}
                                        >
                                            Đơn hàng đã giao
                                        </Text>
                                    </View>
                                    : null}
                                {item.exportId.status == 'CANCELLED'
                                    ? <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'red',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingVertical: 15,
                                            margin: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffffff',
                                                fontSize: 20,
                                            }}
                                        >
                                            Đơn hàng đã được hủy
                                        </Text>
                                    </View>
                                    : null}
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center' }}>
                                <View
                                    style={{
                                        height: 2,
                                        backgroundColor: '#009347',
                                        marginTop: 10,
                                        width: width - 200,
                                    }}
                                />
                            </View>
                        </View>,
                    ];
                })}

            </View>
        );
    }
    render() {
        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
            >
                {this.state.listOrder == 0
                    ? <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >

                        {this.state.isLoading
                            ? <ActivityIndicator />
                            : <Text>{translate('NO_ORDER')}</Text>}
                    </View>
                    : <FlatList
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                        contentContainerStyle={{
                            paddingTop: 10,
                            paddingHorizontal: 20,
                            width: '100%'
                        }}
                        //this.props.resultGetOrder.order
                        data={this.state.listOrder}
                        keyExtractor={(item, index) => 'key ' + item}
                        renderItem={({ item, index }) => {
                            return this.OrderItem(
                                item,
                                false,
                                {
                                    marginTop: index > 0 ? 20 : 0,
                                },
                            );
                        }

                        }

                    />}

            </ScrollView>
        );
    }
}
//luu data props
export const mapStateToProps = state => ({
    user: state.auth.user,
    resultGetOrderDetail:
        state.order.result_GetAllShippingOrderTankDetailInit
    ,
    resultUpdateOrderDetail: state.order.result_UpdateShippingOrderTankDetailInit,
    result_setCreateShippingOrderTankLocation: state.order
        .result_setCreateShippingOrderTankLocation,
});

export default connect(mapStateToProps, {
    getAllShippingOrderTankDetailInit,
    getUpdateShippingOrderTankDetailInit,
    setCreateShippingOrderTankLocation,
    getOrderRequest
})(DriverTankDetail);
