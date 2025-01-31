import React, { Component } from 'react';
import { View, Modal, Text, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {sortBy, orderType, COLOR} from '../../constants';

const {height} = Dimensions.get('window');
const styles= {
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    modal: {
        width: 220,
        height: height*0.6,
        backgroundColor: COLOR.WHITE,
        ...Platform.select({
            ios: {
                margin: 10,
                marginTop: 20
            },
            android: {
                margin: 10
            }
          }),
        borderWidth: 1,
        borderColor: COLOR.LIGHTGRAY,
        borderRadius: 5,
        ...Platform.select({
            ios: {
              borderBottomWidth: 0,
              shadowColor: COLOR.BLACK,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2
            },
            android: {
              elevation: 2,
            },
          })
    },
    titleStyle: {
        backgroundColor: COLOR.LIGHTGRAY,
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        color: COLOR.LIGHTBLACK
    },
    itemContainer: {
        padding: 10,
        paddingRight: 30,
        position: 'relative'
    },
    itemTextStyle: {
        color: COLOR.BLACK
    },
    activeItemStyle: {
        fontWeight: 'bold'
    },
    iconStyle: {
        color: COLOR.GREEN,
        position: 'absolute',
        right: 10,
        top: 10
    }
};

const SortItem = ({onPress,item, selectedItem}) => (
    <TouchableOpacity onPress={()=>onPress(item.type)} style={styles.itemContainer}>
        <Text style={[styles.itemTextStyle,selectedItem === item.type ? styles.activeItemStyle: '' ]}>{item.description}</Text>
        {selectedItem === item.type ? <Icon style={styles.iconStyle} size={20} color='blue'>check</Icon> : null}
    </TouchableOpacity>
);


SortItem.propTypes = {
    onPress: PropTypes.func,
    selectedItem: PropTypes.string,
    item: PropTypes.object,
};

const propTypes = {
    visible: PropTypes.bool,
    handleChangeSortBy: PropTypes.func,
    handleChangeOrder: PropTypes.func,
    order: PropTypes.string,
    sortBy: PropTypes.string,
    toggleModal: PropTypes.func
};

class ArticleSort extends Component {
    renderOrder(items){
        return (
            <View>
                <Text style={styles.titleStyle}>Order</Text>
                {items.map(item =><SortItem key={item.type} onPress={this.props.handleChangeOrder} item={item} selectedItem={this.props.order}/>)}
            </View>
        );
    }
    renderSortBy(items){
        return (
            <View>
                <Text style={styles.titleStyle}>Sort by</Text>
                {items.map(item =><SortItem key={item.type} onPress={this.props.handleChangeSortBy} item={item} selectedItem={this.props.sortBy}/>)}
            </View>
        );
        
    }
    render() {
        // TODO: shouldComponentUpdate() here
        const {visible} = this.props;
        return (
            <Modal animationType = {"slide"} transparent = {true}
            visible = {visible}
            onRequestClose = {() => { console.log("Modal has been closed."); } }>
                <TouchableOpacity onPress={this.props.toggleModal} style={styles.container}>
                    <View style={styles.modal}>
                        <ScrollView>
                            {this.renderOrder(orderType)}
                            {this.renderSortBy(sortBy)}
                        </ScrollView>
                    </View>
                </TouchableOpacity> 
            </Modal>
        );
    }
}
ArticleSort.propTypes = propTypes;
export default  ArticleSort;
