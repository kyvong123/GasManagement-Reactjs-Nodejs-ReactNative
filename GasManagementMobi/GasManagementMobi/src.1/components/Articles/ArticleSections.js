import React, {Component} from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import ArticleSection from './ArticleSection';

class ArticleSections extends Component {
  renderSections(){

    const {data, status} = this.props;
    return data.filter(section =>(section.id&&section.id!==40)).map(section=><ArticleSection currentUser={this.props.currentUser} data={section} status={status} key={section.id} handleAddComent={this.props.handleAddComent} handleDeleteComment={this.props.handleDeleteComment} handleToggleExpandAddComment={this.props.handleToggleExpandAddComment}/>);
  }
  render() {
    const {data} = this.props;
    if(!data || data.length<1){
      return null;
    }
    return (
      <View style={{flex: 1}}>
        {this.renderSections()}
      </View>
    );
  }
}

ArticleSections.propTypes = {
  data: PropTypes.array,
  status: PropTypes.object,
  handleAddComent: PropTypes.func,
  handleDeleteComment: PropTypes.func,
  handleToggleExpandAddComment: PropTypes.func,
  currentUser: PropTypes.object
};

export default ArticleSections;
