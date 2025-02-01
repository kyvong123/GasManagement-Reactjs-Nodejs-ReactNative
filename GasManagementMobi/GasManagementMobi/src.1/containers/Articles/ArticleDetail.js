import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';

import withNetInfo from '../../helpers/withNetinfo';
import { fetchArticle, postArticleComment, deleteArticleComment, toggleExpandAddComment } from './ArticleActions';
// TODO: move to index
import {ArticleTags, ArticleSections, ArticleService, ArticleContent} from '../../components/Articles/';
import { Card, CardColumnSection, PageTitle, Spinner,  Toast} from '../../components/Common';

const propTypes = {
    fetchArticle: PropTypes.func,
    article: PropTypes.object,
    loading: PropTypes.bool,
    navigation: PropTypes.object,
    postArticleComment: PropTypes.func,
    deleteArticleComment: PropTypes.func,
    currentUser: PropTypes.object
};
const styles = {
    withoutPadding: {
      padding: 0,
      paddingLeft: 0,
      paddingRight: 0
    }
  };
class Articles extends Component {
    // componentDidMount(){
    //     const {id} = this.props.navigation.state.params;
    //     if(id){
    //         console.log('load detail: ',id);
    //         this.props.fetchArticle(id);
    //     }
    // }
    // componentWillUnmount(){
    //     console.log('detail unmount');
    // }
    renderEmtyContent(){
        return (
            <Card>
                <CardColumnSection style={styles.withoutPadding}>
                    <PageTitle>Your article's detail is emty</PageTitle>
                </CardColumnSection>
            </Card>
        );
    }
    caculateTags(article){
        const result = {
            'Article ID': article.id || null,
            'Article type': article.articleType && article.articleType.description || null ,
            'Status': article.status && article.status.description || null,
            'Audience':article.audience && article.audience.description || null,
            'Service':article.service && article.service.name || null,
            'Priority':article.priority && article.priority.name || null,
            'FCR': article.fcr && article.fcr.description || null
        };
        return result;
    }
    handleAddComent = (fieldId,comment) => {
        // console.log(fieldId, comment);
        const {id} = this.props.article;
        if(id && fieldId && comment ){
            this.props.postArticleComment(id, fieldId, comment);
        }
    }
    handleDeleteComment = (fieldId,comment) => {
        console.log(fieldId, comment);
        const {id} = this.props.article || '';
        if(id && fieldId && comment ){
            console.log(id, fieldId, comment);
            this.props.deleteArticleComment(id, fieldId, comment.id);
        }
    }
    // renderHeader = (services)=><ArticleService services={services}/>
    renderArticlesDetail(){
        const {article} = this.props;
        // const {service} = article;
        return (
            <ScrollView>
                {/* {this.renderHeader([service])} */}
                <CardColumnSection style={styles.withoutPadding}>
                    <PageTitle>{article.title}</PageTitle>
                </CardColumnSection>
                {/* <ArticleSections 
                    currentUser={this.props.currentUser} 
                    data={article.fields} 
                    status={article.status} 
                    handleAddComent={this.handleAddComent.bind(this)} 
                    handleDeleteComment={this.handleDeleteComment.bind(this)} 
                    handleToggleExpandAddComment={this.props.toggleExpandAddComment}
                /> */}
                <ArticleContent
                    currentUser={this.props.currentUser} 
                    data={article.fields} 
                    status={article.status} 
                    handleAddComent={this.handleAddComent} 
                />
                <ArticleTags data={this.caculateTags(article)}/>
            </ScrollView>
        );
    }
    renderContent(){
        const {article,loading} = this.props;
        if(loading){
            return <Spinner size='large'/>;
        }
        if(isEmpty(article)){
            return this.renderEmtyContent();
        }
        return this.renderArticlesDetail();
    }
    render() {
        return (
            <Card>
                <Toast/>
                {this.renderContent()}
            </Card>
        );
    }
}

Articles.propTypes = propTypes;

const mapStateToProps = (state) => ({
    article: state.get('ArticleReducer').get('article').toJS(),
    query: state.get('FilterReducer').toJS(),
    loading: state.get('ArticleReducer').get('loading'),
    currentUser: state.get('AuthReducer').get('userInfo').toJS()
});

export default connect(mapStateToProps, {fetchArticle, postArticleComment, deleteArticleComment, toggleExpandAddComment})(withNetInfo(Articles));