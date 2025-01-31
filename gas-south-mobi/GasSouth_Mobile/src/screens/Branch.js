import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Image,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import GridView from "react-native-super-grid";
import { Actions } from "react-native-router-flux";
import { isEqual } from "lodash";
import { getUserType, getUserRole } from "../helper/roles";
import {
  changeCyclinderAction,
  deleteCylinders,
  typeForPartner,
} from "../actions/CyclinderActions";
import { getListStation } from "../actions/ListStationAction";
import { COLOR } from "../constants";
import Images from "../constants/image";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import saver from "../utils/saver";
import {
  EXPORT,
  EXPORT_CYLINDER_EMPTY,
  EXPORT_PARTNER,
  DELIVER,
  INSPECTOR,
  FACTORY,
  SUPER_ADMIN,
} from "../types";
import addLocalCyclinder from "./../api/addLocalCyclinder";
import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import CustomStatusBar from "../components/CustomStatusBar";
/*const languageStatus = {}
export default languageStatus*/

const translationGetters = {
  en: () => require("../languages/en.json"),
  vi: () => require("../languages/vi.json"),
};

const chooseLanguageConfig = (lgnCode) => {
  let fallback = { languageTag: "vi" };
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

const { width } = Dimensions.get("window");
const itemWith = width / 2;

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    height: 60,
    flexDirection: "row",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  itemName: {
    flex: 9,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    width: 250,
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  itemIcon: {
    flex: 1,
    //backgroundColor: 'blue',
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 0.9,
  },
  title: {
    fontSize: 20,
  },
  lineBottom: {
    flex: 1,
    height: 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0
  },
  btnTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20
  },
  textStattion: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 10,
    color: COLOR.BLACK
  }
})

class Branch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      user: this.props.user,
      backClickCount: 0,
      listOwn: [],
      listRent: [],
      isShort: true,
      isShort2: true
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.data.name
    })
    this.props.getListStation(this.props.branchId)
  }

  componentDidUpdate(prevProps) {
    if (this.props.listStation != prevProps.listStation) {
      if (this.props.listStation.data?.length > 0)
        this.props.listStation.data.map((item) => {
          item.stationType == 'Own' ? this.state.listOwn.push(item) : this.state.listRent.push(item)
        })
    }
  }

  renderItem = ({ item, index }) => (
    <TouchableOpacity style={{
      color: COLOR.BLACK,
      fontSize: 16,
      backgroundColor: index % 2 == 0 ? '#E8E8E8' : '#FFFFFF',
      padding: 10,
    }}
      onPress={() => {
        this.props.navigation.setParams({ isShowLeft: false })
        this.props.navigation.navigate("statisticDetailManager",
          {
            id: item.id,
            namewh: item.name,
            userType: item.userType,
            userRole: item.userRole,
            _userType: item.userType,
            _userRole: item.userRole
          })
      }}
    >
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity >
  );

  renderListStation(tittle, list, isShort, isOwn) {
    return <View>
      <View style={[styles.tabContainer, {
        backgroundColor: isShort ? '#9AFF96' : '#EDFF88'
      }]}>
        <Text
          style={styles.textStattion}>
          {tittle}
        </Text>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            if (list.length > 0)
              this.setState(
                isOwn ? { isShort: !isShort } : { isShort2: !isShort }
              )
          }}
        >
          <Icon
            size={24}
            name={isShort ? 'angle-down' : 'angle-up'}
            color={COLOR.BLACK} />
        </TouchableOpacity>
      </View>
      {!isShort && <FlatList
        data={list}
        renderItem={this.renderItem}
        keyExtractor={item => item.name}
      />}
    </View>
  }

  render() {
    return (
      <ScrollView>
        <View>
          <CustomStatusBar backgroundColor="#fff1d7" barStyle="light-content" />
          <Image style={{ width: width, height: 150 }} source={Images.BANNER} />
        </View>
        {this.renderListStation(
          'Trạm Trực Thuộc',
          this.state.listOwn,
          this.state.isShort, true)}
        {this.renderListStation(
          'Trạm Chiết Thuê',
          this.state.listRent,
          this.state.isShort2, false)}
      </ScrollView>
    );
  }
}

export const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  listStation: state.listStation.resultListStation
});

export default connect(mapStateToProps, {
  getListStation
})(Branch)
