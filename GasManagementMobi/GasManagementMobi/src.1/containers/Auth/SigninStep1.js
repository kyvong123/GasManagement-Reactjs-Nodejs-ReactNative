import React, { Component } from 'react';
import { View, Text, Keyboard, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { emailChanged, 
    getTernantsByEmail } from './AuthActions';
import { COLOR } from '../../constants';

import withNetInfo from '../../helpers/withNetinfo';
import { getEmail } from '../../helpers/Auth'

import { Card,
    CardRowSection,
    Spinner, 
    CardColumnSection, 
    Input, 
    Button,
    ErrorMessage,
    TextButton,
    PageTitle } from '../../components/Common';
import { validateEmail } from '../../helpers/Utils';

const propTypes = {
    emailAddress: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool,
    emailChanged: PropTypes.func,
    getTernantsByEmail: PropTypes.func,
    isConnected: PropTypes.bool,
    navigation:  PropTypes.object
};
const styles = {
    helpSectionStyle:{
        position: 'absolute',
        padding: 5,
        bottom: 0
    },
    withoutPadding: {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    titleStyle: {
        backgroundColor: COLOR.WHITE
    },
    textStyle: {
        paddingBottom: 11
    }
};
class SigninStep1 extends Component {
    constructor(props){
        super(props);
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.handleSigninHelp = this.handleSigninHelp.bind(this);
        this.state = {
            error: this.props.error
        };
    }
    componentDidMount(){
        getEmail().then(email => {
            if(email){
                this.props.emailChanged(email);
            }
        });
    }
    componentWillReceiveProps(nextprops){
        const {error} = nextprops;
        if(error !== this.state.error){
            this.setState({
                error
            });
        }
    }
    handlePress(){
        const {emailAddress} =this.props;
        if(validateEmail(emailAddress)){
            Keyboard.dismiss();
            this.props.getTernantsByEmail(emailAddress);
        } else {
            this.setState({
                error: 'Please enter a valid email address.'
            }); 
        }
    }
    handleSigninHelp(){

    }
    onEmailChanged(text){
        this.props.emailChanged(text);
    }
    renderButton(){
        const { loading, emailAddress }  =this.props;
        if (loading) {
            return <Spinner size="large" />;
        }

      
        return (
            <Button onPress={this.handlePress} disabled={!emailAddress}>
                Next
            </Button>
        );
    }
    render() {
        const { emailAddress } = this.props;
        const {  error } = this.state;
        const { helpSectionStyle} = styles;

        return (
            <Card>
                <CardColumnSection style={styles.withoutPadding}>
                    <PageTitle style={styles.titleStyle}>Sign in</PageTitle>
                </CardColumnSection>
                <CardColumnSection>
                    <Text style={styles.textStyle}>Enter your email address to continue</Text>
                </CardColumnSection>

                <CardColumnSection>
                    <Input 
                        placeholder='Email address'
                        keyboardType="email-address"
                        value={emailAddress}
                        type={error !== '' ? 'error': ''}
                        onChangeText={this.onEmailChanged}
                        autoCorrect={false}
                        autoCapitalize='none'></Input>
                    {error !== '' && <ErrorMessage>{error}</ErrorMessage>}
                </CardColumnSection>
                <CardRowSection style={{paddingTop: 10}}>
                    {this.renderButton()}
                </CardRowSection>
                <CardRowSection style={helpSectionStyle}>
                    <TextButton>Need help signing in?</TextButton>
                </CardRowSection>
            </Card>
        );
    } 
}
SigninStep1.propTypes = propTypes;

const mapStateToProps = (state) => ({
    emailAddress: state.get('AuthReducer').get('emailAddress'),
    loading: state.get('AuthReducer').get('loading'),
    error: state.get('AuthReducer').get('error'),
    success: state.get('AuthReducer').get('success')
});

export default connect(mapStateToProps, {emailChanged, getTernantsByEmail} )(withNetInfo(SigninStep1));
