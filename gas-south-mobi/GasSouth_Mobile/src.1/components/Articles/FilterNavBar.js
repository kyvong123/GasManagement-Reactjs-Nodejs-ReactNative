import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import {Actions} from 'react-native-router-flux';
import {fetchArticles} from '../../containers/Articles/ArticleActions';
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
    textStyle:{
        paddingLeft: 10,
        color: COLOR.WHITE
    }
};

class FilterNavbar extends Component {
    render() {
        const {wrapper, textStyle} = styles;
        return (
            <View style={wrapper}>
                <TouchableOpacity onPress={()=>console.log('reset')} >
                    <Text style={textStyle}>Clear all</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>console.log('apply')}>
                    <Text style={textStyle}>Apply</Text>
                </TouchableOpacity>
            </View>
        );
  }
}

const mapStateToProps = (state) => ({
    query: state.get('FilterReducer').toJS()
});

FilterNavbar.propTypes = {
    fetchArticles: PropTypes.func,
    query: PropTypes.object
};
export default connect(mapStateToProps,{fetchArticles})(FilterNavbar);

