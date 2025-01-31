import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { List, Card, Button } from '@ant-design/react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';


import GridView from 'react-native-super-grid';
import Images from "../constants/image"
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { EXPORT, EXPORT_CYLINDER_EMPTY, EXPORT_PARTNER, DELIVER, INSPECTOR } from "../types";
import { getUserType, getUserRole } from '../helper/roles';
import saver from '../utils/saver'

import { vapoChkRecord } from '../actions/InspectorActions';
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';


import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { Actions } from 'react-native-router-flux';

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

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

const styles = StyleSheet.create({
  txtError: {
    fontSize: 18,
    color: 'red',
  },
  btnFinish: {
    backgroundColor: "#F6921E",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  txtFinish: {
    fontSize: 18,
    textAlign: "center",
    color: 'white',
  }
})

// const {width} = Dimensions.get("window");
// const itemWith = width / 2;

// const styles = StyleSheet.create({
//     gridView: {
//         paddingTop: 25
//     },
//     itemContainer: {
//         justifyContent: "space-between",
//         alignItems: 'center',
//         borderRadius: 5,
//         padding: 10,
//         height: 60,
//         flexDirection: 'row',
//         shadowColor: '#000000',
//         shadowOffset: {
//             width: 0,
//             height: 1
//         },
//         shadowOpacity: 0.22,
//         shadowRadius: 2.22,

//         elevation: 3
//     },
//     itemName: {
//         fontSize: 15,
//         color: "#fff",
//         fontWeight: "600"
//     },
//     itemCode: {
//         fontWeight: "600",
//         fontSize: 12,
//         color: "#fff"
//     }
// });

class VaporizerCheckingRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,

      // 1
      chkCtrlSystem_BeforeMaintenance: '',
      chkCtrlSystem_AfterMaintenance: '',
      chkCtrlSystem_Results: '',

      // 2
      chkVapoArea_BeforeMaintenance: '',
      chkVapoArea_AfterMaintenance: '',
      chkVapoArea_Results: '',

      // 3
      drainVapo_BeforeMaintenance: '',
      drainVapo_AfterMaintenance: '',
      drainVapo_Results: '',

      // 4
      topUpWater_BeforeMaintenance: '',
      topUpWater_AfterMaintenance: '',
      topUpWater_Results: '',

      // 5
      chkWaterLev_BeforeMaintenance: '',
      chkWaterLev_AfterMaintenance: '',
      chkWaterLev_Results: '',

      // 6
      leakTest_BeforeMaintenance: '',
      leakTest_AfterMaintenance: '',
      leakTest_Results: '',

      // 7
      chkPower_BeforeMaintenance: '',
      chkPower_AfterMaintenance: '',
      chkPower_Results: '',

      // 8
      chkVapoComp_BeforeMaintenance: '',
      chkVapoComp_AfterMaintenance: '',
      chkVapoComp_Results: '',

    };
  }

  // componentDidMount = async () => {
  //     //this.props.deleteCylinders();
  //     //this.props.fetchUsers();

  //     try {
  //         const languageCode = await getLanguage();
  //         if (languageCode) {
  //             RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
  //         }
  //     } catch (error) {
  //         console.log(error);
  //     }
  // };

  // componentWillUnmount = async () => {       
  //     const languageCode = await getLanguage();
  //     if (languageCode) {
  //         RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
  //     }
  // }

  // handleChangeLanguage = (lgnCode) => {
  //     //setLanguage(lgnCode);
  //     chooseLanguageConfig(lgnCode)
  // }

  // handleRole() {
  //     if (this.props.user.userRole === DELIVER) {
  //         // let role = this.props.user.userRole
  //         console.log("driver_role")
  //         return getUserRole(DELIVER)
  //     } else if (this.props.user.userRole === INSPECTOR) {
  //         console.log("inspector_role")
  //         return getUserRole(INSPECTOR)
  //     }
  //     else {
  //         return getUserType(this.props.user.userType)
  //     }
  // }

  // functionClickButton(item) {
  //     if (!item.hasOwnProperty("type") && !item.hasOwnProperty("typeForPartner")) {
  //         this.navigateAction(item.action, "", "")
  //     } else if (item.hasOwnProperty("type") && !item.hasOwnProperty("typeForPartner")) {
  //         this.navigateAction(item.action, item.type, "")
  //     } else if (!item.hasOwnProperty("type") && item.hasOwnProperty("typeForPartner")) {
  //         this.navigateAction(item.action, "", item.typeForPartner)
  //     } else {
  //         this.navigateAction(item.action, item.type, item.typeForPartner)
  //     }
  // }

  // navigateAction = (action, type, typeForPartner = '') => {
  //     //this.props.changeCyclinderAction(action);
  //     saver.setDataCyclinder(action);
  //     saver.setTypeCyclinder(type);
  //     this.props.typeForPartner("")
  //     if (type === "STATION" && action === EXPORT) {
  //         Actions[EXPORT_CYLINDER_EMPTY]();
  //         return;
  //     }
  //     if (!!typeForPartner) {
  //         this.props.typeForPartner(typeForPartner)
  //         Actions[EXPORT_PARTNER]()
  //         return
  //     }

  //     Actions[action]()
  // };

  handleSubmit = () => {
    //alert("aaabc")

    const {
      submitted,
      // 1
      chkCtrlSystem_BeforeMaintenance,
      chkCtrlSystem_AfterMaintenance,
      chkCtrlSystem_Results,

      // 2
      chkVapoArea_BeforeMaintenance,
      chkVapoArea_AfterMaintenance,
      chkVapoArea_Results,

      // 3
      drainVapo_BeforeMaintenance,
      drainVapo_AfterMaintenance,
      drainVapo_Results,

      // 4
      topUpWater_BeforeMaintenance,
      topUpWater_AfterMaintenance,
      topUpWater_Results,

      // 5
      chkWaterLev_BeforeMaintenance,
      chkWaterLev_AfterMaintenance,
      chkWaterLev_Results,

      // 6
      leakTest_BeforeMaintenance,
      leakTest_AfterMaintenance,
      leakTest_Results,

      // 7
      chkPower_BeforeMaintenance,
      chkPower_AfterMaintenance,
      chkPower_Results,

      // 8
      chkVapoComp_BeforeMaintenance,
      chkVapoComp_AfterMaintenance,
      chkVapoComp_Results,

    } = this.state
    this.setState({ submitted: true })


    const payload = {
      // 1
      chkCtrlSystem_BeforeMaintenance,
      chkCtrlSystem_AfterMaintenance,
      chkCtrlSystem_Results,

      // 2
      chkVapoArea_BeforeMaintenance,
      chkVapoArea_AfterMaintenance,
      chkVapoArea_Results,

      // 3
      drainVapo_BeforeMaintenance,
      drainVapo_AfterMaintenance,
      drainVapo_Results,

      // 4
      topUpWater_BeforeMaintenance,
      topUpWater_AfterMaintenance,
      topUpWater_Results,

      // 5
      chkWaterLev_BeforeMaintenance,
      chkWaterLev_AfterMaintenance,
      chkWaterLev_Results,

      // 6
      leakTest_BeforeMaintenance,
      leakTest_AfterMaintenance,
      leakTest_Results,

      // 7
      chkPower_BeforeMaintenance,
      chkPower_AfterMaintenance,
      chkPower_Results,

      // 8
      chkVapoComp_BeforeMaintenance,
      chkVapoComp_AfterMaintenance,
      chkVapoComp_Results,
    }

    console.log("hdl_VaporizerRecord", payload)
    if (submitted && payload) {
      Actions.pop();
    }
    this.props.vapoChkRecord(payload)
    // alert('clicked')
  }

  renderError = error => {
    console.log(error)
    return (
      <WingBlank>
        <WhiteSpace size="lg" />
        <Text style={styles.txtError}>{error}</Text>
      </WingBlank>
    )

  }
  render() {
    const {
      submitted,
      // 1
      chkCtrlSystem_BeforeMaintenance,
      chkCtrlSystem_AfterMaintenance,
      chkCtrlSystem_Results,

      // 2
      chkVapoArea_BeforeMaintenance,
      chkVapoArea_AfterMaintenance,
      chkVapoArea_Results,

      // 3
      drainVapo_BeforeMaintenance,
      drainVapo_AfterMaintenance,
      drainVapo_Results,

      // 4
      topUpWater_BeforeMaintenance,
      topUpWater_AfterMaintenance,
      topUpWater_Results,

      // 5
      chkWaterLev_BeforeMaintenance,
      chkWaterLev_AfterMaintenance,
      chkWaterLev_Results,

      // 6
      leakTest_BeforeMaintenance,
      leakTest_AfterMaintenance,
      leakTest_Results,

      // 7
      chkPower_BeforeMaintenance,
      chkPower_AfterMaintenance,
      chkPower_Results,

      // 8
      chkVapoComp_BeforeMaintenance,
      chkVapoComp_AfterMaintenance,
      chkVapoComp_Results,
    } = this.state

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#FFF' }}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      >
        <Card>
          <Card.Header
            title={'1.' + translate('CHECK_THE_CONTROL')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkCtrlSystem_BeforeMaintenance}
                onChangeText={chkCtrlSystem_BeforeMaintenance => {
                  this.setState({
                    chkCtrlSystem_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkCtrlSystem_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkCtrlSystem_AfterMaintenance}
                onChangeText={chkCtrlSystem_AfterMaintenance => {
                  this.setState({
                    chkCtrlSystem_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkCtrlSystem_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={chkCtrlSystem_Results}
                onChangeText={chkCtrlSystem_Results => {
                  this.setState({
                    chkCtrlSystem_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkCtrlSystem_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'2.' + translate('CHECK_THE_BOILER')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={chkVapoArea_BeforeMaintenance}
                onChangeText={chkVapoArea_BeforeMaintenance => {
                  this.setState({
                    chkVapoArea_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkVapoArea_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkVapoArea_AfterMaintenance}
                onChangeText={chkVapoArea_AfterMaintenance => {
                  this.setState({
                    chkVapoArea_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkVapoArea_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={chkVapoArea_Results}
                onChangeText={chkVapoArea_Results => {
                  this.setState({
                    chkVapoArea_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkVapoArea_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'3.' + translate('RINSE_THE_RESIDUES')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={drainVapo_BeforeMaintenance}
                onChangeText={drainVapo_BeforeMaintenance => {
                  this.setState({
                    drainVapo_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainVapo_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={drainVapo_AfterMaintenance}
                onChangeText={drainVapo_AfterMaintenance => {
                  this.setState({
                    drainVapo_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainVapo_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={drainVapo_Results}
                onChangeText={drainVapo_Results => {
                  this.setState({
                    drainVapo_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainVapo_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'4.' + translate('TOP_UP_WATER')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={topUpWater_BeforeMaintenance}
                onChangeText={topUpWater_BeforeMaintenance => {
                  this.setState({
                    topUpWater_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !topUpWater_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={topUpWater_AfterMaintenance}
                onChangeText={topUpWater_AfterMaintenance => {
                  this.setState({
                    topUpWater_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !topUpWater_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={topUpWater_Results}
                onChangeText={topUpWater_Results => {
                  this.setState({
                    topUpWater_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !topUpWater_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'5.' + translate('CHECK_WATER_LV')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkWaterLev_BeforeMaintenance}
                onChangeText={chkWaterLev_BeforeMaintenance => {
                  this.setState({
                    chkWaterLev_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkWaterLev_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkWaterLev_AfterMaintenance}
                onChangeText={chkWaterLev_AfterMaintenance => {
                  this.setState({
                    chkWaterLev_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkWaterLev_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={chkWaterLev_Results}
                onChangeText={chkWaterLev_Results => {
                  this.setState({
                    chkWaterLev_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkWaterLev_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'6.' + translate('CHECK_FOR_LEAKS_JOINTS')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={leakTest_BeforeMaintenance}
                onChangeText={leakTest_BeforeMaintenance => {
                  this.setState({
                    leakTest_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !leakTest_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={leakTest_AfterMaintenance}
                onChangeText={leakTest_AfterMaintenance => {
                  this.setState({
                    leakTest_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !leakTest_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={leakTest_Results}
                onChangeText={leakTest_Results => {
                  this.setState({
                    leakTest_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !leakTest_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'7.' + translate('CHECK_THE_POWER')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkPower_BeforeMaintenance}
                onChangeText={chkPower_BeforeMaintenance => {
                  this.setState({
                    chkPower_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkPower_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkPower_AfterMaintenance}
                onChangeText={chkPower_AfterMaintenance => {
                  this.setState({
                    chkPower_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkPower_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={chkPower_Results}
                onChangeText={chkPower_Results => {
                  this.setState({
                    chkPower_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkPower_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'8.' + translate('CHECK_STEAM')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkVapoComp_BeforeMaintenance}
                onChangeText={chkVapoComp_BeforeMaintenance => {
                  this.setState({
                    chkVapoComp_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkVapoComp_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                multiline={true}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={chkVapoComp_AfterMaintenance}
                onChangeText={chkVapoComp_AfterMaintenance => {
                  this.setState({
                    chkVapoComp_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkVapoComp_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                multiline={true}
                value={chkVapoComp_Results}
                onChangeText={chkVapoComp_Results => {
                  this.setState({
                    chkVapoComp_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkVapoComp_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <TouchableOpacity
          style={styles.btnFinish}
          onPress={this.handleSubmit}
        >
          <Text style={styles.txtFinish}>{translate('END')}</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}



export const mapStateToProps = state => ({
  //user: state.auth.user,
})

export default connect(
  mapStateToProps,
  { vapoChkRecord }
)(VaporizerCheckingRecord)