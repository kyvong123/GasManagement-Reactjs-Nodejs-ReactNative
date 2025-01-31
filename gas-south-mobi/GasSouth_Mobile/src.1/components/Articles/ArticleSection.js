import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import pluralize from 'pluralize';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import HTMLView from 'react-native-htmlview';
// import DisplayHTML from 'react-native-display-html';

import {COLOR, ArticleStatus} from '../../constants';
import AutoHeightWebView from './AutoHeightWebView';
import { CardRowSection, Heading} from '../Common';
import * as quillStyle from './quill';
import {isSSO, hasKnowledgePermission, KnowledgePermissions} from '../../helpers/permissions';
import ArticleCommentForm from './ArticleCommentForm';
import ArticleComments from './ArticleComments';

const styles = {
    containWrapper: {
        paddingTop: 19,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    commentButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    commentButtonTextStyle: {
        color: COLOR.LIGHTBLACK,
        marginLeft: 8

    }
};
class ArticleSection extends Component {
    renderContent(value){
        if(typeof(value)==='string'){
            value=`<html><head><style>${quillStyle}</style></head><body>${value}</body></html>`;
            return <AutoHeightWebView rawHtml={value}/>;
        }
        if(typeof(value)==='object' && Array.isArray(value)){
            let tags = [];
            value.forEach(tag=>{
                if(tag&&tag.name){
                    tags.push(tag.name);
                }
            });
            tags = tags.join(" ");
            if(tags){
                return <Text>{tags}</Text>;
            }
        }
        return null;
    }

    renderComments = () =>{
        const {comments, id} = this.props.data;
        return <ArticleComments currentUser={this.props.currentUser} isAbleComment={this.isAbleComment} comments={comments} fieldId={id} handleDeleteComment={this.props.handleDeleteComment} />; 
    }
    isCommentEnabled() {
        if (this.props.data.commentEnabled) {
            return true;
        }
        return false;
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
        if (!this.isCommentEnabled()) {
            return false;
        }
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

    handleToggleExpandAddComment () {
        this.props.handleToggleExpandAddComment(this.props.data.id);
    }

    renderCommentToggle(expandAddComment){
        const iconToggle = expandAddComment?'indeterminate_check_box':'add_box';
        return (
            <TouchableOpacity style={styles.commentButtonStyle} onPress={this.handleToggleExpandAddComment.bind(this)}>
            <Icon size={24} color={COLOR.LIGHTBLACK}>{iconToggle}</Icon>
                <Text style={styles.commentButtonTextStyle}>
                    Comment
                </Text>
                </TouchableOpacity>
        );
    }
    renderCommentForm(){
        return <ArticleCommentForm fieldId={this.props.data.id} handleAddComent={this.props.handleAddComent}/>;
    }
    render() {
        const {data} = this.props;
        
        if(!data.value || (Array.isArray(data.value) && data.value.length <1 )){
            return null;
        }
        // console.log('data', data);
        return (
            <View style={styles.containWrapper}>
                <CardRowSection>
                    <Heading>{data.description}</Heading>
                </CardRowSection>
                <CardRowSection>
                    {this.renderContent(data.value)}
                </CardRowSection>
                <CardRowSection style={{paddingBottom: 0}}>
                    {this.renderComments()}
                </CardRowSection>
                {this.isAbleComment()?(
                    <View>
                        <CardRowSection>
                            {this.renderCommentToggle(data.expandAddComment)}
                        </CardRowSection>
                        {data.expandAddComment?(
                            <CardRowSection>
                            {this.renderCommentForm()}
                            </CardRowSection>    
                        ): null}
                        

                    </View>
                    
                ):  null}
            </View>
        );
    }
}

ArticleSection.propTypes = {
    data: PropTypes.object,
    handleAddComent: PropTypes.func,
    handleDeleteComment: PropTypes.func,
    handleToggleExpandAddComment: PropTypes.func,
    status: PropTypes.object,
    currentUser: PropTypes.object
};

export default ArticleSection;