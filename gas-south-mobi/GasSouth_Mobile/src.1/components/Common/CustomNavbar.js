// Import libraries for making a component
import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import {COLOR} from '../../constants';
import { isIPhoneX } from '../../helpers/Utils';

// const CustomNavbar = ({navType}) => {
//   console.log('navType',navType);
//   const { viewStyle, leftGroupStyle, backStyle } = styles;
//   const renderLeft = () =>{
//     if (navType === 'menu') {
//       return (
//         <TouchableOpacity onPress={Actions.drawerOpen}>
//           <View style={leftGroupStyle}>
//             <Icon size={20} color='white'>menu</Icon>
//           </View>
//         </TouchableOpacity>
//       );
//     }
//     if (navType === 'close') {
//       return (
//         <TouchableOpacity onPress={Actions.pop}>
//           <View style={leftGroupStyle}>
//             <Icon size={20} color='white'>close</Icon>
//             <Text style={backStyle}>Close</Text>
//           </View>
//         </TouchableOpacity>
//       );
//     }
//     return (
//       // <View >
//         <TouchableOpacity onPress={Actions.pop}>
//           <View style={leftGroupStyle}>
//             <Icon size={20} color='white'>arrow_back</Icon>
//             <Text style={backStyle}>Back</Text>
//           </View>
//         </TouchableOpacity>
//       // </View>
//     );
//   };
//   const renderRight = () => null;
//   return (
//     <View style={viewStyle}>
//       {renderLeft()}
//       {renderRight()}
//     </View>
//   );
// };



const styles = {
  viewStyle: {
    backgroundColor: COLOR.GREEN,
    // justifyContent: 'flex-start',
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    height: isIPhoneX()?80:60,
    ...Platform.select({
      ios: {
        paddingTop: 20
      },
      android: {}
    }),
    position: 'relative'
  },
  leftGroupStyle: {
    padding: 15,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backStyle: {
    color: COLOR.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 16
  }
};

class CustomNavbar extends Component {
  // constructor(props){
  //   super(props);
  //   this.renderLeft = this.renderLeft.bind(this);
  //   this.renderRight = this.renderRight.bind(this);
  // }
  renderLeft (){
    const {navType} = this.props;
    const { leftGroupStyle, backStyle } = styles;
    if (navType === 'menu') {
      return (
        <TouchableOpacity onPress={Actions.drawerOpen}>
          <View style={leftGroupStyle}>
            <Icon size={24} color='white'>menu</Icon>
          </View>
        </TouchableOpacity>
      );
    }
    if (navType === 'close') {
      return (
        <TouchableOpacity onPress={Actions.pop}>
          <View style={leftGroupStyle}>
            <Icon size={24} color='white'>close</Icon>
            <Text style={backStyle}>Close</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      // <View >
        <TouchableOpacity onPress={Actions.pop}>
          <View style={leftGroupStyle}>
            <Icon size={24} color='white'>arrow_back</Icon>
            <Text style={backStyle}>Back</Text>
          </View>
        </TouchableOpacity>
      // </View>
    );
  };
  renderRight(){
    const {NavRight} = this.props;
    if(!NavRight){
      return null;
    }
    return <NavRight/>;
  };
  render() {

    const { viewStyle } = styles;
    return (
      <View style={viewStyle}>
        {this.renderLeft()}
        {this.renderRight()}
      </View>
    );
  }
}

CustomNavbar.propTypes= {
  NavRight: PropTypes.oneOfType([PropTypes.func,PropTypes.element]),
  navType: PropTypes.string.isRequired
};
// Make the component available to other parts of the app
export default CustomNavbar;
