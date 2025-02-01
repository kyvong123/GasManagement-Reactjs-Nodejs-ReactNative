import React, { Component } from 'react';
import { Text, Keyboard, TouchableHighlight, View, Platform } from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import ENV_VARIABLES from '../../config';
import {
  Card, 
  Spinner,
  CardColumnSection, 
  CardRowSection, 
  Input, 
  Button,
  TextButton,
  PageTitle} from '../../components/Common';
import {COLOR} from '../../constants';

import withNetInfo from '../../helpers/withNetinfo';
import { loginUser } from './AuthActions';
import { removeSpace } from '../../helpers/Utils';
import TernantModal from '../../components/Auth/TernantModal';

const propTypes = {
  loginUser: PropTypes.func,
  ternants: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emailAddress: PropTypes.string,
  isConnected: PropTypes.bool,
  navigation: PropTypes.object
};
const styles = {
  errorTextStyle: {
    fontSize: 14,
    // alignSelf: 'center',
    color: COLOR.RED
  },
  helpSectionStyle:{
      position: 'absolute',
      padding: 5,
      bottom: 0
  },
  ternantTextStyle: {
    paddingBottom: 16
  },
  dropDownStyle: {
    height: 40,
    padding: 10,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: COLOR.LIGHTGRAY,
    justifyContent: 'center',
    position: 'relative'
  },
  dropDownIconStyle: {
    position: 'absolute',
    right: 10
  },
  withoutPadding: {
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  titleStyle: {
    backgroundColor: COLOR.WHITE
  },
  emailStyle: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 11
  },
  textBold: {
    fontWeight: 'bold'
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        height: 40,
        padding: 2
      },
      android: {
        height: 48,
      },
    })
  }
};
class SigninStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password:'',
      emailAddress: removeSpace(this.props.emailAddress),
      error: '',
      modalVisible: false,
      selectedOption: 0
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
      const modalVisible = !this.state.modalVisible;
      this.setState({ modalVisible });
  }
  componentWillReceiveProps(nextprops){
    const {error} = nextprops;
    if(error !== this.state.error){
      this.setState({
        error
      });
    }
  }
  handleLogin(){
    const { emailAddress, password, selectedOption} = this.state;
    Keyboard.dismiss();
    if(emailAddress && password ){
      const ternant = this.props.ternants[selectedOption].domain;
      this.props.loginUser(ternant, emailAddress, password);
    }
  }
  onPasswordChange(text){
    this.setState({
      error: '',
      password: text
    });
  }
  handleChangeOption(val) {
    this.setState({
      selectedOption: val
    },()=>{
      this.toggleModal();
    });
  }
  renderButton(){
    if (this.props.loading) {
        return <Spinner size="large" />;
    }
    
    return (
      <View style = {styles.buttonGroup}>
        <View style={{flex: 1, paddingRight: 4}}>
          <Button type="secondary" onPress={Actions.pop}>
              Back
          </Button>
        </View>
        <View style={{flex: 1, paddingLeft: 4}}>
          <Button onPress={this.handleLogin} disabled={!this.state.password}>
              Sign in
          </Button>
        </View>
      </View>
    );
  }
  renderDropDown(ternants){
    const {selectedOption, emailAddress} =this.state;
    return (
      <View>
        <CardColumnSection style={styles.withoutPadding}>
          <PageTitle style={styles.titleStyle}>Sign in</PageTitle>
          <Text style={styles.emailStyle}>with <Text style={styles.textBold}>{emailAddress}</Text></Text>
        </CardColumnSection>
        <CardColumnSection>
          <Text style={styles.ternantTextStyle}>Choose a domain to which you want to sign in</Text>
          <TernantModal 
          visible={this.state.modalVisible} 
          toggleModal={this.toggleModal} 
          options={ternants}
          selectedOption={selectedOption}
          handleChangeOption={this.handleChangeOption}
          />
          
          <TouchableHighlight onPress = {this.toggleModal}>
            <View style={styles.dropDownStyle}>
              <Text style = {styles.text}>{ternants[selectedOption].domain}</Text>
              <Icon size={20} color='blue' style={styles.dropDownIconStyle}>arrow_drop_down</Icon>
            </View>
          </TouchableHighlight>
        </CardColumnSection>
      </View>
    );
  }
  render() {
    const {ternants} = this.props;
    const { emailAddress, error} =this.state;
    return (
      <Card>
          {ternants && (ternants.length === 1) &&
            <CardColumnSection style={styles.withoutPadding}>
              <PageTitle style={styles.titleStyle}>Sign in</PageTitle>
              <Text style={styles.emailStyle}>to <Text style={styles.textBold}>{ternants[0].domain}</Text> with <Text style={styles.textBold}>{emailAddress}</Text></Text>
            </CardColumnSection>
          }
          {ternants && (ternants.length > 1) &&
            this.renderDropDown(ternants)
          }
          <CardColumnSection>
            <Input 
                placeholder='Your password'
                secureTextEntry={true}
                onChangeText={this.onPasswordChange}
                />
          </CardColumnSection>

          {error !== '' && 
          <CardRowSection>
            <Text style={styles.errorTextStyle}>
                {error}
            </Text>
          </CardRowSection>}

          <CardRowSection style={{paddingTop: 10}}>
            {this.renderButton()}
          </CardRowSection>
          <CardRowSection style={styles.helpSectionStyle}>
              <TextButton>Forgot password?</TextButton>
          </CardRowSection>
      </Card>
    );
  }
};
SigninStep2.propTypes = propTypes;

const getTernant = (ternants) => ternants.reduce((prev, curr, index) => {
      if(curr && curr.domain){
      curr.key = index;
      return prev.concat(curr);
    }
    return prev;
  },[]);
const mapStateToProps = state => ({
  emailAddress: state.get('AuthReducer').get('emailAddress'),
  ternants: getTernant(state.get('AuthReducer').get('ternants').toJS()),
  loading: state.get('AuthReducer').get('loading'),
  error: state.get('AuthReducer').get('errorStep2')
});

export default connect(mapStateToProps,{loginUser})(withNetInfo(SigninStep2));
