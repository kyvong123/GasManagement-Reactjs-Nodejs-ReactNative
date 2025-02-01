
import { Alert, StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput, ActivityIndicator, Image,TouchableOpacity, FlatList,RefreshControl,Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTailwind } from 'tailwind-rn';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import SearchIcon from 'react-native-vector-icons/FontAwesome5';
import DeleteIcon from 'react-native-vector-icons/AntDesign';
import { VStack, Input, Button, FormControl, Select, Center, CheckIcon, WarningOutlineIcon, Box } from 'native-base';
import { Formik } from 'formik';
import { Actions } from "react-native-router-flux";
import moment from 'moment';
import { width } from '../../utils/sizeScreen';
import { useSelector, useDispatch } from 'react-redux';
import { truckDeliveryDeleteSerial } from '../../actions/TruckDeliveryActions';
import { COLOR, SHIPPING_TYPE } from '../../constants';
import { getOrdersStatis } from '../../api/orders_statistical';
import ItemOrderStatis from './OrderStatisticsItem';
import SwitchSelector from "react-native-switch-selector";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { async } from 'rxjs';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import Icon from "react-native-vector-icons/AntDesign";

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const TruckOrderStatistics = () => {
    const tw = useTailwind();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.auth._userInfo);
    const [orders, setOrders] = useState();
    const [refreshing, setRefreshing] = useState(true);
    const [isChooseType, setIsChooseType] = useState(-1);
    const [type, setType] = useState("GIAO_HANG");
    const [timeType, setTimeType] = useState();
    const [startDate, setStartDate] = useState(moment().startOf("day").toISOString());
    const [endDate, setEndDate] = useState(moment().endOf("day").toISOString());
    const [dateStart, setDateStart] = useState(translate("START_DATE"));
    const [dateEnd, setDateEnd] = useState(translate("END_DATE"));
    const [modalVisible, setModalVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const selectArr = [
        {
            id:'1',
            title: "Hôm nay"
        },
        {
            id:'2',
            title: "Hôm qua"
        },
        {
            id:'3',
            title: "Tuần này"
        },
        {
            id:'4',
            title: "Tháng này"
        },
        {
            id:'5',
            title: "Khác"
        },
    ];

    const _filter = (item, index) => {
        switch (index) {
            // Hom nay
            case 0:
                setStartDate(moment().startOf("day").toISOString())
                setEndDate(moment().endOf("day").toISOString())
                break;

            // Hom qua
            case 1:
                setStartDate(moment().subtract(1, 'days').startOf('day').toISOString())
                setEndDate(moment().subtract(1, 'days').endOf('day').toISOString())
                break;
            //Tuan nay
            case 2:
                console.log("Tuan");
                setStartDate(moment().startOf('week').toISOString())
                setEndDate(moment().endOf('week').toISOString())
                break;
            // Thang nay
            case 3:
                console.log("Thang");
                setStartDate(moment().startOf('month').toISOString())
                setEndDate(moment().endOf('month').toISOString())
                break;
            // Khac
            case 4:
                setModalVisible(true)

                break;
        
            default:
                break;
        }
    }
    const timePickerBtn = (timeType, date) => {
      const formatDate = (date) => {
        if (date != translate('START_DATE') && date != translate('END_DATE')) {
          return moment(date).format('DD/MM/YYYY')
        } else {
          return date
        }
      }
      return(
        <TouchableOpacity 
          style={styles.timePickerStyle}
          onPress={() => {
            setIsVisible(true);
            setTimeType(timeType);
          }}>
          <Icon name={'calendar'} size={20} color="gray"/>
          <Text style={{color: '#000', paddingHorizontal: 5}}>{formatDate(date)}</Text>
        </TouchableOpacity>
      )
    }

    const handleDisplayData = async () => {
      if (dateStart == translate('START_DATE') || dateEnd == translate('END_DATE')) {
        Alert.alert(translate('notification'), translate('REQUIRED_FIELDS'))
      } else {
        // onPlotChart();
        // onDisplayWarehouseData();
        setStartDate(dateStart.toISOString())
        setEndDate(dateEnd.toISOString())
        setModalVisible(false)
      }
    }

    // const onPlotChart = async () => {
    //   await tankTruckApi.checkSpurlus({
    //     fromDate: dateStart,
    //     toDate: dateEnd
    //   }).then(data => {
    //     let labelTmp = [];
    //     let listTmp1 = [];
    //     let listTmp2 = [];
    //     let listTmp3 = [];
    //     data.data.Result.map(value => {
    //       listTmp1.push(value.AfterImportExport);
    //       labelTmp.push(value.date)
    //     })
    //     for (let i = 0; i < listTmp1[0].length; i++) {
    //       listTmp2[i] = [];
    //     }
    //     for (let i=0; i < listTmp1[0].length; i++) {
    //       for (let j=0; j < listTmp1.length; j++) {
    //         listTmp2[i][j] = listTmp1[j][i];
    //       }
    //     }
    //     for (let i=0; i < listTmp2.length; i++) {
    //       listTmp3.push({
    //         data: listTmp2[i],
    //         color: () => chartColor[i],
    //         strokeWidth: 3,
    //       })
    //     }
    //     setChartLegend(data.data.Result[0].WareHouseName);
    //     setChartData({
    //       labels: labelTmp,
    //       datasets: listTmp3
    //     });
    //   })
    // }
  
    // const onDisplayWarehouseData = async () => {
    //   await tankTruckApi.ManageImportExportWareHouse({
    //     fromDate: minDate,
    //     toDate: maxDate
    //   }).then(data => {
    //     let listTmp1 = [];
    //     let listTmp2 = [];
        
    //     for (let i = 0; i < data.data.WareHouseName.length; i++) {
    //       listTmp2[i] = [
    //         data.data.BeforeImport[i], 
    //         data.data.Import[i], 
    //         data.data.Export[i], 
    //         data.data.AfterImportExport[i], 
    //       ];
    //       listTmp1.push({
    //         WareHouseName: data.data.WareHouseName[i],
    //         data: listTmp2[i]
    //       })
    //     }
    //     setWarehouseData(listTmp1)
    //   })
    // }



    const renderItemHeader = ({ item, index }) => {
        return (
          <TouchableOpacity
            onPress={ () => {
              setIsChooseType(index);
              _filter(item, index);
            }}
            style={styles.itemHeader(index, isChooseType)}>
            <Text style={styles.itemHeaderText(index, isChooseType)}>{item.title}</Text>
          </TouchableOpacity>
        );
      };

      // ĐƠN GIAO HÀNG
      const _getOrdersForDelivery =  () => {
        console.log("truyenlen",userInfo.id, type, startDate, endDate)
        getOrdersStatis({vehicleId: userInfo.id, type, startDate, endDate})
            .then(data => {
                setRefreshing(false);
                if (data) {
                    setOrders(data.data);
                    console.log("DuLieuGia:",data);
                } else {
                    setOrders(null);
                    console.log("Không lấy được API_Statistic");
                }
            })
            .catch(console.log);
    }

    useEffect(() => {
        _getOrdersForDelivery();
    }, [startDate, endDate, type]);

    const renderItem = props => {
        return <ItemOrderStatis {...props} type={type}/>
    }
    useEffect(() => {
        setIsChooseType(0)
    },[])

    return (
        <SafeAreaView>
            {/* _______START HEADER ________ */}
            <View style={tw('flex items-center justify-between flex-row bg-[#04aa6b] py-4 px-3')}>
                <View>
                    <BackIcon onPress={() => { Actions['home']({}) }} color={'#FFF'} size={30} name="ios-arrow-back" />
                </View>
                <Text style={tw('text-lg text-white font-black ')}>Thông tin thống kê</Text>
                <View>
                    <HomeIcon onPress={() => { Actions['home']({}) }} name="home-outline" size={30} color="#FFF" />
                </View>
            </View>
            {/* _______END HEADER ________ */}
            <View>
                <FlatList
                    style={{ marginHorizontal: 5, margin: 10}}
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    data={selectArr}
                    renderItem={renderItemHeader}
                />
                <View style={{alignItems:'flex-end'}}>
                  <View style={ styles.selector }>
                  <SwitchSelector       
                      initial={0}
                      textColor={"#04aa6b"}
                      selectedColor={"#d9d9d9"}
                      buttonColor={"#04aa6b"}
                      backgroundColor={"#d9d9d9"}
                      borderColor={"#04aa6b"}
                      hasPadding
                      bold
                      options={[
                          { label: "Giao Hàng", value: "GIAO_HANG"},
                          { label: "Hồi Lưu", value: "HOI_LUU"}
                      ]}
                      onPress={
                          value => setType(value)
                      }                  
                  />
                  </View>
                </View>
                
                
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            //Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                            <Text style={styles.modalText}>Tùy chọn hiển thị</Text>

                            <View style={styles.datePickStyle}>
                                {timePickerBtn('dateStart', dateStart)}
                                <Text>-</Text>
                                {timePickerBtn('dateEnd', dateEnd)}
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    padding: 10,
                                    flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                    style={styles.resetBtn}
                                    onPress={() => {
                                      setDateStart(translate("START_DATE"));
                                      setDateEnd(translate("END_DATE"));
                                    }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', textDecorationLine: 'underline' }}>{translate('RESET_DATE')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmBtn}
                                    onPress={handleDisplayData}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{translate('CONFIRM')}</Text>
                                </TouchableOpacity>
                                
                            </View>

                            <DateTimePickerModal
                                isVisible={isVisible}
                                mode={'date'}
                                locale={'vi'}
                                // maximumDate={maxDate}
                                // minimumDate={minDate}
                                onConfirm={(date) => {
                                    setIsVisible(false);
                                    switch(timeType){
                                      case 'dateStart':
                                        setDateStart(date);
                                        // setMinDate(date);
                                        // if (new Date().getTime() > date.getTime() + 62 * 24 * 60 * 60 * 1000){
                                        //   setMaxDate(new Date(date.getTime() + 62 * 24 * 60 * 60 * 1000));
                                        // }
                                        break;
                                      case 'dateEnd':
                                        setDateEnd(date);
                                        // setMaxDate(date);
                                        // setMinDate(date.getTime() - 62 * 24 * 60 * 60 * 1000);

                                        break;
                                    }
                                  }}
                                onCancel={() => setIsVisible(false)}
                                confirmTextIOS="Chọn"
                                cancelTextIOS="Bỏ chọn"
                                headerTextIOS="Chọn thời gian"
                                pickerContainerStyleIOS={{
                                    backgroundColor: 'grey',
                                    styleLabel: {
                                        color: '#fff'
                                    }
                                }}
                            />
                            </View>
                        </View>
                    </Modal>
                
                    <ScrollView >
                        <Text></Text>
                        {orders ?
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                    />
                                }
                                data={orders}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            :
                            (orders === null ?
                                <View style={{ height: '60%', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}> Không có đơn hàng</Text>
                                </View>
                                :
                                <View style={{ height: '100%', justifyContent: 'center' }}>
                                    <ActivityIndicator size="large" color="#00ff00" />
                                </View>
                            )
                        }
                    </ScrollView>
    
            </View>
        </SafeAreaView>
    )
}

export default TruckOrderStatistics

const styles = StyleSheet.create({
    itemHeader: (index, isChooseType) => {
        return {
          backgroundColor: index === isChooseType ? "#04aa6b" : "#d9d9d9",
          flex: 1, justifyContent: "center", alignItems: "center", height: 30,
          margin: 4,
          borderRadius: 20,
          width:67,
          
        };
      },
      itemHeaderText: (index, isChooseType) => {
        return {
          fontWeight: "600",
          color: index === isChooseType ? '#FFF' : '#04aa6b',
          textAlign: 'center',
        };
      },
      selector:{
       // marginHorizontal: 150,
        width:200,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "#d9d9d9",
        borderRadius: 20,
        padding: 35,
        height: 210,
        width:400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalBanner: {
        backgroundColor: "#04aa6b",
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        color:"#04aa6b",
        fontSize:20
      },
      datePickStyle: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      timePickerStyle: {
        width: '45%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 7.5,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5
      },
      confirmBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 40,
        backgroundColor: '#04aa6b',
        marginBottom: 5,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginLeft: 20,
      },
      resetBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 40,
        backgroundColor: '#F6921E',
        marginBottom: 5,
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
})