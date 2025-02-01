import { StyleSheet, Dimensions } from "react-native";
import { COLOR } from "../../constants";

const widthScreen = Dimensions.get("window").width;
const screenTextSize = 17;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  timeSection: {
    width: widthScreen,
    height: 130,
    justifyContent: "space-around",
  },

  timeSectionOption: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-around",
  },

  txtTimeTitle: {
    fontWeight: "bold",
    fontSize: screenTextSize,
    color: "#000",
    paddingLeft: 10,
  },

  txtTime: {
    color: "#fff",
  },

  btnStyleActive: {
    backgroundColor: COLOR.GREEN_MAIN,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },

  btnStyleUnActive: {
    backgroundColor: COLOR.GRAY,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },

  datePickerSection: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLOR.GRAY_OPTION,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: widthScreen - 100,
    height: 40,
    borderRadius: 5,
    alignSelf: "center",
  },

  totalSection: {
    width: widthScreen,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  txtTotal: {
    color: COLOR.GREEN_MAIN,
    fontWeight: "bold",
  },

  dropdownStyle: {
    width: widthScreen / 1.5,
    borderColor: COLOR.GRAY,
    zIndex: -1,
  },

  placeholderStyle: {
    color: COLOR.GRAY,
  },

  dropStyle: {
    marginTop: 10,
    width: widthScreen / 1.5,
    borderColor: COLOR.GRAY,
    zIndex: 10,
  },

  statisticOptionsSection: {
    width: widthScreen,
  },

  optionSection: {
    width: widthScreen,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  txtOption: {
    color: COLOR.BLACK,
    marginLeft: 10,
    width: 100,
  },

  btnShowSection: {
    width: widthScreen,
  },

  btnShow: {
    backgroundColor: COLOR.RED,
    color: COLOR.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 10,
  },

  StatisticSection: {
    flex: 1,
  },

  tableStyle: {
    alignItems: "center",
    marginVertical: 10,
  },

  rowStyle: {
    flexDirection: "row",
  },

  elementStyle: {
    width: widthScreen / 7,
    height: widthScreen / 6,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 0.5,
  },

  elementText: {
    fontSize: 9,
    color: "#000",
    textAlign: "center",
    marginHorizontal: 5,
  },

  articleStyle: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#009347",
    borderColor: "#aaa",
    borderWidth: 0.5,
  },

  tableStationStyle: {
    alignItems: "center",
  },

  articleStationStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: widthScreen,
    padding: 15,
    marginVertical: 1,
  },

  fixerTabsSection: {
    flexDirection: "row",
  },
  fixerTabStyle: {
    justifyContent: "center",
    width: widthScreen / 2,
    height: 50,
    borderTopWidth: 1,
    borderBottomColor: "#009347",
    borderTopColor: "#eee",
  },

  // stations
  columnGroup: {
    width: Dimensions.get("screen").width,
    height: "auto",
    flexDirection: "row",
  },

  columnLeftGroup: {
    width: Dimensions.get("screen").width / 4,
  },

  smallColumnGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 0.5,
    height: Dimensions.get("screen").width / 3,
  },

  insideGroup: {
    width: Dimensions.get("screen").width / 8,
    borderColor: "#aaa",
    borderWidth: 0.5,
  },
});
