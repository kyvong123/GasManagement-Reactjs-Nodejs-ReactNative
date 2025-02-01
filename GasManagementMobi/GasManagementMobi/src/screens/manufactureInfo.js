import React, { Component } from "react";
import {
  DELIVERING,
  EXPORT,
  EXPORT_PARENT_CHILD,
  IMPORT,
  IN_CUSTOMER,
  TURN_BACK,
} from "../types";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { COLOR } from "../constants";
import { Button, Flex, List, WhiteSpace } from "@ant-design/react-native/lib";
import { connect } from "react-redux";
import {
  addCylinder,
  fetchCylinder,
  updateCylinders,
} from "../actions/CyclinderActions";
import { GAS } from "../constants";
import moment from "moment";
import PagerView from "react-native-pager-view";

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";

const translationGetters = {
  en: () => require("../languages/en.json"),
  vi: () => require("../languages/vi.json"),
};

const hide = () => {
  if (cyclinder.manufacture.safetyInstructions == null) {
  }
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
const Item = List.Item;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  label: {
    fontSize: 14,
    textAlign: "center",
    color: COLOR.GREEN_MAIN,
  },
  titleCustom: {
    fontSize: 15,
    // padding: 10,
    // marginRight: 20,
    color: COLOR.WHITE,
  },
  titleCustomHeader: {
    fontSize: 15,
    padding: 10,
    marginRight: 20,
    color: COLOR.WHITE,
  },
  title: {
    fontSize: 16,
    width: "70%",
    color: COLOR.WHITE,
    fontWeight: "bold",
  },
  itemStyle: {
    color: COLOR.BLACK,
    fontSize: 14,
  },
  itemContentStyle: {
    width: "60%",
    fontSize: 14,
    paddingLeft: 6,
    textAlign: "left",
    color: COLOR.BLACK,
    fontWeight: "normal",
  },
  itemStyleFooter: {
    color: COLOR.BLACK,
    padding: 4,
    fontSize: 14,
    textAlign: "center",
  },
  boxBorder: {
    marginTop: 12,
    borderWidth: 1,
    height: 128,
    borderColor: COLOR.BLACK,
  },
  boldText: {
    padding: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: COLOR.BLACK,
    textAlign: "center",
    textTransform: "uppercase",
  },
  itemStyleRED: {
    color: COLOR.RED,
    fontSize: 15,
  },
  btnScan: {
    backgroundColor: "#F6921E",
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
  },
  btnReport: {
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  txtEmpty: {
    textAlign: "center",
    color: COLOR.BLUE,
    fontSize: 20,
    padding: 20,
  },
  txtScan: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 20,
  },
  txtSerials: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
    padding: 20,
  },
  btn: {
    backgroundColor: COLOR.LIGHTBLUE,
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  txtSerial: {
    color: COLOR.ORANGE,
  },
  txtButton: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  btnCancel: {
    backgroundColor: COLOR.RED,
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  contentItemFooter: {
    width: "32%",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 8,
  },
  contentItemFooterRow: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});

class ManufactureInfo extends Component {
  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');
    this.state = {
      //languageCode: ""
      currentPage: 0,
      totalPages: 3,
    };
  }

  pagerRef = React.createRef();

  handleNextPage = () => {
    // this.pagerRef.current.setPage(1);
    this.pagerRef.current.setPage(this.state.currentPage + 1);
  };

  handlePreviousPage = () => {
    // this.pagerRef.current.setPage(0);
    this.pagerRef.current.setPage(this.state.currentPage - 1);
  };

  onPageSelected = (event) => {
    const { position } = event.nativeEvent;
    this.setState({ currentPage: position });
  };

  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          "change",
          this.handleChangeLanguage(languageCode)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        "change",
        this.handleChangeLanguage(languageCode)
      );
    }
  };

  handleChangeLanguage = (lgnCode) => {
    setLanguage(lgnCode);
    //this.setState({ languageCode: lgnCode });

    chooseLanguageConfig(lgnCode);
  };

  render = () => {
    console.log("this is the data from api: ", this.props.cyclinder);

    const cyclinder = this.props.cyclinder;

    const SouthGasHeader = () => (
      <View
        style={{
          width: width,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Image
          style={{
            width: 96,
            height: 96,
          }}
          resizeMode={"contain"}
          source={require("../static/images/logo-2x.png")}
        />
        <View
          style={{
            width: "75%",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              color: COLOR.GREEN_MAIN,
              textTransform: "uppercase",
            }}
          >
            {"Công ty cổ phần\nkinh doanh dầu khí miền nam"}
          </Text>
          <Text style={[styles.label, { marginVertical: 12, fontSize: 12 }]}>
            {
              "Lầu 4 PETROVIETNAM POWER, số 1-5 Lê Duẩn\nphường Bến Nghé, Quận 1, TP Hồ Chí Minh"
            }
          </Text>
          <Text style={styles.label}>ĐT: (84.28) 3910 0108 - 3910 0324</Text>
          <Text style={styles.label}>Fax: (84.28) 3910 0097 - 3910 0325</Text>
        </View>
      </View>
    );

    const VTGASHeader = () => (
      <View
        style={{ alignItems: "center", justifyContent: "center", padding: 6 }}
      >
        <View
          style={{
            width: width,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 64,
              height: 64,
            }}
            resizeMode={"contain"}
            source={require("../static/images/logo-2x.png")}
          />
          <Text
            style={{
              width: "60%",
              fontSize: 15,
              fontWeight: "bold",
              textAlign: "center",
              color: COLOR.GREEN_MAIN,
              textTransform: "uppercase",
            }}
          >
            {"Công ty TNHH khí hóa lỏng\nViệt Nam - VT GAS"}
          </Text>
          <Image
            style={{
              width: 56,
              height: 56,
            }}
            resizeMode={"contain"}
            source={require("../static/images/logo-VTGAS.png")}
          />
        </View>
        <Text style={[styles.label, { marginVertical: 12 }]}>
          {
            "Địa chỉ: Phòng 606, Tầng 6 Tòa nhà Waseco\nSố 10 Phổ Quang, P.2, Q. Tân Bình, TP.HCM"
          }
        </Text>
        <Text style={styles.label}>ĐT: (84.28) 3997 6821 - 3985 8585</Text>
        <Text style={styles.label}>Fax: (84.28) 3997 6823</Text>
      </View>
    );

    const IntroductionAndBranch = () => (
      <>
        <Text
          style={{
            padding: 12,
            fontSize: 16,
            fontWeight: "bold",
            color: COLOR.WHITE,
            textAlign: "center",
            backgroundColor: COLOR.GREEN_MAIN,
          }}
        >
          CHAI KHÍ DẦU MỎ HÓA LỎNG (LPG CHAI)
        </Text>

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 16,
            justifyContent: "center",
            width: width,
            height: 56,
            backgroundColor: "#F6921E",
          }}
        >
          <Text style={styles.title}>{translate("TRADEMARK")}</Text>
          <View
            style={{
              width: "30%",
              alignItems: "flex-end",
            }}
          >
            <Image
              resizeMode="contain"
              style={{ height: 48, width: 48 }}
              source={{
                uri: cyclinder.manufacture.logo
                  ? cyclinder.manufacture.logo
                  : "https://facebook.github.io/react-native/img/tiny_logo.png",
              }}
            />
          </View>
        </View>
      </>
    );

    const IntroductionPage = () => (
      <List>
        <Item
          extra={
            <Text style={[styles.itemContentStyle]}>
              {cyclinder.manufacture.origin ? cyclinder.manufacture.origin : ""}
            </Text>
          }
        >
          <Text style={styles.itemStyle}>
            {translate("ORIGIN").concat(": ")}
          </Text>
        </Item>
        <Item
          extra={
            <View style={{ width: "60%" }}>
              {!!cyclinder.exportPlace ? (
                <Text
                  style={[
                    styles.itemContentStyle,
                    { fontWeight: "bold", width: "100%" },
                  ]}
                >
                  {cyclinder.exportPlace.name},
                  <Text style={[styles.itemContentStyle]}>
                    {" " + cyclinder.exportPlace.address}
                  </Text>
                </Text>
              ) : (
                <Text style={[styles.itemContentStyle]}>
                  {translate("NOT_EXPORTED_YET")}
                </Text>
              )}
            </View>
          }
        >
          <View style={{ width: width, flexDirection: "row" }}>
            <Text style={[styles.itemStyle, { width: "36%" }]}>
              {translate("MAKE_AT")}
            </Text>
          </View>
        </Item>
        <View style={{ width: width, flexDirection: "row" }}>
          <View style={{ width: "70%" }}>
            <Item
              style={{ paddingVertical: 8 }}
              extra={
                <Text
                  style={[
                    styles.itemContentStyle,
                    { fontSize: 20, fontWeight: "bold", width: "40%" },
                  ]}
                >
                  {cyclinder.manufacture?.mass
                    ? cyclinder.category?.mass.toString().concat(" kg")
                    : ""}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>
                {translate("WEIGHT").concat(": ")}
              </Text>
            </Item>

            <Item
              style={{ paddingVertical: 8 }}
              extra={
                <Text
                  style={[
                    styles.itemContentStyle,
                    { fontSize: 20, fontWeight: "bold", width: "40%" },
                  ]}
                >
                  {cyclinder.weight ? cyclinder.weight + " kg" : ""}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>
                {translate("PACKAGE_WEIGHT").concat(": ")}
              </Text>
            </Item>
          </View>

          <View style={{ width: "30%", justifyContent: "center" }}>
            <Image
              style={{
                width: 108,
                height: 108,
              }}
              resizeMode={"contain"}
              source={require("../static/images/gas-logo.png")}
            />
          </View>
        </View>

        <Item
          extra={
            <Text style={styles.itemContentStyle}>
              {cyclinder.manufacture.ingredient
                ? cyclinder.manufacture.ingredient
                : ""}
            </Text>
          }
        >
          <Text style={styles.itemStyle}>
            {translate("INGREDIENT").concat(": ")}
          </Text>
        </Item>
      </List>
    );

    const WarningPage = () => (
      <>
        {console.log("cyclinder.manufacture: ", cyclinder.manufacture)}
        {cyclinder.manufacture.optionSafetyInstructions === "Yes" ? (
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#dddddd",
              }}
            >
              <Text style={[styles.itemStyleRED, { paddingHorizontal: 15 }]}>
                {translate("SAFETY")}
              </Text>
            </View>
            <Item>
              <View
                style={[
                  styles.itemStyle,
                  { flexDirection: "column", flex: 1, alignItems: "flex-end" },
                ]}
              >
                <Text style={{ textAlign: "right" }}>
                  {cyclinder.manufacture.safetyInstructions}
                </Text>
              </View>
            </Item>
          </View>
        ) : (
          <View>
            <Item
              extra={
                <Text style={styles.itemContentStyle}>
                  {cyclinder.manufacture.appliedStandard}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>
                {translate("APPLIED_STANDARD") + ": "}
              </Text>
            </Item>

            <Item
              extra={
                <Text style={styles.itemContentStyle}>
                  {cyclinder.manufacture.basicStandard}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>
                {translate("ORIGINAL_STANDARD") + ": "}
              </Text>
            </Item>
            <Item
              extra={
                <Text
                  style={[styles.itemContentStyle, { textAlign: "center" }]}
                >
                  {moment(cyclinder.exportDate).isValid()
                    ? moment(cyclinder.exportDate).format("DD/MM/YYYY")
                    : cyclinder.exportDate}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>
                {translate("EXPORT_DATE_BRIEF") + ": "}
              </Text>
            </Item>

            <Item
              extra={
                <Text
                  style={[styles.itemContentStyle, { textAlign: "center" }]}
                >
                  {moment(cyclinder.exportDate).isValid()
                    ? moment(cyclinder.exportDate).format("DD/MM/YYYY")
                    : cyclinder.exportDate}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>
                {translate("DATE_OF_MANUFACTURE") + ": "}
              </Text>
            </Item>

            <Item
              extra={
                <Text
                  style={[styles.itemContentStyle, { textAlign: "center" }]}
                >
                  {moment(cyclinder.checkedDate).isValid()
                    ? moment(cyclinder.checkedDate).format("DD/MM/YYYY")
                    : cyclinder.checkedDate}
                </Text>
              }
            >
              <Text style={styles.itemStyle}>{translate("EXPIRY") + ": "}</Text>
            </Item>
            <Item>
              <Text
                style={[
                  styles.itemStyle,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  },
                ]}
              >
                {translate("SAFETY_WARNING_INFORMATION")}
              </Text>
            </Item>
            <View style={styles.contentItemFooterRow}>
              <View style={styles.contentItemFooter}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 100,
                    // transform: [{ rotateY: '90deg' }]
                  }}
                  source={GAS.GAS4}
                />
                <View style={styles.boxBorder}>
                  <Text style={styles.boldText}>{translate("ALERT")}</Text>
                  <View
                    style={{
                      width: "auto",
                      borderWidth: 1,
                      borderColor: COLOR.BLACK,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.itemStyleFooter}>
                      {translate("CONTAINS_GAS_UNDER_PRESSURE")};{" "}
                      {translate("MAY_EXPLODE_IF_HEATED")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.contentItemFooter}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 100,
                  }}
                  source={GAS.GAS6}
                />
                <View style={styles.boxBorder}>
                  <Text style={styles.boldText}>{translate("DANGER")}</Text>
                  <View
                    style={{
                      width: "auto",
                      borderWidth: 1,
                      borderColor: COLOR.BLACK,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.itemStyleFooter}>
                      {translate("HIGHLY_FLAMMABLE_GAS")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.contentItemFooter}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 100,
                  }}
                  source={GAS.GAS5}
                />
                <View style={styles.boxBorder}>
                  <Text style={styles.boldText}>{translate("ALERT")}</Text>
                  <View
                    style={{
                      width: "auto",
                      borderWidth: 1,
                      borderColor: COLOR.BLACK,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.itemStyleFooter}>
                      {translate("HARMFUL_WHEN")}{" "}
                      {translate("IN_CONTACT_WITH_SKIN")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </>
    );

    const { currentPage, totalPages } = this.state;
    const pageText = `Trang ${currentPage + 1} | ${totalPages}`;

    return (
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={this.pagerRef}
        onPageSelected={this.onPageSelected}
      >
        <View key="1" style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 0.9 }}
          >
            {cyclinder.exportPlace?.companyBrand === "VTGAS" ? (
              <VTGASHeader />
            ) : (
              <SouthGasHeader />
            )}

            <IntroductionAndBranch />
            <IntroductionPage />
          </ScrollView>
          <View
            style={{
              flex: 0.1,
              flexDirection: "row",
              elevation: 2,
              borderTopWidth: 1,
              paddingHorizontal: 16,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: COLOR.WHITE,
              borderTopColor: COLOR.GREEN_MAIN,
            }}
          >
            <View style={{ width: "20%" }} />
            <Text
              style={{
                width: "60%",
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              {pageText}
            </Text>
            <Text
              onPress={this.handleNextPage}
              style={{
                padding: 6,
                width: "20%",
                borderRadius: 6,
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              Tiếp
            </Text>
          </View>
        </View>
        <View key="2">
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 0.9 }}
          >
            <IntroductionAndBranch />
            <WarningPage />
          </ScrollView>
          <View
            style={{
              flex: 0.1,
              flexDirection: "row",
              elevation: 2,
              borderTopWidth: 1,
              paddingHorizontal: 16,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: COLOR.WHITE,
              borderTopColor: COLOR.GREEN_MAIN,
            }}
          >
            <Text
              onPress={this.handlePreviousPage}
              style={{
                padding: 6,
                width: "20%",
                borderRadius: 6,
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              Trước
            </Text>
            <Text
              style={{
                width: "60%",
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              {pageText}
            </Text>
            <Text
              onPress={this.handleNextPage}
              style={{
                padding: 6,
                width: "20%",
                borderRadius: 6,
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              Tiếp
            </Text>
          </View>
        </View>
        <View key={"3"}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 0.9 }}
          >
            {/* <IntroductionAndBranch /> */}
            <View
              style={{
                width: width,
                marginTop: 0,
                justifyContent: "center",
              }}
            >
              <Item style={{ marginTop: 0 }}>
                <Text style={[styles.itemStyle, { fontWeight: "bold" }]}>
                  {translate("STORAGE_INSTRUCTIONS")}
                </Text>
              </Item>
              <Item>
                <Text style={[styles.itemStyle, { textAlign: "justify" }]}>
                  {cyclinder.manufacture.preservation
                    ? cyclinder.manufacture.preservation
                    : ""}
                </Text>
              </Item>
              <Text
                style={{
                  fontSize: 16,
                  color: COLOR.RED,
                  fontWeight: "bold",
                  paddingVertical: 8,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                Cảnh báo khi có mùi gas
              </Text>
              <View
                style={{
                  width: width,
                  flexDirection: "row",
                  borderWidth: 1,
                }}
              >
                <View
                  style={{ width: "50%", padding: 8, borderRightWidth: 0.5 }}
                >
                  {WarningInformation.DONOT.map((item, index) => {
                    return (
                      <Text
                        key={index + 1}
                        style={{
                          height: index === 0 || index === 1 ? 36 : 56,
                          color: COLOR.BLACK,
                          fontSize: 14,
                        }}
                      >
                        {index + 1}.{" "}
                        <Text
                          style={{
                            fontWeight: "bold",
                            textAlign: "justify",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.split(" ")[0].concat(" ")}
                        </Text>
                        {item.split(" ").slice(1).join(" ")}
                      </Text>
                    );
                  })}
                </View>
                <View
                  style={{ width: "50%", padding: 8, borderLeftWidth: 0.5 }}
                >
                  {WarningInformation.DO.map((item, index) => {
                    return (
                      <Text
                        key={index + 1}
                        style={{
                          height: index === 0 || index === 1 ? 36 : 56,
                          color: COLOR.BLACK,
                          fontSize: 14,
                        }}
                      >
                        {index + 1}.{" "}
                        <Text
                          style={{
                            fontWeight: "bold",
                            textAlign: "justify",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.split(" ")[0].concat(" ")}
                        </Text>
                        {item.split(" ").slice(1).join(" ")}
                      </Text>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  width: width,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: COLOR.RED,
                    textTransform: "uppercase",
                  }}
                >
                  Lưu ý
                </Text>
                <Text style={{ color: COLOR.BLACK, paddingVertical: 2 }}>
                  <Text
                    style={{
                      color: COLOR.BLACK,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Không{" "}
                  </Text>
                  nên đi ra ngoài khi đang đun nấu
                </Text>
                <Text style={{ color: COLOR.BLACK, paddingVertical: 2 }}>
                  <Text
                    style={{
                      color: COLOR.BLACK,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Phải{" "}
                  </Text>
                  khóa van bình gas mỗi khi sử dụng xong
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 0,
                paddingVertical: 12,
                paddingHorizontal: 8,
                width: width,
                height: "auto",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLOR.GREEN_MAIN,
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 13,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: COLOR.WHITE,
                }}
              >
                {translate("FOOTER_INFORMATION")}
              </Text>
            </View>
          </ScrollView>
          <View
            style={{
              flex: 0.1,
              flexDirection: "row",
              elevation: 2,
              borderTopWidth: 1,
              paddingHorizontal: 16,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: COLOR.WHITE,
              borderTopColor: COLOR.GREEN_MAIN,
            }}
          >
            <Text
              onPress={this.handlePreviousPage}
              style={{
                padding: 6,
                width: "20%",
                borderRadius: 6,
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              Trước
            </Text>
            <Text
              style={{
                width: "60%",
                textTransform: "uppercase",
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "center",
                color: COLOR.GREEN_MAIN,
              }}
            >
              {pageText}
            </Text>
            <View style={{ width: "20%" }} />
          </View>
        </View>
      </PagerView>
    );
  };
}

export const mapStateToProps = (state) => ({
  cyclinder: state.cylinders.cyclinder,
});

const WarningInformation = {
  DONOT: [
    "Không bật bếp gas.",
    "Không bật/tắt thiết bị điện.",
    "Không dùng quạt điện để thổi khí gas ra ngoài",
    "Không bật hộp quẹt (bật lửa), quẹt diêm",
  ],
  DO: [
    "Phải khóa van bình gas lại.",
    "Phải mở cửa thông thoáng.",
    "Phải dùng quạt tay để giảm nồng nộ khí gas trong nhà.",
    "Phải gọi điện cho nhà cung cấp bình gas để xử lý kịp thời.",
  ],
};

export default connect(mapStateToProps)(ManufactureInfo);
