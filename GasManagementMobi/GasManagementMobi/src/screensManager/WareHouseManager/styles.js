import { Dimensions, StyleSheet } from "react-native";
import { COLOR } from "../../constants";

const widthScreen = Dimensions.get("screen").width;
const heightScreen = Dimensions.get("screen").height;
const fontSizeTitle = 16;
const fontSize = 14;

export const styles = StyleSheet.create({
  container: {
    width: widthScreen - 32,
    marginLeft: 16,
    flexGrow: 1,
  },

  //  title style
  titleStyle: {
    fontSize: fontSizeTitle,
    color: COLOR.BLACK,
    marginVertical: 10,
    fontWeight: "bold",
  },

  //   out screen
  styleForInputAvailable: {
    backgroundColor: COLOR.GRAY_OPTION,
    color: COLOR.BLACK,
  },

  //   footer
  footer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },

  wrapBtn: {
    backgroundColor: COLOR.ORANGE,
    width: widthScreen / 1.5,
    height: 50,
    borderRadius: 3,
  },

  txtContinueStyle: {
    color: COLOR.WHITE,
    fontWeight: "bold",
    fontSize: fontSize,
  },
});
