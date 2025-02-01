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
import saver from '../utils/saver';

import { frefgtrec } from '../actions/InspectorActions';

import { setLanguage, getLanguage } from "../helper/auth";
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';


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

// const {width} = Dimensions.get("window");
// const itemWith = width / 2;

const styles = StyleSheet.create({
  txtError: {
    fontSize: 18,
    color: 'red',
  },
  btnEnd: {
    backgroundColor: "#F6921E",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  txtEnd: {
    fontSize: 18,
    textAlign: "center",
    color: 'white',
  }
})
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

class FireFightingRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {

      submitted: false,

      // 1
      testCoolingSys_BeforeMaintenance: '',
      testCoolingSys_AfterMaintenance: '',
      testCoolingSys_Results: '',

      // 2
      chkWaterSupl_BeforeMaintenance: '',
      chkWaterSupl_AfterMaintenance: '',
      chkWaterSupl_Results: '',

      // 3
      chkPortableEqm_BeforeMaintenance: '',
      chkPortableEqm_AfterMaintenance: '',
      chkPortableEqm_Results: '',
    };
  }

  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
    }
  }

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

    const {
      submitted,
      // 1
      testCoolingSys_BeforeMaintenance,
      testCoolingSys_AfterMaintenance,
      testCoolingSys_Results,

      // 2
      chkWaterSupl_BeforeMaintenance,
      chkWaterSupl_AfterMaintenance,
      chkWaterSupl_Results,

      // 3
      chkPortableEqm_BeforeMaintenance,
      chkPortableEqm_AfterMaintenance,
      chkPortableEqm_Results,
    } = this.state
    this.setState({ submitted: true })


    const payload = {
      // 1
      testCoolingSys_BeforeMaintenance,
      testCoolingSys_AfterMaintenance,
      testCoolingSys_Results,

      // 2
      chkWaterSupl_BeforeMaintenance,
      chkWaterSupl_AfterMaintenance,
      chkWaterSupl_Results,

      // 3
      chkPortableEqm_BeforeMaintenance,
      chkPortableEqm_AfterMaintenance,
      chkPortableEqm_Results,
    }

    console.log("hdl_FireFightingRecord", payload)
    if (submitted && payload) {
      Actions.pop();
    }
    this.props.frefgtrec(payload)
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
      testCoolingSys_BeforeMaintenance,
      testCoolingSys_AfterMaintenance,
      testCoolingSys_Results,

      // 2
      chkWaterSupl_BeforeMaintenance,
      chkWaterSupl_AfterMaintenance,
      chkWaterSupl_Results,

      // 3
      chkPortableEqm_BeforeMaintenance,
      chkPortableEqm_AfterMaintenance,
      chkPortableEqm_Results,
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
            title={'1.' + translate('CHECK_THE_OPERATION_COOLING')}
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
                value={testCoolingSys_BeforeMaintenance}
                onChangeText={testCoolingSys_BeforeMaintenance => {
                  this.setState({
                    testCoolingSys_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !testCoolingSys_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={testCoolingSys_AfterMaintenance}
                onChangeText={testCoolingSys_AfterMaintenance => {
                  this.setState({
                    testCoolingSys_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !testCoolingSys_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={testCoolingSys_Results}
                onChangeText={testCoolingSys_Results => {
                  this.setState({
                    testCoolingSys_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !testCoolingSys_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'2.' + translate('CHECK_FIRE')}
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
                value={chkWaterSupl_BeforeMaintenance}
                onChangeText={chkWaterSupl_BeforeMaintenance => {
                  this.setState({
                    chkWaterSupl_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkWaterSupl_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={chkWaterSupl_AfterMaintenance}
                onChangeText={chkWaterSupl_AfterMaintenance => {
                  this.setState({
                    chkWaterSupl_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkWaterSupl_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={chkWaterSupl_Results}
                onChangeText={chkWaterSupl_Results => {
                  this.setState({
                    chkWaterSupl_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkWaterSupl_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'3.' + translate('CHECK_PORTABLE')}
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
                value={chkPortableEqm_BeforeMaintenance}
                onChangeText={chkPortableEqm_BeforeMaintenance => {
                  this.setState({
                    chkPortableEqm_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkPortableEqm_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={chkPortableEqm_AfterMaintenance}
                onChangeText={chkPortableEqm_AfterMaintenance => {
                  this.setState({
                    chkPortableEqm_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkPortableEqm_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={chkPortableEqm_Results}
                onChangeText={chkPortableEqm_Results => {
                  this.setState({
                    chkPortableEqm_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !chkPortableEqm_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <TouchableOpacity
          style={styles.btnEnd}
          onPress={this.handleSubmit}
        >
          <Text style={styles.txtEnd}>{translate('END')}</Text>
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
  { frefgtrec }
)(FireFightingRecord)