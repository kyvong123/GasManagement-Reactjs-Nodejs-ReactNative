import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
	Modal,
	Alert,
	Platform, Picker, PickerIOS
} from 'react-native';
import { COLOR } from './../constants';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';

import { List, Card, Button } from '@ant-design/react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Actions } from 'react-native-router-flux';
import GridView from 'react-native-super-grid';
import Images from '../constants/image';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	EXPORT,
	EXPORT_CYLINDER_EMPTY,
	EXPORT_PARTNER,
	DELIVER,
	INSPECTOR,
} from '../types';
import {
	DAILY_REPORT,
	TURN_BACK_MARKET,
	IMPORT,
	TURN_BACK_SALE_FROM_PARTNER,
	TURN_BACK_RENT_FROM_PARTNER,
	TURN_BACK_FROM_FACTORY_REPAIR,
	BUY,
	RENT,
	RETURN_CYLINDER,
	TO_FIX,
	TURN_BACK,
} from '../types';
import { getUserType, getUserRole } from '../helper/roles';
import saver from '../utils/saver';
import SignatureCapture from 'react-native-signature-capture';
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';

import { setLanguage, getLanguage } from '../helper/auth';

import { mthchk, mtdate } from '../actions/InspectorActions';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const base64_uncheckBox =
	'iVBORw0KGgoAAAANSUhEUgAAAfQAAAFmCAIAAAAUGv+VAAAAAXNSR0IArs4c6QAAAANzQklUBQYF\nMwuNgAAABQNJREFUeJzt1MEJACAQwDB1/53PJQShJBP01T0zC4CW8zsAgPfMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGC\nzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLM\nHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswd\nIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0g\nyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI\n3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjc\nAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGC\nzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLM\nHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswd\nIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0g\nyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI\n3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjc\nAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGC\nzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLM\nHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswd\nIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0g\nyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI\n3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjc\nAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCLj+cBcm8Os9WAAAAAElFTkSuQmCC\n';

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
const itemWith = width / 2;

const styles = StyleSheet.create({
	gridView: {
		paddingTop: 25,
	},
	txtError: {
		fontSize: 18,
		color: 'red',
	},
	itemContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 5,
		padding: 10,
		height: 60,
		flexDirection: 'row',
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	itemName: {
		fontSize: 15,
		color: '#fff',
		fontWeight: '600',
	},
	itemCode: {
		fontWeight: '600',
		fontSize: 12,
		color: '#fff',
	},
	signature: {
		flex: 1,
		borderColor: '#000033',
		borderWidth: 1,
	},
	buttonStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#eeeeee',
		margin: 10,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		height: Platform.OS === 'android' ? null : 320,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: '#F194FF',
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		position: Platform.OS === 'android' ? null : 'absolute',
		bottom: Platform.OS === 'android' ? null : 10,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		textAlign: 'center',
		marginBottom: Platform.OS == 'ios' ? 15 : 5,
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

class MonthlyChecklist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			checkingAt: '',
			location: '',
			checkingDate: new Date(),
			modeDate: 'date',
			showDate: false,
			checkedBy: '',
			phone: '',
			dataButton: [
				{
					name: translate('TANK_CHECKING_RECORD'),
					code: '#009347',
					action: 'TankCheckingRecord',
					iconName: 'application-import',
				},
				{
					name: translate('Check_valve_pipe'),
					code: '#F6921E',
					action: 'ValveFlangeRecord',
					iconName: 'export',
				},
				{
					name: translate('VAPORIZER_CHECKING_RECORD'),
					code: '#F6921E',
					action: 'VaporizerCheckingRecord',
					iconName: 'application-import',
				},
				{
					name: translate('EARTHING_SYSTEM_CHECKING_RECORD'),
					code: '#009347',
					action: 'EarthingSystemRecord',
					iconName: 'calendar-export',
				},
				{
					name: translate('FIRE_FIGHTING_CHECKING_RECORD'),
					code: '#009347',
					action: 'FireFightingRecord',
					iconName: 'calendar-export',
				},
			],
			notes: '',
			// signature
			signature_CheckedBy: '',
			save_Signature_CheckedBy: false,
			save_is_Disable: true,

			signature_VerifiedBy: '',
			save_Signature_VerifiedBy: false,
			verify_is_Disable: true,

			modalVisible: true,
			selectedMtnDate: '',
			str_selectedMtnDate: translate('Select_calendar'),
		};
		//this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount = async () => {
		this.setState({ modalVisible: true });
		const { user } = this.props;
		const payload = {
			id: user.id,
			maintenanceType: '01',
			userRole: user.userRole,
		};
		this.props.mtdate(payload);

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

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.MtnDate !== prevProps.MtnDate) {
			//console.log("this.props.MtnDate", this.props.MtnDate)
			this.setState({
				selectedMtnDate: this.props.MtnDate[0].idSchedule,
				str_selectedMtnDate: this.props.MtnDate[0].maintenanceDate,
				checkingAt: this.props.MtnDate[0].nameCompChecked,
				location: this.props.MtnDate[0].maintenanceDate,
			});
		}
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

	handleChangeLanguage = lgnCode => {
		//setLanguage(lgnCode);
		chooseLanguageConfig(lgnCode);
	};

	handleRole() {
		if (this.props.user.userRole === DELIVER) {
			// let role = this.props.user.userRole
			console.log('driver_role');
			return getUserRole(DELIVER);
		} else if (this.props.user.userRole === INSPECTOR) {
			console.log('inspector_role');
			return getUserRole(INSPECTOR);
		} else {
			return getUserType(this.props.user.userType);
		}
	}

	// functionClickButton(item) {
	//     if (!item.hasOwnProperty("type") && !item.hasOwnProperty("typeForPartner")) {
	//         this.navigateAction(item.action, "", "")
	//     } else if (item.hasOwnProperty("type") && !item.hasOwnProperty("typeForPartner")) {
	//         this.navigateAction(item.action, item.type, "")
	//     } else if (!item.hasOwnProperty("type") && item.hasOwnProperty("typeForPartner")) {
	//         this.navigateAction(item.action, "", item.typeForPartner)
	//     } else {
	//         this.navigateAction(item.action, item.type, item.typeForPartner)
	//     }
	// }

	navigateAction = action => {
		// console.log("type", type)
		// saver.setDataCyclinder(action)
		// saver.setTypeCyclinder(type)

		// if(!!typeForPartner){
		//     this.props.changeCyclinderAction(action)
		//     this.props.typeForPartner(typeForPartner)
		//     Actions[EXPORT_PARTNER]()
		// }else {
		//     this.props.changeCyclinderAction(TURN_BACK)
		//     Actions[action]()
		// }

		Actions[action]();
	};

	onPress = () => {
		const { user } = this.props;
		const payload = {
			id: user.id,
			maintenanceType: '01',
			userRole: user.userRole,
		};
		this.props.mtdate(payload);
		this.setState({ modalVisible: true });
	};

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

	_onSaveEvent_CheckedBy = result => {
		//result.encoded - for the base64 encoded png
		//result.pathName - for the file path name
		console.log('sign__CheckedBy', result);
		console.log(result.encoded);
		this.setState({
			signature_CheckedBy: result.encoded,
			errorSignature: false,
		});
	};
	_onDragEvent_CheckedBy() {
		this.setState({ save_is_Disable: false });
		// This callback will be called when the user enters signature
		console.log('dragged__CheckedBy');
	}

	_onSaveEvent_VerifiedBy = result => {
		//result.encoded - for the base64 encoded png
		//result.pathName - for the file path name
		console.log('sign_VerifiedBy', result);
		console.log(result.encoded);
		this.setState({
			signature_VerifiedBy: result.encoded,
			errorSignature: false,
		});
	};
	_onDragEvent_VerifiedBy() {
		this.setState({ verify_is_Disable: false });
		// This callback will be called when the user enters signature
		console.log('dragged_VerifiedBy');
	}

	handleSubmit = () => {
		console.log('hdl_mthlChkList this.state', this.state);
		console.log('hdl_mthlChkList this.props', this.props);

		const {
			checkingAt,
			checkingDate,
			checkedBy,
			location,
			phone,

			// // 1
			// combustiveMaterial,
			// warningSigns,
			// fireExtinguisher,

			// // 2
			// //appearance: '',
			// appearance_normal,
			// appearance_weirdo,
			// appearance_other,
			// appearance_other_text,
			// cylindersOthers,

			// // 3
			// pigTails_Type,
			// pigTails_Appearance,

			// // 4
			// pipingBefore_1stRegulator_Leakage,
			// pipingBefore_1stRegulator_Others,

			// // 5
			// pipingAfter_1stRegulator_Leakage,
			// pipingAfter_1stRegulator_Others,

			// // 6
			// valesOnPiping_Leakage,
			// valesOnPiping_Others,

			// // 7
			// hoseConnect_Type_SoftRubber,
			// hoseConnect_Type_CopperPipe,
			// hoseConnect_Type_Other,
			// hoseConnect_Type_Other_Text,
			// hoseConnect_Appearance,

			// // 8
			// periodicalInspection_Devices,

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

		// if (!selectedMtnDate) return Alert.alert('Thông báo','Chưa chọn lịch bảo trì')

		if (!save_Signature_CheckedBy || signature_CheckedBy === base64_uncheckBox) {
			Alert.alert(translate('notification'), translate('SIGN_REQ'));
			return;
		}
		if (!save_Signature_VerifiedBy || signature_VerifiedBy === base64_uncheckBox) {
			Alert.alert(translate('notification'), translate('SIGN_CHECK'));
			return;
		}

		const { user } = this.props;
		const createdBy = user.id;

		const {
			checkingRecord,
			valveFlangeRecord,
			vaporizerRecord,
			earthSysRecord,
			firefgtRecord,
		} = this.props;

		// let appearance = ''
		// if (appearance_normal) {
		//     appearance = 'Bình thường'
		// }
		// if (appearance_weirdo) {
		//     appearance = 'Bất thường'
		// }
		// if (appearance_other) {
		//     appearance = appearance_other_text
		// }

		// let hoseConnect_Type = ''
		// if (hoseConnect_Type_SoftRubber) {
		//     hoseConnect_Type = 'Dây cao su mềm'
		// }
		// if (hoseConnect_Type_CopperPipe) {
		//     hoseConnect_Type = 'Ống đồng'
		// }
		// if (hoseConnect_Type_Other) {
		//     hoseConnect_Type = hoseConnect_Type_Other_Text
		// }

		// if (!selectedMtnDate) return alert ('Chưa chọn lịch bảo trì')
		// if (!checkingRecord) return alert('Chưa hoàn thành form\nKiểm tra bồn chứa LPG')
		// if (!valveFlangeRecord) return alert('Chưa hoàn thành form\nKiểm tra van, đường ống')
		// if (!vaporizerRecord) return alert('Chưa hoàn thành form\nKiểm tra nồi hóa hơi')
		// if (!earthSysRecord) return alert('Chưa hoàn thành form\nKiểm tra hệ thống đất')
		// if (!firefgtRecord) return alert('Chưa hoàn thành form\nKiểm tra hệ thống PCCC')

		const payload = {
			checkingAt,
			checkingDate,
			checkedBy,
			location,
			phone,

			//
			checkingRecord,
			valveFlangeRecord,
			vaporizerRecord,
			earthSysRecord,
			firefgtRecord,

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

		// console.log("hdl_mthlChkList", payload)
		this.props.mthchk(payload);
		// alert("clicked")
	};

	renderError = error => {
		console.log(error);
		return (
			<WingBlank>
				<WhiteSpace size="lg" />
				<Text style={styles.txtError}>{error}</Text>
			</WingBlank>
		);
	};
	render() {
		const {
			submitted,
			checkingAt,
			location,
			checkingDate,
			modeDate,
			showDate,
			checkedBy,
			phone,
			//
			notes,

			// signature
			signature_CheckedBy,
			save_Signature_CheckedBy,

			signature_VerifiedBy,
			save_Signature_VerifiedBy,

			modalVisible,
			selectedMtnDate,
			str_selectedMtnDate,
		} = this.state;

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
						Alert.alert('Oops!', 'Modal has been closed.');
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								{translate('SELECT_MAINTENANCE')}
							</Text>
							{Platform.OS === 'ios'
								? <PickerIOS
									selectedValue={selectedMtnDate}
									style={{ height: 50, width: 180 }}
									onValueChange={(itemValue, itemIndex) => {
										console.log('MtnDate[itemIndex]}', MtnDate[itemIndex]);
										this.setState({
											selectedMtnDate: MtnDate[itemIndex].idSchedule,
										});
										this.setState({
											str_selectedMtnDate: MtnDate[itemIndex].maintenanceDate,
										});
										this.setState({
											checkingAt: MtnDate[itemIndex].nameCompChecked,
										});
										this.setState({
											location: MtnDate[itemIndex].maintenanceDate,
										});
									}}
								>
									{/* <Picker.Item label='Chọn lịch bảo trì' value="null" /> */}
									{MtnDate ? (
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
										// console.log("dcgg")
									)}
								</PickerIOS>
								:
								<Picker
									selectedValue={selectedMtnDate}
									style={{ height: 50, width: 180 }}
									onValueChange={(itemValue, itemIndex) => {
										console.log('MtnDate[itemIndex]}', MtnDate[itemIndex]);
										this.setState({
											selectedMtnDate: MtnDate[itemIndex].idSchedule,
										});
										this.setState({
											str_selectedMtnDate: MtnDate[itemIndex].maintenanceDate,
										});
										this.setState({
											checkingAt: MtnDate[itemIndex].nameCompChecked,
										});
										this.setState({
											location: MtnDate[itemIndex].maintenanceDate,
										});
									}}
								>
									{/* <Picker.Item label='Chọn lịch bảo trì' value="null" /> */}
									{MtnDate ? (
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
										// console.log("dcgg")
									)}
								</Picker>
							}

							<TouchableOpacity
								style={[styles.openButton, { backgroundColor: '#F6921E' }]}
								onPress={() => {
									this.setState({ modalVisible: !modalVisible });
								}}
							>
								<Text
									style={[styles.textStyle, { backgroundColor: '#F6921E' }]}
								>
									{translate('CLOSED')}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				<Card>
					<Card.Header title={translate('COPY_1_SAVE')} />
					<Card.Body>
						<WingBlank>
							<TextInput
								label={translate('COMPANY_NAME')}
								multiline={true}
								value={checkingAt}
								disabled={true}
								onChangeText={checkingAt => {
									this.setState({
										checkingAt,
										errorLicensePlate: false,
									});
								}}
								error={this.state.errorLicensePlate}
							/>
							{submitted &&
								!checkingAt &&
								this.renderError(translate('COMPANY_NAME_IS_REQUIRE'))}
						</WingBlank>
						<WhiteSpace />

						<WingBlank>
							<TextInput
								label={translate('LOCATION')}
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
							/>
							{submitted &&
								!location &&
								this.renderError(translate('IMPORT_LOCATION_ERROR'))}
						</WingBlank>
						<WhiteSpace size="lg" />
						<WingBlank>
							<View
								style={{
									marginTop: 10,
									justifyContent: 'space-between',
									height: 50,
								}}
							>
								{/* <Text style={{ textAlignVertical: 'center', fontSize: 20, color: 'blue' }}>
                                {translate('TEST_DAY')}
                            </Text> */}

								<TouchableOpacity
									style={{ flexDirection: 'row' }}
									onPress={this.onPress}
								>
									<IconMa name="calendar-range" size={30} color="#F6921E" />
									<Text style={{ fontSize: 20, color: '#F6921E' }}>
										{str_selectedMtnDate}
									</Text>
								</TouchableOpacity>
								{showDate && (
									<DateTimePicker
										testID="dateTimePicker"
										timeZoneOffsetInMinutes={0}
										value={new Date()}
										mode={modeDate}
										is24Hour={true}
										display="default"
										onChange={this.onChangeDate}
									/>
								)}
							</View>
						</WingBlank>
						<WingBlank>
							<TextInput
								label={translate('CHECKED_BY')}
								multiline={true}
								mode="outlined"
								value={checkedBy}
								onChangeText={checkedBy => {
									this.setState({
										checkedBy,
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
										background: 'white',
									},
								}}
							/>
							{submitted &&
								!checkedBy &&
								this.renderError(translate('IMPORT_NAME_CHECKED_BY_ERROR'))}
						</WingBlank>

						<WhiteSpace />
						<WingBlank>
							<TextInput
								label={translate('PHONE')}
								multiline={true}
								mode="outlined"
								value={phone}
								onChangeText={phone => {
									this.setState({
										phone,
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
							{submitted &&
								!phone &&
								this.renderError(translate('PHONE_ERROR'))}
						</WingBlank>
					</Card.Body>
				</Card>

				{/* <View>
                    <Image
                        style={{width: width, height: 150}}
                        source={Images.BANNER1}
                    />
                </View> */}

				<GridView
					itemDimension={itemWith}
					data={this.state.dataButton}
					style={styles.gridView}
					renderItem={item => (
						<TouchableOpacity onPress={() => this.navigateAction(item.action)}>
							<View
								style={[styles.itemContainer, { backgroundColor: item.code }]}
							>
								<View>
									<Text style={styles.itemName}>{item.name}</Text>
								</View>
								<Icons name={item.iconName} size={30} color="#FFFFFF" />
							</View>
						</TouchableOpacity>
					)}
				/>
				<WingBlank>
					<Text style={{ textAlign: 'center' }}>{translate('COMMENTS')}</Text>
					<WhiteSpace />
					<TextInput
						mode="outlined"
						multiline={true}
						value={notes}
						onChangeText={text => this.setState({ notes: text })}
					/>
				</WingBlank>
				<WhiteSpace size="lg" />

				<View style={{ flexDirection: 'column', height: 380 }}>
					<Text style={{ textAlign: 'center' }}>{translate('CHECKED_BY')}</Text>
					<Text style={{ textAlign: 'center', color: 'red' }}>
						{this.state.errorSignature ? this.state.errorSignature : null}
					</Text>

					<View
						style={{
							borderWidth: this.state.errorSignature ? 1 : 0,
							borderColor: 'red',
							flex: 1,
							marginVertical: 10,
							position: 'relative',
						}}
					>
						<SignatureCapture
							style={[{ flex: 1 }, styles.signature]}
							ref="signCheckedBY"
							onSaveEvent={this._onSaveEvent_CheckedBy}
							onDragEvent={this._onDragEvent_CheckedBy.bind(this)}
							saveImageFileInExtStorage={true}
							showNativeButtons={false}
							showTitleLabel={false}
							viewMode={'portrait'}
						/>
						{/* {save_Signature_CheckedBy ? <View style={{ width: '100%', height: 250, opacity: 0.1, backgroundColor: 'black', position: 'absolute', top: 0 }} /> : null} */}

						{save_Signature_CheckedBy ? (
							<View
								style={{
									width: '100%',
									height: 250,
									opacity: 10,
									position: 'absolute',
									top: 0,
								}}
							>
								<Image
									style={{
										width: '100%',
										height: 250,
										position: 'absolute',
										top: 0,
									}}
									source={{
										// uri: 'https://reactnative.dev/img/tiny_logo.png',
										uri: `data:image/png;base64,${this.state.signature_CheckedBy}`,
									}}
								/>
							</View>
						) : null}
					</View>

					<View style={{ flexDirection: 'row', marginHorizontal: 6 }}>
						<TouchableOpacity
							disabled={this.state.save_is_Disable}
							style={styles.buttonStyle}
							onPress={() => {
								this.setState({ save_Signature_CheckedBy: true });
								this.saveSign('signCheckedBY');
							}}
						>
							<Text>{translate('SAVE')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.buttonStyle}
							onPress={() => {
								this.setState({
									save_Signature_CheckedBy: false,
									save_is_Disable: true,
								});
								this.resetSign('signCheckedBY');
							}}
						>
							<Text>{translate('RESET')}</Text>
						</TouchableOpacity>
					</View>
				</View>

				<WhiteSpace size="lg" />
				<View style={{ flexDirection: 'column', height: 380 }}>
					<Text style={{ textAlign: 'center' }}>
						{translate('CONFIRM_THE_TEST')}
					</Text>
					<Text style={{ textAlign: 'center', color: 'red' }}>
						{this.state.errorSignature ? this.state.errorSignature : null}
					</Text>

					<View
						style={{
							borderWidth: this.state.errorSignature ? 1 : 0,
							borderColor: 'red',
							flex: 1,
							marginVertical: 10,
							position: 'relative',
						}}
					>
						<SignatureCapture
							style={[{ flex: 1 }, styles.signature]}
							ref="signVerifiedBy"
							onSaveEvent={this._onSaveEvent_VerifiedBy}
							onDragEvent={this._onDragEvent_VerifiedBy.bind(this)}
							saveImageFileInExtStorage={true}
							showNativeButtons={false}
							showTitleLabel={false}
							viewMode={'portrait'}
						/>
						{/* {save_Signature_VerifiedBy ? <View style={{ width: '100%', height: 250, opacity: 0.1, backgroundColor: 'black', position: 'absolute', top: 0 }} /> : null} */}

						{save_Signature_VerifiedBy ? (
							<View
								style={{
									width: '100%',
									height: 250,
									opacity: 10,
									position: 'absolute',
									top: 0,
								}}
							>
								<Image
									style={{
										width: '100%',
										height: 250,
										position: 'absolute',
										top: 0,
									}}
									source={{
										// uri: 'https://reactnative.dev/img/tiny_logo.png',
										uri: `data:image/png;base64,${this.state.signature_VerifiedBy}`,
									}}
								/>
							</View>
						) : null}
					</View>

					<View style={{ flexDirection: 'row', marginHorizontal: 6 }}>
						<TouchableOpacity
							disabled={this.state.verify_is_Disable}
							style={styles.buttonStyle}
							onPress={() => {
								this.setState({ save_Signature_VerifiedBy: true });
								this.saveSign('signVerifiedBy');
							}}
						>
							<Text>{translate('SAVE')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.buttonStyle}
							onPress={() => {
								this.setState({
									save_Signature_VerifiedBy: false,
									verify_is_Disable: true,
								});
								this.resetSign('signVerifiedBy');
							}}
						>
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
	user: state.auth.user,
	checkingRecord: state.inspector.checkingRecord,
	valveFlangeRecord: state.inspector.valveFlangeRecord,
	vaporizerRecord: state.inspector.vaporizerRecord,
	earthSysRecord: state.inspector.earthSysRecord,
	firefgtRecord: state.inspector.firefgtRecord,
	MtnDate: state.inspector.mtnDate,
});

export default connect(mapStateToProps, { mthchk, mtdate })(MonthlyChecklist);
