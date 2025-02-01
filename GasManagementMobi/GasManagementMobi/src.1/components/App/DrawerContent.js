import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, ViewPropTypes, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { getTernant } from '../../helpers/Auth';

import {Button, CardRowSection, Card, TextButton} from '../../components/Common';
import {logOut, switchDomain} from '../../containers/Auth/AuthActions';
import CompanyInfo from './CompanyInfo';
import DrawerItems from './DrawerItems';
import TernantList from './TernantList';
import { COLOR } from '../../constants';
import { isIPhoneX } from '../../helpers/Utils';

const propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    logOut: PropTypes.func,
    metaData: PropTypes.object,
    loading: PropTypes.bool
  };
const styles = {
  withoutPadding: {
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  versionStyle: {
    position:'absolute',
    bottom: 16,
    left: 0
  },
  textVersionStyle:{
    flex: 1,
    textAlign: 'center'
  },
  iconStyle: {
    marginLeft: 'auto'
  },
  textDomainStyle:{
    color: COLOR.LIGHTBLACK,
    fontSize: 14
  }

};
class DrawerContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      showDomainList: false,
      logoSize:null
    };
  }


  componentWillReceiveProps(nextProps) {
    if(this.props.metaData !== nextProps.metaData) {
      const { companyLogo } = nextProps.metaData;
      if (companyLogo){
        Image.getSize(companyLogo, (width, height) => {
          this.setImageSize(width, height);
        });
      }
    }
  }

  setImageSize(width, height){
    this.setState(prevState => ({...prevState, logoSize:{
      width,
      height
    }}));
  }


  renderDomainList = () =>{
    
      const ternantsExcludeCurrent = this.props.ternants.filter(ternant => ternant.domain !== this.props.ternant);
      const { switchDomain } = this.props;
      return(
        <TernantList ternants={ternantsExcludeCurrent} handleSwitchDomain= {switchDomain} />
      );
      
  }
  renderIcon = ()=>{
    const {showDomainList} = this.state;
    if(showDomainList){
     return <Icon style={styles.iconStyle} size={24}>arrow_drop_up</Icon>;
    }
    return <Icon style={styles.iconStyle} size={24}>arrow_drop_down</Icon>;
  }
  toggleDomainList=()=>{
    this.setState((preState)=>({...preState,
        showDomainList: !preState.showDomainList}));
  }
  render() {
    const { loading, metaData, ternant } = this.props;
    const {showDomainList, logoSize} = this.state;

    return (
      <Card>
        <CardRowSection style={ isIPhoneX()?{paddingTop: 25}: null}>
          <CompanyInfo loading={loading} metaData={metaData} logoSize={logoSize}/>
        </CardRowSection>
        {/* //TODO: update drawer */}
        <CardRowSection style={styles.withoutPadding}>
          <TouchableOpacity style={{flex: 1, flexDirection: 'row',paddingBottom: 10, paddingLeft: 16, paddingRight: 16,borderBottomWidth: 1,borderColor: 'gray'}} onPress={this.toggleDomainList}>
            <Text style={styles.textDomainStyle}>{ternant}</Text>
            {this.renderIcon()}
          </TouchableOpacity>
        </CardRowSection>
        {!showDomainList&&<CardRowSection style={styles.withoutPadding}>
          <DrawerItems/>
        </CardRowSection>}
        {!showDomainList&&<CardRowSection style={styles.versionStyle}>
          <Text style={styles.textVersionStyle}>v.1.38</Text>
        </CardRowSection>}
        {showDomainList && this.renderDomainList()}
      </Card >
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.get('AuthReducer').get('serverData').get('loading'),
  metaData: state.get('AuthReducer').get('serverData').get('metaData').toJS(),
  ternants: state.get('AuthReducer').get('ternants').toJS(),
  ternant: state.get('AuthReducer').get('ternant')
});

DrawerContent.propTypes = propTypes;
export default connect(mapStateToProps,{switchDomain})(DrawerContent);