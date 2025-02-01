import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

const CardRowSection = (props) => (
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
    backgroundColor: COLOR.WHITE,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    // borderColor: 'green',
    position: 'relative'
  }
};
CardRowSection.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

export default CardRowSection;
