import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

import { isSSO, hasKnowledgePermission, KnowledgePermissions} from '../../helpers/permissions';
import { STATUS_FIELDS, AUDIENCE_FIELDS, ArticleStatus, DATE_FORMAT, ANY_TIME } from '../../constants';
import {  BaseModal, PageTitle} from '../../components/Common';
// import ServicesFilter from '../../components/Articles/Filters/ServicesFilter';
import CheckboxFilter from '../../components/Articles/Filters/CheckboxFilter';
import DateTimeFilter from '../../components/Articles/Filters/DateTimeFilter';
import { toggleFilter, queryChanged } from '../../containers/Filters/FilterActions';
import { fetchArticles } from '../../containers/Articles/ArticleActions';
import FilterHeader from '../../components/Articles/Filters/FilterHeader';

const propTypes = {
  // serviceList: PropTypes.array,
  visibleFilter: PropTypes.object,
  articleTypes: PropTypes.array,
  toggleFilter:PropTypes.func,
  query: PropTypes.object,
  fetchArticles: PropTypes.func,
  queryChanged: PropTypes.func,
};

class ArticleFilters extends Component {
    constructor(props){
      super(props);
      this.state= {
        query: this.props.query
      };
    }
    buildStatus() {
      const status = [];

      if (
        isSSO() ||
        hasKnowledgePermission(KnowledgePermissions.VA_VIEW_IN_PROGRESS_AND_DRAFT_ARTICLES) ||
        hasKnowledgePermission(KnowledgePermissions.EA_EDIT_IN_PROGRESS_AND_DRAFT_ARTICLES)
      ) {
        status.push(STATUS_FIELDS[0]);
        status.push(STATUS_FIELDS[1]);
      }

      if (
        isSSO() ||
        hasKnowledgePermission(KnowledgePermissions.VA_VIEW_VALIDATED_ARTICLES) ||
        hasKnowledgePermission(KnowledgePermissions.EA_EDIT_VALIDATED_ARTICLES)
      ) {
        status.push(STATUS_FIELDS[2]);
      }

      if (
        isSSO() ||
        hasKnowledgePermission(KnowledgePermissions.VA_VIEW_ARCHIVED_ARTICLES) ||
        hasKnowledgePermission(KnowledgePermissions.EA_EDIT_ARCHIVED_ARTICLES)
      ) {
        status.push(STATUS_FIELDS[3]);
      }

      if (status.length === 1 && status[0].id === ArticleStatus.Validated) {
        return [];
      }

      return status;
    }
    buildTypes() {
      const types = this.props.articleTypes;
      if (types) {
        return types.filter(t => t.enable);
      }
      return [];
    }
    // hanldeServiceClick = (id) => this.handleFieldClick(id, 'services')

    handleStatusClick = (id) => this.handleFieldClick(id, 'status')

    handleTypesClick = (id) => this.handleFieldClick(id, 'types')

    handleAudienceClick = (id) => this.handleFieldClick(id, 'audiences')
    
    handleFieldClick = (id,type) => {
      const {query} = this.state;
      const field = query[type];
      if(field.includes(id)){
          const index = field.indexOf(id);
          field.splice(index, 1);
          query[type] = [...field];
          this.setState({query});
          // this.setState({query},()=>{console.log(this.state);});
      } else {
          const updatedField = [...field,id];
          query[type] = updatedField;
          this.setState({query});
          // this.setState({query},()=>{console.log(this.state);});
      }
    }
    handleClearAllClick = () => {
      const {query}= this.state;
      // query.services = [];
      query.status= [];
      query.types = [];
      query.audiences = [];
      query.lastModifiedDatePreSetting = 5;
      query.lastModifiedDateFrom = null;
      query.lastModifiedDateTo = null;
      this.setState({query});
      // this.setState({query},()=>console.log(this.state));
    }
    hadnleApplyClick = () => {
      const {query}= this.state;
      query.page = 1;
      this.props.fetchArticles(query,{refresh: true, autoShowRefresh: true});
      Actions.pop();
    }
    handleDateTimeChange = (lastModifiedDatePreSetting,lastModifiedDateFrom, lastModifiedDateTo) =>{
      // console.log('handleDateTimeChange----xxxx');
      // console.log(lastModifiedDatePreSetting,lastModifiedDateFrom, lastModifiedDateTo);
      const {query} = this.state;
      if( lastModifiedDatePreSetting === null){
        query.lastModifiedDatePreSetting = null;
        query.lastModifiedDateFrom = moment(lastModifiedDateFrom).format('YYYY-MM-DD');
        query.lastModifiedDateTo = moment(lastModifiedDateTo).format('YYYY-MM-DD');
      } else {
        query.lastModifiedDatePreSetting = lastModifiedDatePreSetting;
        query.lastModifiedDateFrom = null;
        query.lastModifiedDateTo = null;
      }
      this.setState({query});
    }

    render() {
      // console.log('render', this.state);
      if(!this.state.query){
        return null;
      }
      const status = this.buildStatus();
      const types = this.buildTypes();
      return (
          <BaseModal hideClose>
              <FilterHeader 
                handleClearAllClick={this.handleClearAllClick}
                hadnleApplyClick={this.hadnleApplyClick}
              />
              <PageTitle>Filters</PageTitle>
              <ScrollView style={{marginBottom: 20}}>
                {/* <ServicesFilter 
                  label='Service'
                  expand={this.props.visibleFilter.services}
                  toggleFilter={()=>this.props.toggleFilter('services')}
                  serviceList={this.props.serviceList}
                  selectedService={this.state.query.services}
                  hanldeServiceClick={this.hanldeServiceClick}
                /> */}
                {status.length > 1 && 
                <CheckboxFilter
                  label='Article status'
                  expand={this.props.visibleFilter.status}
                  checkboxList={status}
                  handleCheckboxClick={this.handleStatusClick}
                  selectedCheckbox={this.state.query.status}
                  toggleFilter={()=>this.props.toggleFilter('status')}
                />
                }
                <CheckboxFilter
                  label='Article type'
                  expand={this.props.visibleFilter.types}
                  checkboxList={types}
                  handleCheckboxClick={this.handleTypesClick}
                  selectedCheckbox={this.state.query.types}
                  toggleFilter={()=>this.props.toggleFilter('types')}
                />
                <CheckboxFilter
                  label='Audience'
                  expand={this.props.visibleFilter.audiences}
                  checkboxList={AUDIENCE_FIELDS}
                  handleCheckboxClick={this.handleAudienceClick}
                  selectedCheckbox={this.state.query.audiences}
                  toggleFilter={()=>this.props.toggleFilter('audiences')}
                />
                <DateTimeFilter
                  label='Last modified date'
                  expand={this.props.visibleFilter.lastModified}
                  dateFormat={DATE_FORMAT}
                  dateOptions={ANY_TIME}
                  lastModifiedDatePreSetting={this.state.query.lastModifiedDatePreSetting}
                  showCustomrange={this.state.query.lastModifiedDatePreSetting === null}
                  lastModifiedDateFrom={this.state.query.lastModifiedDateFrom}
                  lastModifiedDateTo={this.state.query.lastModifiedDateTo}
                  handleDateTimeChange={this.handleDateTimeChange}
                  toggleFilter={()=>this.props.toggleFilter('lastModified')}
                />
              </ScrollView>
          </BaseModal>
      );
    }
}

ArticleFilters.propTypes = propTypes;

const mapStateToProps = (state) => ({
  articleTypes: state.get('ArticleReducer').get('types').get('typeList').toJS(),
  visibleFilter: state.get('VisibleFilterReducer').toJS(),
  // serviceList: state.get('ServiceReducer').get('services').toJS(),
  query: state.get('FilterReducer').toJS()
});

export default connect(mapStateToProps, {toggleFilter, queryChanged, fetchArticles})(ArticleFilters);
