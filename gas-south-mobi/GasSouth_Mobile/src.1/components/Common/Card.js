import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

const Card = (props) => (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );

const styles = {
  containerStyle: {
    flex: 1,
    // borderWidth: 1,
    // borderRadius: 2,
    // borderColor: 'red',
    // borderBottomWidth: 0,
    backgroundColor: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  }
};
Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
export default Card;
