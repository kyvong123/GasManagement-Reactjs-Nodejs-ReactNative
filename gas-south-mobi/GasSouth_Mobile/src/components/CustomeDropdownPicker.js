import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState, useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { COLOR } from "../constants";

const widthScreen = Dimensions.get("screen").width;
const fontSize = 14;

const CustomeDropdownPicker = ({
  label,
  data,
  value,
  setValue,
  placeholder,
  isSearch,
  searchPlaceholder,
  onChangeSearchText,
}) => {
  const [isvisible, setIsvisible] = useState(false);

  // xử lí dữ liệu khi chọn một item trong dropdown
  const handleSetValue = (value) => {
    setValue(value);
  };

  // đóng mở dropdown
  const toogleDropdown = () => {
    setIsvisible(!isvisible);
  };

  return (
    <View>
      {label && <Text style={styles.labelStyle}>{label}</Text>}
      <DropDownPicker
        style={styles.inputStyle}
        dropDownContainerStyle={{
          borderColor: COLOR.GRAY_OPTION,
        }}
        placeholderStyle={styles.placeholderStyle}
        items={data}
        open={isvisible}
        value={value}
        setValue={(value) => handleSetValue(value)}
        placeholder={placeholder}
        setOpen={toogleDropdown}
        searchable={isSearch}
        searchContainerStyle={{ borderBottomColor: COLOR.GRAY_OPTION }}
        searchPlaceholder={searchPlaceholder}
      />
    </View>
  );
};

export default CustomeDropdownPicker;

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
  },

  placeholderStyle: {
    color: COLOR.GRAY,
    fontSize: fontSize,
    paddingHorizontal: 5,
  },
});
