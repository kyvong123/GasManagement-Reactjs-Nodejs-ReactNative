import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import pluralize from 'pluralize';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import moment from 'moment';
  
import { Confirm } from '../Common';
import {COLOR} from '../../constants';

  const styles = {
    wrapperStyle: {
        flex: 1
    },
    commentContainerStyle:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    commentTextStyle:{
        paddingTop: 10,
        color: COLOR.GREEN,
        fontSize: 14
    },
    commentWrapperStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding:10,
        paddingLeft: 0,
        paddingRight: 0
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHTGRAY
    },
    menuStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    infoStyle:{
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    nameStyle:{
        paddingBottom: 0,
        fontSize: 12,
        color: COLOR.GRAY
    },
    dateStyle:{
        paddingBottom: 0,
        fontSize: 12,
        color: COLOR.GRAY
    },
    commentDetail: {
        paddingBottom: 10,
        fontSize: 14,
        color: COLOR.LIGHTBLACK
    }
};
const propTypes = {
    comments: PropTypes.array,
    handleDeleteComment: PropTypes.func,
    fieldId: PropTypes.number,
    isAbleComment: PropTypes.func,
    currentUser: PropTypes.object
};
class ArticleComments extends Component {
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            activeComment: null
        };
    }
    handleDeleteComment = (comment) =>{
        this.setState({
            activeComment: comment
        },()=>{
            this.toogleModal();
        });
    }
    deleteComment = () =>{
        const {fieldId} = this.props;
        this.props.handleDeleteComment(fieldId,this.state.activeComment);
        this.toogleModal();
    }
    toogleModal = () =>{
        const updatedShowModal = !this.state.showModal;
        this.setState({showModal: updatedShowModal});
    }
    canDelete(comment) {
        return (
          this.props.isAbleComment() &&
            comment.createdByUser.id === this.props.currentUser.id &&
            comment.createdByUser.emailAddress === this.props.currentUser.emailAddress);
        
      }
    renderDisplayName(comment){
        const displayName = this.canDelete(comment)?'Me':comment.createdByUser.displayName;
        return (
            <Text style={styles.nameStyle}>{displayName}</Text>
        );
    }
    renderDisplayDate(date) {
        const isCurrentYear = moment(date).isSame(moment(), 'year');
        if(isCurrentYear){
            return (<Text style={styles.dateStyle}>Added {`${moment(date).format("MMM D")}`} by </Text>);
        }
        return (<Text style={styles.dateStyle}>Added {`${moment(date).format("MMM D, YYYY")}`} by </Text>);
          
    }
    renderComment(comment, isLastComment){
        if(!comment || comment.status.id !== 11){
            return null;
        }
        return (
            <View style={[styles.commentWrapperStyle,
                isLastComment ? null :styles.borderBottom
            ]} key={comment.id}>
                <View style={styles.infoStyle}>
                    <Text style={styles.commentDetail}>{comment.content}</Text>
                    <View style={{flexDirection: 'row'}}>
                        {this.renderDisplayDate(comment.createdAtUTC)}
                        {this.renderDisplayName(comment)}
                    </View>
                    
                </View>

                {this.canDelete(comment)&&<View style={{width: 30}}>
                <Menu>
                        <MenuTrigger>
                            <Icon size={24} color='gray'>more_vert</Icon>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={()=>this.handleDeleteComment(comment)} style={styles.menuStyle}>
                                <Icon style={{paddingRight: 16}} size={24} color='gray'>delete</Icon>
                                <Text>Delete</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>}
            </View>
        );
    }
    render() {
        const {comments}  = this.props;
        if(!comments || (comments.length < 1)){
            return  null;
        }
        return (
            <View style={styles.wrapperStyle} >
                <TouchableOpacity style={styles.commentContainerStyle} onPress={()=>console.log('xxx')}>
                    <Text style={styles.commentTextStyle}>
                    {`${comments.length} ${pluralize('comment',comments.length)}`}
                    </Text>
                </TouchableOpacity>
                <View>
                    {Array.isArray(comments) ? comments.map((comment, index) => this.renderComment(comment,index === (comments.length-1))) : this.renderComment(comments)}
                </View>
                <Confirm 
                    onAccept={this.deleteComment} 
                    onDecline={this.toogleModal} 
                    visible={this.state.showModal}
                    acceptText='DELETE'
                    declineText='CANCEL'
                    >
                        Delete comment?
                    </Confirm>
            </View>
        );
    }
}

ArticleComments.propTypes = propTypes;

export default ArticleComments;