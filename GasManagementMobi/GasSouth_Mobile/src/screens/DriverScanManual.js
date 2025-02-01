import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
    Button,
    WingBlank,
    Flex,
    InputItem,
    Card,
    WhiteSpace,
} from '@ant-design/react-native/lib';
import { fetchCylinder } from '../actions/CyclinderActions';
import { COLOR } from '../constants';

import { setLanguage, getLanguage } from '../helper/auth';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import CustomStatusBar from '../components/CustomStatusBar'
const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json'),
};

const chooseLanguageConfig = lgnCode => {
    let fallback = { languageTag: 'vi' };
    if (Object.keys(translationGetters).includes(lgnCode)) {
        fallback = { languageTag: lgnCode };
    }

    const { languageTag } = fallback;

    translate.cache.clear();

    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLogin: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 5,
    },
    btnErr: {
        backgroundColor: '#d9534f',
        width: width * 0.6,
        padding: 20,
        borderRadius: 6,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
    },
    btn: {
        backgroundColor: '#009347',
        width: width * 0.6,
        padding: 20,
        borderRadius: 6,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
    },
    txtButton: {
        textAlign: 'center',
        color: COLOR.WHITE,
        fontSize: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
    },
});

class DriverScanManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serial: '',
            submitted: false,

        };
    }

    componentDidMount = async () => {
        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener(
                    'change',
                    this.handleChangeLanguage(languageCode),
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener(
                'change',
                this.handleChangeLanguage(languageCode),
            );
        }
    };

    handleChangeLanguage = lgnCode => {
        //setLanguage(lgnCode);
        chooseLanguageConfig(lgnCode);
    };

    handleChange = value => {
        this.setState({ serial: value });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { serial } = this.state;
        this.setState({ submitted: true }, () => {
            if (serial) {
                const updatedSerial = serial.toUpperCase().replace(/\s/g, '');
                this.setState({ serial: '', submitted: false }, () =>
                    Actions.push('driverProductInfo', {
                        serial: [updatedSerial]
                    })
                );
            }
        });
    };
    renderError = error => {
        return (
            <WingBlank>
                <WhiteSpace size="lg" />
                <Text style={styles.txtError}>
                    {translate('PLEASE_ENTER_THE_SERIAL_CODE_TO_LOOK_UP')}.
                </Text>
            </WingBlank>
        );
    };

    renderLayout() {
        const { serial, submitted } = this.state;
        const { isLoading } = this.props;
        return (
            <Flex style={styles.container}>
                <CustomStatusBar backgroundColor="#009347" barStyle="light-content" />
                <Flex.Item>
                    <Card>
                        <Card.Header title={translate('ENTER_THE_SERIAL_CODE')} />
                        <Card.Body>
                            <InputItem
                                onChange={this.handleChange}
                                placeholder={translate('SERIAL_NUMBER')}
                                disable={isLoading ? true : false}
                                value={this.state.serial}
                            />
                            {submitted &&
                                !serial &&
                                this.renderError(translate('SERIAL_CODE_IS_REQUIRED'))}
                            <WingBlank>
                                <WhiteSpace size="lg" />
                                {isLoading ? (
                                    <ActivityIndicator size="large" color={COLOR.BLUE} />
                                ) : (
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={styles.btn}
                                            onPress={e => this.handleSubmit(e)}
                                        >
                                            <Text style={styles.txtButton}>
                                                {translate('SEARCH')}
                                            </Text>
                                        </TouchableOpacity>
                                        <WhiteSpace />
                                        <TouchableOpacity style={styles.btn} onPress={() => Actions.pop()}>
                                            <Text style={styles.txtButton}>
                                                {translate('RESCAN')}
                                            </Text>
                                        </TouchableOpacity>
                                        <WhiteSpace />
                                        <TouchableOpacity
                                            style={styles.btnErr}
                                            onPress={() =>
                                                this.props.user.hasOwnProperty('user')
                                                    ? Actions.reset('app')
                                                    : Actions.reset('application')
                                            }
                                        >
                                            <Text style={styles.txtButton}>
                                                {translate('CANCLE')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </WingBlank>
                        </Card.Body>
                    </Card>
                </Flex.Item>
            </Flex>
        );
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    {this.renderLayout()}
                </KeyboardAvoidingView>
            );
        }
        return this.renderLayout();
    }
}

export const mapStateToProps = state => ({
    isLoading: state.cylinders.loading,
    user: state.auth,
});

export default connect(mapStateToProps, { fetchCylinder })(DriverScanManual);
