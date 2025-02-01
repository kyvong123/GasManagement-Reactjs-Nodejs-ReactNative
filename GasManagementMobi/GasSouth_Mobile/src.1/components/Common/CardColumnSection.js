import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const CardColumnSection = (props) => (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );

const styles = {
  containerStyle: {
    // borderBottomWidth: 1,
    // borderWidth: 1,
    padding: 5,
    paddingLeft: 16,
    paddingRight: 16,
    // backgroundColor: 'green',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    position: 'relative'
  }
};
CardColumnSection.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

export default CardColumnSection;
