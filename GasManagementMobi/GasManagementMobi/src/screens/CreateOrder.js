/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, InteractionManager, Alert } from 'react-native';
// import { Picker, PickerIOS } from '@react-native-community/picker';
import { List, Card, Button, WingBlank, WhiteSpace } from '@ant-design/react-native';

import { Checkbox, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import SignatureCapture from 'react-native-signature-capture';
import { connect } from "react-redux";

import { setChecklist, getmtndate, mtdate, getallchild, getallchildSuccess } from '../actions/InspectorActions';
import { createOrder } from '../actions/OrderActions';

import { changeLanguage } from "../actions/LanguageActions";

import { withNavigationFocus } from 'react-navigation';
import { Actions } from "react-native-router-flux";
import PickerCustom from './../components/PickerCustom';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';


const Item = List.Item;
const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json'),
};

const chooseLanguageConfig = (lgnCode) => {
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
    (key, config) => (config ? key + JSON.stringify(config) : key)
);


const styles = StyleSheet.create({

    txtError: {
        fontSize: 18,
        color: 'red',
    },
    btnCreate: {
        backgroundColor: "#F6921E",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    txtCreate: {
        fontSize: 18,
        textAlign: "center",
        color: 'white',
    }

});

class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            factoryId: '',
            errorFactory: false,
            nameFactory: '',
            orderId: '',
            numberCylinders: '',
            orderDate: new Date(),

            submitted: false,
        };

        this.pickerCustomRef = React.createRef();
    }



    componentDidMount() {
        const {
            user,
        } = this.props;
        const isChildOf = user.id;

        this.props.getallchild(isChildOf);
        this.setState({ submitted: false });

        // InteractionManager.runAfterInteractions(()=> {
        //     Actions.refresh({onBack:()=>this.setState({submitted: false})})
        // })
    }

    renderError = error => {
        return (
            <WingBlank>
                <WhiteSpace size="xm" />
                <Text style={styles.txtError}>{error}</Text>
            </WingBlank>
        );

    }

    handleSubmit = () => {
        const {
            orderId,
            factoryId,
            numberCylinders,
            orderDate,
            submitted,
        } = this.state;

        const {
            user,
        } = this.props;
        const createdBy = user.id;

        this.setState({ submitted: true });

        if (!(submitted && orderId && numberCylinders && factoryId)) {
            return;
        }

        if (!orderId) {
            return;
        }

        if (this.state.numberCylinders <= 0) {
            Alert.alert(
                translate('PLEASE_TRY_AGAIN'),
                translate('THE_QUANTITY_MUST_BE_INTEGER'),
                [{ text: translate('RETRY') }],
                { cancelable: false }
            );
            return;
        }

        const payload = {
            orderId,
            factoryId,
            numberCylinders,
            orderDate,
            createdBy,
        };

        this.props.createOrder(payload);
        //alert('clicked')
    }

    render() {
        const {
            factoryId,
            //nameFactory,
            errorFactory,
            orderId,
            numberCylinders,
            orderDate,
            submitted,
        } = this.state;
        const { listChildCompany } = this.props;

        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: '#FFF' }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
            >
                {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Chọn lịch bảo trì</Text>
                            <Picker
                                selectedValue={selectedMtnDate}
                                style={{ height: 50, width: 150 }}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({selectedMtnDate: MtnDate[itemIndex].idSchedule})
                                }}
                            >
                                {
                                    MtnDate ? (
                                        MtnDate.map(schedule => {
                                            return (
                                                <Picker.Item
                                                    label={schedule.maintenanceDate}
                                                    value={schedule.idSchedule}
                                                />
                                            )
                                        })
                                    ) : (
                                             <Picker.Item label='Không có lịch bảo trì' value="null" />
                                        )
                                }
                            </Picker>

                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {
                                    this.setState({modalVisible: !modalVisible});
                                }}
                            >
                                <Text style={styles.textStyle}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}


                <List renderHeader={translate('Order')}>
                    <Item>
                        <TextInput
                            label={translate('Code_orders')}
                            mode="outlined"
                            //multiline={true}
                            value={orderId}
                            onChangeText={text => this.setState({ orderId: text })}
                            theme={{
                                colors: {
                                    // placeholder: 'white',
                                    // text: 'white',
                                    // primary: 'white',
                                    // underlineColor: 'transparent',
                                    background: '#FFF',
                                },
                            }}
                        />
                        {
                            submitted && !orderId &&
                            this.renderError(translate('Enter_the_order_code'))
                        }
                    </Item>

                    <WingBlank>
                        <PickerCustom
                            placeholder={translate('CHOOSE_COMPANY')}
                            value={factoryId}
                            error={errorFactory}
                            ref={this.pickerCustomRef}
                            listItem={listChildCompany?.map(child => ({
                                value: child.id,
                                label: child.name,
                                key: child.id,
                            }))}
                            setValue={(value) => {

                                this.setState({ factoryId: value.value, errorFactory: false });
                                console.log(value.value);
                                this.setState({ nameFactory: value.label });

                            }}
                        />
                        {
                            submitted && !factoryId &&
                            this.renderError(translate('Selected_the_company'))
                        }
                    </WingBlank>

                    <Item>
                        <TextInput
                            label={translate('Amount')}
                            mode="outlined"
                            //multiline={true}
                            keyboardType="numeric"
                            value={numberCylinders}
                            onChangeText={text => this.setState({ numberCylinders: text })}
                            theme={{
                                colors: {
                                    // placeholder: 'white',
                                    // text: 'white',
                                    // primary: 'white',
                                    // underlineColor: 'transparent',
                                    background: '#FFF',
                                },
                            }}
                        />
                        {
                            submitted && !numberCylinders &&
                            this.renderError(translate('Enter_a_number'))
                        }
                    </Item>


                    <Item>
                        <TextInput
                            label={translate('Order_date')}
                            mode="outlined"
                            disabled={true}
                            multiline={true}
                            //placeholder={orderDate.toString()}
                            value={orderDate.toString()}
                            onChangeText={text => this.setState({ orderDate: text })}
                        />
                    </Item>

                </List>


                {/* <Text>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text> */}
                <WingBlank>
                    <TouchableOpacity
                        onPress={this.handleSubmit}
                        style={styles.btnCreate}
                    >
                        <Text style={styles.txtCreate}>{translate('CREATE_ORDER')}</Text>
                    </TouchableOpacity>
                </WingBlank>

            </ScrollView>
        );
    }

}


export const mapStateToProps = state => ({
    user: state.auth.user,
    listChildCompany: state.inspector.listChildCompany,
});

export default connect(
    mapStateToProps,
    { getallchild, getallchildSuccess, createOrder }
)(CreateOrder);
