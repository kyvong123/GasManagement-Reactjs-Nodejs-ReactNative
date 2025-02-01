import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, InteractionManager } from 'react-native';
import { List, Card, Button, WingBlank, WhiteSpace, Flex } from '@ant-design/react-native';
// import {Picker } from '@react-native-community/picker';

import { Checkbox, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import SignatureCapture from 'react-native-signature-capture';
import { connect } from "react-redux";

import { setChecklist, getmtndate, mtdate, getallchild, getallchildSuccess } from '../actions/InspectorActions';
import { createOrder } from '../actions/OrderActions';

import { changeLanguage } from "../actions/LanguageActions";
import {
    getOrder,
    getOrderSuccess,
    getOrderFail,
} from '../actions/OrderActions';

import { withNavigationFocus } from 'react-navigation';
import { Actions } from "react-native-router-flux";
import PickerCustom from './../components/PickerCustom';
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'

const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json')
}

const chooseLanguageConfig = (lgnCode) => {
    let fallback = { languageTag: 'vi' }
    if (Object.keys(translationGetters).includes(lgnCode)) {
        fallback = { languageTag: lgnCode }
    }

    const { languageTag } = fallback

    translate.cache.clear()

    i18n.translations = { [languageTag]: translationGetters[languageTag]() }
    i18n.locale = languageTag
}

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

})

class OrderStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOrderId: '',
            error_selectedOrderId: false,
            str_orderId: 'Chưa có',
            numberCylinders: '',
            index: null
        };

        this.pickerCustomRef = React.createRef();
    }

    componentDidMount() {
        //console.log("THIS_PROPS", this.props)
        const {
            user
        } = this.props
        const orderCreatedBy = user.id

        this.props.getOrder(orderCreatedBy)
    }



    handleSubmit = () => {
        console.log("THIS_PROPS", this.props)
        const {
            user
        } = this.props
        const orderCreatedBy = user.id

        this.props.getOrder(orderCreatedBy)

    }

    render() {
        const {
            resultGetOrder
        } = this.props
        const listOrder = resultGetOrder.order

        const {
            selectedOrderId,
            error_selectedOrderId,
            str_orderId,
            numberCylinders,
            index
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
                                console.log(value.value);
                                this.setState({
                                    str_orderId: value.label,
                                    index: value.index + 1
                                })
                                console.log('INDEX', value.index)

                            }}
                        />

                        <Card>
                            <Card.Header title={translate('Order') + ':' + str_orderId} />
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
                                </WingBlank>

                                <WingBlank>
                                    <TextInput
                                        label={translate('Factory')}
                                        mode='outlined'
                                        //multiline={true}
                                        disabled={true}
                                        value={

                                            // () => {
                                            //     if (this.state.index ) {
                                            //         if (listOrder[index-1].factoryId) {
                                            //            return listOrder[index-1].factoryId.name
                                            //         }
                                            //         else {
                                            //             return ''
                                            //         }
                                            //     }
                                            //     else {
                                            //         return ''
                                            //     }
                                            // }

                                            (index && listOrder[index - 1].factoryId)
                                                ? listOrder[index - 1].factoryId.name
                                                : ""

                                        }
                                    // onChangeText={text => this.setState({ orderId: text })}
                                    />
                                </WingBlank>

                                <WingBlank>
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
                                </WingBlank>

                                <WingBlank>
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
                                </WingBlank>

                                {/* <WhiteSpace size='lg' />
                                <WingBlank>
                                <Button
                                    type="primary"
                                    onPress={this.handleSubmit}
                                >
                                    Thay đổi trạng thái đơn hàng
                                </Button>
                                </WingBlank> */}
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
    resultGetOrder: state.order.resultGetOrder
})

export default connect(
    mapStateToProps,
    { getOrder, getOrderSuccess, getOrderFail, }
)(OrderStatus)