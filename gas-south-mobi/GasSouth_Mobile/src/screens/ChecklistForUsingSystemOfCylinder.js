/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Image, Platform } from 'react-native';
import { List, Card, Button } from '@ant-design/react-native';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import memoize from 'lodash.memoize';
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';
import { COLOR } from './../constants';
import SignatureCapture from 'react-native-signature-capture';
import { connect } from 'react-redux';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';
import { setLanguage, getLanguage } from '../helper/auth';
import * as RNLocalize from 'react-native-localize';

import { setChecklist, getmtndate, mtdate } from '../actions/InspectorActions';
import { Picker, PickerIOS } from 'react-native';
import { changeLanguage } from '../actions/LanguageActions';
import Checkbox from './../components/CheckBox';
import { withNavigationFocus } from 'react-navigation';
import i18n from 'i18n-js';

const Item = List.Item;
const Brief = Item.Brief;

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
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10,
    },
    txtError: {
        fontSize: 18,
        color: 'red',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        height: Platform.OS === "android" ? null : 320,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        position: Platform.OS === "android" ? null : "absolute",
        bottom: Platform.OS === "android" ? null : 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    btnSubmit: {
        backgroundColor: "#F6921E",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    txtBtnSubmit: {
        fontSize: 18,
        textAlign: "center",
        color: COLOR.WHITE,
    }
});

class ChecklistForUsingSystemOfCylinder extends Component {
    constructor(props) {
        super(props);
        this.state = {

            //valuePicker: 'picker',
            //text: '',
            //
            submitted: false,
            company_name: '',

            checkingAt: '',
            checkingDate: new Date(),
            modeDate: 'date',
            showDate: false,
            checkedBy: '',
            location: '',

            // 1
            combustiveMaterial: false,
            warningSigns: false,
            fireExtinguisher: false,

            // 2
            //appearance: '',
            appearance_normal: false,
            appearance_weirdo: false,
            appearance_other: false,
            appearance_other_text: '',
            cylindersOthers: '',

            // 3
            pigTails_Type: '',
            pigTails_Appearance: '',

            // 4
            pipingBefore_1stRegulator_Leakage: false,
            pipingBefore_1stRegulator_Others: '',

            // 5
            pipingAfter_1stRegulator_Leakage: false,
            pipingAfter_1stRegulator_Others: '',

            // 6
            valesOnPiping_Leakage: false,
            valesOnPiping_Others: '',

            // 7
            hoseConnect_Type_SoftRubber: false,
            hoseConnect_Type_CopperPipe: false,
            hoseConnect_Type_Other: false,
            hoseConnect_Type_Other_Text: '',
            hoseConnect_Appearance: '',

            // 8
            periodicalInspection_Devices: '',

            //
            notes: '',

            // signature
            signature_CheckedBy: '',
            save_Signature_CheckedBy: false,
            save_is_Disable: true,

            signature_VerifiedBy: '',
            save_Signature_VerifiedBy: false,
            verify_is_Disable: true,

            //
            modalVisible: true,
            selectedMtnDate: '',
            str_selectedMtnDate: translate('Select_calendar'),
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // onChange = value => {
    //     this.setState({
    //         valuePicker: value
    //     });
    // };

    componentDidMount = async () => {
        this.setState({ modalVisible: true });
        const { user } = this.props;
        const payload = {
            id: user.id,
            maintenanceType: '00',
            userRole: user.userRole,
        };
        this.props.mtdate(payload);

        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
            }
        } catch (error) {
            console.log(error);
        }

        this.props.cyclinderAction == TURN_BACK ? this.props.getListDriver(this.props.id.toString()) : null;

        let getData = await addLocalCyclinder.getItem();
        this.setState({ cylindersReturn: getData });

        this.props.fetchUsers();
    }

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener(
                'change',
                this.handleChangeLanguage(languageCode),
            );
        }
        this.setState({ modalVisible: false });
    };

    handleChangeLanguage = (lgnCode) => {
        //setLanguage(lgnCode);
        chooseLanguageConfig(lgnCode);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.MtnDate !== prevProps.MtnDate) {
            this.setState({
                selectedMtnDate: this.props.MtnDate[0].idSchedule,
                str_selectedMtnDate: this.props.MtnDate[0].maintenanceDate,
                checkingAt: this.props.MtnDate[0].nameCompChecked,
                location: this.props.MtnDate[0].maintenanceDate,
            });
        }
    }

    onPress = () => {
        const { user } = this.props;
        const payload = {
            id: user.id,
            maintenanceType: '00',
            userRole: user.userRole,
        };
        this.props.mtdate(payload);
        this.setState({ modalVisible: true });
    }

    onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        //setShow(Platform.OS === 'ios');
        this.setState({ showDate: false });
        this.setState({ checkingDate: currentDate });
    };

    // signature
    saveSign(ref) {
        this.refs[ref].saveImage();
    }

    resetSign(ref) {
        this.refs[ref].resetImage();
    }

    _onSaveEvent_CheckedBy = (result) => {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        this.setState({ signature_CheckedBy: result.encoded, errorSignature: false });

    }
    _onDragEvent_CheckedBy() {
        this.setState({ save_is_Disable: false });
        // This callback will be called when the user enters signature
    }

    _onSaveEvent_VerifiedBy = (result) => {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        this.setState({ signature_VerifiedBy: result.encoded, errorSignature: false });

    }
    _onDragEvent_VerifiedBy() {
        this.setState({ verify_is_Disable: false });
        // This callback will be called when the user enters signature
    }

    handleSubmit = () => {
        //alert("aaabc")

        const {

            submitted,
            company_name,
            checkingAt,
            checkingDate,
            checkedBy,
            location,

            // 1
            combustiveMaterial,
            warningSigns,
            fireExtinguisher,

            // 2
            //appearance: '',
            appearance_normal,
            appearance_weirdo,
            appearance_other,
            appearance_other_text,
            cylindersOthers,

            // 3
            pigTails_Type,
            pigTails_Appearance,

            // 4
            pipingBefore_1stRegulator_Leakage,
            pipingBefore_1stRegulator_Others,

            // 5
            pipingAfter_1stRegulator_Leakage,
            pipingAfter_1stRegulator_Others,

            // 6
            valesOnPiping_Leakage,
            valesOnPiping_Others,

            // 7
            hoseConnect_Type_SoftRubber,
            hoseConnect_Type_CopperPipe,
            hoseConnect_Type_Other,
            hoseConnect_Type_Other_Text,
            hoseConnect_Appearance,

            // 8
            periodicalInspection_Devices,

            //
            notes,

            // signature
            signature_CheckedBy,
            save_Signature_CheckedBy,

            signature_VerifiedBy,
            save_Signature_VerifiedBy,

            selectedMtnDate,
        } = this.state;

        this.setState({ submitted: true });
        // if (!selectedMtnDate) return alert ('Chưa chọn lịch bảo trì')
        const data1 = {
            checkedBy,
            pigTails_Appearance,
            pigTails_Type,
            pipingBefore_1stRegulator_Others,
            pipingAfter_1stRegulator_Others,
            valesOnPiping_Others,
            hoseConnect_Type,
            hoseConnect_Appearance,
            periodicalInspection_Devices
        }


        if (!signature_CheckedBy.length) {
            Alert.alert('Thông báo', 'Người kiểm tra chưa ký');
            return
        }
        if (!signature_VerifiedBy.length) {
            Alert.alert("Thông báo", 'Thiếu chữ ký xác nhận');
            return
        }

        if (!data1) {
            Alert.alert("Thông báo", translate('YOU_ENTER_INFORMATION_IS_MISSING'));
            return

        }
        //else{
        //     Alert.alert("Thông báo", translate('YOU_ENTER_INFORMATION_IS_MISSING'));

        // }
        if (appearance_other && hoseConnect_Type_Other && !(hoseConnect_Type_Other_Text && cylindersOthers)) {
            Alert.alert("Thông báo", translate('YOU_ENTER_INFORMATION_IS_MISSING'));
            return
        }
        if (!(fireExtinguisher || warningSigns || combustiveMaterial)) {
            Alert.alert("Thông báo", 'Bạn chưa chọn Khu vựa chứa bình Gas');
            return
        }
        if (!(appearance_normal || appearance_weirdo || appearance_other)) {
            Alert.alert("Thông báo", 'Bạn chưa chọn tình trạng bên ngoài');
            return
        }
        if (!(hoseConnect_Type_SoftRubber || hoseConnect_Type_CopperPipe || hoseConnect_Type_Other)) {
            Alert.alert("Thông báo", 'Bạn chưa chọn chủng loại');
            return
        }

        const {
            user,
        } = this.props;
        const createdBy = user.id;

        let appearance = '';
        if (appearance_normal) {
            appearance = 'Bình thường';
        }
        if (appearance_weirdo) {
            appearance = 'Bất thường';
        }
        if (appearance_other) {
            appearance = appearance_other_text;
        }

        let hoseConnect_Type = '';
        if (hoseConnect_Type_SoftRubber) {
            hoseConnect_Type = 'Dây cao su mềm';
        }
        if (hoseConnect_Type_CopperPipe) {
            hoseConnect_Type = 'Ống đồng';
        }
        if (hoseConnect_Type_Other) {
            hoseConnect_Type = hoseConnect_Type_Other_Text;
        }

        const payload = {

            company_name,
            checkingAt,
            checkingDate,
            checkedBy,
            location,

            // 1
            combustiveMaterial,
            warningSigns,
            fireExtinguisher,

            // 2
            appearance,
            // appearance_normal,
            // appearance_weirdo,
            // appearance_other,
            // appearance_other_text,
            cylindersOthers,

            // 3
            pigTails_Type,
            pigTails_Appearance,

            // 4
            pipingBefore_1stRegulator_Leakage,
            pipingBefore_1stRegulator_Others,

            // 5
            pipingAfter_1stRegulator_Leakage,
            pipingAfter_1stRegulator_Others,

            // 6
            valesOnPiping_Leakage,
            valesOnPiping_Others,

            // 7
            hoseConnect_Type,
            // hoseConnect_Type_SoftRubber,
            // hoseConnect_Type_CopperPipe,
            // hoseConnect_Type_Other,
            // hoseConnect_Type_Other_Text,
            hoseConnect_Appearance,

            // 8
            periodicalInspection_Devices,

            //
            notes,

            // signature
            signature_CheckedBy,
            save_Signature_CheckedBy,

            signature_VerifiedBy,
            save_Signature_VerifiedBy,

            selectedMtnDate,
            createdBy,
        };

        this.props.setChecklist(payload);
    }
    // checkSubmit(){
    //     let check = false;
    //     if(!this.state.company_name) {
    //         this.setState({
    //             errorLicensePlate : translate('COMPANY_NAME_IS_REQUIRE')})
    //     }else {
    //         check = true;

    //     }
    //     return check;

    // }
    renderError = error => {
        console.log(error);
        return (
            <WingBlank>
                <WhiteSpace size="lg" />
                <Text style={styles.txtError}>{error}</Text>
            </WingBlank>
        );

    }


    render() {
        const {

            checkingAt,
            checkedBy,
            location,
            submitted,

            //1
            combustiveMaterial,
            warningSigns,
            fireExtinguisher,

            //2
            //appearance,
            appearance_normal,
            appearance_weirdo,
            appearance_other,
            appearance_other_text,
            cylindersOthers,

            //3
            pigTails_Type,
            pigTails_Appearance,

            // 4
            pipingBefore_1stRegulator_Leakage,
            pipingBefore_1stRegulator_Others,

            // 5
            pipingAfter_1stRegulator_Leakage,
            pipingAfter_1stRegulator_Others,

            // 6
            valesOnPiping_Leakage,
            valesOnPiping_Others,

            // 7
            hoseConnect_Type_SoftRubber,
            hoseConnect_Type_CopperPipe,
            hoseConnect_Type_Other,
            hoseConnect_Type_Other_Text,
            hoseConnect_Appearance,

            // 8
            periodicalInspection_Devices,

            //
            notes,

            // signature
            // signature_CheckedBy,
            save_Signature_CheckedBy,

            // signature_VerifiedBy,
            save_Signature_VerifiedBy,

            // errorSignature,

            //
            modalVisible,
            selectedMtnDate,
            str_selectedMtnDate,
        } = this.state;


        let { showDate, checkingDate, modeDate } = this.state;
        const { MtnDate } = this.props;


        return (

            <ScrollView
                style={{ flex: 1, backgroundColor: '#FFF' }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
            >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{translate('SELECT_MAINTENANCE')}</Text>
                            {Platform.OS === 'ios'
                                ? <PickerIOS
                                    selectedValue={selectedMtnDate}
                                    style={{ height: 50, width: 180 }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectedMtnDate: MtnDate[itemIndex].idSchedule });
                                        this.setState({ str_selectedMtnDate: MtnDate[itemIndex].maintenanceDate });
                                        this.setState({ checkingAt: MtnDate[itemIndex].nameCompChecked });
                                        this.setState({ location: MtnDate[itemIndex].maintenanceDate });
                                    }}
                                >

                                    {
                                        MtnDate ? (
                                            MtnDate.map(schedule => {

                                                return (

                                                    <PickerIOS.Item
                                                        label={schedule.maintenanceDate}
                                                        value={schedule.idSchedule}
                                                    />
                                                );

                                            })
                                        ) : (
                                            <PickerIOS.Item label={translate('MAINTENANCE')} value="null" />
                                        )
                                    }
                                </PickerIOS>
                                : <Picker
                                    selectedValue={selectedMtnDate}
                                    style={{ height: 50, width: 180 }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectedMtnDate: MtnDate[itemIndex].idSchedule });
                                        this.setState({ str_selectedMtnDate: MtnDate[itemIndex].maintenanceDate });
                                        this.setState({ checkingAt: MtnDate[itemIndex].nameCompChecked });
                                        this.setState({ location: MtnDate[itemIndex].maintenanceDate });
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
                                                );

                                            })
                                        ) : (
                                            <Picker.Item label={translate('MAINTENANCE')} value="null" />
                                        )
                                    }
                                </Picker>
                            }
                            <TouchableOpacity
                                style={[styles.openButton, { backgroundColor: "#F6921E" }]}
                                onPress={() => {
                                    this.setState({ modalVisible: !modalVisible });
                                }}
                            >
                                <Text style={[styles.textStyle, { backgroundColor: '#F6921E' }]}>{translate('CLOSED')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Card>
                    <Card.Header
                        title={translate('COPY_1_SAVE')}
                    />
                    <Card.Body>
                        <WingBlank>
                            <TextInput
                                mode="outlined"
                                value={checkingAt}
                                multiline={true}
                                disabled={true}
                                // onChangeText={text => this.setState({ checkingAt: text })}
                                onChangeText={checkingAt => {
                                    this.setState({
                                        checkingAt,
                                        errorLicensePlate: false,
                                    });
                                }}
                                error={this.state.errorLicensePlate}
                                label={translate('COMPANY_NAME')}
                            // theme={{
                            //     colors: {
                            //         // placeholder: 'white',
                            //         // text: 'white',
                            //         // primary: 'white',
                            //         // underlineColor: 'transparent',
                            //         background: '#FFF'
                            //     }
                            // }}
                            />

                        </WingBlank>

                        <WingBlank>
                            <TextInput
                                // label="Địa chỉ"
                                mode="outlined"
                                disabled={true}
                                multiline={true}
                                value={location}
                                onChangeText={location => {
                                    this.setState({
                                        location,
                                        errorLicensePlate: false,
                                    });
                                }}
                                error={this.state.errorLicensePlate}
                                label={translate('LOCATION')}
                            // theme={{
                            //     colors: {
                            //         // placeholder: 'white',
                            //         // text: 'white',
                            //         // primary: 'white',
                            //         // underlineColor: 'transparent',
                            //         background: '#FFF'
                            //     }
                            // }}
                            />

                        </WingBlank>

                        <WhiteSpace size="lg" />
                        <WingBlank>
                            <View style={{ marginTop: 10, justifyContent: 'space-between', height: 50 }}>
                                {/* <Text style={{ textAlignVertical: 'center',fontSize: 20, color: 'blue' }}>
                                {translate('TEST_DAY')}
                            </Text> */}
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.onPress}>
                                    <IconMa name="calendar-range" size={30} color="#F6921E" />
                                    <Text style={{ fontSize: 20, color: '#F6921E' }}>
                                        {str_selectedMtnDate}
                                    </Text>
                                </TouchableOpacity>
                                {/* {showDate && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    timeZoneOffsetInMinutes={0}
                                    value={new Date()}
                                    mode={modeDate}
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.onChangeDate}
                                />
                            )} */}

                            </View>
                        </WingBlank>

                        <WingBlank>
                            <TextInput
                                mode="outlined"
                                multiline={true}
                                value={checkedBy}
                                onChangeText={checkedBy => {
                                    this.setState({
                                        checkedBy,
                                        errorLicensePlate: false,
                                    });
                                }}
                                error={this.state.errorLicensePlate}
                                label={translate('CHECKED_BY')}
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
                            {submitted && !checkedBy &&
                                this.renderError(translate('IMPORT_NAME_CHECKED_BY_ERROR'))}
                        </WingBlank>

                        <WhiteSpace />
                    </Card.Body>

                </Card>

                <List renderHeader={'1. ' + translate('CONTAINER')} style={{ backgroundColor: "#0cb5f7", borderColor: "#0cb5f7", shadowColor: "#0cb5f7" }}>
                    <Item extra={
                        <Checkbox
                            status={combustiveMaterial ? 'checked' : 'unchecked'}
                            onPress={() => { this.setState({ combustiveMaterial: !combustiveMaterial }); }}
                        />
                    }>
                        {translate('FLAMMABLE')}
                    </Item>
                    <Item extra={
                        <Checkbox
                            status={warningSigns ? 'checked' : 'unchecked'}
                            onPress={() => { this.setState({ warningSigns: !warningSigns }); }}
                        />
                    }>
                        {translate('WARNING')}
                    </Item>
                    <Item extra={
                        <Checkbox
                            status={fireExtinguisher ? 'checked' : 'unchecked'}
                            onPress={() => { this.setState({ fireExtinguisher: !fireExtinguisher }); }}
                        />
                    }>
                        {translate('EXTINGUISHER')}
                    </Item>
                    {submitted && !(combustiveMaterial || warningSigns || fireExtinguisher) ? this.renderError('Bạn chưa tích') : null}
                </List>

                <List renderHeader={'2. ' + translate('GAS_CONTAINERS')}>
                    <Item>
                        {translate('EXTERNAL')}
                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: -10 }}>
                            <Text style={{ textAlignVertical: 'center', marginHorizontal: 10 }}>{translate('Normal')}</Text>
                            <Checkbox
                                status={appearance_normal ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!appearance_normal) {
                                        this.setState({ appearance_weirdo: false });
                                        this.setState({ appearance_other: false });
                                    }
                                    this.setState({ appearance_normal: !appearance_normal });
                                }}
                            />
                            <Text style={{ textAlignVertical: 'center', marginHorizontal: 10 }}>{translate('WEIRDO')}</Text>
                            <Checkbox
                                status={appearance_weirdo ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!appearance_weirdo) {
                                        this.setState({ appearance_normal: false });
                                        this.setState({ appearance_other: false });
                                    }
                                    this.setState({ appearance_weirdo: !appearance_weirdo });
                                }}
                            />
                            <Text style={{ textAlignVertical: 'center', marginHorizontal: 10 }}>{translate('OTHER')}</Text>
                            <Checkbox
                                status={appearance_other ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!appearance_other) {
                                        this.setState({ appearance_normal: false });
                                        this.setState({ appearance_weirdo: false });
                                    }
                                    this.setState({ appearance_other: !appearance_other });
                                }}
                            />
                        </View>


                        {
                            appearance_other == true
                                ?
                                //<Brief>
                                <TextInput
                                    mode="outlined"
                                    multiline={true}
                                    value={cylindersOthers}
                                    label={translate('OTHER_REASONS')}
                                    onChangeText={cylindersOthers => {
                                        this.setState({
                                            cylindersOthers,
                                            errorLicensePlate: false,
                                        });
                                    }}
                                    error={this.state.errorLicensePlate}
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

                                // {submitted && !cylindersOthers &&
                                //     this.renderError(translate('IMPORT_CYLINDERSOTHERS_ERROR'))}
                                //</Brief>
                                : null
                        }
                    </Item>
                    {(submitted && appearance_other == true && !cylindersOthers) ? this.renderError('Bạn chưa nhập lý do khác') : null}


                </List>

                <List renderHeader={'3. ' + translate('SOFT_PIPES')}>
                    <Item >

                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={pigTails_Type}
                            onChangeText={pigTails_Type => {
                                this.setState({
                                    pigTails_Type,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !pigTails_Type &&
                            this.renderError(translate('IMPORT_PIGTAILS_TYPE_ERROR'))}
                    </Item>
                    <Item>
                        {translate('EXTERNAL')}
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={pigTails_Appearance}
                            onChangeText={pigTails_Appearance => {
                                this.setState({
                                    pigTails_Appearance,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !pigTails_Appearance &&
                            this.renderError(translate('IMPORT_PIGTAILS_APPEARANCE_ERROR'))}

                    </Item>
                </List>

                <List renderHeader={'4. ' + translate('PIPE_ASSISTANCE_BEFORE')}>
                    <Item extra={
                        <Checkbox
                            status={pipingBefore_1stRegulator_Leakage ? 'checked' : 'unchecked'}
                            onPress={() => { this.setState({ pipingBefore_1stRegulator_Leakage: !pipingBefore_1stRegulator_Leakage }); }}
                        />
                    }>
                        {translate('LEAKAGE')}
                    </Item>
                    <Item>
                        {translate('OTHER_REASONS')}
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={pipingBefore_1stRegulator_Others}
                            onChangeText={pipingBefore_1stRegulator_Others => {
                                this.setState({
                                    pipingBefore_1stRegulator_Others,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !pipingBefore_1stRegulator_Others &&
                            this.renderError(translate('IMPORT_CYLINDERSOTHERS_ERROR'))}
                    </Item>
                </List>

                <List renderHeader={'5. ' + translate('PIPE_ASSISTANCE_AFTER')}>
                    <Item extra={
                        <Checkbox
                            status={pipingAfter_1stRegulator_Leakage ? 'checked' : 'unchecked'}
                            onPress={() => { this.setState({ pipingAfter_1stRegulator_Leakage: !pipingAfter_1stRegulator_Leakage }); }}
                        />
                    }>
                        {translate('LEAKAGE')}
                    </Item>
                    <Item>
                        {translate('OTHER_REASONS')}
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={pipingAfter_1stRegulator_Others}
                            onChangeText={pipingAfter_1stRegulator_Others => {
                                this.setState({
                                    pipingAfter_1stRegulator_Others,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !pipingAfter_1stRegulator_Others &&
                            this.renderError(translate('IMPORT_CYLINDERSOTHERS_ERROR'))}
                    </Item>
                </List>

                <List renderHeader={'6. ' + translate('VALVE_SYSTEM')}>
                    <Item extra={
                        <Checkbox
                            status={valesOnPiping_Leakage ? 'checked' : 'unchecked'}
                            onPress={() => { this.setState({ valesOnPiping_Leakage: !valesOnPiping_Leakage }); }}
                        />
                    }>
                        {translate('LEAKAGE')}
                    </Item>
                    <Item>
                        {translate('OTHER_REASONS')}
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={valesOnPiping_Others}
                            onChangeText={valesOnPiping_Others => {
                                this.setState({
                                    valesOnPiping_Others,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !valesOnPiping_Others &&
                            this.renderError(translate('IMPORT_CYLINDERSOTHERS_ERROR'))}
                    </Item>
                </List>

                <List renderHeader={'7. ' + translate('TUBES_OF_SOFTWARE')}>
                    <Item>
                        {translate('SPECIES')}
                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: -10 }}>
                            <Text style={{ textAlignVertical: 'center', marginHorizontal: 10 }}>{translate('SOFT_RUBBER')}</Text>
                            <Checkbox
                                status={hoseConnect_Type_SoftRubber ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!hoseConnect_Type_SoftRubber) {
                                        this.setState({ hoseConnect_Type_CopperPipe: false });
                                        this.setState({ hoseConnect_Type_Other: false });
                                    }
                                    this.setState({ hoseConnect_Type_SoftRubber: !hoseConnect_Type_SoftRubber });
                                }}
                            />
                            <Text style={{ textAlignVertical: 'center', marginHorizontal: 10 }}>{translate('COPPER')}</Text>
                            <Checkbox
                                status={hoseConnect_Type_CopperPipe ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!hoseConnect_Type_CopperPipe) {
                                        this.setState({ hoseConnect_Type_SoftRubber: false });
                                        this.setState({ hoseConnect_Type_Other: false });
                                    }
                                    this.setState({ hoseConnect_Type_CopperPipe: !hoseConnect_Type_CopperPipe });
                                }}
                            />
                            <Text style={{ textAlignVertical: 'center', marginHorizontal: 10 }}>{translate('OTHER')}</Text>
                            <Checkbox
                                status={hoseConnect_Type_Other ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!hoseConnect_Type_Other) {
                                        this.setState({ hoseConnect_Type_SoftRubber: false });
                                        this.setState({ hoseConnect_Type_CopperPipe: false });
                                    }
                                    this.setState({ hoseConnect_Type_Other: !hoseConnect_Type_Other });
                                }}
                            />
                        </View>
                        {
                            hoseConnect_Type_Other == true
                                ?
                                //<Brief>
                                <TextInput
                                    mode="outlined"
                                    multiline={true}
                                    value={hoseConnect_Type_Other_Text}
                                    label={translate('OTHER_REASONS')}
                                    onChangeText={hoseConnect_Type_Other_Text => {
                                        this.setState({
                                            hoseConnect_Type_Other_Text,
                                            errorLicensePlate: false,
                                        });
                                    }}
                                    error={this.state.errorLicensePlate}
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
                                //</Brief>
                                : null
                        }
                        {(submitted && hoseConnect_Type_Other == true && !hoseConnect_Type_Other_Text) ? this.renderError('Bạn chưa nhập lý do') : null}
                    </Item>
                    <Item>
                        {translate('EXTERNAL')}
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={hoseConnect_Appearance}
                            onChangeText={hoseConnect_Appearance => {
                                this.setState({
                                    hoseConnect_Appearance,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !hoseConnect_Appearance &&
                            this.renderError(translate('IMPORT_PIGTAILS_APPEARANCE_ERROR'))}
                    </Item>
                </List>

                <List renderHeader={'8. ' + translate('DEVICES_REQUIRED')}>
                    <Item>
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            value={periodicalInspection_Devices}
                            onChangeText={periodicalInspection_Devices => {
                                this.setState({
                                    periodicalInspection_Devices,
                                    errorLicensePlate: false,
                                });
                            }}
                            error={this.state.errorLicensePlate}
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
                        {submitted && !periodicalInspection_Devices &&
                            this.renderError(translate('IMPORT_PERIODICALLNSPECTION_DEVICES_ERROR'))}
                    </Item>
                </List>
                <WhiteSpace />
                <Text style={{ textAlign: 'center' }}>{translate('COMMENTS')}</Text>

                <WingBlank>
                    <TextInput
                        mode="outlined"
                        multiline={true}
                        value={notes}
                        onChangeText={text => this.setState({ notes: text })}
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
                </WingBlank>
                <WhiteSpace size="lg" />
                <View style={{ flexDirection: "column", height: 380 }}>
                    <Text style={{ textAlign: 'center' }}>{translate('CHECKED_BY')}</Text>
                    <Text style={{ textAlign: 'center', color: 'red' }}>{this.state.errorSignature ? this.state.errorSignature : null}</Text>

                    <View style={{ borderWidth: this.state.errorSignature ? 1 : 0, borderColor: 'red', flex: 1, marginVertical: 10, position: 'relative' }}>
                        <SignatureCapture
                            style={[{ flex: 1 }, styles.signature]}
                            ref="signCheckedBY"
                            onSaveEvent={this._onSaveEvent_CheckedBy}
                            onDragEvent={this._onDragEvent_CheckedBy.bind(this)}
                            saveImageFileInExtStorage={true}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            viewMode={"portrait"} />
                        {/* {save_Signature_CheckedBy ? <View style={{ width: '100%', height: 250, opacity: 0.1, backgroundColor: 'black', position: 'absolute', top: 0 }} /> : null} */}

                        {
                            save_Signature_CheckedBy
                                ?
                                <View style={{ width: '100%', height: 250, opacity: 10, position: 'absolute', top: 0 }}>
                                    <Image
                                        style={{ width: '100%', height: 250, position: 'absolute', top: 0 }}
                                        source={{
                                            // uri: 'https://reactnative.dev/img/tiny_logo.png',
                                            uri:
                                                `data:image/png;base64,${this.state.signature_CheckedBy}`,
                                        }}
                                    />
                                </View>
                                : null
                        }
                    </View>

                    <View style={{ flexDirection: "row", marginHorizontal: 6 }}>
                        <TouchableOpacity style={styles.buttonStyle}
                            disabled={this.state.save_is_Disable}
                            onPress={() => { this.setState({ save_Signature_CheckedBy: true }); this.saveSign("signCheckedBY"); }} >
                            <Text>{translate('SAVE')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonStyle}
                            onPress={() => { this.setState({ save_Signature_CheckedBy: false, save_is_Disable: true }); this.resetSign("signCheckedBY"); }} >
                            <Text>{translate('RESET')}</Text>
                        </TouchableOpacity>

                    </View>

                </View>
                <WhiteSpace size="lg" />

                <View style={{ flexDirection: "column", height: 380 }}>
                    <Text style={{ textAlign: 'center' }}>{translate('CONFIRM_THE_TEST')}</Text>
                    <Text style={{ textAlign: 'center', color: 'red' }}>{this.state.errorSignature ? this.state.errorSignature : null}</Text>

                    <View style={{ borderWidth: this.state.errorSignature ? 1 : 0, borderColor: 'red', flex: 1, marginVertical: 10, position: 'relative' }}>
                        <SignatureCapture
                            style={[{ flex: 1 }, styles.signature]}
                            ref="signVerifiedBy"
                            onSaveEvent={this._onSaveEvent_VerifiedBy}
                            onDragEvent={this._onDragEvent_VerifiedBy.bind(this)}
                            saveImageFileInExtStorage={true}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            viewMode={"portrait"} />
                        {/* {save_Signature_VerifiedBy ? <View style={{ width: '100%', height: 250, opacity: 0.1, backgroundColor: 'black', position: 'absolute', top: 0 }} /> : null} */}

                        {
                            save_Signature_VerifiedBy
                                ?
                                <View style={{ width: '100%', height: 250, opacity: 10, position: 'absolute', top: 0 }}>
                                    <Image
                                        style={{ width: '100%', height: 250, position: 'absolute', top: 0 }}
                                        source={{
                                            // uri: 'https://reactnative.dev/img/tiny_logo.png',
                                            uri:
                                                `data:image/png;base64,${this.state.signature_VerifiedBy}`,
                                        }}
                                    />
                                </View>
                                : null
                        }
                    </View>

                    <View style={{ flexDirection: "row", marginHorizontal: 6 }}>
                        <TouchableOpacity style={styles.buttonStyle}
                            disabled={this.state.verify_is_Disable}
                            onPress={() => { this.setState({ save_Signature_VerifiedBy: true }); this.saveSign("signVerifiedBy"); }} >
                            <Text>{translate('SAVE')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonStyle}
                            onPress={() => { this.setState({ save_Signature_VerifiedBy: false, save_is_Disable: true }); this.resetSign("signVerifiedBy"); }} >
                            <Text>{translate('RESET')}</Text>
                        </TouchableOpacity>

                    </View>

                </View>




                <WingBlank>
                    <WhiteSpace size="lg" />

                    <TouchableOpacity

                        // style = {{backgroundColor:'#F6921E',borderColor:'#F6921E',shadowColor:'#F6921E'}}
                        style={styles.btnSubmit}
                        onPress={() => { this.handleSubmit(); }}
                    >
                        <Text style={styles.txtBtnSubmit}>{translate('END')}</Text>
                    </TouchableOpacity>
                    <WhiteSpace size="lg" />
                </WingBlank>

            </ScrollView>

        );
    }
}

export const mapStateToProps = state => ({
    MtnDate: state.inspector.mtnDate,
    user: state.auth.user,
});

export default connect(
    mapStateToProps,
    { setChecklist, changeLanguage, mtdate }
)(ChecklistForUsingSystemOfCylinder);
