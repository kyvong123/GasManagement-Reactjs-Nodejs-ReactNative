// import {
//     Image,
//     Platform,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import React from 'react';
// import { Actions } from 'react-native-router-flux';
// import { COLOR } from '../constants';
// import { connect } from 'react-redux';
// import {
//     addCylinder,
//     fetchCylinder,
//     updateCylinders,
// } from '../actions/CyclinderActions';
// import { getUserInfo } from '../helper/auth';
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
// import dectectDevice from '../utils/DetectDeviceService';
// import IconFe from 'react-native-vector-icons/Ionicons';

// const dectectDevices = dectectDevice.getInstance();
// const styles = StyleSheet.create({
//     container: {
//         height: Platform.OS === 'ios' ? 64 : 64,
//         flexDirection: 'row',
//         padding: 10,
//         backgroundColor: '#009347',
//     },
//     navBarItem: {
//         flex: 1,
//         paddingRight: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     backItem: {
//         width: 40,
//         justifyContent: 'center',
//         paddingLeft: 10,
//     },
//     backIcon: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#FFF',
//     },
//     header: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#FFF',
//     },
// });

// class CustomNavBar extends React.Component {


//     constructor(props) {
//         super(props);
//         this.lastData = props.data ? props.data : {};
//     }

//     _renderLeft(routeName) {
//         if (routeName === '_home') {
//             return (
//                 <TouchableOpacity onPress={Actions.drawerOpen} style={styles.backItem}>
//                     <Icons name="menu" size={30} color="#FFF" />
//                 </TouchableOpacity>
//             );
//         } else if (routeName === '_changePassword') {
//             return (
//                 <TouchableOpacity
//                     onPress={() => {
//                         Actions.jump('_home');
//                     }}
//                     style={styles.backItem}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         } else if (routeName === '_signature') {
//             return (
//                 <TouchableOpacity
//                     onPress={() => {
//                         Actions.jump('_home');
//                     }}
//                     style={styles.backItem}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         } else if (
//             typeof this.props.cyclinderAction !== 'undefined' &&
//             this.props.cyclinderAction !== '' &&
//             this.props.cyclinderAction !== 'scanAdmin' &&
//             (routeName === 'result2Import' || routeName === 'result2')
//         ) {
//             return (
//                 <TouchableOpacity style={styles.backItem}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         } else if (routeName === 'scanManual') {
//             return (
//                 <TouchableOpacity style={styles.backItem} onPress={() => Actions.pop()}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         } else if (routeName === '_dailyReport') {
//             return (
//                 <TouchableOpacity
//                     style={styles.backItem}
//                     onPress={() => Actions.reset('app')}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         } else if (routeName === 'result2') {
//             return (
//                 <TouchableOpacity style={styles.backItem} onPress={() => Actions.pop()}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         } else if (routeName === '_branch') {
//             return (
//                 <TouchableOpacity
//                     onPress={() => {
//                         Actions.jump('statisticDetailManager');
//                     }}
//                     style={styles.backItem}>
//                     <IconFe color={'#FFF'} size={30} name="ios-arrow-back"></IconFe>
//                 </TouchableOpacity>
//             );
//         }
//         const tittle = this.props.data ? { namewh: this.props.data.name } : {};
//         const userInfo = this.props.userInfo;
//         return (
//             <TouchableOpacity
//                 onPress={() => {
//                     if (routeName == 'branch') {
//                         Actions.jump('statisticDetailManager', {
//                             data: this.lastData,
//                             ...this.lastData,
//                             selectall: false,
//                             ...tittle,
//                             userRole: 'BRANCH',
//                             userType: 'BRANCH',
//                         });
//                     } else if (
//                         (routeName == 'statisticDetailManager' &&
//                             typeof userInfo !== 'undefined' &&
//                             userInfo.userType != 'Factory' &&
//                             !this.props.isBack) ||
//                         (typeof userInfo !== 'undefined' &&
//                             userInfo.userType == 'Factory' &&
//                             userInfo.userRole == 'Owner')
//                     ) {
//                         Actions.jump('home');
//                     } else if (routeName == 'statisticManager') {
//                         Actions.jump('home');
//                     } else if (routeName == 'branch') {
//                         Actions.jump('statisticDetailManager', {
//                             data: this.lastData,
//                             ...this.lastData,
//                             selectall: false,
//                             ...tittle,
//                             userRole: 'BRANCH',
//                             userType: 'BRANCH',
//                         });
//                     } else if (routeName == 'orderScreen') {
//                         Actions.jump('home');
//                     } else {
//                         console.log(
//                             'HIHI22222222222222',
//                             this.props.isBack,
//                             typeof this.props.cyclinderAction,
//                             this.props.cyclinderAction,
//                         );
//                         const backBranch = this.props.isBack
//                             ? Actions.jump('branch', {
//                                 branchId: this.props.branchId,
//                                 data: this.lastData,
//                             })
//                             : Actions.pop();
//                         typeof this.props.cyclinderAction !== 'undefined' &&
//                             this.props.cyclinderAction !== ''
//                             ? backBranch
//                             : Actions.jump('info');
//                     }
//                 }}
//                 style={styles.backItem}>
//                 <IconFe size={30} color={'#FFF'} name="ios-arrow-back"></IconFe>
//             </TouchableOpacity>
//         );
//     }

//     _renderMiddle() {
//         return (
//             <View style={styles.navBarItem}>
//                 <Text style={styles.header}>{this.props.title}</Text>
//             </View>
//         );
//     }

//     _renderRight() {
//         const userInfo = this.props.userInfo;
//         return (
//             <TouchableOpacity
//                 style={styles.backItem}
//                 onPress={() => {
//                     Actions['filterCustomer']({
//                         userInfo: userInfo
//                     })
//                 }}>
//                 <Icons color={'#FFF'} size={30} name="filter-outline"></Icons>
//             </TouchableOpacity>
//         );
//     }

//     render() {
//         const { routeName } = this.props.scene.route;
//         return (
//             <View
//                 style={[
//                     styles.container,
//                     {
//                         marginTop:
//                             Platform.OS == 'ios'
//                                 ? dectectDevices.marginTopHeader + 15
//                                 : dectectDevices.marginTopHeader,
//                     },
//                 ]}>
//                 {this._renderLeft(routeName)}
//                 {this._renderMiddle()}
//                 {this._renderRight()}
//             </View>
//         );
//     }
// }

// export const mapStateToProps = (state) => ({
//     cyclinder: state.cylinders.cyclinder,
//     cyclinderAction: state.cylinders.cyclinderAction,
//     scanResults: state.cylinders.scanResults,
//     loading: state.cylinders.loading,
//     userInfo: state.auth.user,
// });
// export default connect(mapStateToProps)(CustomNavBar);


import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';
import { connect } from 'react-redux';
import {
    addCylinder,
    fetchCylinder,
    updateCylinders,
} from '../actions/CyclinderActions';
import { getUserInfo } from '../helper/auth';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import dectectDevice from '../utils/DetectDeviceService';
import IconFe from 'react-native-vector-icons/Ionicons';

const dectectDevices = dectectDevice.getInstance();
const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 64 : 64,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#009347',
    },
    navBarItem: {
        flex: 1,
        paddingRight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backItem: {
        width: 40,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    backIcon: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
});

class CustomNavBar extends React.Component {


    constructor(props) {
        super(props);
        this.lastData = props.data ? props.data : {};
    }

    _renderLeft() {
        const userInfo = this.props.userInfo;
        return (
            <TouchableOpacity
                style={styles.backItem}
                onPress={() => {
                    Actions['home']({
                        userInfo: userInfo
                    })
                }}>
                 <IconFe size={30} color={'#FFF'} name="ios-arrow-back"></IconFe>
            </TouchableOpacity>
        );
      }

    _renderMiddle() {
        return (
            <View style={styles.navBarItem}>
                <Text style={styles.header}>{this.props.title}</Text>
            </View>
        );
    }

    _renderRight() {
        const userInfo = this.props.userInfo;
        return (
            <TouchableOpacity
                style={styles.backItem}
                onPress={() => {
                    Actions['filterCustomer']({
                        userInfo: userInfo
                    })
                }}>
                <Icons color={'#FFF'} size={30} name="filter-outline"></Icons>
            </TouchableOpacity>
        );
    }

    render() {
        const { routeName } = this.props.scene.route;
        return (
            <View
                style={[
                    styles.container,
                    {
                        marginTop:
                            Platform.OS == 'ios'
                                ? dectectDevices.marginTopHeader + 15
                                : dectectDevices.marginTopHeader,
                    },
                ]}>
                {this._renderLeft(routeName)}
                {this._renderMiddle()}
                {this._renderRight()}
            </View>
        );
    }
}

export const mapStateToProps = (state) => ({
    cyclinder: state.cylinders.cyclinder,
    cyclinderAction: state.cylinders.cyclinderAction,
    scanResults: state.cylinders.scanResults,
    loading: state.cylinders.loading,
    userInfo: state.auth.user,
});
export default connect(mapStateToProps)(CustomNavBar);

