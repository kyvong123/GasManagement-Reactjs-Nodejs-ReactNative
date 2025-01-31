import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { List, Card, Button } from '@ant-design/react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';



import GridView from 'react-native-super-grid';
import Images from "../constants/image"
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { EXPORT, EXPORT_CYLINDER_EMPTY, EXPORT_PARTNER, DELIVER, INSPECTOR } from "../types";
import { getUserType, getUserRole } from '../helper/roles';
import saver from '../utils/saver'

import { valveFlangeRecord } from '../actions/InspectorActions';

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

class ValveFlangeRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,

      // 1
      emergencyShutValve_BeforeMaintenance: '',
      emergencyShutValve_AfterMaintenance: '',
      emergencyShutValve_Results: '',

      // 2
      globeValve_BeforeMaintenance: '',
      globeValve_AfterMaintenance: '',
      globeValve_Results: '',

      // 3
      ballValve_BeforeMaintenance: '',
      ballValve_AfterMaintenance: '',
      ballValve_Results: '',

      // 4
      drainValve_BeforeMaintenance: '',
      drainValve_AfterMaintenance: '',
      drainValve_Results: '',

      // 5
      electricalValve_BeforeMaintenance: '',
      electricalValve_AfterMaintenance: '',
      electricalValve_Results: '',

      // 6
      stStageRegulator_BeforeMaintenance: '',
      stStageRegulator_AfterMaintenance: '',
      stStageRegulator_Results: '',

      // 7
      pipeCorrosion_BeforeMaintenance: '',
      pipeCorrosion_AfterMaintenance: '',
      pipeCorrosion_Results: '',

      // 8
      drainInsidePipeline_BeforeMaintenance: '',
      drainInsidePipeline_AfterMaintenance: '',
      drainInsidePipeline_Results: '',

      // 9
      checkGasLeakage_BeforeMaintenance: '',
      checkGasLeakage_AfterMaintenance: '',
      checkGasLeakage_Results: '',
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
      emergencyShutValve_BeforeMaintenance,
      emergencyShutValve_AfterMaintenance,
      emergencyShutValve_Results,

      // 2
      globeValve_BeforeMaintenance,
      globeValve_AfterMaintenance,
      globeValve_Results,

      // 3
      ballValve_BeforeMaintenance,
      ballValve_AfterMaintenance,
      ballValve_Results,

      // 4
      drainValve_BeforeMaintenance,
      drainValve_AfterMaintenance,
      drainValve_Results,

      // 5
      electricalValve_BeforeMaintenance,
      electricalValve_AfterMaintenance,
      electricalValve_Results,

      // 6
      stStageRegulator_BeforeMaintenance,
      stStageRegulator_AfterMaintenance,
      stStageRegulator_Results,

      // 7
      pipeCorrosion_BeforeMaintenance,
      pipeCorrosion_AfterMaintenance,
      pipeCorrosion_Results,

      // 8
      drainInsidePipeline_BeforeMaintenance,
      drainInsidePipeline_AfterMaintenance,
      drainInsidePipeline_Results,

      // 9
      checkGasLeakage_BeforeMaintenance,
      checkGasLeakage_AfterMaintenance,
      checkGasLeakage_Results,

    } = this.state
    this.setState({ submitted: true })


    const payload = {
      // 1
      emergencyShutValve_BeforeMaintenance,
      emergencyShutValve_AfterMaintenance,
      emergencyShutValve_Results,

      // 2
      globeValve_BeforeMaintenance,
      globeValve_AfterMaintenance,
      globeValve_Results,

      // 3
      ballValve_BeforeMaintenance,
      ballValve_AfterMaintenance,
      ballValve_Results,

      // 4
      drainValve_BeforeMaintenance,
      drainValve_AfterMaintenance,
      drainValve_Results,

      // 5
      electricalValve_BeforeMaintenance,
      electricalValve_AfterMaintenance,
      electricalValve_Results,

      // 6
      stStageRegulator_BeforeMaintenance,
      stStageRegulator_AfterMaintenance,
      stStageRegulator_Results,

      // 7
      pipeCorrosion_BeforeMaintenance,
      pipeCorrosion_AfterMaintenance,
      pipeCorrosion_Results,

      // 8
      drainInsidePipeline_BeforeMaintenance,
      drainInsidePipeline_AfterMaintenance,
      drainInsidePipeline_Results,

      // 9
      checkGasLeakage_BeforeMaintenance,
      checkGasLeakage_AfterMaintenance,
      checkGasLeakage_Results,
    }

    if (submitted && payload) {
      Actions.pop();
    }
    this.props.valveFlangeRecord(payload)
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
      emergencyShutValve_BeforeMaintenance,
      emergencyShutValve_AfterMaintenance,
      emergencyShutValve_Results,

      // 2
      globeValve_BeforeMaintenance,
      globeValve_AfterMaintenance,
      globeValve_Results,

      // 3
      ballValve_BeforeMaintenance,
      ballValve_AfterMaintenance,
      ballValve_Results,

      // 4
      drainValve_BeforeMaintenance,
      drainValve_AfterMaintenance,
      drainValve_Results,

      // 5
      electricalValve_BeforeMaintenance,
      electricalValve_AfterMaintenance,
      electricalValve_Results,

      // 6
      stStageRegulator_BeforeMaintenance,
      stStageRegulator_AfterMaintenance,
      stStageRegulator_Results,

      // 7
      pipeCorrosion_BeforeMaintenance,
      pipeCorrosion_AfterMaintenance,
      pipeCorrosion_Results,

      // 8
      drainInsidePipeline_BeforeMaintenance,
      drainInsidePipeline_AfterMaintenance,
      drainInsidePipeline_Results,

      // 9
      checkGasLeakage_BeforeMaintenance,
      checkGasLeakage_AfterMaintenance,
      checkGasLeakage_Results,
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
            title={'1.' + translate('CHECK_PIPING')}
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
                value={emergencyShutValve_BeforeMaintenance}
                onChangeText={emergencyShutValve_BeforeMaintenance => {
                  this.setState({
                    emergencyShutValve_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !emergencyShutValve_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={emergencyShutValve_AfterMaintenance}
                onChangeText={emergencyShutValve_AfterMaintenance => {
                  this.setState({
                    emergencyShutValve_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !emergencyShutValve_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={emergencyShutValve_Results}
                onChangeText={emergencyShutValve_Results => {
                  this.setState({
                    emergencyShutValve_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !emergencyShutValve_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'2.' + translate('CHECK_THE_OPERATION_GLOBE')}
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
                value={globeValve_BeforeMaintenance}
                onChangeText={globeValve_BeforeMaintenance => {
                  this.setState({
                    globeValve_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !globeValve_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={globeValve_AfterMaintenance}
                onChangeText={globeValve_AfterMaintenance => {
                  this.setState({
                    globeValve_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !globeValve_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
            </WingBlank>
            <WhiteSpace />

            <WingBlank>
              <TextInput globeValve_Results
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
                value={globeValve_Results}
                onChangeText={globeValve_Results => {
                  this.setState({
                    globeValve_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !globeValve_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'3.' + translate('CHECK_THE_OPERATION_BALL')}
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
                value={ballValve_BeforeMaintenance}
                onChangeText={ballValve_BeforeMaintenance => {
                  this.setState({
                    ballValve_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !ballValve_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={ballValve_AfterMaintenance}
                onChangeText={ballValve_AfterMaintenance => {
                  this.setState({
                    ballValve_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !ballValve_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={ballValve_Results}
                onChangeText={ballValve_Results => {
                  this.setState({
                    ballValve_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !ballValve_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'4.' + translate('CHECK_THE_OPERATION_DRAIN')}
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
                value={drainValve_BeforeMaintenance}
                onChangeText={drainValve_BeforeMaintenance => {
                  this.setState({
                    drainValve_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainValve_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={drainValve_AfterMaintenance}
                onChangeText={drainValve_AfterMaintenance => {
                  this.setState({
                    drainValve_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainValve_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={drainValve_Results}
                onChangeText={drainValve_Results => {
                  this.setState({
                    drainValve_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainValve_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'5.' + translate('CHECK_THE_OPERATION_ELECTRONIC')}
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
                value={electricalValve_BeforeMaintenance}
                onChangeText={electricalValve_BeforeMaintenance => {
                  this.setState({
                    electricalValve_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !electricalValve_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={electricalValve_AfterMaintenance}
                onChangeText={electricalValve_AfterMaintenance => {
                  this.setState({
                    electricalValve_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !electricalValve_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={electricalValve_Results}
                onChangeText={electricalValve_Results => {
                  this.setState({
                    electricalValve_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !electricalValve_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'6.' + translate('CHECK_THE_OPERATION_LV1')}
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
                value={stStageRegulator_BeforeMaintenance}
                onChangeText={stStageRegulator_BeforeMaintenance => {
                  this.setState({
                    stStageRegulator_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !stStageRegulator_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={stStageRegulator_AfterMaintenance}
                onChangeText={stStageRegulator_AfterMaintenance => {
                  this.setState({
                    stStageRegulator_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !stStageRegulator_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={stStageRegulator_Results}
                onChangeText={stStageRegulator_Results => {
                  this.setState({
                    stStageRegulator_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !stStageRegulator_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'7.' + translate('CHECK_FOR_CORROSION')}
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
                value={pipeCorrosion_BeforeMaintenance}
                onChangeText={pipeCorrosion_BeforeMaintenance => {
                  this.setState({
                    pipeCorrosion_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !pipeCorrosion_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={pipeCorrosion_AfterMaintenance}
                onChangeText={pipeCorrosion_AfterMaintenance => {
                  this.setState({
                    pipeCorrosion_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !pipeCorrosion_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={pipeCorrosion_Results}
                onChangeText={pipeCorrosion_Results => {
                  this.setState({
                    pipeCorrosion_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !pipeCorrosion_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'8. ' + translate('DRAIN_RESIDUE')}
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
                value={drainInsidePipeline_BeforeMaintenance}
                onChangeText={drainInsidePipeline_BeforeMaintenance => {
                  this.setState({
                    drainInsidePipeline_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainInsidePipeline_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={drainInsidePipeline_AfterMaintenance}
                onChangeText={drainInsidePipeline_AfterMaintenance => {
                  this.setState({
                    drainInsidePipeline_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainInsidePipeline_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={drainInsidePipeline_Results}
                onChangeText={drainInsidePipeline_Results => {
                  this.setState({
                    drainInsidePipeline_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !drainInsidePipeline_Results && this.renderError(translate("JOB_SUG_ERROR"))}
            </WingBlank>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={'9.' + translate('CHECK_FOR_AT')}
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
                value={checkGasLeakage_BeforeMaintenance}
                onChangeText={checkGasLeakage_BeforeMaintenance => {
                  this.setState({
                    checkGasLeakage_BeforeMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !checkGasLeakage_BeforeMaintenance && this.renderError(translate("CONDITION_ERROR"))}
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
                value={checkGasLeakage_AfterMaintenance}
                onChangeText={checkGasLeakage_AfterMaintenance => {
                  this.setState({
                    checkGasLeakage_AfterMaintenance,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !checkGasLeakage_AfterMaintenance && this.renderError(translate("WORK_ERROR"))}
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
                value={checkGasLeakage_Results}
                onChangeText={checkGasLeakage_Results => {
                  this.setState({
                    checkGasLeakage_Results,
                    errorLicensePlate: false
                  })
                }}
                error={this.state.errorLicensePlate}
              />
              {submitted && !checkGasLeakage_Results && this.renderError(translate("JOB_SUG_ERROR"))}
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
  { valveFlangeRecord }
)(ValveFlangeRecord)