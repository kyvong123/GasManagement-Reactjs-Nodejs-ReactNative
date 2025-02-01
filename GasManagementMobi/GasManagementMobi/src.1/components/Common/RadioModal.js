import React, { Component } from 'react';
import { Modal, View, TouchableHighlight, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';

const styles = {
    container:{
        flex: 1,
        alignItems: 'center',
        // backgroundColor: COLOR.BLACK,
        // opacity: 0.8,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flexDirection: 'row'
    },
    modal: {
        flex: 1,
        // backgroundColor: COLOR.WHITE,
        // opacity: 1,
        backgroundColor: 'rgba(255, 0, 0, 1)',
        margin: 20
    },
    optionContainerStyle:{
        padding: 10,
        paddingRight: 50,
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: COLOR.WHITE,
        opacity: 1,
        borderBottomWidth: 1,
        borderColor: COLOR.GRAY
    },
    optionTextStyle: {
        color: COLOR.BLACK
    },
    optionTextActiveStyle: {
        fontWeight: 'bold'
    },
    optionIconContainerStyle: {
        position: 'absolute',
        right: 10
    },
    titleStyle:{
        padding: 10,
        backgroundColor: COLOR.WHITE,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    }
};
class RadioModal extends Component {
    renderChild(option,index){
        const {selectedOption} = this.props;
        const {handleChangeOption} =this.props;
        const {optionContainerStyle, 
            optionTextStyle, 
            optionIconContainerStyle, 
            optionIconStyle, 
            optionTextActiveStyle} = styles;
        return( 
            <TouchableHighlight key={option.key} onPress={()=>handleChangeOption(option.key)} >
                <View style={optionContainerStyle}>
                    <Text style={[
                        optionTextStyle,
                        option.key === selectedOption ? optionTextActiveStyle:null]}>{option.value}</Text>
                    <View style={optionIconContainerStyle}>
                    {option.key === selectedOption ? <Icon style={optionIconStyle} size={20} color='blue'>radio_button_checked</Icon>:<Icon style={optionIconStyle} size={20}>radio_button_unchecked</Icon>}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    renderTitle(){
        return <Text style={styles.titleStyle}>{this.props.headerTitle}</Text>;
    }
    render() {
        const {toggleModal, options, visible} =this.props;
        if(!options || options.length < 0){
            return null;
        }
        return (
            <Modal animationType = {"fade"} transparent = {true}
               visible = {visible}
               onRequestClose = {() => { console.log("Modal has been closed."); } }>
                <TouchableHighlight onPress={toggleModal} style = {styles.container} underlayColor = 'rgba(0, 0, 0, 0.7)'>
                    <View style = {styles.modal}>
                        {/* {headerTitle ? this.renderTitle() : '' } */}
                        {options.map((option,index)=>this.renderChild(option,index))}
                    </View>
                </TouchableHighlight>
            </Modal>
        );
    }
}

RadioModal.propTypes = {
    visible: PropTypes.bool,
    toggleModal: PropTypes.func,
    options: PropTypes.array,
    handleChangeOption: PropTypes.func,
    headerTitle: PropTypes.string,
    selectedOption: PropTypes.number
};

export default RadioModal;