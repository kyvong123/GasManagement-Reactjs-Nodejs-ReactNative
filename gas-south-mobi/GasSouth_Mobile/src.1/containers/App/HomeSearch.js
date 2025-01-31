import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import pluralize from 'pluralize';

import withNetInfo from '../../helpers/withNetinfo';
import {fetchArticles, 
    toggleExpandArticle, 
    cleanArticles, 
    fetchArticle, 
    fetchArticleTypes,
 } from '../Articles/ArticleActions';
 import { fetchArticleServices } from '../../containers/Services/ServiceActions';
import { resetQuery,queryChanged} from '../Filters/FilterActions';
import { Card, CardRowSection } from '../../components/Common';
// TODO: move to index
import {ArticlesList, ArticleService} from '../../components/Articles/';
import { COLOR } from '../../constants';

const propTypes = {
    fetchArticles: PropTypes.func,
    query: PropTypes.object,
    queryChanged: PropTypes.func,
    navigation: PropTypes.object,
    articles: PropTypes.array,
    loading: PropTypes.bool,
    isAbleLoadMore: PropTypes.bool,
    // toggleExpandArticle: PropTypes.func,
    totalArticles: PropTypes.number,
    resetQuery: PropTypes.func,
    fetchArticle: PropTypes.func,
    cleanArticles: PropTypes.func,
    fetchArticleTypes: PropTypes.func,
    // services:PropTypes.array,
    service: PropTypes.object,
    isShowingSearchResult: PropTypes.bool,
    closeSearchBox: PropTypes.func,
    error: PropTypes.string
};

const styles = {
    containerStyle: {
        // backgroundColor: COLOR.BACKGROUNDGRAY,
        // marginLeft: 'auto',
        // justifyContent: 'center',
        padding: 16,
        paddingTop: 24
    },
    totalArticleStyle: {
        fontSize: 14,
        // fontWeight: '500',
        justifyContent: 'center',
        color: COLOR.DARKGRAY
    }
  };


class HomeSearch extends Component {
    constructor(props){
        super(props);
        this.handleItemPress = this.handleItemPress.bind(this);
        // this.handleToggle = this.handleToggle.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }
    componentDidMount(){
        this.props.cleanArticles();
        // this.props.closeSearchBox();
        this.props.fetchArticles(this.props.query);
        this.props.fetchArticleTypes();
    }
    // componentWillUnmount(){
        // this.props.cleanArticles();
    // }
    handleItemPress(id){
        this.props.fetchArticle(id);
        Actions.searchDetail();
        // this.props.navigation.navigate('ArticleDetail',{id});
    }
    // handleToggle(id){
    //     this.props.toggleExpandArticle(id);
    // }
    onRefresh(){
        const { query, loading} = this.props;
        if(!loading){
            query.page = 1;
            this.props.fetchArticles(query,{refresh: true});
        }
    }
    onEndReached(){
        // console.log('end reach', this.props.navigation);
        const {isAbleLoadMore, query, loading} = this.props;
        if(isAbleLoadMore && !loading ){
            query.page += 1;
            this.props.fetchArticles(query);
        }
    }
    renderListArticle(articles){
        return <ArticlesList 
                data={articles} 
                onPress={this.handleItemPress} 
                autoShowRefresh={this.props.autoShowRefresh}
                // handleToggle={this.handleToggle} 
                onRefresh={this.onRefresh}
                loading={this.props.loading}
                isAbleLoadMore={this.props.isAbleLoadMore}
                onEndReached={this.onEndReached}/>;
        
    }
    cleanSearch = () =>{
        this.props.cleanArticles();
        this.props.queryChanged({search: null});
        this.props.fetchArticles({search: null, page: 1});
    }
    renderHeader(){
        return <ArticleService total={this.props.totalArticles} cleanSearch={this.cleanSearch} service={this.props.service} isShowingSearchResult={this.props.isShowingSearchResult}/>;
    }

    render() {
        const {articles} = this.props;
        return (
            <Card>
                {this.renderHeader()}
                {/* {this.renderSumArticles(articles.length)} */}
                {this.renderListArticle(articles)}
            </Card>
        );
    }
}

HomeSearch.propTypes = propTypes;

const isShowingSearchResult = (keys) => (keys && keys.length > 0);
const mapStateToProps = (state) => ({
    articles: state.get('ArticleReducer').get('articles').toJS(),
    loading: state.get('ArticleReducer').get('loading'),
    totalArticles: state.get('ArticleReducer').get('total'),
    isAbleLoadMore: state.get('ArticleReducer').get('isAbleLoadMore'),
    // TODO: services -> service
    // services: getSelectedService(state.get('ServiceReducer').get('services').toJS(),state.get('FilterReducer').get('services').toJS()),
    service: state.get('ServiceReducer').get('service').toJS(),
    query: state.get('FilterReducer').toJS(),
    isShowingSearchResult: isShowingSearchResult(state.get('FilterReducer').get('search')),
    autoShowRefresh: state.get('ArticleReducer').get('autoShowRefresh')
});

export default connect(mapStateToProps, {queryChanged,fetchArticles, toggleExpandArticle, resetQuery, cleanArticles, fetchArticle, fetchArticleTypes, fetchArticleServices})(withNetInfo(HomeSearch));