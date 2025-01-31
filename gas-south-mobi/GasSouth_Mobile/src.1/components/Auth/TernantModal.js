import React, { Component } from 'react';
import { Modal, View, TouchableHighlight, ScrollView, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLOR} from '../../constants';

const {height} = Dimensions.get('window');
const styles = {
    container:{
        flex: 1,
        alignItems: 'center',
        // backgroundColor: COLOR.BLACK,
        // opacity: 0.8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        flexDirection: 'row',
        // justifyContent: 'center',
    },
    modal: {
        flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'center',
        backgroundColor: COLOR.WHITE,
        // opacity: 1,
        // backgroundColor: 'rgba(255, 0, 0, 1)',
        margin: 20, 
        maxHeight: height - 140
    },
    optionContainerStyle:{
        padding: 16,
        paddingRight: 50,
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: COLOR.WHITE,
        opacity: 1,
        borderBottomWidth: 1,
        borderColor: COLOR.GRAY
    },
    optionDomainStyle: {
        fontSize: 14,
        paddingTop: 8,
        color: COLOR.LIGHTBLACK
    },
    optionCompanyStyle: {
        fontSize: 16,
        fontWeight: '500'
    },
    optionIconContainerStyle: {
        position: 'absolute',
        right: 10
    },
    titleStyle:{
        padding: 10,
        backgroundColor: COLOR.WHITE,
        fontSize: 17,
        fontWeight: 'bold',
    }
};
class TernantModal extends Component {
    renderChild(option){
        const {selectedOption} = this.props;
        const {handleChangeOption} =this.props;
        const {optionContainerStyle, 
            optionIconContainerStyle,
            optionDomainStyle, 
            optionCompanyStyle, 
            optionIconStyle } = styles;
        return( 
            <TouchableHighlight key={option.key} onPress={()=>handleChangeOption(option.key)} >
                <View style={optionContainerStyle}>
                    <View>
                        <Text style={optionCompanyStyle}>{option.companyName}</Text>
                        <Text style={
                            optionDomainStyle}>{option.domain}</Text>
                    </View>
                    <View style={optionIconContainerStyle}>
                    {option.key === selectedOption ? <Icon style={optionIconStyle} size={20} color='blue'>radio_button_checked</Icon>:<Icon style={optionIconStyle} size={20}>radio_button_unchecked</Icon>}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    renderTitle(){
        return (
            <TouchableHighlight>
                    <Text style={styles.titleStyle}>Select domain</Text>
            </TouchableHighlight>
        );
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
                    <View style={styles.modal}>
                        {this.renderTitle() }
                        <View>
                            <ScrollView>
                                {options.map((option,index)=>this.renderChild(option,index))}
                            </ScrollView>
                        </View>
                    </View>
                </TouchableHighlight>
            </Modal>
        );
    }
}

TernantModal.propTypes = {
    visible: PropTypes.bool,
    toggleModal: PropTypes.func,
    options: PropTypes.array,
    handleChangeOption: PropTypes.func,
    headerTitle: PropTypes.string,
    selectedOption: PropTypes.number
};

export default TernantModal;