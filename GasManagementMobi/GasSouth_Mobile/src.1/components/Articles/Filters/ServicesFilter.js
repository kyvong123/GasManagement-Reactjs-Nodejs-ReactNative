import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ListView, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLOR } from '../../../constants';
import { Heading } from '../../Common';

const propTypes = {
    label: PropTypes.string.isRequired,
    expand: PropTypes.bool,
    toggleFilter: PropTypes.func,
    hanldeServiceClick: PropTypes.func,
    selectedService: PropTypes.array,
    serviceList:PropTypes.array,
};
const styles= {
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    infoStyle:{
        flex: 1
    },
    logoStyle:{
        width: 48,
        height: 48,
        marginRight: 16,
        borderRadius: 24,
        backgroundColor: COLOR.LIGHTGRAY
    },
    nameStyle:{
        color: COLOR.DARKGRAY,
        fontSize: 16,
        marginBottom: 4
    },
    detailStyle:{
        fontSize: 12,
        color: COLOR.DARKGRAY,
    },
    iconStyle:{
        position: 'absolute',
        right: 24
    },
    filterWrapper: {
        // maxHeight: 400,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    headerWrapper: {
        // backgroundColor: 'yellow',
        padding: 16,
        paddingRight: 40,
        justifyContent: 'center',
        position: 'relative'
    },
    headerIcon: {
        position: 'absolute',
        right: 16,
        top: 12
    }
};
class ServicesFilter extends Component {
    keyExtractor = (item) => item.id;

    renderServiceList = () => {
        const {serviceList, expand} = this.props;
        if(!serviceList || serviceList.length < 1){
            return null;
        }
        if(!expand){
            return null;
        }
        return (
                <FlatList
                    data={this.props.serviceList}
                    keyExtractor={this.keyExtractor}
                    extraData={this.props.selectedService}
                    renderItem={this.renderRow}
                />
        );
    }
    isChecked = (id) => {
        const {selectedService} = this.props;
        return selectedService.includes(id);
    }
    hanldeServiceClick = (id) => {
        this.props.hanldeServiceClick(id);
    }
    renderRow = ({item}) => {
        if(item.id === null){
            return null;
        }
        return (
            <TouchableOpacity onPress={()=>this.hanldeServiceClick(item.id)}>
                <View style={styles.containerStyle}>
                    <View style={styles.logoStyle}>
                    </View>
                    <View style={styles.infoStyle}>
                        {item.name && <Text ellipsizeMode='tail' numberOfLines={1} style={styles.nameStyle}>{item.name}</Text>}
                        {item.name && <Text ellipsizeMode='tail' numberOfLines={2} style={styles.detailStyle}>{item.description}</Text>}
                    </View>
                    { this.isChecked(item.id) ? <Icon size={20} color='#2a56c6'>check_box</Icon>:<Icon size={20} color='gray'>check_box_outline_blank</Icon>}
                </View>
            </TouchableOpacity>
        );
    }
    render() {
        const {label, expand, toggleFilter} = this.props;
        return (
        <View style={styles.filterWrapper}>
            <TouchableOpacity onPress={toggleFilter} style={styles.headerWrapper}>
                <Heading>{label}</Heading>
                <Icon style={styles.headerIcon} size={20} color='gray'>{expand ? 'keyboard_arrow_up': 'keyboard_arrow_down'}</Icon>
            </TouchableOpacity>
            {this.renderServiceList()}
        </View>
        );
    }
}

ServicesFilter.propTypes = propTypes;

export default ServicesFilter;
