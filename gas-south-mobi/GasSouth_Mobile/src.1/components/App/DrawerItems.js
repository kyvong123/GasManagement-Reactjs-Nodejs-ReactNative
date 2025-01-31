import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {Actions} from 'react-native-router-flux';
import DrawerItem from './DrawerItem';
import {logOut} from '../../containers/Auth/AuthActions';

const styles ={
    container:{
        flex: 1,
        flexDirection: 'column',
        paddingTop: 11,
        // paddingLeft: 16,
        marginBottom: 30
    }
};
class DrawerItems extends Component {
  handleBrowseArticlesClick = () =>{
      Actions.app();
      Actions.articles();
  }
  render() {
    return (
      <View style={styles.container}>
          <DrawerItem name='Home' icon='home' onPress={Actions.app}/>
          {/* <DrawerItem name='Services' icon='library_books' onPress={this.handleBrowseArticlesClick}/> */}
          {/* <DrawerItem name='Contact us' icon='contact_mail' onPress={()=>{console.log('contact us');}}/>
          <DrawerItem name='Change password' icon='lock' onPress={()=>{console.log('change password');}}/> */}
          <DrawerItem name='Sign out' icon='power_settings_new' onPress={this.props.logOut}/>
      </View>
    );
  }
};

export default connect(null, {logOut})(DrawerItems);
