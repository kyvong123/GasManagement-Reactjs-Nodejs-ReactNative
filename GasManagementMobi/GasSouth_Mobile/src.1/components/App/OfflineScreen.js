import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Card, CardColumnSection } from '../Common/';
import {COLOR} from '../../constants';


const styles = {
  iconStyle: {
    paddingTop: 100,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  headlineStyle:{
    alignSelf: 'center',
    fontSize: 18,
    color: COLOR.BLACK
  },
  textStyle:{
    alignSelf: 'center'
  }
};
class OfflineScreen extends Component {
  render() {
    return (
			<Card>
        <CardColumnSection>
          <Icon style={styles.iconStyle} size={100} color='gray'>error_outline</Icon>
        </CardColumnSection>
        <CardColumnSection>
          <Text style={styles.headlineStyle}>No Internet connection</Text>
        </CardColumnSection>
        <CardColumnSection>
          <Text style={styles.textStyle}>Please make sure you are connected to the Internet</Text>
        </CardColumnSection>
      </Card>
    );
  }
}

export default OfflineScreen;
