import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';
import ArticleSort from './ArticleSort';

const propTypes = {
    modalVisible: PropTypes.bool,
    showSearchButton: PropTypes.bool,
    toggleModal: PropTypes.func,
    sortBy: PropTypes.string,
    order: PropTypes.string,
    handleChangeSortBy: PropTypes.func,
    handleChangeOrder: PropTypes.func,
    toggleSearchBox: PropTypes.func,
    showFiber: PropTypes.bool
};
const styles = {
    wrapper: {
        flex: 1,
        // backgroundColor: 'red',
        padding: 15,
        paddingRight: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icon:{
        paddingLeft: 12,
        paddingRight: 12,
        position: 'relative'
    },
    fiber: {
        color: '#80d000',
        position: 'absolute',
        top: 0,
        right: 8
    }
};

class SortNavbar extends Component {
    render() {
        const {showSearchButton} = this.props;
        return (
            <View style={styles.wrapper}>
                <ArticleSort 
            visible={this.props.modalVisible} 
            toggleModal={this.props.toggleModal}
            sortBy={this.props.sortBy}
            order={this.props.order}
            handleChangeSortBy={this.props.handleChangeSortBy}
            handleChangeOrder={this.props.handleChangeOrder}/>

                {showSearchButton&&<TouchableOpacity onPress={this.props.toggleSearchBox} style={styles.icon}>
                    <Icon size={24} color='white'>search</Icon>
                </TouchableOpacity>}
                <TouchableOpacity onPress={Actions.articleFilters} style={styles.icon}>
                    <Icon size={24} color='white'>filter_list</Icon>
                    {this.props.showFiber&&<Icon size={8} style={styles.fiber}>fiber_manual_record</Icon>}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.toggleModal} style={styles.icon}>
                    <Icon size={24} color='white'>sort_by_alpha</Icon>
                </TouchableOpacity>
            </View>
        );
  }
}

SortNavbar.propTypes = propTypes;

export default SortNavbar;

