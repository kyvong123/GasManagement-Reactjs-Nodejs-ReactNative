import React, { Component } from 'react';
import { View, TextInput, Text, Animated, TouchableHighlight, Easing, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';

const propTypes = {
    handleSearch: PropTypes.func,
    onFocus: PropTypes.func,
    showBorder: PropTypes.bool,
    isShowingSearchResult: PropTypes.bool,
    handleBackClick: PropTypes.func,
    focus: PropTypes.bool,
    handleBack: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    toggleSearchBox: PropTypes.func
};

const styles = {
    container: {
        backgroundColor: COLOR.WHITE,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#283b434f'
    },
    inputStyle: {
        color: COLOR.GRAY,
        height: 40,
        borderBottomWidth: 0,
        textDecorationLine: 'none',
        flex: 1
    },
    iconStyle:{
        color: '#9B9B9B',
        paddingRight: 10
    },
    iconClearStyle:{}
};

class SearchInput extends Component {
    constructor(props){
        super(props);
        this.state={
            value: this.props.value,
            isShowingSearchResult: this.props.isShowingSearchResult
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
        this.clearText = this.clearText.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.isShowingSearchResult !== this.props.isShowingSearchResult){
            this.setState({
                isShowingSearchResult: nextProps.isShowingSearchResult
            });
        }
        if(nextProps.value !== this.props.value){
            this.setState({
                value: nextProps.value
            });
        }
    }
    onChangeText(text){
        this.setState({
            value: text
        });
    }
    onSubmitEditing(){
        this.props.handleSearch(this.state.value);
    }
    clearText(){
        this.setState({
            value: null
        });
    }
    handleBackClick = () => {
        this.setState({
            value: null,
            isShowingSearchResult: false
        },()=>{
            this.props.handleBackClick();
        });
    }
    renderIcon = () => {
        const {isShowingSearchResult} = this.state;
        const {iconStyle} = styles;
        if(isShowingSearchResult){
            return (
                <TouchableOpacity onPress={this.handleBackClick}>
                    <Icon style={iconStyle} size={24}>keyboard_backspace</Icon>
                </TouchableOpacity>
            );
        }
        return <Icon style={iconStyle} size={24}>search</Icon>;
    }
    render() {
        const {container, inputStyle, iconStyle, iconClearStyle} = styles;
        const {value} = this.state;
        return (
            <View style={container}>
                {/* <Icon style={iconStyle} size={24}>search</Icon> */}
                {/* <Icon style={iconStyle} size={24}>keyboard_backspace</Icon> */}
                {this.renderIcon()}
                <TextInput 
                    onSubmitEditing={this.onSubmitEditing}
                    onChangeText={this.onChangeText}
                    onFocus={this.props.onFocus}
                    value={this.state.value}
                    returnKeyType='search'
                    autoFocus={this.props.focus}
                    caret={true}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder={this.props.placeholder}
                    style={inputStyle}/>
                {!!value&&<TouchableHighlight style={iconClearStyle} onPress={this.clearText}>
                    <Icon size={24} style={iconStyle}>cancel</Icon>
                </TouchableHighlight>}
            </View>
        );
    }
}

SearchInput.propTypes = propTypes;

export default SearchInput;