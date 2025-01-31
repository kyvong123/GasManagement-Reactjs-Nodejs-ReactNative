import React from "react";
import { Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { COLOR } from "../constants";

const TextButton = ({ onPress, children, style, btnStyle }) => {
  const { wrapperStyle, textStyle } = styles;
  return (
    <TouchableOpacity style={[wrapperStyle, btnStyle]} onPress={onPress}>
      <Text style={[textStyle, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  wrapperStyle: {
    flex: 1,
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 14,
    alignSelf: "center",
    color: COLOR.GREEN,
  },
};
TextButton.propTypes = {
  style: PropTypes.object,
  children: PropTypes.string,
  onPress: PropTypes.func,
};
export default TextButton;
