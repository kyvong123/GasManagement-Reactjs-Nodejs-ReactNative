import React, {Component} from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Platform, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import {COLOR} from '../../constants';
import SortNavbar from './SortNavBar';
import ArticleSort from './ArticleSort';
import {fetchArticles, toggleSearchBox} from '../../containers/Articles/ArticleActions';
import {queryChanged} from '../../containers/Filters/FilterActions';
import {SearchInput} from '../Common';
import { isIPhoneX } from '../../helpers/Utils';

const propTypes = {
  loading: PropTypes.bool,
  fetchArticles: PropTypes.func,
  queryChanged: PropTypes.func,
  showSearchBox: PropTypes.bool,
  query: PropTypes.object,
  isShowingSearchResult: PropTypes.bool,
  toggleSearchBox: PropTypes.func,
};
const styles = {
  container: {
    flexDirection: 'column',
    backgroundColor: COLOR.GREEN
  },
  viewStyle: {
    height: isIPhoneX()?80:60,
    backgroundColor: COLOR.GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        paddingTop: 20
      },
      android: {}
    })
  },
  leftGroupStyle: {
    padding: 15,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchGroup:{
    backgroundColor: COLOR.GREEN,
    padding: 8,
    height: 64
  }
};

class ArticleListNav extends Component {
  constructor(props){
    super(props);
    this.state= {
      modalVisible: false,
      sortBy: this.props.query.sortBy,
      order: this.props.query.order,
      // showSearchBox: this.props.showSearchBox,
      // showSearchBox: true,
      search: this.props.query.search
    };
    this.toggleSearchBox = this.toggleSearchBox.bind(this);
    this.reloadArticles = this.reloadArticles.bind(this);
    this.handleChangeSortBy = this.handleChangeSortBy.bind(this);
    this.handleChangeOrder = this.handleChangeOrder.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.renderSearchBox = this.renderSearchBox.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  // componentWillReceiveProps(nextProps){
  //   if(nextProps.showSearchBox !== this.props.showSearchBox){
  //     this.setState({
  //       showSearchBox: nextProps.showSearchBox
  //     });
  //   }
  // }
  componentDidMount(){
    // this.props.queryChanged({search: null});
  }
  // componentWillUnmount(){
    // this.props.queryChanged({search: null});
  // }
  reloadArticles(){
    const {query, loading} = this.props;
    const {sortBy, order, search} = this.state;
    if(!loading){
        query.page = 1;
        query.sortBy = sortBy;
        query.order = order;
        query.search = search;
        this.props.fetchArticles(query,{refresh: true, autoShowRefresh: true});
    }
  }
  toggleModal() {
    const modalVisible = !this.state.modalVisible;
    this.setState({ 
        modalVisible
     });
}
  handleChangeSortBy(val) {
    if(val !== this.state.sortBy){
        this.setState({
            sortBy: val
        },()=>{
            this.reloadArticles();
        });
    }
    this.toggleModal();
  }
  handleSearch = (val) =>{
    this.setState({
        search: val
    },()=>{
        this.props.queryChanged({search: val});
        this.reloadArticles();
        Keyboard.dismiss();
        if(!this.props.isShowingSearchResult){
          Actions.articleSearch();
        }
    });
  }
  handleChangeOrder(val) {
    if(val !== this.state.order){
        this.setState({
            order: val
        },()=>{
        this.reloadArticles();
        });
    }
    this.toggleModal();
  }
  handleBackClick =() =>{
    this.setState({
      search: null
    },()=>{
        this.props.queryChanged({search: null, page: 1});
        this.reloadArticles();
        Actions.pop();
    });
  }
  isShowFiber = () =>{
    const {query} = this.props;
    if( query && (
      query.status[0]&&query.status[0] !==null ||
      query.types[0]&&query.types[0] !==null ||
      query.audiences[0]&&query.audiences[0] !==null ||
      query.lastModifiedDateFrom !== null ||
      query.lastModifiedDateTo !== null 
    )){
        return true;
    } 
      return false;
    
  }
  renderLeft (){
    const { leftGroupStyle } = styles; 
    return (
        <TouchableOpacity onPress={Actions.drawerOpen}>
          <View style={leftGroupStyle}>
            <Icon size={24} color='white'>menu</Icon>
          </View>
        </TouchableOpacity>
      );
  };
  renderRight(){
    return <SortNavbar
            modalVisible={this.state.modalVisible} 
            sortBy={this.state.sortBy}
            order={this.state.order}
            showSearchButton={!this.props.isShowingSearchResult}
            toggleModal={this.toggleModal}
            handleChangeSortBy={this.handleChangeSortBy}
            handleChangeOrder={this.handleChangeOrder}
            showFiber={this.isShowFiber()}
            toggleSearchBox={this.toggleSearchBox}/>;
  };
  toggleSearchBox(){
    // const {showSearchBox} = this.state;
    // this.setState({showSearchBox: !showSearchBox});
    this.props.toggleSearchBox();
  }
  renderSearchBox(){
    const { searchGroup } = styles;
    const {showSearchBox} = this.props;
    if(!showSearchBox){
      return null;
    }
    return (
      <View style={searchGroup}>
        <SearchInput 
          handleSearch={this.handleSearch}
          handleBackClick={this.handleBackClick}
          placeholder='Search knowledge base'
          focus={false}
          showBorder={false}
          value={this.props.query.search || null}
          isShowingSearchResult={this.props.isShowingSearchResult}
          toggleSearchBox={this.toggleSearchBox}/>
      </View>
    );
  }
  render() {
    const { viewStyle, container } = styles;
    return (
      <View style={container}>
        <View style={viewStyle}>
          {this.renderLeft()}
          {this.renderRight()}
        </View>
        {this.renderSearchBox()}
      </View>
    );
  }
}

ArticleListNav.propTypes= propTypes;

// const isShowSearchBox = (services) =>{
//   if(!services || (services.length === 0)){
//     return true;
//   }
//   return false;
// };

const isShowingSearchResult = (keys) => (keys && keys.length > 0);

const mapStateToProps = (state) => ({
  loading: state.get('ArticleReducer').get('loading'),
  query: state.get('FilterReducer').toJS(),
  showSearchBox: state.get('ArticleReducer').get('showSearchBox'),
  isShowingSearchResult: isShowingSearchResult(state.get('FilterReducer').get('search'))
});
export default connect(mapStateToProps,{fetchArticles, queryChanged, toggleSearchBox})(ArticleListNav);
