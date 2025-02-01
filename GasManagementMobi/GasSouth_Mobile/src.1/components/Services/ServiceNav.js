import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fetchArticles} from '../../containers/Articles/ArticleActions';
import { queryChanged } from '../../containers/Filters/FilterActions';
import {COLOR} from '../../constants';

const styles = {
    wrapper: {
        flex: 1,
        // backgroundColor: 'red',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconSearchStyle:{
        color: COLOR.WHITE
    }
};

class ServiceNav extends Component {
    handleSearch = () =>{
        // this.props.queryChanged({services: []});
        Actions.searchArticles();
    }
    render() {
        const {wrapper} = styles;
        return (
            <View style={wrapper}>
                <TouchableOpacity onPress={this.handleSearch} >
                    <Icon size={24} style={styles.iconSearchStyle} color='gray'>search</Icon>
                </TouchableOpacity>
            </View>
        );
  }
}

const mapStateToProps = (state) => ({
    query: state.get('FilterReducer').toJS()
});

ServiceNav.propTypes = {
    fetchArticles: PropTypes.func,
    queryChanged: PropTypes.func,
    query: PropTypes.object
};
export default connect(mapStateToProps,{fetchArticles, queryChanged})(ServiceNav);

