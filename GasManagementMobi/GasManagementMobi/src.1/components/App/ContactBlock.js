import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';

const propTypes = {
    userInfo: PropTypes.object
};

const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding:10,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    infoStyle:{
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    nameStyle:{
        paddingBottom: 10,
        fontSize: 15,
        color: COLOR.BLACK,
        fontWeight: 'bold'
    },
    emailStyle: {
        color: COLOR.DARKGRAY
    },
    iconStyle: {
        // flex: 1,
        color: COLOR.GRAY
    }
};

const ContactBlock = () => {
    const {container, infoStyle, nameStyle, emailStyle, iconStyle} = styles;
    // console.log('userInfo', this.props);
    // if(this.props && this.props.userInfo){
    //     console.log('userInfo',this.props.userInfo);}
    return (
        <View style={container}>
            <Icon style={iconStyle} size={60} >account_circle</Icon>
            <View style={infoStyle}>
                <Text style={nameStyle}>User name here</Text>
                <Text style={emailStyle}>Email here</Text>
            </View>
        </View>
  );
};

ContactBlock.propTypes = propTypes;

// const mapStateToProps = (state) => ({
//     userInfo: state.get('AuthReducer').get('userInfo').toJS()
//   });
// export default connect(null,null)(ContactBlock);
export default ContactBlock;

