import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { COLOR } from "../constants";

const widthScreen = Dimensions.get("screen").width;
const fontSize = 14;

const CustomeTextInput = ({
  label,
  placeholder = "Nhập",
  inputStyle,
  editable = true,
  value,
}) => {
  return (
    <KeyboardAvoidingView style={[styles.container]}>
      {label && <Text style={styles.labelStyle}>{label}</Text>}
      <TextInput
        editable={editable}
        style={[styles.inputStyle, inputStyle]}
        placeholder={placeholder}
        value={value ? value : null}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthScreen - 32,
    marginVertical: 5,
  },

  labelStyle: {
    color: COLOR.BLACK,
    fontSize: fontSize,
    marginVertical: 5,
  },

  inputStyle: {
    borderRadius: 7,
    backgroundColor: COLOR.WHITE,
    borderWidth: 2,
    borderColor: COLOR.GRAY_OPTION,
    paddingHorizontal: 5,
    height: 50,
    fontSize: fontSize,
    paddingHorizontal: 10,
  },
});

export default CustomeTextInput;
