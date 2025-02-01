import React, { Component } from "react";
import { connect } from "react-redux";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    Alert,
    Platform,
    TouchableOpacity, Picker, PickerIOS
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
    Button,
    WingBlank,
    Flex,
    Card,
    WhiteSpace,
    InputItem
} from "@ant-design/react-native/lib";
import { updateCylinders, typeForPartner } from "../actions/CyclinderActions";
import { fetchUsers, fetchUsersTypeForPartner, getListDriver } from "../actions/AuthActions";
import { COLOR } from "../constants";
import { destinationList } from "../helper/selector";
import saver from '../utils/saver';
import {
    AGENCY,
    EXPORT,
    FACTORY, FIXER,
    GENERAL,
    IMPORT,
    STATION, TO_FIX,
    TURN_BACK
} from '../types';
import MultiSelect from "react-native-multiple-select";
import PickerCustom from './../components/PickerCustom';

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    txtError: {
        fontSize: 18,
        color: COLOR.RED,
    },
    to: {
        width: "100%",
    },
    btnFinish: {
        backgroundColor: "#F6921E",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    txtFinish: {
        fontSize: 18,
        textAlign: "center",
        color: 'white',
    }
});

const PickerItem = Platform.OS === 'ios' ? PickerIOS.Item : Picker.Item;

class ShipperTypeforPartner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            driver: "",
            idDriver: "",
            //errorDriver : false,
            license_plate: "",
            addressCustomer: "",
            nameCustomer: "",
            to: "",
            submitted: false,
            selectedItems: [],
            selectedItemsFullInfo: [],
            numberArrays: [],
            total: 0,
            phoneCustomer: "",
            numberOfCylinder: "",
            selectItemTotal: [],
            cylindersWithoutSerial: "",
            destinationList: []
        };

        this.pickerCustomRef = React.createRef();
    }

    componentDidMount = async () => {
        const { fromUser, cyclinderAction } = this.props;
        this.props.fetchUsersTypeForPartner();
        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
            }
            if (this.props.userType === FIXER && (cyclinderAction === EXPORT)) this.props.getListDriver(fromUser);
        } catch (error) {
            console.log(error);
        }
    };

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
        }
    }

    handleChangeLanguage = (lgnCode) => {
        //setLanguage(lgnCode);
        chooseLanguageConfig(lgnCode)
    }

    handleChange = (name, val) => {
        this.setState({
            ...this.state,
            [name]: val,
        });
    };
    // handleChange = (key, value) => {
    //     this.setState({[key]: value});
    // }
    componentWillReceiveProps(nextProps) {
        const arr = []
        if (nextProps.destinationList !== this.props.destinationList) {
            nextProps.destinationList.map(item => {
                if (!!item) {
                    arr.push(item)
                }
            })
            this.setState({ destinationList: arr })
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        //this.setState({submitted: true});
        const { fromUser, cyclinderAction, typeForPartnerReducer, cylinders, cyclinder } = this.props;
        //tim data history binh cuoi cung
        //const dataTo = cyclinder.histories[cyclinder.histories.length - 1];
        // const resultHistory = dataTo.toArray.find(
        //     x => x.id === this.props.user
        // );
        //console.log("resultHistory", resultHistory);
        const {
            driver,
            idDriver,
            license_plate,
            to,
            numberOfCylinder,
            selectedItems,
            cylindersWithoutSerial
        } = this.state;
        let total = 0;
        await this.state.numberArrays.map(item => {
            total = total + Number(item.value);
        });
        this.setState({ total, submitted: true });
        if (typeof this.state.numberArrays !== "undefined" && this.state.numberArrays !== null && this.state.numberArrays.length > 0) {
            for (let i = 0; i < this.state.numberArrays.length; i++) {
                if (this.state.numberArrays[i].value <= 0) {
                    Alert.alert(
                        translate('QUANTITY_CANNOT_BE_LESS_THAN_0'),
                        translate('PLEASE_TRY_AGAIN'),
                        [{ text: translate('RETRY') }],
                        { cancelable: false }
                    );
                    return;
                }
            }
        }
        if (
            typeof this.state.numberArrays !== "undefined" &&
            this.state.numberArrays !== null &&
            this.state.numberArrays.length > 0
        ) {
            if (this.state.total !== cylinders.length) {
                Alert.alert(
                    translate('THE_QUANTITY_IS_INCORRECT'),
                    translate('PLEASE_TRY_AGAIN'),
                    [{ text: translate('RETRY') }],
                    { cancelable: false }
                )
                return
            }
        } else {
            if (this.state.total > cylinders.length) {
                Alert.alert(
                    translate('THE_QUANTITY_IS_INCORRECT'),
                    translate('PLEASE_TRY_AGAIN'),
                    [{ text: translate('RETRY') }],
                    { cancelable: false }
                )
                return
            }
        }
        if (destinationList.id.length <= 0) {
            Alert.alert(
                translate('CHOOSE_COMPANY'),
                translate('PLEASE_TRY_AGAIN'),
                [{ text: translate('RETRY') }],
                { cancelable: false }
            )
            return
        }
        if (cyclinderAction === IMPORT) {
            Alert.alert(
                translate('THE_QUANTITY_IS_INCORRECT'),
                translate('PLEASE_TRY_AGAIN'),
                [{ text: translate('RETRY') }],
                { cancelable: false }
            )
            return
        }
        if (driver && idDriver && license_plate) {
            const payload = {
                driver,
                idDriver,
                signature: 'Nhập vỏ bình về sửa chữa - trên Mobile',
                license_plate,
                type: cyclinderAction,
                typeForPartner: typeForPartnerReducer,
                cylinders: cylinders,
            }
            if (this.props.userType === FIXER) {
                if (cyclinderAction === EXPORT) {
                    payload.from = fromUser;
                    payload.toArray = selectedItems
                    payload.numberArray = this.state.numberArrays.value
                } else {
                    payload.from = to;
                    payload.to = fromUser;
                    payload.cylindersWithoutSerial = cylindersWithoutSerial
                }
                this.props.updateCylinders(payload);
            } else {
                if (cyclinderAction === EXPORT) {
                    payload.from = fromUser
                    payload.toArray = selectedItems
                    payload.cylindersWithoutSerial = cylindersWithoutSerial
                } else {
                    payload.from = to
                    payload.to = fromUser
                }
                this.props.updateCylinders(payload);
            }

        }
    };
    renderError = error => {
        return (
            <WingBlank>
                <WhiteSpace size="lg" />
                <Text style={styles.txtError}>{error}</Text>
            </WingBlank>
        );
    };

    getItemFromDestinationList(list_id) {
        let selectedItemsFullInfo = [];
        for (let j = 0; j < list_id.length; j++) {
            const id = list_id[j];
            for (let i = 0; i < this.state.destinationList.length; i++) {
                if (this.state.destinationList[i].id === id) {
                    selectedItemsFullInfo.push(this.state.destinationList[i]);
                }
            }
        }
        this.setState({ selectedItemsFullInfo });
    }

    onSelectedItemsChange = selectedItems => {
        const { selectItemTotal } = this.state
        selectedItems.map(item => {
            const result = selectItemTotal.find(x => !!x ? x === item : "")
            if (!!result === false) {
                selectItemTotal.push(item)
            }
        })
        this.getItemFromDestinationList(selectedItems);
        this.setState({ selectedItems });
    };

    // TODO: remove after authorization
    getDestination = () => {
        const {
            cyclinderAction,
            generalList,
            factoryList,
            stationList,
            agencyList,
            userType
        } = this.props;
        if (cyclinderAction === IMPORT) {
            if (userType === FACTORY) {
                return [{ id: null, name: "Người dân" }];
            }
            if (userType === GENERAL || userType === STATION) {
                return factoryList;
            }
            if (userType === AGENCY) {
                return generalList;
            }
        }
        if (cyclinderAction === EXPORT) {
            if (userType === FACTORY) {
                const outputList = [...generalList, ...stationList, ...agencyList];
                return outputList;
            }
            if (userType === GENERAL) {
                return agencyList;
            }
            if (userType === STATION) {
                return factoryList;
            }
            if (userType === AGENCY) {
                return [{ id: null, name: "Người dân" }];
            }
        }
        if (cyclinderAction === TURN_BACK) {
            if (userType === FACTORY) {
                return [{ id: null, name: "Người dân" }];
            }
        }
    };

    renderNotCylinder() {
        const { typeForPartnerReducer, cyclinderAction, userType } = this.props;
        if (typeForPartnerReducer === TO_FIX && ((cyclinderAction === IMPORT && userType !== FACTORY) || (cyclinderAction === EXPORT && userType === FACTORY))) {
            return (
                <View>
                    <InputItem
                        //onChangeText={v => this.handleChange('driver', v)}
                        type="number"
                        onChange={cylindersWithoutSerial => {
                            this.setState({
                                cylindersWithoutSerial
                            });
                        }}
                        placeholder={translate('NUMBER_OF_CYLINDERS_WITHOUT_SERIAL')}
                    />
                </View>
            )
        } else {
            return null
        }

    }

    renderRow(item, index) {
        if (this.state.numberArrays.length > this.state.selectedItems.length) {
            if (this.state.selectedItems.length === 0) {
                this.setState({
                    numberArrays: []
                })
            }
            this.state.selectedItems.map(item => {
                const result = this.state.numberArrays.find(x => !!x ? x.index !== item : "")
                if (!!result) {
                    const result1 = this.state.numberArrays.findIndex(x => x.index === result.index)
                    if (result1 !== -1) {
                        this.state.numberArrays.splice(result1, 1)
                    }
                }
            })
        }
        return (
            <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }} key={index}>
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                    {!!item ? <Text>{item.name}</Text> : null}
                </View>
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                    <InputItem
                        onChange={value => {
                            let numberArrays = this.state.numberArrays;
                            numberArrays[index] = { value: value, index: item.id };
                            this.setState({
                                numberArrays,
                            })
                        }}
                        type={'number'}
                        placeholder={translate('ENTER_THE_AMOUNT')}
                    />
                    {this.state.submitted &&
                        !this.state.numberArrays[index] &&
                        this.renderError(translate('AMOUNT_IS_REQUIRED'))}
                </View>
            </View>
        );
    }

    renderSelectInput() {
        const { cyclinderAction, userType } = this.props;
        const { destinationList } = this.state
        if (this.props.typeForPartnerReducer === TO_FIX) {
            if (cyclinderAction === IMPORT) {
                return (
                    <WingBlank>
                        <Picker
                            selectedValue={this.state.to}
                            style={styles.to}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ to: itemValue });
                                this.props.getListDriver(itemValue);
                            }}
                        >
                            <Picker.Item label={translate('PLEASE_SELECT')} value="null" />
                            {
                                destinationList.map(v => {
                                    return (
                                        <Picker.Item
                                            label={!!v ? v.name : ""}
                                            value={!!v ? v.id : ""}
                                            key={!!v ? v.name : ""}
                                        />
                                    );
                                }
                                )}
                        </Picker>
                    </WingBlank>
                )
            } else {
                return (
                    <WingBlank>
                        <MultiSelect
                            hideTags={false}
                            items={destinationList}
                            uniqueKey="id"
                            selectText={translate('SELECT')}
                            ref={component => {
                                this.multiSelect = component;
                            }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={this.state.selectedItems}
                            searchInputPlaceholderText={translate('SELECT')}
                            altFontFamily={
                                Platform.OS === "ios" ? "" : "ProximaNova-Light"
                            }
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{ color: "#CCC" }}
                            submitButtonColor="#CCC"
                            submitButtonText={translate('SELECTED')}
                        />
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {this.state.selectedItemsFullInfo.map(
                                (item, index) => {
                                    // This will render a row for each data element.
                                    return this.renderRow(item, index);
                                }
                            )}
                        </View>
                    </WingBlank>
                )
            }
        } else {
            return (
                <WingBlank>
                    {cyclinderAction === IMPORT ? (<Picker
                        selectedValue={this.state.to}
                        style={styles.to}
                        onValueChange={(itemValue, itemIndex) => {
                            console.log(itemValue);
                            this.setState({ to: itemValue });
                        }}
                    >
                        <Picker.Item label={translate('PLEASE_SELECT')} value="null" />
                        {
                            destinationList.map(v => {
                                return (
                                    <Picker.Item
                                        label={!!v ? v.name : ""}
                                        value={!!v ? v.id : ""}
                                        key={!!v ? v.name : ""}
                                    />
                                );
                            }
                            )}
                    </Picker>) : (
                        <View>
                            <MultiSelect
                                hideTags={false}
                                items={destinationList}
                                uniqueKey="id"
                                selectText={translate('SELECT')}
                                ref={component => {
                                    this.multiSelect = component;
                                }}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={this.state.selectedItems}
                                searchInputPlaceholderText={translate('SELECT')}

                                altFontFamily={
                                    Platform.OS === "ios" ? "" : "ProximaNova-Light"
                                }
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                selectedItemTextColor="#CCC"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: "#CCC" }}
                                submitButtonColor="#CCC"
                                submitButtonText={translate('SELECTED')}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {this.state.selectedItemsFullInfo.map(
                                    (item, index) => {
                                        // This will render a row for each data element.
                                        return this.renderRow(item, index);
                                    }
                                )}
                            </View>
                        </View>
                    )}

                </WingBlank>
            )
        }

    }

    render() {
        const { driver, license_plate, submitted, destinationList } = this.state;
        const { isAuthLoading, isCylindersLoading, error, typeForPartnerReducer, listNameDriver } = this.props;
        // const cyclinderLast = saver.getArrCyclinder();

        if (isAuthLoading || isCylindersLoading) {
            return <ActivityIndicator size="large" color={COLOR.BLUE} />;
        }
        //const itemFrom = this.props.cyclinder.histories[lastItem]
        return (
            <ScrollView>
                <Flex style={styles.container}>
                    <Flex.Item>
                        <Card>
                            <Card.Header title={translate('SHIPPING_INFORMATION')} />
                            <Card.Body>
                                {/* <InputItem
                                    //onChangeText={v => this.handleChange('driver', v)}
                                    onChange={driver => {
                                        this.setState({
                                            driver
                                        });
                                    }}
                                    placeholder={translate('DRIVERS_NAME')}
                                /> */}
                                <PickerCustom
                                    placeholder={translate('select_driver')}
                                    value={this.state.idDriver}
                                    //error={this.state.errorDriver}
                                    ref={this.pickerCustomRef} listItem={listNameDriver?.data.map(driver => ({
                                        value: driver.id,
                                        label: driver.name
                                    }))} setValue={(value) => {

                                        this.setState({ idDriver: value.value, errorDriver: false })
                                        this.setState({ driver: value.label })

                                    }}
                                ></PickerCustom>
                                {submitted &&
                                    !driver &&
                                    this.renderError(translate('DRIVER_NAME_IS_REQUIRED'))}
                                <InputItem
                                    // clear
                                    //onChangeText={v => this.handleChange('license_plate', v)}
                                    onChange={license_plate => {
                                        this.setState({
                                            license_plate,
                                        });
                                    }}
                                    placeholder={translate('LICENSE_PLATE')}
                                />
                                {submitted &&
                                    !license_plate &&
                                    this.renderError(translate('YOU_HAVE_NOT_ENTERED_THE_NUMBER_OF_GAS_CYLINDERS'))}
                                {this.renderNotCylinder()}
                                {this.renderSelectInput()}
                                <WingBlank>
                                    <WhiteSpace size="lg" />
                                    {isCylindersLoading ? (
                                        <ActivityIndicator size="large" color={COLOR.BLUE} />
                                    ) : (
                                        <TouchableOpacity
                                            disabled={destinationList.length === 0}
                                            onPress={this.handleSubmit}
                                            style={styles.btnFinish}
                                        >
                                            <Text style={styles.txtFinish}>{translate('FINISH')}</Text>
                                        </TouchableOpacity>
                                    )}
                                </WingBlank>
                            </Card.Body>
                        </Card>
                    </Flex.Item>
                </Flex>
            </ScrollView>
        );
    }
}

export const mapStateToProps = state => ({
    isAuthLoading: state.auth.loading,
    isCylindersLoading: state.cylinders.loading,
    error: state.auth.error,
    fromUser: state.auth.user.id,
    cyclinder: state.cylinders.cyclinder,
    cylinders: state.cylinders.cylinders,
    cyclinderAction: state.cylinders.cyclinderAction,
    userType: state.auth.user.userType,
    generalList: state.auth.general,
    factoryList: state.auth.factory,
    stationList: state.auth.station,
    agencyList: state.auth.agency,
    typeForPartnerReducer: state.cylinders.typeForPartner,
    user: state.auth.user,
    destinationList: destinationList(state, state),
    listNameDriver: state.auth.listNameDriver,
});

// const getDestination1 = (cyclinderAction, generalList, factoryList, stationList, agencyList, userType) => {
//   // const { cyclinderAction, generalList, factoryList, stationList, agencyList, userType } = this.props
//   if( cyclinderAction === "IMPORT") {
//     if (userType === "Factory") {
//       return [{ id: null, name: 'Người dân'}]
//     }
//     if (userType === "General" || userType === "Station") {
//       return factoryList
//     }
//     if (userType === "Agency") {
//       return generalList
//     }
//   }
//   if(cyclinderAction === "EXPORT"){
//     if (userType === "Factory") {
//       // const outputList = [...generalList,...stationList, ...agencyList]
//       outputList = generalList.concat(stationList, agencyList)
//       return outputList
//     }
//     if (userType === "General") {
//       return agencyList
//     }
//     if (userType === "Station") {
//       return factoryList
//     }
//     if (userType === "Agency") {
//       return [{ id: null, name: 'Người dân'}]
//     }
//   }
//   if( cyclinderAction === "TURN_BACK") {
//     if (userType === "Factory") {
//       return [{ id: null, name: 'Người dân'}]
//     }
//   }
// }

// driver: "hao tai xe"
// from: "5d886bdc73a77c9e9c4f3bb5"
// license_plate: "123456"
// numberOfCylinder: 333
// to: "5d8c43f0186abd16e5c93fc7"
// type: "EXPORT"
// typeForPartner: "TO_FIX"
export default connect(
    mapStateToProps,
    { updateCylinders, fetchUsers, fetchUsersTypeForPartner, typeForPartner, getListDriver }
)(ShipperTypeforPartner);

