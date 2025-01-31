import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { List, Card, Button } from '@ant-design/react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';

// import DateTimePicker from '@react-native-community/datetimepicker';


// import GridView from 'react-native-super-grid';
// import Images from "../constants/image"
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
// import {EXPORT, EXPORT_CYLINDER_EMPTY, EXPORT_PARTNER, DELIVER, INSPECTOR} from "../types";
// import {getUserType, getUserRole} from '../helper/roles';
// import saver from '../utils/saver'

import { tankCheckingRecordSuccess, takcr } from '../actions/InspectorActions';
import { changeLanguage } from "../actions/LanguageActions";

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

// const {width} = Dimensions.get("window");
// const itemWith = width / 2;
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

class TankCheckingRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {

      submitted: false,
      // 1
      visualChecking_BeforeMaintenance: '',
      visualChecking_AfterMaintenance: '',
      visualChecking_Results: '',

      // 2
      corrosionTank_BeforeMaintenance: '',
      corrosionTank_AfterMaintenance: '',
      corrosionTank_Results: '',

      // 3
      combustiveMaterials_BeforeMaintenance: '',
      combustiveMaterials_AfterMaintenance: '',
      combustiveMaterials_Results: '',

      // 4
      warningSigns_BeforeMaintenance: '',
      warningSigns_AfterMaintenance: '',
      warningSigns_Results: '',

      // 5
      leakingTest_BeforeMaintenance: '',
      leakingTest_AfterMaintenance: '',
      leakingTest_Results: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = async () => {
    //this.props.deleteCylinders();
    //this.props.fetchUsers();

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



  handleSubmit() {
    //alert("aaabc")

    const {
      submitted,
      // 1
      visualChecking_BeforeMaintenance,
      visualChecking_AfterMaintenance,
      visualChecking_Results,

      // 2
      corrosionTank_BeforeMaintenance,
      corrosionTank_AfterMaintenance,
      corrosionTank_Results,

      // 3
      combustiveMaterials_BeforeMaintenance,
      combustiveMaterials_AfterMaintenance,
      combustiveMaterials_Results,

      // 4
      warningSigns_BeforeMaintenance,
      warningSigns_AfterMaintenance,
      warningSigns_Results,

      // 5
      leakingTest_BeforeMaintenance,
      leakingTest_AfterMaintenance,
      leakingTest_Results

    } = this.state
    this.setState({ submitted: true })

    const payload = {
      // 1
      visualChecking_BeforeMaintenance,
      visualChecking_AfterMaintenance,
      visualChecking_Results,

      // 2
      corrosionTank_BeforeMaintenance,
      corrosionTank_AfterMaintenance,
      corrosionTank_Results,

      // 3
      combustiveMaterials_BeforeMaintenance,
      combustiveMaterials_AfterMaintenance,
      combustiveMaterials_Results,

      // 4
      warningSigns_BeforeMaintenance,
      warningSigns_AfterMaintenance,
      warningSigns_Results,

      // 5
      leakingTest_BeforeMaintenance,
      leakingTest_AfterMaintenance,
      leakingTest_Results
    }

    if (submitted && payload) {
      Actions.pop();
    }
    this.props.takcr(payload)
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
      visualChecking_BeforeMaintenance,
      visualChecking_AfterMaintenance,
      visualChecking_Results,

      // 2
      corrosionTank_BeforeMaintenance,
      corrosionTank_AfterMaintenance,
      corrosionTank_Results,

      // 3
      combustiveMaterials_BeforeMaintenance,
      combustiveMaterials_AfterMaintenance,
      combustiveMaterials_Results,

      // 4
      warningSigns_BeforeMaintenance,
      warningSigns_AfterMaintenance,
      warningSigns_Results,

      // 5
      leakingTest_BeforeMaintenance,
      leakingTest_AfterMaintenance,
      leakingTest_Results,
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
            title={'1.' + translate('GENERAL')}
          />
          <Card.Body>
            <View>
              <WingBlank>
                <TextInput
                  label={translate("CONDITION")}
                  mode='outlined'
                  multiline={true}
                  theme={{
                    colors: {
                      // placeholder: 'white',
                      // text: 'white',
                      // primary: 'white',
                      // underlineColor: 'transparent', 
                      background: '#FFF'
                    }
                  }}
                  value={visualChecking_BeforeMaintenance}
                  onChangeText={visualChecking_BeforeMaintenance => {
                    this.setState({
                      visualChecking_BeforeMaintenance,
                      errorLicensePlate: false
                    })
                  }}
                  error={this.state.errorLicensePlate}
                />
                {submitted && !visualChecking_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
              </WingBlank>
              <WhiteSpace />
            </View>
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
                value={visualChecking_AfterMaintenance}
                onChangeText={visualChecking_AfterMaintenance => {
                  this.setState({
                    visualChecking_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !visualChecking_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                multiline={true}
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={visualChecking_Results}
                onChangeText={visualChecking_Results => {
                  this.setState({
                    visualChecking_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !visualChecking_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
            <WhiteSpace />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'2.' + translate('CHECK_FOR')}
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
                value={corrosionTank_BeforeMaintenance}
                onChangeText={corrosionTank_BeforeMaintenance => {
                  this.setState({
                    corrosionTank_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !corrosionTank_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
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
                value={corrosionTank_AfterMaintenance}
                onChangeText={corrosionTank_AfterMaintenance => {
                  this.setState({
                    corrosionTank_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !corrosionTank_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={corrosionTank_Results}
                onChangeText={corrosionTank_Results => {
                  this.setState({
                    corrosionTank_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !corrosionTank_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>

          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'3.' + translate('CHECK_FOR_COMBUSTIBLE')}
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
                value={combustiveMaterials_BeforeMaintenance}
                onChangeText={combustiveMaterials_BeforeMaintenance => {
                  this.setState({
                    combustiveMaterials_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !combustiveMaterials_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
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
                value={combustiveMaterials_AfterMaintenance}
                onChangeText={combustiveMaterials_AfterMaintenance => {
                  this.setState({
                    combustiveMaterials_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !combustiveMaterials_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={combustiveMaterials_Results}
                onChangeText={combustiveMaterials_Results => {
                  this.setState({
                    combustiveMaterials_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !combustiveMaterials_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>

          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'4.' + translate('CHECK_FOR_PROHIBITION')}
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
                value={warningSigns_BeforeMaintenance}
                onChangeText={warningSigns_BeforeMaintenance => {
                  this.setState({
                    warningSigns_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !warningSigns_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
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
                value={warningSigns_AfterMaintenance}
                onChangeText={warningSigns_AfterMaintenance => {
                  this.setState({
                    warningSigns_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !warningSigns_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={warningSigns_Results}
                onChangeText={warningSigns_Results => {
                  this.setState({
                    warningSigns_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !warningSigns_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>

          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'5.' + translate('CHECK_FOR_LEAKS')}
          />
          <Card.Body>
            <WingBlank>
              <TextInput
                label={translate("CONDITION")}
                mode='outlined'
                multiline={true}
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                style={styles.theme}
                value={leakingTest_BeforeMaintenance}
                onChangeText={leakingTest_BeforeMaintenance => {
                  this.setState({
                    leakingTest_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !leakingTest_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("WORK")}
                mode='outlined'
                multiline={true}
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                value={leakingTest_AfterMaintenance}
                onChangeText={leakingTest_AfterMaintenance => {
                  this.setState({
                    leakingTest_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !leakingTest_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput
                label={translate("JOB_SUG")}
                mode='outlined'
                multiline={true}
                value={leakingTest_Results}
                theme={{
                  colors: {
                    // placeholder: 'white',
                    // text: 'white',
                    // primary: 'white',
                    // underlineColor: 'transparent', 
                    background: '#FFF'
                  }
                }}
                onChangeText={leakingTest_Results => {
                  this.setState({
                    leakingTest_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !leakingTest_Results && this.renderError(translate("JOB_SUG_ERROR"))}
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
  // user: state.auth.user,
})

export default connect(
  mapStateToProps,
  { changeLanguage, takcr, tankCheckingRecordSuccess }
)(TankCheckingRecord)