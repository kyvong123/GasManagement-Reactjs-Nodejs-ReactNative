import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text
} from "react-native";
import { logOut } from "../actions/AuthActions";

import { Flex, WhiteSpace } from "@ant-design/react-native/lib/";
import { Actions } from "react-native-router-flux";
import { COLOR } from "../constants";

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'

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

const { height, width } = Dimensions.get("window");

const logo = require("../static/images/logo.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "transparent"
  },
  logoSection: {
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 30,
    marginBottom: 30,
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#009347",
    width: width * 0.6,
    marginHorizontal: 10,
    borderRadius: 6,
    height: 50,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  txt: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 15,
  }
});

class DrawerContent extends React.Component {
  //   static propTypes = {
  //     name: PropTypes.string,
  //     sceneStyle: ViewPropTypes.style,
  //     title: PropTypes.string,
  //   };

  //   static contextTypes = {
  //     drawer: PropTypes.object,
  //   };

  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
    }
  }

  handleChangeLanguage = (lgnCode) => {
    //setLanguage(lgnCode);
    chooseLanguageConfig(lgnCode)
  }

  handleLogout = () => {
    this.props.logOut();
    // Actions.application()
  };

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image resizeMode="contain" source={logo} />
        </View>
        {/* <WhiteSpace />
        <Button type='primary' onPress={this.handleLogout}>Xem báo cáo thống kê</Button>
        <WhiteSpace />
        <Button type='primary' onPress={this.handleLogout} inline={true}>Xem thông báo</Button>
        <WhiteSpace />
        <Button type='primary' onPress={this.handleLogout}>Đăng xuất</Button> */}


         
        {
         !user  ? null : (
          user.userRole === 'Deliver' || user.userRole === 'Inspector'
            ? null
            : <Flex justify="center">
              <TouchableOpacity
                style={styles.btn}
                onPress={() => Actions.statisticsReport()}
              >
                {/* linh bug */}
                <Text style={styles.txt}>{translate('STATISTICS')}</Text>
              </TouchableOpacity>
            </Flex>
         )
        }

        {
          !user ? null : (
            user.userRole === 'Deliver'
              ? <Flex justify="center">
                <TouchableOpacity style={styles.btn} onPress={() => Actions.signature()}>
                  <Text style={styles.txt}>{translate('delivery_history')}</Text>
                </TouchableOpacity>
              </Flex>
              : null
          )
        }

        {/* Cuong them vao  */}
        {/* <WhiteSpace  />        
        <Flex justify="center">
          <TouchableOpacity style={styles.btn} onPress={() => Actions.signature()}>
            <Text style={styles.txt}>{translate('delivery_history')}</Text>
          </TouchableOpacity>
        </Flex> */}


        <WhiteSpace /* Cuong them vao */ />        
        <Flex justify="center">
          <TouchableOpacity style={styles.btn} onPress={() => Actions.changePassword()}>
            <Text style={styles.txt}>{translate('CHANGE_PASSWORD')}</Text>
          </TouchableOpacity>
        </Flex>
        <WhiteSpace />
        <Flex justify="center">
          <TouchableOpacity style={[styles.btn,{backgroundColor:"#F6921E"}]} onPress={this.handleLogout}>
            <Text style={styles.txt}>{translate('LOGOUT')}</Text>
          </TouchableOpacity>
        </Flex>
      </View>
    );
  }
}
export const mapStateToProps = state => ({
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  { logOut }
)(DrawerContent);
