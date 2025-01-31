import React, { Component } from 'react';
import { View, SectionList, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';
import { Actions } from 'react-native-router-flux';

const propTypes = {
    ternants: PropTypes.array
};

const styles= {
    containerStyle: {
        flexDirection: 'column',
        padding: 16,
    },
    containerFooterStyle: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 27,
        paddingBottom: 27,
        alignContent: 'center'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    textDomainStyle:{
        color: COLOR.LIGHTBLACK,
        fontSize: 14,
        paddingTop: 8
    },
    textCompanyStyle:{
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.BLACK,
    }
};

class TernantList extends Component {


    keyExtractor = (item, index) => item.domain + index;


    onPressItem = (item) => {
        // updater functions are preferred for transactional updates
        Actions.drawerClose();
        this.props.handleSwitchDomain(item.domain);
    }

    onPressSignInAnother = () => {
        Actions.signInAnotherStep1();
    }

    renderRow = ({item, index, section}) => {
        if(item.domain === null){
            return null;
        }

        return (
            <TouchableOpacity onPress={()=>this.onPressItem(item)}>
                <View style={[styles.containerStyle,styles.borderBottom]}>
                    <Text style={styles.textCompanyStyle}>{item.companyName}</Text>
                    <Text style={styles.textDomainStyle}>{item.domain}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderFooter = ({section: { title }}) => {
        if(title===null) {
            return null;
        }
        return (
            <TouchableOpacity onPress={()=>this.onPressSignInAnother()}>
                <View style={styles.containerFooterStyle}>
                    <Text style={styles.textCompanyStyle}>{title}</Text>
                    <Icon size={20} style={{marginLeft:'auto', color:'gray'}}>add</Icon>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const {ternants} = this.props;
        return (
                <SectionList
                    renderItem={this.renderRow}
                    renderSectionFooter={this.renderFooter}
                    sections={[{title: 'Sign in with another email', data: ternants}]}
                    keyExtractor={this.keyExtractor}
                />

        );
    }
}

TernantList.propTypes = propTypes;
export default TernantList;