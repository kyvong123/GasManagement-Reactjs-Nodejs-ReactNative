import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {find as _find } from 'lodash';

import { COLOR } from '../../../constants';
import { Heading, RadioModal } from '../../Common';

const {width} = Dimensions.get('window');
const propTypes = {
    label: PropTypes.string.isRequired,
    expand: PropTypes.bool,
    toggleFilter: PropTypes.func,
    handleDateTimeChange: PropTypes.func,
    dateOptions:PropTypes.array,
    dateFormat: PropTypes.string,
    lastModifiedDatePreSetting: PropTypes.number,
    lastModifiedDateFrom: PropTypes.string,
    lastModifiedDateTo: PropTypes.string,
    showCustomrange:PropTypes.bool,
};
const styles= {
    containerStyle: {
        flex: 1,
        flexDirection: 'column',
        // alignItems: 'center',
        padding: 0,
        paddingLeft: 19,
        paddingRight: 19,
        paddingBottom: 27
    },
    filterWrapper: {
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
    },

    dropDownStyle: {
        flex: 1,
        height: 40,
        padding: 10,
        paddingRight: 50,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY,
        justifyContent: 'center',
        position: 'relative'
    },
    dropDownIconStyle: {
        position: 'absolute',
        right: 10
    },
    pickerWrapper: {
        marginTop: 25
    },
    datePickerStyle: {
        width: width - 40,
        marginBottom: 15
    }
};

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 8);

class DateTimeFilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            fromDate: this.props.lastModifiedDateFrom || oneWeekAgo,
            toDate: this.props.lastModifiedDateTo || new Date()
        };
    }
    toggleModal = () =>{
        const modalVisible = !this.state.modalVisible;
        this.setState({ modalVisible });
    }
    handleDateTimeChange = (val) =>{
        const {toDate, fromDate} = this.state;
        if(val === null){
            this.props.handleDateTimeChange(null,fromDate,toDate);
            this.toggleModal();
        } else {
            this.props.handleDateTimeChange(val,null,null);
            this.toggleModal();
        }
    }
    handleFromDateChange = (date) =>{
        const {toDate} = this.state;
        // console.log(date);
        if(moment(date).isAfter(moment(toDate))){
            this.setState({
                fromDate: date,
                toDate: date
            },()=>{
                // console.log(this.state);
                this.props.handleDateTimeChange(null,date,date);
            });
        } else {
            this.setState({
                fromDate: date
            },()=>{
                // console.log(this.state);
                this.props.handleDateTimeChange(null,date,toDate);
            });
        }
        
    }
    handleToDateChange = (date) =>{
        const {fromDate} = this.state;
        // console.log(date);
        if(moment(date).isBefore(moment(fromDate))){
            this.setState({
                fromDate: date,
                toDate: date
            },()=>{
                // console.log(this.state);
                this.props.handleDateTimeChange(null,date,date);
            });
        } else {
            this.setState({
                toDate: date
            },()=>{
                // console.log(this.state);
                this.props.handleDateTimeChange(null,fromDate,date);
            });
        }
    }

    renderOption = ()=>{
        const {dateOptions,  lastModifiedDatePreSetting} = this.props;
        const option = _find(dateOptions,(e)=>e.key === lastModifiedDatePreSetting);   
        // console.log(option);
        if(option){
            return <Text>{option.value}</Text>;
        } 
        return <Text>Option undefined</Text>;
    }
    renderFilter = () => {
        const {dateOptions, expand, lastModifiedDatePreSetting, showCustomrange} = this.props;
        if(!dateOptions || dateOptions.length < 1){
            return null;
        }
        if(!expand){
            return null;
        }
        return (
            <View style={styles.containerStyle}>
                <TouchableOpacity onPress = {this.toggleModal} style={{flex: 1}}>
                    <View style={styles.dropDownStyle}>
                        {/* <Text>{dateOptions.find().value}</Text> */}
                        {this.renderOption()}
                        <Icon size={20} color='blue' style={styles.dropDownIconStyle}>arrow_drop_down</Icon>
                    </View>
                </TouchableOpacity>
                <RadioModal 
                    visible={this.state.modalVisible} 
                    toggleModal={this.toggleModal} 
                    options={dateOptions}
                    selectedOption={lastModifiedDatePreSetting}
                    handleChangeOption={this.handleDateTimeChange}
                />
                {showCustomrange&&<View style={styles.pickerWrapper}>
                    <DatePicker
                        style={styles.datePickerStyle}
                        date={this.state.fromDate}
                        mode="date"
                        placeholder="Select date"
                        // format={this.props.dateFormat}
                        // maxDate={this.state.toDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            right: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            alignItems: 'flex-start',
                            borderWidth: 0
                        }
                        }}
                        onDateChange={this.handleFromDateChange}
                    />
                    <DatePicker
                        style={styles.datePickerStyle}
                        date={this.state.toDate}
                        mode="date"
                        placeholder="Select date"
                        // format={this.props.dateFormat}
                        // minDate={this.state.fromDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            right: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            alignItems: 'flex-start',
                            borderWidth: 0
                        }
                        }}
                        onDateChange={this.handleToDateChange}
                    />
                </View>}
            </View>
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
            {this.renderFilter()}
        </View>
        );
    }
}

DateTimeFilter.propTypes = propTypes;

export default DateTimeFilter;
