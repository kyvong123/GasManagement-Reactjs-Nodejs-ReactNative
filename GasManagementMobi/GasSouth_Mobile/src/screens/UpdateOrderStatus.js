import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, InteractionManager } from 'react-native';
// import {Picker } from '@react-native-community/picker';
import { List, Card, Button, WingBlank, WhiteSpace, Flex } from '@ant-design/react-native';

import { Checkbox, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import SignatureCapture from 'react-native-signature-capture';
import { connect } from "react-redux";

import { setChecklist, getmtndate, mtdate, getallchild, getallchildSuccess } from '../actions/InspectorActions';
import { createOrder } from '../actions/OrderActions';
import { setLanguage, getLanguage } from '../helper/auth';
import * as RNLocalize from 'react-native-localize';

import { changeLanguage } from "../actions/LanguageActions";
import {
    getOrderFactory,
    updateOrderStatus,
    updateOrderStatusSuccess,
    updateOrderStatusFail,
} from '../actions/OrderActions';

import { withNavigationFocus } from 'react-navigation';
import { Actions } from "react-native-router-flux";
import PickerCustom from './../components/PickerCustom';
import { transform } from 'lodash';
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { color } from 'react-native-reanimated';
import { COLOR } from '../constants';

const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json')
};

const chooseLanguageConfig = (lgnCode) => {
    let fallback = { languageTag: 'vi' }
    if (Object.keys(translationGetters).includes(lgnCode)) {
        fallback = { languageTag: lgnCode }
    }

    const { languageTag } = fallback

    translate.cache.clear()

    i18n.translations = { [languageTag]: translationGetters[languageTag]() }
    i18n.locale = languageTag
};

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const Item = List.Item;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    txtError: {
        fontSize: 18,
        color: 'red',
    },
    styleBtn: {
        backgroundColor: "#009347",
        padding: 20,
        borderRadius: 6,
    },
    styleBtnCancel: {
        backgroundColor: "#d9534f",
        padding: 20,
        borderRadius: 6,
    },
    textBtn: {
        textAlign: "center",
        color: COLOR.WHITE,
        fontSize: 18,
    }
})

class UpdateOrderStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOrderId: '',
            error_selectedOrderId: false,
            str_orderId: '',
            numberCylinders: '',
            index: null,
            submitted: false
        };

        this.pickerCustomRef = React.createRef();
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

    componentWillMount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener(
                'change',
                this.handleChangeLanguage(languageCode),
            );
        }
        //console.log("THIS_PROPS", this.props)
        const {
            user
        } = this.props
        const orderFactory = user.id

        this.props.getOrderFactory(orderFactory);
    };

    handleChangeLanguage = lgnCode => {
        //setLanguage(lgnCode);
        chooseLanguageConfig(lgnCode);
    };


    handleSubmit = (status) => {
        const {
            selectedOrderId
        } = this.state

        const {
            user
        } = this.props
        const orderUpdatedBy = user.id

        const payload = {
            updatedBy: orderUpdatedBy,
            orderStatus: status,
            orderId: selectedOrderId
        }

        this.setState({ submitted: true })

        if (!selectedOrderId) {
            return
        }

        this.props.updateOrderStatus(payload)
        //alert('clicked')
    }

    renderError = error => {
        console.log(error)
        return (
            <WingBlank>
                <WhiteSpace size="xm" />
                <Text style={styles.txtError}>{error}</Text>
            </WingBlank>
        )

    }

    render() {
        const {
            result_getOrderFactory
        } = this.props
        const listOrder = result_getOrderFactory.orderFactory

        const {
            selectedOrderId,
            error_selectedOrderId,
            str_orderId,
            numberCylinders,
            index,
            submitted
        } = this.state

        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
            >
                <Flex style={styles.container}>
                    <Flex.Item>

                        <PickerCustom
                            placeholder={translate('Select_the_order_code')}
                            value={selectedOrderId}
                            error={error_selectedOrderId}
                            ref={this.pickerCustomRef}
                            listItem={listOrder?.map(order => ({
                                value: order.id,
                                label: order.orderId,
                                key: order.id
                            }))}
                            setValue={(value) => {

                                this.setState({ selectedOrderId: value.value, errorFactory: false })
                                this.setState({
                                    str_orderId: value.label,
                                    index: value.index + 1
                                })

                            }}
                        />
                        {
                            submitted && !selectedOrderId &&
                            this.renderError(translate('No_orders_elected'))
                        }

                        <Card>
                            <Card.Header title={str_orderId ? translate('Order') + ':' + str_orderId : translate('Select_order_above')} />
                            <Card.Body>
                                <WingBlank>
                                    <TextInput
                                        label={translate('Amount')}
                                        mode='outlined'
                                        //multiline={true}
                                        disabled={true}
                                        value={
                                            index ? listOrder[index - 1].numberCylinders : ""
                                        }
                                    // onChangeText={text => this.setState({ orderId: text })}
                                    />

                                    <TextInput
                                        label={translate('Factory')}
                                        mode='outlined'
                                        multiline={true}
                                        disabled={true}
                                        value={
                                            index ? listOrder[index - 1].factoryId.name : ""
                                        }
                                    // onChangeText={text => this.setState({ orderId: text })}
                                    />

                                    <TextInput
                                        label={translate('Order_date')}
                                        mode='outlined'
                                        //multiline={true}
                                        disabled={true}
                                        value={
                                            index ? listOrder[index - 1].orderDate : ""
                                        }
                                    // onChangeText={text => this.setState({ orderId: text })}
                                    />

                                    <TextInput
                                        label={translate('ORDER_STATUS')}
                                        mode='outlined'
                                        //multiline={true}
                                        disabled={true}
                                        value={
                                            index ? listOrder[index - 1].status : ""
                                        }
                                    // onChangeText={text => this.setState({ orderId: text })}
                                    />

                                    <WhiteSpace size='lg' />
                                    <WingBlank>
                                        <TouchableOpacity
                                            style={styles.styleBtn}
                                            onPress={() => this.handleSubmit(translate('Receive'))}
                                        >
                                            <Text style={styles.textBtn}>{translate('Receive')}</Text>
                                        </TouchableOpacity>
                                    </WingBlank>

                                    <WhiteSpace size='lg' />
                                    <WingBlank>
                                        <TouchableOpacity
                                            style={styles.styleBtn}
                                            onPress={() => this.handleSubmit(translate('Transport'))}
                                        >
                                            <Text style={styles.textBtn}>{translate('Transport')}</Text>
                                        </TouchableOpacity>
                                    </WingBlank>

                                    <WhiteSpace size='lg' />
                                    <WingBlank>
                                        <TouchableOpacity
                                            style={styles.styleBtnCancel}
                                            onPress={() => this.handleSubmit(translate('CANCLE'))}
                                        >
                                            <Text style={styles.textBtn}>{translate('CANCLE')}</Text>
                                        </TouchableOpacity>
                                    </WingBlank>
                                </WingBlank>
                            </Card.Body>
                        </Card>
                    </Flex.Item>
                </Flex>

            </ScrollView>
        )
    }
}

export const mapStateToProps = state => ({
    user: state.auth.user,
    result_getOrderFactory: state.order.result_getOrderFactory
})

export default connect(
    mapStateToProps,
    {
        getOrderFactory,
        updateOrderStatus, updateOrderStatusSuccess, updateOrderStatusFail,
    }
)(UpdateOrderStatus)