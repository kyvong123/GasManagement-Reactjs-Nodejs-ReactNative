import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLOR } from '../../../constants';
import { Heading } from '../../Common';

const propTypes = {
    label: PropTypes.string.isRequired,
    expand: PropTypes.bool,
    toggleFilter: PropTypes.func,
    handleCheckboxClick: PropTypes.func,
    selectedCheckbox:PropTypes.array,
    checkboxList: PropTypes.array
};
const styles= {
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 27
    },
    nameStyle:{
        color: COLOR.LIGHTBLACK,
        paddingLeft: 27,
        fontSize: 16,
        marginBottom: 4
    },
    filterWrapper: {
        // flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    headerWrapper: {
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
class CheckboxFilter extends Component {
    renderCheckboxList = () => {
        const {checkboxList, expand} = this.props;
        if(!checkboxList || checkboxList.length < 1){
            return null;
        }
        if(!expand){
            return null;
        }
        return (
                <FlatList
                    data={this.props.checkboxList}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderRow}
                    extraData={this.props.selectedCheckbox}
                />
        );
    }
    isChecked = (id) => {
        const {selectedCheckbox} = this.props;
        return selectedCheckbox.includes(id);
    }
    keyExtractor = (item) => item.id;

    handleCheckboxClick = (id) => {
        this.props.handleCheckboxClick(id);
    }
    renderRow = ({item}) => {
        if(item.id === null){
            return null;
        }
        return (
            <TouchableOpacity onPress={()=>this.handleCheckboxClick(item.id)}>
                <View style={styles.containerStyle}>
                    { this.isChecked(item.id) ? <Icon size={20} color='#2a56c6'>check_box</Icon>:<Icon size={20} color='gray'>check_box_outline_blank</Icon>}
                    {item.description && <Text ellipsizeMode='tail' numberOfLines={1} style={styles.nameStyle}>{item.description}</Text>}                    
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
            {this.renderCheckboxList()}
        </View>
        );
    }
}

CheckboxFilter.propTypes = propTypes;

export default CheckboxFilter;
