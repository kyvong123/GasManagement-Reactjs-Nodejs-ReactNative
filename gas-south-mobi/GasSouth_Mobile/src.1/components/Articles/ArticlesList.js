import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import {Card, Spinner, CardRowSection} from '../Common/';
import ArticlesItem from './ArticlesItem';

class ArticlesList extends Component {
    constructor(props){
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderEmptyContent = this.renderEmptyContent.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }
    // shouldComponentUpdate(nextProps){
    //     if(!_.isEqual(this.props.data,nextProps.data)){
    //         return true;
    //     } 
    //     return false;  
    // }

    componentWillReceiveProps(nextProps) {
        if(nextProps.autoShowRefresh && nextProps.loading){
            this.flatList.scrollToOffset({
                offset: -60,
                animated: true
                })
        }
    }

    renderItem(item){
        const {onPress}  = this.props;
        return <ArticlesItem onPress={onPress} data={item} key={item.id}/>;
    }
    keyExtractor = (item) => item.id;

    renderEmptyContent(){
        const { loading, emptyContent}  = this.props;
        if(loading){
            return null;
        }
        if(emptyContent !== undefined){
            return <Text style={{paddingLeft: 16, paddingRight: 16}}>{emptyContent}</Text>;
        }
        return null;
        // return <Text style={{paddingLeft: 16, paddingRight: 16}}>No articles.</Text>;
    }
    renderFooter(){
        const { loading, isAbleLoadMore, data }  = this.props;
        if(loading && isAbleLoadMore){
            return (
                <CardRowSection>
                    <Spinner size='small'/>
                </CardRowSection>
            );
        }
        if(data&&data.length === 0 ){
            return null;
        }
        return (
            <CardRowSection>
                <Text>All articles are loaded</Text>
            </CardRowSection>
        );
    }
    render() {
        const { onEndReached, onRefresh, loading, data}  = this.props;
        return (
            <Card>
                <View style={{flex: 1}}>
                    <FlatList
                        data={data}
                        ListEmptyComponent={this.renderEmptyContent()}
                        onEndReachedThreshold={0.02}
                        onEndReached={onEndReached}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                        onRefresh={onRefresh}
                        refreshing={loading}
                        ref={
                            (c) => {
                              this.flatList = c;
                            }
                          }
                    />
                </View>
            </Card>
        );
    }
}

ArticlesList.propTypes = {
    data: PropTypes.array,
    onPress: PropTypes.func,
    onEndReached: PropTypes.func,
    onRefresh: PropTypes.func,
    loading: PropTypes.bool,
    isAbleLoadMore: PropTypes.bool,
    handleToggle: PropTypes.func,
    emptyContent: PropTypes.string
};

export default ArticlesList;