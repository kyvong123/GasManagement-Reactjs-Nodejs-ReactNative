import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import pluralize from 'pluralize';
import MyWebView from 'react-native-webview-autoheight';
import moment from 'moment';
import { quillStyle, ArticleStatus } from '../../constants';

import {isSSO, hasKnowledgePermission, KnowledgePermissions} from '../../helpers/permissions';
// import AutoHeightWebView from './AutoHeightWebView';



const propTypes = {
    data: PropTypes.array,
    status: PropTypes.object,
    currentUser: PropTypes.object,
    handleAddComent: PropTypes.func
};
class ArticleContent extends Component {
    pushTitle = (source, title) => source.concat(`<h2 class="rn-article-title">${title}</h2>`);
    pushContent = (source, string) => source.concat(`<div class="rn-article-content">${string}</div>`);
    pushTag = (source, string) => source.concat(`<div class="rn-article-tags">${string}</div>`);
    pushLine = (source) => source.concat(`<div class="rn-line"></div>`);
    pushComments = (source, comments, id) => {
        source = source.concat(`<div class="rn-article-comments-total">${pluralize('comment',comments.length, true)}</div>`);
        source = this.pushCommentForm(source, id);
        const htmlComent = this.renderComments(comments);
        // console.log(htmlComent);
        return source.concat(htmlComent);
    }
    pushCommentForm = (source, id) => {
        source = source.concat(`<div class="rn-article-comment-form" id="${id}"><input type="text" name="FirstName" value="Mickey"></div>`);
        return source;
    }
    pushAttachments = (source, attachments) => {
        const htmlComent = this.renderattachments(attachments);
        // console.log(htmlComent);
        return source.concat(htmlComent);
    }
    renderHTML = (data) => {
        let htmlResult = '';
        data.map((field) => {
            const {
                id,
                value,
                comments,
                description,
                attachmentEnabled,
                attachments
            } = field;
            if(!value || (Array.isArray(value) && value.length <1 )){
                return null;
            }
            if(typeof(value)==='string'){
                htmlResult = this.pushTitle(htmlResult, description);
                htmlResult = this.pushContent(htmlResult, value);
                // push attachments
                if(attachmentEnabled && attachments && attachments.length) {
                    htmlResult = this.pushAttachments(htmlResult, attachments);
                }
                if(comments&&comments.length >= 1 && this.isCommentEnabled(field)){
                    htmlResult = this.pushComments(htmlResult, comments, id); 
                }
                htmlResult = this.pushLine(htmlResult);
            }
            if(typeof(value)==='object' && Array.isArray(value)){
                htmlResult = this.pushTitle(htmlResult, description);
                let tags = '';
                value.map(e => {
                    tags = this.pushTag(tags, e.name);
                    return e;
                });
                // TODO: add attaches and comment form
                htmlResult = this.pushContent(htmlResult, tags);
                if(comments&&comments.length >= 1 && this.isCommentEnabled(field)){
                    htmlResult = this.pushComments(htmlResult, comments, id); 
                }
                htmlResult = this.pushLine(htmlResult);
            }
            return field;
        });
        htmlResult = `<html><head><style>${quillStyle}</style></head><body style="background-color: #fff">${htmlResult}</body></html>`;
        // console.log(htmlResult);
        // return <AutoHeightWebView rawHtml={htmlResult}/>;
        return <MyWebView
                    source={{html: htmlResult}}
                    startInLoadingState={true}
                />;
    }
    renderDisplayName = (comment) => this.canDelete(comment)?'Me':comment.createdByUser.displayName
    renderComments = (comments) => {
        let result = '';// eslint-disable-line
        comments.map(comment => {
            let htmlComment = '';
            htmlComment = htmlComment.concat(`<div>${comment.content}</div>`);
            htmlComment = htmlComment.concat(`<div class="rn-comment-user">Added ${this.displayDate(comment.createdAtUTC)} by ${this.renderDisplayName(comment)}</div>`);
            result = result.concat(`<div class="rn-article-comment">${htmlComment}</div>`);
            return comment;
        });
        return `<div class="rn-article-comments">${result}</div>`;
    }
    renderattachments = (attachments) => {
        let result = '';// eslint-disable-line
        attachments.map(attachment => {
            let htmlComment = '';
            htmlComment = htmlComment.concat(`<a href="${attachment.absoluteUrl}">${attachment.fileName}</a>`);
            // htmlComment = htmlComment.concat(`<div class="rn-comment-user">Added ${this.displayDate(attachment.createdAtUTC)} by ${this.renderDisplayName(comment)}</div>`);
            result = result.concat(`<div class="rn-article-attachment">${htmlComment}</div>`);
            return attachment;
        });
        console.log('result', result);
        return `<div class="rn-article-attachments">${result}</div>`;
    }
    displayDate(date) {
        const isCurrentYear = moment(date).isSame(moment(), 'year');
        if(isCurrentYear){
            return moment(date).format("MMM D");
        }
        return moment(date).format("MMM D, YYYY");
          
    }
    canDelete(comment) {
        return (
          this.isAbleComment() &&
            comment.createdByUser.id === this.props.currentUser.id &&
            comment.createdByUser.emailAddress === this.props.currentUser.emailAddress);
        
    }
    isCommentEnabled(field) {
        return field.commentEnabled;
    }
    isDraftOrNew() {
        const status = this.props.status.id;
        return status === ArticleStatus.InProgress || status === ArticleStatus.Draft;
    }
    isValidated() {
        const status = this.props.status.id;
        return status === ArticleStatus.Validated;
    }
    isAbleComment= () =>{
        if(isSSO()) {
            return true;
        }
        if (
            this.isDraftOrNew() &&
            hasKnowledgePermission(KnowledgePermissions.COA_COMMENT_ON_IN_PROGRESS_AND_DRAFT_ARTICLES)
        ) {
            return true;
        }
        if (this.isValidated() && hasKnowledgePermission(KnowledgePermissions.COA_COMMENT_ON_VALIDATED_ARTICLES)) {
            return true;
        }
        return false;
    }
    render() {
        const {data} = this.props;
        if(!data || data.length<1){
        return null;
        }
        return (
            <View style={{flex: 1}}>
                {this.renderHTML(data)}
            </View>
        );
    }
}

ArticleContent.propTypes = propTypes;

export default ArticleContent;