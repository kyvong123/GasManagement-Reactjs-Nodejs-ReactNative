import React, {Component} from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Button,
} from 'react-native';
import {setLanguage, getLanguage} from '../helper/auth';
import IconOcticons from 'react-native-vector-icons/Octicons';
import {Actions} from 'react-native-router-flux';
import {COLOR} from '../constants';
import Img from '../constants/image';
import Modal, {
  ModalButton,
  ModalFooter,
  ModalTitle,
  SlideAnimation,
  ModalContent,
} from 'react-native-modals';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {ScrollView} from 'react-native-gesture-handler';
import Textarea from 'react-native-textarea';
import {ProgressDialog} from 'react-native-simple-dialogs';
import IconFea from 'react-native-vector-icons/Feather';
import {
  getCompletedOrderAndCylinders,
  setOrderRequest,
  getOrderRequest,
  setOrderRequestSuccess,
  approvalOrder,
  cancelOrder,
} from '../actions/OrderActions';
import {connect} from 'react-redux';

const {width} = Dimensions.get ('window');

const translationGetters = {
  en: () => require ('../languages/en.json'),
  vi: () => require ('../languages/vi.json'),
};

const chooseLanguageConfig = lgnCode => {
  let fallback = {languageTag: 'vi'};
  if (Object.keys (translationGetters).includes (lgnCode)) {
    fallback = {languageTag: lgnCode};
  }

  const {languageTag} = fallback;

  translate.cache.clear ();

  i18n.translations = {[languageTag]: translationGetters[languageTag] ()};
  i18n.locale = languageTag;
};
const handleChangeLanguage = lgnCode => {
  setLanguage (lgnCode);
  chooseLanguageConfig (lgnCode);
};

const translate = memoize (
  (key, config) => i18n.t (key, config),
  (key, config) => (config ? key + JSON.stringify (config) : key)
);

class OrderManagement extends Component {
  constructor (props) {
    super (props);
    this.state = {
      listCode: props.data.array,
      user: this.props.user,
      title: 'Thông báo đơn hàng',
      data: '',
      appname: 'Gassouth',
      device: '',
      idsend: '',
      idreceive: '',
      ordershippingid: '',
      modalVisible: false,
      reasonForCancellatic: '',
      loading: true,
    };
  }
  // ====================================================================
  showModal (visible) {
    this.setState ({modalVisible: visible});
  }
  // ====================================================================
  componentDidMount = async () => {
    // this.setState({ ordershippingid: this.state })
    try {
      const languageCode = await getLanguage ();
      if (languageCode) {
        RNLocalize.addEventListener (
          'change',
          handleChangeLanguage (languageCode)
        );
      }
    } catch (error) {
      console.log (error);
    }

    // ---- Get Completed Order And Cylinder if status === 'complete'
    console.log ('status of order: ', this.props.data.status);

    // if (this.props.data.status == 'DELIVERED') {
    //   this.props.getCompletedOrderAndCylinders(this.props.data.id);
    // }

    // ===================

    console.log ('aaaaaaaaaaaaaa123123123321123a22');
  };

  componentWillUnmount = async () => {
    const languageCode = await getLanguage ();
    if (languageCode) {
      RNLocalize.addEventListener (
        'change',
        handleChangeLanguage (languageCode)
      );
    }
  };
  guixacnhan = async () => {
    await this.props.getOrderRequest (
      this.state.title,
      'Bạn có đơn hàng cần duyệt từ ' +
        this.props.user.name +
        '. Ghi chú: ' +
        this.props.data.note,
      this.state.appname,
      this.props.data.warehouseId.playerID,
      this.props.data.id
    );
    Actions['home'] (
      Alert.alert (
        translate ('notification'),
        translate ('ORDER_REQUEST_SUCCESS')
      )
    );
    this.setState ({showProgress: false});
  };
  xacnhan = async () => {
    await this.props.getOrderRequest (
      this.state.title,
      'Đơn hàng của bạn đã được duyệt từ ' + this.props.user.name,
      this.state.appname,
      this.props.data.createdBy.playerID,
      this.props.data.id
    );
    Actions['home'] (
      Alert.alert (translate ('notification'), 'Duyệt đơn hàng thành công!')
    );
  };
  tuchoidon = async () => {
    await this.props.getOrderRequest (
      this.state.title,
      'Đơn hàng của bạn đã bị từ chối từ ' +
        this.props.user.name +
        '. Lý do: ' +
        this.state.reasonForCancellatic,
      this.state.appname,
      this.props.data.createdBy.playerID,
      this.props.data.id
    );
    Actions['home'] (
      Alert.alert (translate ('notification'), 'Từ chối đơn hàng thành công!')
    );
    console.log ('aaaaaaaaasdas2323232131', this.props.data.createdBy.playerID);
  };
  componentDidUpdate (prevProp, prevState) {
    // if (this.props.result_setOrderRequest !== prevProp.result_setOrderRequest) {
    //   this.setState({ showProgress: false });
    // }
  }
  openGuixacnhan = async () => {
    this.setState ({showProgress: true});
    setTimeout (() => {
      this.setState ({showProgress: false});
      this.guixacnhan ();
    }, 400);
  };
  openXacnhan = async () => {
    this.setState ({showProgress: true});
    setTimeout (() => {
      this.setState ({showProgress: false});
      this.xacnhan ();
    }, 400);
  };
  openTuchoidon = async () => {
    this.setState ({showProgress: true});
    setTimeout (() => {
      this.setState ({showProgress: false});
      this.tuchoidon ();
    }, 400);
  };

  onShowMore (index) {
    const states = this.state;
    states.listCode[index].isChoose = states.listCode[index].isChoose
      ? false
      : true;
    this.setState ({...states.listCode});
  }
  //linh them
  OrderType (number, type) {
    let Type_ = 'Sản phẩm';
    switch (type) {
      case 'V':
        Type_ = 'Vỏ';
        break;
      case 'B':
        Type_ = 'Bình';
        break;
    }
    return (
      <View>
        <Text style={styles.textGray}>
          {number} {Type_}
        </Text>
      </View>
    );
  }
  OrderStatus (status) {
    let checkStatus = translate ('INIT');
    switch (status) {
      case 'CONFIRMED':
        checkStatus = translate ('CONFIRMED');
        break;
      case 'DELIVERING':
        checkStatus = translate ('DELIVERING');
        break;
      case 'DELIVERED':
        checkStatus = translate ('DELIVERED');
        break;
      case 'COMPLETED':
        checkStatus = translate ('COMPLETED');
        break;
      case 'CANCELLED':
        checkStatus = translate ('CANCELLED');
        break;
      case 'REQUEST':
        checkStatus = translate ('REQUEST');
        break;
      case 'PROCESSING':
        checkStatus = translate ('PROCESSING');
        break;
      default:
        break;
    }
    return (
      <View style={{alignItems: 'center'}}>
        {status === 'CANCELLED'
          ? //trang thai huy thi trang thai mau do
            <View>
              <Text style={styles.textBlack}>{translate ('STATUS')}</Text>
              <Text style={styles.statusRED}> {checkStatus}</Text>
            </View>
          : status === 'INIT'
              ? //trang thai khoi tao thi trang thai mau xanh duong
                <View>
                  <Text style={styles.textBlack}>{translate ('STATUS')}</Text>
                  <Text style={styles.textBlue}> {checkStatus}</Text>
                </View>
              : status === 'CONFIRMED'
                  ? //trang thai da duyet thi trang thai mau xanh la
                    <View>
                      <Text style={styles.textBlack}>
                        {translate ('STATUS')}
                      </Text>
                      <Text style={styles.textGREEN}> {checkStatus}</Text>
                    </View>
                  : // binh thuong trang thai se mau  xanh duong
                    <View>
                      <Text style={styles.textBlack}>
                        {translate ('STATUS')}
                      </Text>
                      <Text style={styles.textBlue}> {checkStatus}</Text>
                    </View>}

      </View>
    );
  }
  render () {
    const {
      tittle,
      status,
      orderCode,
      customerId,
      listCylinder,
      agencyId,
    } = this.props.data;
    const {start, end, number} = this.props;
    const states = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: COLOR.WHITE,
            padding: 15,
          }}
          contentContainerStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Text style={styles.textGray}>
              {translate ('ORDERS')}
              :
              {' '}
              <Text
                style={{
                  fontSize: 16,
                  color: COLOR.BLACK,
                  marginLeft: 5,
                  fontWeight: 'bold',
                }}
                numberOfLines={1}
              >
                {' '}{orderCode}
              </Text>
            </Text>

            <Text style={[styles.textGray]}>
              {start}
            </Text>
          </View>

          <View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}
            >

              <Text style={styles.textGray} numberOfLines={2}>
                {'Nơi nhận'}
                {': '}
                <Text style={{color: COLOR.BLACK}}>
                  {this.props.data.createdBy.name}
                </Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
              }}
            >
              <IconOcticons name="location" size={20} color={COLOR.DARKGRAY} />
              <Text
                style={{
                  fontSize: 13,
                  color: COLOR.GRAY,
                  marginLeft: 5,
                }}
              >
                {this.props.data.createdBy.address}

              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
              marginBottom: 10,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IconOcticons name="clock" size={20} color={COLOR.DARKGRAY} />
              <Text
                style={{
                  fontSize: 14,
                  color: COLOR.DARKGRAY,
                  marginLeft: 5,
                }}
              >
                {end}
              </Text>
            </View>

            {this.OrderStatus (status)}

            {this.OrderType (number, this.props.data.type)}
          </View>

          {listCylinder.map ((item, index) => {
            return [
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: index > 0 ? 10 : 0,
                }}
              >
                <Text style={styles.textBlack} numberOfLines={1}>
                  {`${item.cylinderType} - ${item.valve} - ${item.color} - ${item.numberCylinders}`}
                </Text>

              </View>,
            ];
          })}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}
          >

            <Text style={styles.textRED} numberOfLines={2}>
              {'Ghi chú'}
              {': '}
              <Text style={{color: COLOR.GRAY}}>{this.props.data.note} </Text>
            </Text>
          </View>
          {status == 'DELIVERING'
            ? <View style={{justifyContent: 'center', alignItems: 'center'}}>

                {/* ============================================================================= */}
                <TouchableOpacity
                  style={{
                    height: 50,
                    backgroundColor: '#009347',
                    borderRadius: 50,
                    width: width - 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                  onPress={() => {
                    Actions['GetLocationsipping'] ({
                      orderShippingID: this.props.data.id,
                    });
                    //edit
                  }}
                >
                  <View style={{flexDirection: 'row'}}>
                    <IconFea
                      name="map"
                      color={'#ffffff'}
                      size={18}
                      // style={{position: 'absolute'}}
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
                      Xem vị trí của tài xế
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* =================================================================================== */}
              </View>
            : null}

          {this.props.data.reasonForCancellatic
            ? <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >

                <Text style={styles.textRED} numberOfLines={2}>
                  {'Lý do từ chối đơn hàng'}
                  {': '}
                  <Text style={{color: COLOR.GRAY}}>
                    {this.props.data.reasonForCancellatic}{' '}
                  </Text>
                </Text>
              </View>
            : null}
          {/* cái này không biết để làm gì luôn */}
          {/* {
            status == "DELIVERED" ? (<View>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 15, color: COLOR.BLUE }}> {translate('DETAIL')}</Text>
              </View>
              <View>
                <FlatList data={this.props.result_CompletedOrderAndCylinders}
                  keyExtractor={(item, index) => 'key' + item}
                  renderItem={({ item, index }) => {
                    console.log('item.item', item)
                    console.log('index', index)
                    if (item.status == 'DELIVERED')
                      return (
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ color: COLOR.GREEN }}>{translate('LAN')} {index + 1} : {item.cylinders.length} {translate('CYLINDER')}</Text>
                          {
                            item.cylinders.map((cylinder) => {
                              return (
                                <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingHorizontal: 15 }}>
                                  <Text>{cylinder.cylinderType}</Text>
                                  <Text>{cylinder.color}</Text>
                                  <Text>{cylinder.serial}</Text>
                                </View>
                              )
                            })
                          }
                        </View>
                      )
                  }}
                />
              </View>

            </View>
            )
              : null
          }
           */}
        </ScrollView>
        {this.props.data.status === 'INIT' &&
          this.props.user.id === this.props.data.createdBy.id
          ? <View>

              <TouchableOpacity
                style={styles.btnContinue}
                onPress={async () => {
                  Alert.alert (
                    'Thông báo',
                    'Bạn có muốn gửi yêu cầu xét duyệt không ?',
                    [
                      {
                        text: 'Có',
                        onPress: async () => {
                          this.openGuixacnhan ();
                          await this.props.setOrderRequest (
                            this.props.data.id,
                            this.props.data.warehouseId.id
                          );
                        },
                      },
                      {
                        text: 'Không',
                        onPress: () => console.log ('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]
                  );

                  //edit
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: COLOR.WHITE,
                  }}
                >
                  Gửi yêu cầu duyệt
                </Text>
              </TouchableOpacity>

            </View>
          : null}
        {this.props.data.status === 'REQUEST' &&
          this.props.user.id === this.props.data.warehouseId.id
          ? <View>
              <TouchableOpacity
                style={styles.btnContinue}
                onPress={() => {
                  Alert.alert ('Thông báo', 'Bạn có muốn xét duyệt không ?', [
                    {
                      text: 'Có',
                      onPress: async () => {
                        this.openXacnhan ();
                        console.log ('ordersippingid', this.props.data.id);
                        console.log ('userid', this.props.user.id);
                        // Actions["home"](Alert.alert(translate("notification"), translate('ORDER_REQUEST')))
                        await this.props.approvalOrder (
                          this.props.data.id,
                          this.props.data.createdBy.id
                        );
                        // this.xacnhan();
                      },
                    },
                    {
                      text: 'Không',
                      onPress: () => console.log ('Cancel Pressed'),
                      style: 'cancel',
                    },
                  ]);
                }}
              >

                <Text
                  style={{
                    fontSize: 18,
                    color: COLOR.WHITE,
                  }}
                >
                  Duyệt đơn hàng
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.showModal (true);
                  }}
                  style={styles.btnContinue}
                >

                  <Text
                    style={{
                      fontSize: 18,
                      color: COLOR.WHITE,
                    }}
                  >
                    Từ chối đơn hàng
                  </Text>
                </TouchableOpacity>

                <Modal
                  modalAnimation={
                    new SlideAnimation ({
                      initialValue: 0, // optional
                      slideFrom: 'bottom', // optional
                      useNativeDriver: true, // optional
                    })
                  }
                  visible={this.state.modalVisible}
                  modalTitle={<ModalTitle title="Lý do từ chối đơn hàng" />}
                  footer={
                    <ModalFooter>
                      <ModalButton
                        textStyle={{color: COLOR.WHITE}}
                        style={{backgroundColor: COLOR.RED}}
                        text="Hủy"
                        onPress={() => {
                          this.showModal (!this.state.modalVisible);
                        }}
                      />
                      <ModalButton
                        textStyle={{color: COLOR.WHITE}}
                        style={{backgroundColor: COLOR.RED}}
                        text="Có"
                        onPress={async () => {
                          this.openTuchoidon ();
                          await this.props.cancelOrder (
                            this.props.data.id,
                            this.props.data.createdBy.id,
                            this.state.reasonForCancellatic
                          );
                          this.showModal (!this.state.modalVisible);
                        }}
                      />
                    </ModalFooter>
                  }
                  onRequestClose={() => {
                    console.log ('Modal has been close');
                  }}
                >
                  <View
                    style={{
                      height: 200,
                      width: 300,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 5,
                    }}
                  >
                    {/* <TouchableHighlight onPress={() => {
       this.showModal(!this.state.modalVisible)
     }}>

       <Text style={styles.text}>Close Modal</Text>
     </TouchableHighlight> */}
                    <Textarea
                      onChangeText={text =>
                        this.setState ({reasonForCancellatic: text})}
                      defaultValue={this.state.reasonForCancellatic}
                      placeholder={'Lý do hủy đơn hàng'}
                    />
                  </View>

                </Modal>
              </View>

            </View>
          : null}

        <ProgressDialog
          title="Đang gửi yêu cầu"
          activityIndicatorColor="blue"
          activityIndicatorSize="large"
          animationType="slide"
          message="Vui lòng đợi"
          visible={this.state.showProgress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flexGrow: 1,
    backgroundColor: COLOR.WHITE,
  },
  textGray: {
    fontSize: 16,
    color: COLOR.GRAY,
  },
  textBlack: {
    fontSize: 16,
    color: COLOR.BLACK,
  },
  textBlue: {
    fontSize: 16,
    color: COLOR.BLUE,
  },
  textGREEN: {
    fontSize: 16,
    color: 'green',
  },
  btnContinue: {
    backgroundColor: COLOR.RED,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    margin: 5,
  },

  textORANGE: {
    fontSize: 16,
    color: COLOR.ORANGE,
  },
  statusRED: {
    fontSize: 16,
    color: COLOR.RED,
  },
  textRED: {
    fontSize: 16,
    color: COLOR.RED,
  },

  textBlack: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.BLACK,
    paddingLeft: 5,
  },
});
export const mapStateToProps = state => {
  console.log (
    'mapresult_getCompletedOrderAndCylinders',
    state.order.result_GetCompletedOrderAndCylinders.data
  );
  return {
    result_CompletedOrderAndCylinders: state.order
      .result_GetCompletedOrderAndCylinders.data,
    result_setOrderRequest: state.order.result_setOrderRequest,
    result_approvalOrder: state.order.result_approvalOrder,
    result_cancelOrder: state.order.result_cancelOrder,
    user: state.auth.user,
  };
};
export default connect (mapStateToProps, {
  getCompletedOrderAndCylinders,
  setOrderRequest,
  getOrderRequest,
  setOrderRequestSuccess,
  approvalOrder,
  cancelOrder,
}) (OrderManagement);
