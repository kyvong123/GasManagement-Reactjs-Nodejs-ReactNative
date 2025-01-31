import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import pluralize from 'pluralize';

import { Card, Spinner, CardRowSection, PageTitle } from '../Common';
import { COLOR } from '../../constants';
import ServiceItem from './ServiceItem';

const styles = {
    withoutPadding: {
      padding: 0,
      paddingLeft: 0,
      paddingRight: 0
    },
    titleStyle: {
        backgroundColor: COLOR.WHITE
    },
    containerStyle: {
        // backgroundColor: COLOR.BACKGROUNDGRAY,
        marginLeft: 'auto',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 24
    },
    totalArticleStyle: {
        fontSize: 12,
        // fontWeight: '500',
        color: COLOR.DARKGRAY
    }
  };

const propTypes = {
    services: PropTypes.array,
    fetchArticleService: PropTypes.func,
    sumArticles: PropTypes.number,
    fetchArticleServices: PropTypes.func,
    queryChanged:PropTypes.func,
    loading: PropTypes.bool,
    cleanArticles: PropTypes.func,
    resetQuery: PropTypes.func
};

class ServiceList extends Component {
    componentWillMount(){
        this.props.fetchArticleServices();
        this.props.cleanArticles();
    }
    keyExtractor = (item) => item.id;
    renderListServices(){
        return <FlatList
        data={this.props.services}
        renderItem={this.renderRow}
        keyExtractor={this.keyExtractor}
        />;
    }
    showInfo = (id) => {
        this.props.fetchArticleService(id);
        Actions.serviceDetail();
    }
    hanldeServiceClick = (id) => {
        this.props.resetQuery();
        this.props.queryChanged({services: id});
        Actions.articles();
    }
    renderRow = ({item}) =><ServiceItem data={item} handleClick={this.hanldeServiceClick} showInfo={this.showInfo}/>

    renderSumArticles = (sum) => {
        if(!sum && sum !==0){
            return null;
        }
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.totalArticleStyle}>Total {`${sum} ${pluralize('article',sum)}`} </Text>
            </View>
        );
    }

    render() {
        const {loading, sumArticles} = this.props;
        if(loading){
            return (
                <Card>
                    <Spinner/>
                </Card>
            );
        }
        return (
            <Card>
                <CardRowSection style={styles.withoutPadding}>
                    <PageTitle style={styles.titleStyle}>Services</PageTitle>
                    {this.renderSumArticles(sumArticles)}
                </CardRowSection>
                {this.renderListServices()}
            </Card>
        );
    }
}

ServiceList.propTypes = propTypes;

export default ServiceList;