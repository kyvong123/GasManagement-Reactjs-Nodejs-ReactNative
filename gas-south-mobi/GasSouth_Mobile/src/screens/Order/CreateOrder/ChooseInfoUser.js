import { StyleSheet, Text, TextInput, View, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Picker } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLOR } from '../../../constants';
import handleChangeLanguage, { translate } from '../../../utils/changeLanguage';
import LineOrderItem from '../../../components/LineOrderItem';
import { createOrderNew, getAddressStationClient, getArea, getCustomers, getStation } from '../../../api/orders_new';
import Toast from 'react-native-toast-message'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';

const ChooseInfoUser = (props) => {

  const [selectedDiaChiKH, setSelectedDiaChiKH] = useState("dia chi khách hàng");
  const [adderssStation, setAdderssStation] = useState("");
  const [selectedDiaChiTram, setSelectedDiaChiTram] = useState("");
  const [placeOfDelivery, setPlaceOfDelivery] = useState("CUSTOMER");
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [placeholderCustommer, setPlaceholderCustommer] = useState("Chọn khách hàng");
  //check null

  const [checkSupplier, setCheckSupplier] = useState(false);
  const [checkArea, setCheckArea] = useState(false);
  const [checkDT, setCheckDT] = useState(false);
  const [checkCustommer, setCheckCustommer] = useState(false);

  const [state, setState] = useState(
    {
      delivery: [{
        deliveryAddress: null,
        deliveryDate: null
      }],
      orderType: "KHONG", //coc vo muon vo
      note: "Không có ghi chú",
      supplier: "",//tram
      area: "",//khu vuc
      customers: "",//id KH,
      idCustomersGetPrice: ""
    })

  const [temp, setTemp] = useState({
    listStation: [],//tram
    listArea: [],//khu vuc
    lisCustomers: [],
    lisCustomersTemp: [],
  })
  const [temp2, setTemp2] = useState({
    doiTuong: "",
    khachHang: "",
  })

  const [address, setAddress] = useState("")
  const [isChildOf, setIsChildOf] = useState("")//Khách hàng
  const [addressCus, setAddressCus] = useState("")//Khách hàng
  const visibilityTime = 2000;

  //danh địa chỉ trạm theo khách hàng
  const getAddressStation = async (isChildOf) => {
    const response = await getAddressStationClient(isChildOf)
    if (response.status) {
      setAddress(response.data.address)
    }
  }

  //danh sách tram
  const getListStation = async () => {
    const listStation = await getStation()
    setTemp({ ...temp, listStation: listStation.data })
  }

  //danh sách khu vuc theo tram
  const getLisArea = async (e) => {
    const listArea = await getArea(e)
    setTemp({ ...temp, listArea: listArea.data })
  }

  //danh sach khach hang khi chọn vùng(tạm thời chưa lọc theo khu vực)
  const getListCustomers = async (area, userRole) => {
    try {
      const listCustomers = await getCustomers(state.supplier, userRole) //(id trạm, đối tượng)
      const arrTemp = listCustomers.data
      // const newArr = arrTemp.filter(element =>
      //   element.area === area && element.userRole === userRole && element.isChildOf === state.supplier)
      setTemp({
        ...temp, lisCustomers: arrTemp.map(item => ({ label: item.name, value: item.id })),
        lisCustomersTemp: arrTemp.map(item => ({ label: item.name, value: item }))
      })
    } catch (err) {
      console.log("LỖI FETCH API,", err);
    }
  }

  //lấy thông tin khach hàng
  const getInfoCustomer = (idCustomer) => {
    let customer = null
    customer = temp.lisCustomersTemp.filter(element => element.value.id == idCustomer)
    return customer[0].value
  }

  //createOrder
  const CreateOrderSuccessFull = (state) => {
    // setIsCheckLoading(true)
    // createOrderNew(state)
    // Actions['CreateNewOrderSuccessFull']({})
    Actions['orderScreen']({ inforCustomers: state, address: address, placeOfDelivery: placeOfDelivery, inforCustomersDetail: temp2.khachHang })
    // console.log(state)
  }


  useEffect(() => {
    getListStation()
  }, []);

  const loaiKH = [
    {
      userRole: "Industry",
      name: "Khách hàng công nghiệp bình"
    }, {
      userRole: "Distribution",
      name: "Tổng đại lý"
    },
    {
      userRole: "Agency",
      name: "Đại lý"
    }]


  return (
    <SafeAreaView style={styles.container}
    >
      <View style={{ flex: 9 }}>

        <View style={styles.Nav_container}>
          <TouchableOpacity
            hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
            onPress={() => Actions['OrderManagement']({})}
          >
            <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
          </TouchableOpacity>
          <Text style={styles.Nav_title}>{translate('CREATE_NEW_ORDERS')}</Text>
          <View style={{ width: 30 }}></View>
        </View>
        <ScrollView style={styles.container}>
          <LineOrderItem showLine={1} />
          <View style={{ paddingHorizontal: 5 }}>
            <Text style={[styles.title, { fontSize: 18 }]}>{translate('CUSTOMER_INFORMATION')}:</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{translate('STATION')}:</Text>
                <View style={styles.ViewPicker}>
                  <Picker
                    selectedValue={state.supplier}
                    style={{ height: 40, width: "100%" }}
                    onValueChange={(e) => {
                      setState({ ...state, supplier: e, customers: "", area: "" })
                      getLisArea(e)
                      setTemp({ ...temp, lisCustomers: [], lisCustomersTemp: [] })
                      setTemp2({ ...temp2, khachHang: "", doiTuong: "" })
                      setPlaceholderCustommer("Chọn khách hàng")
                      setSelectedDiaChiTram('')
                      setSelectedDiaChiKH('dia chi khách hàng')
                      setAddress("")
                      setAddressCus("")
                      setIsChildOf("")
                      //check null
                      setCheckSupplier(false)
                      // setCheckArea(false)
                      // setCheckDT(false)
                      // setCheckCustommer(false)
                    }}>
                    <Picker.Item label={translate('SELECT') + ' ' + translate('STATION')} value={""} />
                    {temp.listStation ? temp.listStation.map((item, index) => {
                      return (<Picker.Item label={item.name} value={item.id} key={index} />)
                    }) : null}
                  </Picker>
                </View>
                <View style={{ paddingLeft: 10 }}>
                  {
                    checkSupplier == false ? null :
                      state.supplier != "" ? null
                        : <Text style={{ color: 'red', fontSize: 11 }}>{translate("THIS_FIELD_CANNOT_BE_LEFT_BLANK")}</Text>
                  }
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{translate('SECTOR')}:</Text>
                <View style={styles.ViewPicker}>
                  <Picker
                    selectedValue={state.area}
                    style={{ height: 40, width: "100%" }}
                    onValueChange={(e) => {
                      setState({ ...state, area: e, customers: "" })
                      setTemp({ ...temp, lisCustomers: [], lisCustomersTemp: [] })
                      setTemp2({ ...temp2, khachHang: "", doiTuong: "" })
                      setPlaceholderCustommer("Chọn khách hàng")
                      setSelectedDiaChiTram('')
                      setSelectedDiaChiKH('dia chi khách hàng')
                      setAddress("")
                      setAddressCus("")
                      setIsChildOf("")
                      //check null
                      setCheckArea(false)
                      // setCheckDT(false)
                      // setCheckCustommer(false)
                    }}>
                    <Picker.Item label={translate('SELECT_AREA')} value={""} />
                    {temp.listArea ? temp.listArea.map((item, index) => {
                      return (<Picker.Item label={item.name} value={item.id} key={index} />)
                    }) : null}
                  </Picker>
                </View>
                <View style={{ paddingLeft: 10 }}>
                  {
                    checkArea == false ? null :
                      state.area != "" ? null
                        : <Text style={{ color: 'red', fontSize: 11 }}>{translate("THIS_FIELD_CANNOT_BE_LEFT_BLANK")}</Text>
                  }
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.title}>{translate('CHOOSE_CUSTOMER_TYPE')}:</Text>
              <View style={{ paddingLeft: 10 }}>
                {
                  checkDT == false ? null :
                    temp2.doiTuong != "" ? null
                      : <Text style={{ color: 'red', fontSize: 11 }}>{translate("THIS_FIELD_CANNOT_BE_LEFT_BLANK")}</Text>
                }
              </View>
              <View style={styles.ViewPicker}>
                <Picker
                  selectedValue={temp2.doiTuong}
                  style={{ height: 40, width: "100%" }}
                  onValueChange={(e) => {
                    setTemp2({ ...temp2, doiTuong: e, khachHang: "" })
                    setPlaceholderCustommer("Chọn khách hàng")
                    getListCustomers(state.area, e)
                    setState({ ...state, customers: "" })
                    setSelectedDiaChiTram('')
                    setSelectedDiaChiKH('dia chi khách hàng')
                    setAddress("")
                    setAddressCus("")
                    setIsChildOf("")
                    //ckeck null
                    setCheckDT(false)
                    // setCheckCustommer(false)
                  }}>
                  <Picker.Item label={translate('SELECT_TYPE_CUSTOMER')} value={""} />
                  {loaiKH.map((item, index) => {
                    return (<Picker.Item label={item.name} value={item.userRole} key={index} />)
                  })}
                </Picker>
              </View>
              <Text style={styles.title}>{translate('CUSTOMER')}:</Text>
              <View style={{ paddingLeft: 10 }}>
                {
                  checkCustommer == false ? null :
                    state.customers != "" ? null
                      : <Text style={{ color: 'red', fontSize: 11 }}>{translate("THIS_FIELD_CANNOT_BE_LEFT_BLANK")}</Text>
                }
              </View>
              <View style={{ marginHorizontal: 5 }}>
                <DropDownPicker
                  open={open}
                  items={temp.lisCustomers}
                  setOpen={setOpen}
                  listMode="MODAL"
                  placeholder={placeholderCustommer}
                  searchable={true} searchPlaceholder="Nhập tên khách hàng..."
                  onSelectItem={(item) => {
                    setPlaceholderCustommer(item.label)
                    setTemp2({ ...temp2, khachHang: getInfoCustomer(item.value) })
                    setState({
                      ...state, customers: getInfoCustomer(item.value).id,//e.userRole === "SuperAdmin" ? e.id : e.isChildOf
                      idCustomersGetPrice: getInfoCustomer(item.value).id
                    })
                    setSelectedDiaChiTram('')
                    setSelectedDiaChiKH('dia chi khách hàng')
                    setAddress(getInfoCustomer(item.value).address)
                    setAddressCus(getInfoCustomer(item.value).address)
                    setIsChildOf(getInfoCustomer(item.value).isChildOf)
                    //check null
                    setCheckCustommer(false)
                  }}
                />
              </View>
              <Text style={styles.title}>{translate('DELIVERY_ADDRESS')}:</Text>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.ViewCheckBox(selectedDiaChiKH)}
                    onPress={() => {
                      setSelectedDiaChiTram('')
                      setSelectedDiaChiKH('dia chi khách hàng')
                      setPlaceOfDelivery('CUSTOMER')
                      setAddress(addressCus)
                    }} />
                  <Text style={[styles.title, {
                    fontSize: 14,
                    paddingVertical: 2,
                    color: '#009347',
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginLeft: 5
                  }]}>Địa chỉ khách hàng</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.ViewCheckBox(selectedDiaChiTram)}
                    onPress={() => {
                      setSelectedDiaChiKH('')
                      setSelectedDiaChiTram('dia chi tram')
                      setPlaceOfDelivery('STATION')
                      getAddressStation(isChildOf)
                    }} />
                  <Text style={[styles.title, {
                    fontSize: 14,
                    paddingVertical: 2,
                    color: '#009347',
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginLeft: 5
                  }]}>Địa chỉ trạm</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 10 }}>
                {
                  checkCustommer == false ? null :
                    state.customers != "" ? null
                      : <Text style={{ color: 'red', fontSize: 11 }}>{translate("THIS_FIELD_CANNOT_BE_LEFT_BLANK")}</Text>
                }
              </View>
              <View style={styles.ViewPicker}>
                <Picker
                  selectedValue={address}
                  style={{ height: 40, width: "100%" }}
                  onValueChange={(e) => { }}>
                  <Picker.Item label={translate('SELECT') + ' ' + translate('ADDRESS')} value={""} />
                  {address != "" ? <Picker.Item label={address} value={address} /> : null}
                  {/* {temp2.listAddress.map((item, index) => {
                    return (<Picker.Item label={item} value={index} key={index} />)
                  })} */}
                </Picker>
              </View>
            </View>

            <View>
              <Text style={[styles.title, {
                marginVertical: 10,
                color: '#81ad61',
                fontSize: 18
              }]}>{translate('NOTE')}:</Text>
              <TextInput
                style={styles.inputNote}
                placeholder={translate('IMPORT_NOTES')}
                multiline={true}
                onChangeText={(e) => {
                  if (e == "") { setState({ ...state, note: "Không có ghi chú" }) }
                  else {
                    setState({ ...state, note: e })
                  }
                }}>
              </TextInput>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={{ flex: 1, marginTop: 10, justifyContent: 'flex-end' }}>
        {isCheckLoading ? <ActivityIndicator size="large" color={COLOR.GREEN_MAIN} /> :
          <TouchableOpacity
            style={styles.btnContinue}
            onPress={() => {

              if (state.customers != "" && state.supplier != "") {//state.area != "" &&
                // createOrderNew(state); Actions['CreateNewOrderSuccessFull']({})
                CreateOrderSuccessFull(state)
              } else {
                // if (state.area == "") {
                //   setCheckArea(true)
                // }
                if (state.customers == "") {
                  setCheckCustommer(true)
                }
                if (state.supplier == "") {
                  setCheckSupplier(true)
                }
                if (temp2.doiTuong == "") {
                  setCheckDT(true)
                }
              }
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLOR.WHITE,
              }}>
              {translate('CONTINUE')}
            </Text>
          </TouchableOpacity>}
      </View>
      <Toast
        backgroundColor="#fffff"
        autoHide={true}
        visibilityTime={visibilityTime}
        ref={(ref) => {
          Toast.setRef(ref);
        }}
      />
    </SafeAreaView>
  );
};

export default ChooseInfoUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  title: {
    fontSize: 15,
    paddingVertical: 2,
    color: '#009347',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5
  },
  btnContinue: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F6921E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  ViewPicker: {
    borderColor: COLOR.GRAY,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5
  },
  ViewCheckBox: (isChoosing) => {
    return {
      marginTop: 10,
      width: 20,
      height: 20,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#009347',
      backgroundColor: isChoosing === "" ? COLOR.WHITE : '#81ad61',
    };
  }, VieDate: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderColor: COLOR.GRAY,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    width: "40%",
  }, inputNote: {
    height: 150,
    borderWidth: 0.5,
    textAlignVertical: 'top',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  dtpickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    overflow: 'hidden',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10
  },
  txtGray: {
    color: COLOR.GRAY,
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
