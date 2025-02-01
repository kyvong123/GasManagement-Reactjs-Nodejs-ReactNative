import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	//TextInput,
	Alert,
	Platform,
	TouchableOpacity,
	PermissionsAndroid,
	// Bluetooth
	Switch,
	Dimensions,
	DeviceEventEmitter,
	NativeEventEmitter,
	ToastAndroid,
	Image, Picker
} from 'react-native';
//asda
import { Actions } from 'react-native-router-flux';
import {
	Button,
	WingBlank,
	Flex,
	Card,
	WhiteSpace,
	InputItem,
} from '@ant-design/react-native/lib';
import { getallchild } from '../actions/InspectorActions';
import { updateCylinders, returnGas, importDupCylinder } from '../actions/CyclinderActions';
import { fetchUsers, getListDriver, getUserInfo } from '../actions/AuthActions';
import { exportPlace } from '../actions/ManufactureAction';
import { getLstCylinder } from '../actions/PrintActions';
//import { getLstWeight } from '../actions/NewAction';
import {
	getListCustomerType,
} from "../actions/CustomerActions";
import { COLOR } from '../constants';
import { destinationList } from '../helper/selector';
import PickerCustom from './../components/PickerCustom';
import Modal from 'react-native-modal';
import moment from 'moment';
import { TextField } from 'react-native-material-textfield';
import MultiSelect from 'react-native-multiple-select';
import saver from '../utils/saver';
import {
	AGENCY,
	EXPORT,
	FACTORY,
	GENERAL,
	IMPORT,
	STATION,
	TURN_BACK,
} from '../types';
import ManufactureReducer from '../reducers/ManufactureReducer';
import {
	BluetoothManager,
	BluetoothEscposPrinter,
	BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import { TextInput } from 'react-native-paper';

import SignatureCapture from 'react-native-signature-capture';

import { setLanguage, getLanguage } from '../helper/auth';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { windowToggle } from 'rxjs/operators';
import addLocalCyclinder from './../api/addLocalCyclinder';
import { cleanAccents } from './../helper/words';

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

// Bluetooth
var { height, width } = Dimensions.get('window');

const base64_uncheckBox =
	'iVBORw0KGgoAAAANSUhEUgAAAfQAAAFmCAIAAAAUGv+VAAAAAXNSR0IArs4c6QAAAANzQklUBQYF\nMwuNgAAABQNJREFUeJzt1MEJACAQwDB1/53PJQShJBP01T0zC4CW8zsAgPfMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGC\nzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLM\nHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswd\nIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0g\nyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI\n3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjc\nAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGC\nzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLM\nHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswd\nIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0g\nyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI\n3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjc\nAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGC\nzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLM\nHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswd\nIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0g\nyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI\n3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjc\nAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCzB0gyNwB\ngswdIMjcAYLMHSDI3AGCzB0gyNwBgswdIMjcAYLMHSDI3AGCLj+cBcm8Os9WAAAAAElFTkSuQmCC\n';


const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	txtError: {
		fontSize: 18,
		color: COLOR.RED,
	},
	to: {
		width: '100%',
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
		//backgroundColor: "blue",
		margin: 10,
		borderColor: 'gray',
		borderWidth: 2
	},
	// Bluetooth
	title: {
		//width:width,
		backgroundColor: '#eee',
		color: '#232323',
		paddingLeft: 8,
		paddingVertical: 4,
		textAlign: 'left',
	},
	btnPrint: {
		color: 'blue',
	},
	btnFinish: {
		backgroundColor: "#F6921E",
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
	},
	btnFinishDisable: {
		backgroundColor: "#edcda8",
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

const PickerItem = Picker.Item;

const CUSTOMER_TYPES = [
	{
		name: 'Khách hàng công nghiệp',
		value: "Industry"

	},
	{
		name: 'Hệ thống phân phối',
		value: "Distribution"

	},
	{
		name: 'Hệ thống CH bán lẻ',
		value: "Agency"

	},
]

class TurnbackByDriver extends Component {
	_listeners = [];
	constructor(props) {
		super(props);
		this.state = {
			// driver: "",
			// idDriver: "",
			license_plate: '',
			signature: "",
			// addressCustomer: "",
			// nameCustomer: "",
			// to: "",
			// nameCompany: '',
			submitted: false,
			// selectedItems: [],
			// selectedItemsFullInfo: [],
			// numberArrays: [],
			// //exportPlaceCylinder:[],
			// total: 0,
			// phoneCustomer: "",
			numberOfCylinder: 0,
			// exportPlace: "",
			// errorDriver: false,
			// errorCompany: false,
			errorLicensePlate: false,
			// openModal: false,
			// weight: null,
			// errorWeight: false,
			// save: false,
			cylindersReturn: [],
			// Bluetooth
			devices: null,
			pairedDs: [],
			foundDs: [],
			bleOpend: false,
			loading: true,
			boundAddress: '',
			name: '',
			//debugMsg: '',
			//list_inforCylinder: this.props.getLstCylinder()
			driverName: this.props.userInfor.name,
			idCompany: '',
			codeCompany: '',
			nameCompany: '',
			addressCompany: '',
			errorSignature: false,
			save: false,
			signature_CheckedBy: '',
			save_Signature_CheckedBy: false,
			save_is_Disable: true,
			cylindersReturn: [],

			customerType: '',
			isCustomerType: false,
		};

		this.customerTypePickerCustomRef = React.createRef();
		this.customerPickerCustomRef = React.createRef();
	}

	// componentWillReceiveProps(nextProps){
	//     if(nextProps.exportPlaceCylinder !== this.props.exportPlaceCylinder){
	//         this.setState({exportPlaceCylinder:nextProps.exportPlaceCylinder})
	//     }
	// }

	// componentWillMount() {
	//     this.props.exportPlace()
	// }

	componentDidMount = async () => {
		const { userInfor, cylinders } = this.props;

		let getData = await addLocalCyclinder.getItem();

		this.setState({ cylindersReturn: getData });

		this.props.getLstCylinder(cylinders);

		const payload = {
			serialCylnder: 'A11',
		};
		//this.props.getLstWeight(payload);
		this.props.getallchild(userInfor.isChildOf);
		this.askPermisson()
		try {
			this.props.getUserInfo(userInfor.isChildOf);
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

		//Bluetooth
		BluetoothManager.isBluetoothEnabled().then(
			enabled => {
				this.setState({
					bleOpend: Boolean(enabled),
					loading: false,
				});
			},
			err => {
				err;
			},
		);

		if (Platform.OS === 'ios') {
			let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);

			this._listeners.push(
				bluetoothManagerEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
					rsp => {
						this._deviceAlreadPaired(rsp);
					},
				),
			);
			this._listeners.push(
				bluetoothManagerEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_FOUND,
					rsp => {
						this._deviceFoundEvent(rsp);
					},
				),
			);
			this._listeners.push(
				bluetoothManagerEmitter.addListener(
					BluetoothManager.EVENT_CONNECTION_LOST,
					() => {
						this.setState({
							name: '',
							boundAddress: '',
						});
					},
				),
			);
		} else if (Platform.OS === 'android') {
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
					rsp => {
						this._deviceAlreadPaired(rsp);
					},
				),
			);
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_FOUND,
					rsp => {
						this._deviceFoundEvent(rsp);
					},
				),
			);
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_CONNECTION_LOST,
					() => {
						this.setState({
							name: '',
							boundAddress: '',
						});
					},
				),
			);
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
					() => {
						ToastAndroid.show(
							'Device Not Support Bluetooth !',
							ToastAndroid.LONG,
						);
					},
				),
			);
		}

		//this.props.getLstCylinder(cylinders)
		// this.props.getLstCylinder()
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

	_deviceAlreadPaired(rsp) {
		var ds = null;
		if (typeof rsp.devices == 'object') {
			ds = rsp.devices;
		} else {
			try {
				ds = JSON.parse(rsp.devices);
			} catch (e) { }
		}
		if (ds && ds.length) {
			let pared = this.state.pairedDs;
			ds.forEach((item) => {
				const isExist = pared.some((item_1) => item.address == item_1.address)
				if (!isExist) {
					pared.push(item)
				}
			})
			this.setState({
				pairedDs: pared,
			});
		}
	}

	_deviceFoundEvent(rsp) {
		//alert(JSON.stringify(rsp))
		var r = null;
		try {
			if (typeof rsp.device == 'object') {
				r = rsp.device;
			} else {
				r = JSON.parse(rsp.device);
			}
		} catch (e) {
			//alert(e.message);
			//ignore
		}
		//alert('f')
		if (r) {
			let found = this.state.foundDs || [];
			if (found.findIndex) {
				let duplicated = found.findIndex(function (x) {
					return x.address == r.address;
				});
				//CHECK DEPLICATED HERE...
				if (duplicated == -1) {
					found.push(r);
					this.setState({
						foundDs: found,
					});
				}
			}
		}
	}

	handleChangeLanguage = lgnCode => {
		//setLanguage(lgnCode);
		chooseLanguageConfig(lgnCode);
	};

	handleChange = (name, val) => {
		this.setState({
			...this.state,
			[name]: val,
		});
	};
	// handleChange = (key, value) => {
	//     this.setState({[key]: value})
	// }

	saveSign() {
		this.refs.sign.saveImage();
	}

	resetSign() {
		this.refs.sign.resetImage();
	}

	_onSaveEvent = result => {
		//result.encoded - for the base64 encoded png
		//result.pathName - for the file path name
		this.setState({
			signature: result.encoded,
			errorSignature: false
		});
	};
	_onDragEvent() {
		this.setState({ save_is_Disable: false });
		// This callback will be called when the user enters signature
	}

	askPermisson = async () => {
		console.log('request Permission');
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,

				{
					title: "Storage Permission",
					message: "App needs access to memory to download the file "
				}
			);

			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				const granted1 = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					{
						title: "Storage Permission",
						message: "App needs access to memory to download the file "
					}
				);
				if (granted1 !== PermissionsAndroid.RESULTS.GRANTED) {
					return false;
				}
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.warn(err);
			return false;
		}
	}

	handleSubmit = async e => {
		try {
			this.setState({ submitted: true });

			const {
				submitted,
				driverName,
				license_plate,
				signature,
				idCompany,
				cylindersReturn,
				numberOfCylinder,
				signature_CheckedBy,
				save_Signature_CheckedBy
			} = this.state;

			const { userInfor, cylinders, cyclinderAction } = this.props;

			console.log('c_return', this.state.cylindersReturn);
			const payload = {
				driver: driverName,
				idDriver: userInfor.id,
				license_plate,
				signature,
				cylinders,
				from: idCompany ? idCompany : null,
				to: userInfor.isChildOf,
				type: cyclinderAction,
				numberOfCylinder,
				cylindersReturn,
				turnbackByDriver: 'Yes',
			};


			if (save_Signature_CheckedBy && license_plate) {
				this.props.importDupCylinder(payload);
			} else {
				if ((!save_Signature_CheckedBy || signature_CheckedBy === base64_uncheckBox)) {
					Alert.alert(translate('notification'), translate('SIGN_REQ'), [
						{
							text: 'Thành công', onPress: () => console.log('OK Pressed')
						},
					],
						{ cancelable: false });
					return;
				}
				else {
					Alert.alert(translate('notification'), "Điền thông tin lại")
				}
			}
		} catch (error) {
			console.log(error)
		}
	};

	// handleSubmit = async e => {
	//     // e.preventDefault()
	//     //this.setState({submitted: true})

	//     const { cylinders, fromUser, cyclinderAction, userType } = this.props
	//     const { driver, idDriver, license_plate, signature, to, nameCustomer, addressCustomer, phoneCustomer, numberOfCylinder, cylindersReturn } = this.state
	//     let total = 0
	//     await this.state.numberArrays.map(item => {
	//         total = total + Number(item)

	//     })

	//     // Cuong them vao

	//     // if (userType === AGENCY) {
	//     //     if (!nameCustomer || !addressCustomer) {
	//     //         alert("Bạn nhập thiếu thông tin");
	//     //     }
	//     // }

	//     // End Cuong them vao

	//     this.setState({ total, submitted: true })

	//     // Kiem tra so luong binh ga xuat di
	//     // if (
	//     //     typeof this.state.numberArrays !== "undefined" &&
	//     //     this.state.numberArrays !== null &&
	//     //     this.state.numberArrays.length > 0
	//     // ) {
	//     //     for (let i = 0; i < this.state.numberArrays.length; i++) {
	//     //         if (this.state.numberArrays[i] <= 0) {
	//     //             Alert.alert(
	//     //                 translate('QUANTITY_CANNOT_BE_LESS_THAN_0'),
	//     //                 translate('PLEASE_TRY_AGAIN'),
	//     //                 [{text: translate('RETRY')}],
	//     //                 {cancelable: false}
	//     //             )
	//     //             return
	//     //         }
	//     //     }
	//     // }
	//     // if (
	//     //     typeof this.state.numberArrays !== "undefined" &&
	//     //     this.state.numberArrays !== null &&
	//     //     this.state.numberArrays.length > 0
	//     // ) {
	//     //     if (this.state.total !== cylinders.length) {
	//     //         // console.log('số luong lon hon')
	//     //         Alert.alert(
	//     //             translate('THE_QUANTITY_IS_INCORRECT'),
	//     //             translate('PLEASE_TRY_AGAIN'),
	//     //             [{ text: translate('RETRY') }],
	//     //             { cancelable: false }
	//     //         )

	//     //         return

	//     //     }
	//     // } else {
	//     //     if (this.state.total > cylinders.length) {
	//     //         //console.log('số luong lon hon')
	//     //         Alert.alert(
	//     //             translate('THE_QUANTITY_IS_INCORRECT'),
	//     //             translate('PLEASE_TRY_AGAIN'),
	//     //             [{ text: translate('RETRY') }],
	//     //             {cancelable: false}
	//     //         )
	//     //         return
	//     //     }
	//     // }

	//     console.log('cyclinderAction', cyclinderAction, userType)
	//     if (driver && license_plate) {
	//         if (cyclinderAction === IMPORT) {
	//             const payload = {
	//                 driver,
	//                 idDriver,
	//                 license_plate,
	//                 signature,
	//                 cylinders,
	//                 from: to,
	//                 to: fromUser,
	//                 type: cyclinderAction,
	//             }

	//             this.props.updateCylinders(payload)

	//         }
	//         if (cyclinderAction === EXPORT) {
	//             // TODO:
	//             if (userType === GENERAL) {
	//                 const payload = {
	//                     driver,
	//                     idDriver,
	//                     license_plate,
	//                     signature,
	//                     cylinders,
	//                     from: fromUser,
	//                     numberArray: this.state.numberArrays,
	//                     toArray: this.state.selectedItems,
	//                     to: null,
	//                     type: cyclinderAction,
	//                 }
	//                 console.log('payload', payload)
	//                 this.props.updateCylinders(payload)

	//             } else if (userType === FACTORY) {
	//                 const payload = {
	//                     driver,
	//                     idDriver,
	//                     license_plate,
	//                     signature,
	//                     cylinders,
	//                     from: fromUser,
	//                     numberArray: this.state.numberArrays,
	//                     toArray: this.state.selectedItems,
	//                     to: null,
	//                     type: cyclinderAction,
	//                 }
	//                 if (payload.toArray.length === 0) {
	//                     Alert.alert(
	//                         translate('PLEASE_SELECT_A_DESTINATION'),
	//                         translate('PLEASE_TRY_AGAIN'),
	//                         [{ text: translate('RETRY') }],
	//                         { cancelable: false }
	//                     )
	//                 } else {
	//                     this.props.updateCylinders(payload)
	//                 }

	//             } else {
	//                 if (!to) {
	//                     if (userType === AGENCY) {
	//                         if (nameCustomer && addressCustomer) {
	//                             const payload = {
	//                                 driver,
	//                                 idDriver,
	//                                 license_plate,
	//                                 signature,
	//                                 cylinders,
	//                                 from: fromUser,
	//                                 to: null,
	//                                 nameCustomer,
	//                                 addressCustomer,
	//                                 phoneCustomer,
	//                                 type: 'SALE',
	//                             }

	//                             this.props.updateCylinders(payload)
	//                         }
	//                         else {
	//                             alert(translate('YOU_ENTER_INFORMATION_IS_MISSING'));
	//                         }

	//                     } else {
	//                         const payload = {
	//                             driver,
	//                             idDriver,
	//                             license_plate,
	//                             signature,
	//                             cylinders,
	//                             from: fromUser,
	//                             to: null,
	//                             type: cyclinderAction,
	//                         }

	//                         this.props.updateCylinders(payload)

	//                     }
	//                 } else {
	//                     //console.log('loi o day')
	//                     const payload = {
	//                         driver,
	//                         idDriver,
	//                         license_plate,
	//                         signature,
	//                         cylinders,
	//                         from: fromUser,
	//                         to,
	//                         type: cyclinderAction,
	//                     }
	//                     this.props.updateCylinders(payload)
	//                 }
	//             }
	//         }
	//         if (cyclinderAction === TURN_BACK) {
	//             console.log("c_return", this.state.cylindersReturn)
	//             const payload = {
	//                 driver,
	//                 idDriver,
	//                 license_plate,
	//                 signature,
	//                 cylinders,
	//                 from: null,
	//                 to: fromUser,
	//                 type: cyclinderAction,
	//                 numberOfCylinder: numberOfCylinder,
	//                 cylindersReturn: cylindersReturn
	//             }

	//             console.log("payloadTesst", payload)
	//             this.props.updateCylinders(payload)

	//             // console.log("c_return", this.state.cylindersReturn)
	//             // const payload_rtnGas = {
	//             //     //idManufacture: this.props.id,
	//             //     cylindersReturn: cylindersReturn,
	//             //     //createBy: this.props.id
	//             // }
	//             // console.log("payload_rtnGas", payload_rtnGas)

	//             // // returnGas
	//             // this.props.returnGas(payload_rtnGas)
	//         }
	//         if (cyclinderAction === 'EXPORT_PARENT_CHILD') {
	//             const payload = {
	//                 driver,
	//                 idDriver,
	//                 license_plate,
	//                 signature,
	//                 cylinders,
	//                 from: fromUser,
	//                 to,
	//                 type: EXPORT,
	//                 exportPlace
	//             }

	//             //console.log("payloadTesst",payload)
	//             this.props.updateCylinders(payload)

	//         }
	//     }
	//     else {
	//         if (userType === AGENCY) {

	//             // let driverUnd = "Không xác định";
	//             // let license_plateUnd = "Không xác định";

	//             if (nameCustomer && addressCustomer) {
	//                 if (!driver && license_plate) {
	//                     const payload = {
	//                         driver: 'Không xác định',
	//                         idDriver: this.props.id,
	//                         license_plate,
	//                         signature,
	//                         cylinders,
	//                         from: fromUser,
	//                         to: null,
	//                         nameCustomer,
	//                         addressCustomer,
	//                         phoneCustomer,
	//                         type: 'SALE',
	//                     }
	//                     this.props.updateCylinders(payload)
	//                 }
	//                 else if (driver && !license_plate) {
	//                     const payload = {
	//                         driver,
	//                         idDriver,
	//                         license_plate: 'Không xác định',
	//                         signature,
	//                         cylinders,
	//                         from: fromUser,
	//                         to: null,
	//                         nameCustomer,
	//                         addressCustomer,
	//                         phoneCustomer,
	//                         type: 'SALE',
	//                     }
	//                     this.props.updateCylinders(payload)
	//                 }
	//                 else {
	//                     // if (nameCustomer && addressCustomer) {
	//                     //     // Tiep
	//                     const payload = {
	//                         driver: 'Không xác định',
	//                         idDriver: this.props.id,
	//                         license_plate: 'Không xác định',
	//                         signature,
	//                         cylinders,
	//                         from: fromUser,
	//                         to: null,
	//                         nameCustomer,
	//                         addressCustomer,
	//                         phoneCustomer,
	//                         type: 'SALE',
	//                     }
	//                     this.props.updateCylinders(payload)
	//                     // }
	//                 }
	//             }

	//         }
	//     }
	// }

	renderError = error => {
		console.log(error);
		return (
			<WingBlank>
				<WhiteSpace size="lg" />
				<Text style={styles.txtError}>{error}</Text>
			</WingBlank>
		);
	};

	// getItemFromDestinationList(list_id) {
	//     let selectedItemsFullInfo = []
	//     for (let j = 0; j < list_id.length; j++) {
	//         const id = list_id[j]
	//         for (let i = 0; i < this.props.destinationList.length; i++) {
	//             if (this.props.destinationList[i].id === id) {
	//                 selectedItemsFullInfo.push(this.props.destinationList[i])
	//             }
	//         }
	//     }
	//     this.setState({ selectedItemsFullInfo })
	//     console.log('selectedItemsFullInfo', selectedItemsFullInfo)
	// }

	// onSelectedItemsChange = selectedItems => {
	//     //const { numberArray } = this.state
	//     let numberArrays = []
	//     for (i = 0; i < selectedItems.length; i++) {
	//         numberArrays[i] = '0'
	//     }

	//     this.getItemFromDestinationList(selectedItems)
	//     this.setState({ numberArrays })
	//     this.setState({ selectedItems })
	//     console.log('selectedItems', selectedItems)
	// }

	// // TODO: remove after authorization
	// getDestination = () => {
	//     const {
	//         cyclinderAction,
	//         generalList,
	//         factoryList,
	//         stationList,
	//         agencyList,
	//         userType
	//     } = this.props

	//     if (cyclinderAction === IMPORT) {
	//         if (userType === FACTORY) {
	//             return [{ id: null, name: "Người dân" }]
	//         }
	//         if (userType === GENERAL || userType === STATION) {
	//             return factoryList

	//         }
	//         if (userType === AGENCY) {
	//             return generalList

	//         }
	//     }
	//     if (cyclinderAction === EXPORT) {
	//         if (userType === FACTORY) {
	//             const outputList = [...generalList, ...stationList, ...agencyList]

	//             return outputList

	//         }
	//         if (userType === GENERAL) {
	//             return agencyList
	//         }
	//         if (userType === STATION) {
	//             return factoryList

	//         }
	//         if (userType === AGENCY) {
	//             return [{ id: null, name: "Người dân" }]

	//         }
	//     }
	//     if (cyclinderAction === TURN_BACK) {
	//         if (userType === FACTORY) {
	//             return [{ id: null, name: "Người dân" }]

	//         }
	//     }
	// }

	// renderRow(item, index) {
	//     return (
	//         <View style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}>
	//             <View style={{ flex: 1, alignSelf: "stretch" }}>
	//                 {item.name ? <Text>{item.name}</Text> : null}
	//             </View>
	//             <View style={{ flex: 1, alignSelf: "stretch" }}>
	//                 <InputItem
	//                     //defaultValue='0'
	//                     onChange={value => {
	//                         let numberArrays = this.state.numberArrays
	//                         numberArrays[index] = value

	//                         this.setState({
	//                             numberArrays,
	//                         })
	//                     }}
	//                     type={'number'}
	//                     placeholder={translate('ENTER_THE_AMOUNT')}
	//                 />
	//                 {this.state.submitted &&
	//                     !this.state.numberArrays[index] &&
	//                     this.renderError(translate('AMOUNT_IS_REQUIRED'))}
	//             </View>
	//         </View>
	//     )
	// }

	// checkSubmit() {
	//     let check = false;
	//     if (!this.state.idDriver) {
	//         this.setState({ errorDriver: translate('DRIVER_NAME_IS_REQUIRED') })
	//     }
	//     // else if(!this.state.to) {
	//     //     this.setState({errorCompany : translate('COMPANY_IS_REQUIRED')})

	//     //}
	//     else if (!this.state.license_plate) {
	//         this.setState({
	//             errorLicensePlate: translate('LICENSE_PLATE_IS_REQUIRED')
	//         })
	//     } else if (!this.state.signature) {
	//         this.setState({
	//             errorSignature: translate('SIGNATURE_IS_REQUIRED')
	//         })
	//     } else {
	//         check = true;

	//     }

	//     // if (this.props.cyclinderAction === TURN_BACK) {
	//     //     check = true;
	//     // }

	//     return check;
	// }

	// renderNotCylinder() {
	//     const { submitted, numberOfCylinder } = this.state
	//     return (
	//         <View>
	//             <InputItem
	//                 //onChangeText={v => this.handleChange('driver', v)}
	//                 type="number"
	//                 onChange={numberOfCylinder => {
	//                     this.setState({
	//                         numberOfCylinder
	//                     })
	//                 }}
	//                 placeholder={translate('TOTAL_IMPORT')}
	//             />
	//         </View>
	//     )
	// }

	// get_lsDriver() {
	//     this.setState({
	//         textAbc : this.props.getListDriver(this.props.id.toString())
	//     })
	// }

	// handleFindCylinder = () => {
	//     const payload = {
	//         findCylinders: ["5de9dc3fb4dabc37ae9d5ca3", "5de9dc3fb4dabc37ae9d5ca4"]
	//     }
	//     alert('clicked')
	//     this.props.getLstCylinder(payload)
	// }

	// change_numberArray = (index) => {
	//     let default_numberArray = []
	//     for (i=0; i<index; i++) {
	//         default_numberArray[index] = '0'
	//     }
	//     this.setState({default_numberArray})
	// }

	render() {
		const {
			driverName,
			license_plate,
			idCompany,
			codeCompany,
			nameCompany,
			addressCompany,
			signature,
			cylindersReturn,
			submitted,
			customerType,
			isCustomerType,
		} = this.state;
		const {
			userType,
			userInfor,
			listChildCompany,
			isCylindersLoading,
			list_inforCylinder,
			inforTBComp,
			listCustomer,
		} = this.props;
		// console.log('listChildCompany', listChildCompany);
		// console.log('listCustomer', listCustomer);
		// console.log('idCompany', idCompany);
		// console.log('nameCompany', nameCompany);
		// console.log('codeCompany', codeCompany);
		// console.log('addressCompany', addressCompany);

		// const {driver, license_plate, submitted,licenseCustomer, nameCustomer, addressCustomer, selectedItemsFullInfo} = this.state
		// const {isAuthLoading, isCylindersLoading, error, cyclinderAction, userType, cyclinder, cylinders, listNameDriver, id} = this.props
		// const cyclinderLast = saver.getArrCyclinder()
		// let destinationList = this.props.destinationList

		// console.log('props_list_inforCylinder', list_inforCylinder)
		// if (list_inforCylinder) {
		//     let data_cylindersInfor = list_inforCylinder.data_cylindersInfor
		//     console.log('props_data_cylindersInfor', data_cylindersInfor)
		// }

		// console.log("before_destinationList", destinationList)
		// if (destinationList) {
		//     destinationList.map( user => {
		//         if (user.userRole !== 'SuperAdmin') {
		//             const index = destinationList.indexOf(user)
		//             if (index > -1) {
		//                 destinationList.splice(index, 1);
		//             }
		//         }
		//     })
		// }
		// console.log("after_destinationList", destinationList)

		// if (isAuthLoading || isCylindersLoading) {
		//     return <ActivityIndicator size="large" color={COLOR.BLUE}/>

		// }
		//const itemFrom = this.props.cyclinder.histories[lastItem]
		return (
			<ScrollView>
				<Flex style={styles.container}>
					<Flex.Item>
						<Card>
							<Card.Header title={translate('SHIPPING_INFORMATION')} />
							<Card.Body>
								<WingBlank>
									<TextInput
										label="Tên tài xế"
										mode="outlined"
										disabled="true"
										value={driverName}
										theme={{
											colors: {
												// placeholder: 'white',
												// text: 'white',
												// primary: 'white',
												// underlineColor: 'transparent',
												background: '#FFF',
											},
										}}
									//onChangeText={text => this.setState({ text })}
									/>
								</WingBlank>
								<WhiteSpace size="lg" />
								<WingBlank>
									<TextInput
										label={translate('LICENSE_PLATE')}
										value={license_plate}
										mode="outlined"
										onChangeText={license_plate => {
											this.setState({
												license_plate,
												errorLicensePlate: false,
											});
										}}
										theme={{
											colors: {
												// placeholder: 'white',
												// text: 'white',
												// primary: 'white',
												// underlineColor: 'transparent',
												background: '#FFF',
											},
										}}
										error={this.state.errorLicensePlate}
									/>
									{submitted &&
										!license_plate &&
										this.renderError(translate('LICENSE_PLATE_IS_REQUIRED'))}
								</WingBlank>
								<WhiteSpace />
								<WingBlank>
									<TextInput
										label={translate('TURNBACK_TO_COMPANY')}
										mode="outlined"
										disabled="true"
										// value={userInfor.isChildOf}
										value={inforTBComp.name}
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
								<WingBlank>
									{/* <TextInput
									//onChangeText={v => this.handleChange('driver', v)}
									label={translate('TOTAL_IMPORT')}
									mode="outlined"
									keyboardType="numeric"
									onChange={numberOfCylinder => {
										this.setState({
											numberOfCylinder
										});
									}}
									theme={{
										colors: {
											// placeholder: 'white',
											// text: 'white',
											// primary: 'white',
											// underlineColor: 'transparent',
											background: '#FFF',
										},
									}}
									// placeholder={translate('TOTAL_IMPORT')}
								/> */}

									<InputItem
										//onChangeText={v => this.handleChange('driver', v)}
										type="number"
										onChange={(numberOfCylinder) => {
											this.setState({
												numberOfCylinder,
											});
										}}
										placeholder={translate("TOTAL_IMPORT")}
									/>

								</WingBlank>
								<WhiteSpace />

								{/* Chọn loại khách hàng */}

								{
									userInfor.userRole === "Deliver" &&
									<View>
										<PickerCustom
											placeholder={translate("CUSTOMER_TYPE")}
											value={customerType}
											error={this.state.errorCompany}
											ref={this.customerTypePickerCustomRef}
											listItem={CUSTOMER_TYPES?.map((type) => ({
												value: type.value,
												label: type.name,
												//address: company.address
											}))}
											setValue={(value) => {
												// console.log("setValue={(value3)", value);
												if (value.value) {
													this.setState({
														customerType: value.value,
														isCustomerType: true,
													});
													console.log("value", value);
													const payload = {
														customerType: value.value,
														isChildOf: userInfor.isChildOf,
													}
													this.props.getListCustomerType(payload);
												}
											}}
										/>
										{/* {submitted && !customerType
											? this.renderError("bạn chưa chọn ")
											: null} */}
										{customerType &&
											listCustomer.data.length > 0 &&
											isCustomerType ? (
											<PickerCustom
												placeholder={translate("CHOOSE_COMPANY")}
												value={idCompany}
												error={this.state.errorListCustomer}
												ref={this.customerPickerCustomRef}
												listItem={listCustomer.data.map((company) => ({
													value: company.id,
													label: company.name,
													//address: company.address
												}))}
												setValue={(value) => {
													console.log("setValue={(valueCustomer)", value);
													if (value.value) {
														// Tìm thông tin khách hàng đã chọn
														const selectedCustomer = listCustomer.data.find(_customer => {
															return _customer.id === value.value
														})
														if (selectedCustomer) {
															this.setState({
																idCompany: selectedCustomer.id,
																codeCompany: selectedCustomer.code,
																nameCompany: selectedCustomer.name,
																addressCompany: selectedCustomer.address,
															});
														}
													}

												}}
											/>
										) : null}
									</View>
								}










								{/* <WhiteSpace />
                                <PickerCustom
                                    placeholder={translate('CHOOSE_COMPANY')}
                                    value={idCompany}
                                    error={this.state.errorCompany}
                                    ref={this.pickerCustomRef} listItem={listChildCompany?.map(company => ({
                                        value: company.id,
                                        label: company.name,
                                        //address: company.address
                                    }))} setValue={(value) => {
                                        console.log('setValue={(value)', value);

                                        this.setState({ idCompany: value.value, nameCompany: value.label, addressCompany: listChildCompany?.length>0 ? listChildCompany[value.index]?.address : '', errorCompany: false })
                                        //console.log(value.value);
                                        //this.setState({ driver: value.label })

                                    }}></PickerCustom> */}
								{/* <WingBlank style={{ flex: 1}}> */}
								<View style={{ flexDirection: 'column', height: 380 }}>
									<Text style={{ textAlign: 'center' }}>
										{translate('SIGNATURE')}
									</Text>
									<Text style={{ textAlign: 'center', color: 'red' }}>
										{this.state.errorSignature
											? this.state.errorSignature
											: null}
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
											ref="sign"
											onSaveEvent={this._onSaveEvent}
											onDragEvent={this._onDragEvent.bind(this)}
											saveImageFileInExtStorage={true}
											showNativeButtons={false}
											showTitleLabel={false}
											viewMode={'portrait'}
										/>
										{/* {this.state.save ? <View style={{width : '100%', height : 250, opacity : 0.1, backgroundColor : 'black', position : 'absolute', top : 0}} /> : null} */}

										{this.state.save_Signature_CheckedBy ? (
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
														uri: `data:image/png;base64,${this.state.signature}`,
													}}
												/>
											</View>
										) : null}
									</View>

									<View style={{ flexDirection: 'row' }}>
										<TouchableOpacity
											disabled={this.state.save_is_Disable}
											style={styles.buttonStyle}
											onPress={() => {
												this.setState({ save_Signature_CheckedBy: true });
												this.saveSign();
											}}
										>
											<Text>{translate('SAVE')}</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={styles.buttonStyle}
											onPress={() => {
												this.setState({ save_Signature_CheckedBy: false });
												this.resetSign();
											}}
										>
											<Text>{translate('RESET')}</Text>
										</TouchableOpacity>
									</View>
								</View>
								{/* </WingBlank> */}
								{console.log("Hoai", userType)}
								<WingBlank>
									<WhiteSpace size="lg" />
									{isCylindersLoading ? (
										<ActivityIndicator size="large" color={COLOR.BLUE} />
									) : (
										<TouchableOpacity
											//disabled={((userType === FACTORY || userType === GENERAL) && cyclinderAction === EXPORT && destinationList.length === 0) ? true : false}
											style={styles.btnFinish}
											onPress={() => {
												// if(this.checkSubmit()) {
												this.handleSubmit();
												// }
												// alert("abc")
											}}
										>
											<Text style={styles.txtFinish}>{translate('FINISH')}</Text>
										</TouchableOpacity>
									)}
								</WingBlank>
							</Card.Body>
						</Card>

						<WingBlank>
							<WhiteSpace size="lg" />

							<Text textAlign="center">{translate('TURN_ON_BLUETOOTH')}</Text>
							<Text style={styles.title}>
								{translate('BLUETOOTH_STATUS')}:{' '}
								{this.state.bleOpend ? translate('ON') : translate('OFF')}
							</Text>

							<View>
								<Switch
									value={this.state.bleOpend}
									onValueChange={v => {
										this.setState({
											loading: true,
										});
										if (!v) {
											BluetoothManager.disableBluetooth().then(
												() => {
													this.setState({
														bleOpend: false,
														loading: false,
														foundDs: [],
														pairedDs: [],
													});
												},
												err => {
													Alert.alert(translate('notification'), "Lỗi",
														[{ text: "lại" }],
														{ cancelable: false });
												},
											);
										} else {
											BluetoothManager.enableBluetooth().then(
												r => {
													var paired = [];
													if (r && r.length > 0) {
														for (var i = 0; i < r.length; i++) {
															try {
																paired.push(JSON.parse(r[i]));
																// console.log("123213123", paired)
															} catch (e) {
																//ignore
																console.log(e);
															}
														}
													}
													this.setState({
														bleOpend: true,
														loading: false,
														pairedDs: paired,
													});
												},
												err => {
													this.setState({
														loading: false,
													});
													Alert.alert(translate('notification'), "Lỗi",
														[{ text: "lại" }],
														{ cancelable: false });
												},
											);
										}
									}}
								/>

							</View>
							<Text style={styles.title}>
								{translate('CONNECT_DEVICE')}
								<Text style={{ color: 'blue' }}>
									{!this.state.name ? translate('NO_DEVICE') : this.state.name}
								</Text>
							</Text>
							<Text style={styles.title}>{translate('NO_DEVICE')}</Text>
							{this.state.loading ? (
								<ActivityIndicator animating={true} />
							) : null}
							<View style={{ flex: 1, flexDirection: 'column' }}>
								{this._renderRow(this.state.foundDs)}
							</View>
							<Text style={styles.title}>{translate('DEVICE_PAIRED')}</Text>
							{this.state.loading ? (
								<ActivityIndicator animating={true} />
							) : null}
							<View style={{ flex: 1, flexDirection: 'column' }}>
								{this._renderRow(this.state.pairedDs)}
							</View>

							<View style={{ paddingTop: 10 }}>
								<TouchableOpacity
									disabled={
										this.state.loading ||
										!(this.state.bleOpend && this.state.boundAddress.length > 0)
									}
									style={(this.state.bleOpend && this.state.boundAddress.length > 0) ? styles.btnFinish : styles.btnFinishDisable}
									onPress={async () => {
										let FullCylinder_50 = [];
										let FullCylinder_45 = [];
										let FullCylinder_12 = [];

										let EmptyCylinder_50 = [];
										let EmptyCylinder_45 = [];
										let EmptyCylinder_12 = [];

										if (list_inforCylinder.length > 0) {
											Promise.all(
												list_inforCylinder.map(cylinder => {
													//console.log('cylinder', cylinder)
													// if (cylinder.status === 'FULL') {
													//     if (cylinder.weight<18) {
													//         let c_Return = cylindersReturn.find(element=> element.id == cylinder.id)
													//         FullCylinder_12.push(Object.assign(cylinder, {weightReturn: c_Return.weight}))
													//     }
													//     else if (cylinder.weight>=18 && cylinder.weight<33) {
													//         let c_Return = cylindersReturn.find(element=> element.id == cylinder.id)
													//         FullCylinder_45.push(Object.assign(cylinder, {weightReturn: c_Return.weight}))
													//     }
													//     else if (cylinder.weight>=33) {
													//         let c_Return = cylindersReturn.find(element=> element.id == cylinder.id)
													//         FullCylinder_50.push(Object.assign(cylinder, {weightReturn: c_Return.weight}))
													//     }
													// }
													// if (cylinder.status === 'EMPTY') {
													if (cylinder.weight < 18) {
														let c_Return = cylindersReturn.find(
															element => element.id == cylinder.id,
														);
														EmptyCylinder_12.push(
															Object.assign(cylinder, {
																weightReturn: c_Return.weight,
																surplus: ((c_Return.weight) - (cylinder.weight))
															}),
														);
														// EmptyCylinder_12.push(cylinder)
													} else if (
														cylinder.weight >= 18 &&
														cylinder.weight < 39
													) {
														let c_Return = cylindersReturn.find(
															element => element.id == cylinder.id,
														);
														EmptyCylinder_45.push(
															Object.assign(cylinder, {
																weightReturn: c_Return.weight,
																surplus: ((c_Return.weight) - (cylinder.weight))

															}),
														);
														// EmptyCylinder_45.push(cylinder)
													} else if (cylinder.weight >= 39) {
														let c_Return = cylindersReturn.find(
															element => element.id == cylinder.id,
														);
														EmptyCylinder_50.push(
															Object.assign(cylinder, {
																weightReturn: c_Return.weight,
																surplus: ((c_Return.weight) - (cylinder.weight))
															}),
														);
														// EmptyCylinder_50.push(cylinder)
													}
													// }
												}),
											);

											// console.log(EmptyCylinder_50)
											// console.log(EmptyCylinder_45)
											// console.log(EmptyCylinder_12)
											// EmptyCylinder_12, EmptyCylinder_45, EmptyCylinder_50
											// )

											try {
												await BluetoothEscposPrinter.printerAlign(
													BluetoothEscposPrinter.ALIGN.CENTER,
												);
												await BluetoothEscposPrinter.printText(
													'CONG TY TNHH KHI HOA LONG VIET NAM - VT GAS\n\r',
													{
														//encoding: 'GBK',
														//codepage: 0,
														widthtimes: 3,
														heigthtimes: 3,
														fonttype: 1,
													},
												);
												await BluetoothEscposPrinter.printerAlign(
													BluetoothEscposPrinter.ALIGN.CENTER,
												);
												await BluetoothEscposPrinter.printText(
													'\n\r',
													{
														//encoding: 'GBK',
														//codepage: 0,
														widthtimes: 1,
														heigthtimes: 1,
														fonttype: 0,
													},
												);
												await BluetoothEscposPrinter.printText(
													'\n\rBIEN BAN GIAO NHAN HANG HOA\n\r',
													{},
												);
												await BluetoothEscposPrinter.printText('\n\r', {});

												await BluetoothEscposPrinter.printerAlign(
													BluetoothEscposPrinter.ALIGN.CENTER,
												);

												await BluetoothEscposPrinter.printColumn(
													[13, 2, 33],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
													],
													['Ma KH', ': ', codeCompany ? codeCompany : ''],
													{ fonttype: 1 },
												);
												await BluetoothEscposPrinter.printColumn(
													[13, 2, 33],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
													],
													[
														'Ten KH',
														': ',
														nameCompany ? cleanAccents(nameCompany) : '',
													],
													{ fonttype: 1 },
												);
												await BluetoothEscposPrinter.printColumn(
													[13, 2, 33],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
													],
													[
														'Dia Chi',
														': ',
														addressCompany ? cleanAccents(addressCompany) : '',
													],
													{ fonttype: 1 },
												);

												await BluetoothEscposPrinter.printColumn(
													[13, 2, 33],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
													],
													[
														'Ngay/Gio',
														': ',
														moment(new Date()).format('DD/MM/YYYY, HH:mm:ss'),
													],
													{ fonttype: 1 },
												);
												await BluetoothEscposPrinter.printColumn(
													[13, 2, 33],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
													],
													[
														'NV Giao Hang',
														': ',
														driverName ? cleanAccents(driverName) : '',
													],
													{ fonttype: 1 },
												);
												await BluetoothEscposPrinter.printColumn(
													[13, 2, 33],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.LEFT,
													],
													['So Xe', ': ', license_plate ? license_plate : ''],
													{ fonttype: 1 },
												);

												// --- // Tai xe nhap hang thay
												// await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

												// await BluetoothEscposPrinter.printText('GIAO BINH DAY (FULL CYLINDER)\n\r', {});
												// await BluetoothEscposPrinter.printText('\n\r', {})

												// await BluetoothEscposPrinter.printColumn([24, 24],
												//     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
												//     ['Binh day - 50Kg', `SL: ${FullCylinder_50.length} binh`], { });
												// if (FullCylinder_50.length > 0) {
												//     for (i = 0; i < FullCylinder_50.length; i++) {
												//         await BluetoothEscposPrinter.printColumn([8, 24, 8, 8],
												//             [BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER],
												//             [(i + 1).toString() + '. 50Kg', FullCylinder_50[i].serial, (FullCylinder_50[i].weight + 50).toString() + ' Kg', (FullCylinder_50[i].weight).toString() + ' Kg'], {});
												//     }
												// }

												// await BluetoothEscposPrinter.printColumn([24, 24],
												//     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
												//     ['Binh day - 45Kg', `SL: ${FullCylinder_45.length} binh`], { });
												// if (FullCylinder_45.length > 0) {
												//     for (i = 0; i < FullCylinder_45.length; i++) {
												//         await BluetoothEscposPrinter.printColumn([8, 24, 8, 8],
												//             [BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER],
												//             [(i + 1).toString() + '. 45Kg', FullCylinder_45[i].serial, (FullCylinder_45[i].weight + 45).toString() + ' Kg', (FullCylinder_45[i].weight).toString() + ' Kg'], {});
												//     }
												// }

												// await BluetoothEscposPrinter.printColumn([24, 24],
												//     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
												//     ['Binh day - 12Kg', `SL: ${FullCylinder_12.length} binh`], { });
												// if (FullCylinder_12.length > 0) {
												//     for (i = 0; i < FullCylinder_45.length; i++) {
												//         await BluetoothEscposPrinter.printColumn([8, 24, 8, 8],
												//             [BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER],
												//             [(i + 1).toString() + '. 12Kg', FullCylinder_12[i].serial, '- Kg', '- Kg'], {});
												//     }
												// }

												// --- // Tai xe hoi luu
												await BluetoothEscposPrinter.printText(
													'\n\r--------------------------------\n\r',
													{},
												);

												await BluetoothEscposPrinter.printText(
													'GIAO BINH RONG (EMPTY CYLINDER)\n\r',
													{},
												);
												await BluetoothEscposPrinter.printText('\n\r', {});


												await BluetoothEscposPrinter.printColumn(
													[48],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,

													],
													[
														` Binh 45 Kg `,
													],
													{},
												)

												if (EmptyCylinder_50.length > 0) {
													let totalcounnt = EmptyCylinder_50.reduce((s, x) => s + x.surplus, 0);

													await BluetoothEscposPrinter.printColumn(
														[24, 8, 8, 8],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`    Ma Seri`,
															'TL. LPG',
															' TL. Vo',
															' Gas du',
														],
														{},
													);

													await BluetoothEscposPrinter.printColumn(
														[24, 8, 8, 8],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`    Don vi`,
															'Kg',
															' Kg',
															' Kg',
														],
														{},
													);

													for (i = 0; i < EmptyCylinder_50.length; i++) {
														await BluetoothEscposPrinter.printColumn(
															[24, 8, 8, 8],
															[
																BluetoothEscposPrinter.ALIGN.LEFT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
															],
															[
																(i + 1).toString() + '. ' + EmptyCylinder_50[i].serial,
																EmptyCylinder_50[i].weightReturn.toString(),
																EmptyCylinder_50[i].weight.toString(),
																EmptyCylinder_50[i].surplus.toFixed(1).toString(),
															],
															{},
														)

													}
													await BluetoothEscposPrinter.printColumn(
														[18, 11, 10, 9],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.CENTER,
															BluetoothEscposPrinter.ALIGN.CENTER,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`Tong: SL: ${EmptyCylinder_50.length} binh`,
															'',
															'',
															totalcounnt.toFixed(1).toString() + ' Kg'
														],
														{},
													);


												}

												if (EmptyCylinder_45.length > 0) {

													let totalcounnt = EmptyCylinder_45.reduce((s, x) => s + x.surplus, 0);
													await BluetoothEscposPrinter.printColumn(
														[24, 8, 8, 8],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`    Ma Seri `,
															'TL. LPG',
															' TL. Vo',
															' Gas du',
														],
														{},
													);

													await BluetoothEscposPrinter.printColumn(
														[24, 8, 8, 8],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`    Don vi`,
															'Kg',
															' Kg',
															' Kg',
														],
														{},
													);

													for (i = 0; i < EmptyCylinder_45.length; i++) {
														await BluetoothEscposPrinter.printColumn(
															[24, 8, 8, 8],
															[
																BluetoothEscposPrinter.ALIGN.LEFT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
															],
															[
																(i + 1).toString() + '. ' + EmptyCylinder_45[i].serial,
																EmptyCylinder_45[i].weightReturn.toString(),
																EmptyCylinder_45[i].weight.toString(),
																EmptyCylinder_45[i].surplus.toFixed(1).toString(),

															],
															{},

														);
													}
													await BluetoothEscposPrinter.printColumn(
														[18, 11, 10, 9],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.CENTER,
															BluetoothEscposPrinter.ALIGN.CENTER,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`tong: SL: ${EmptyCylinder_45.length} binh`,
															'',
															'',
															totalcounnt.toFixed(1).toString() + ' Kg'
														],
														{},
													);

												}

												await BluetoothEscposPrinter.printColumn(
													[48],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,

													],
													[
														` Binh 12 Kg `,
													],
													{},
												);

												if (EmptyCylinder_12.length > 0) {
													let totalcounnt = EmptyCylinder_12.reduce((s, x) => s + x.surplus, 0);
													await BluetoothEscposPrinter.printColumn(
														[24, 8, 8, 8],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`    Ma Seri `,
															'TL. LPG',
															' TL. Vo',
															' Gas du',
														],
														{},
													);

													await BluetoothEscposPrinter.printColumn(
														[24, 8, 8, 8],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`    Don vi`,
															'Kg',
															' Kg',
															' Kg',
														],
														{},
													);

													for (i = 0; i < EmptyCylinder_12.length; i++) {
														await BluetoothEscposPrinter.printColumn(
															[24, 8, 8, 8],
															[
																BluetoothEscposPrinter.ALIGN.LEFT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
																BluetoothEscposPrinter.ALIGN.RIGHT,
															],
															[
																(i + 1).toString() + '. ' + EmptyCylinder_12[i].serial,
																EmptyCylinder_12[i].weightReturn.toString(),
																EmptyCylinder_12[i].weight.toString(),
																EmptyCylinder_12[i].surplus.toFixed(1).toString(),

															],
															{},
														)

													}
													await BluetoothEscposPrinter.printColumn(
														[18, 11, 10, 9],
														[
															BluetoothEscposPrinter.ALIGN.LEFT,
															BluetoothEscposPrinter.ALIGN.CENTER,
															BluetoothEscposPrinter.ALIGN.CENTER,
															BluetoothEscposPrinter.ALIGN.RIGHT,
														],
														[
															`Tong: SL: ${EmptyCylinder_12.length} binh`,
															'',
															'',
															totalcounnt.toFixed(1).toString() + ' Kg'
														],
														{},
													);
												}

												await BluetoothEscposPrinter.printText(
													'\n\r--------------------------------\n\r',
													{},
												);


												await BluetoothEscposPrinter.printColumn(
													[27, 6],
													[
														BluetoothEscposPrinter.ALIGN.LEFT,
														BluetoothEscposPrinter.ALIGN.RIGHT,
													],
													[
														'Da kiem tra an toan va thu bang binh xit xa phong',
														'[ ]',
													],
													{},
												);

												await BluetoothEscposPrinter.printColumn(
													[
														BluetoothEscposPrinter.width58 / 8 / 2,
														BluetoothEscposPrinter.width58 / 8 / 2,
													],
													[
														BluetoothEscposPrinter.ALIGN.CENTER,
														BluetoothEscposPrinter.ALIGN.CENTER,
													],
													['Cong Ty Gas South', 'Dai Dien Khach Hang'],
													{},
												);
												await BluetoothEscposPrinter.printColumn(
													[
														BluetoothEscposPrinter.width58 / 8 / 2,
														BluetoothEscposPrinter.width58 / 8 / 2,
													],
													[
														BluetoothEscposPrinter.ALIGN.CENTER,
														BluetoothEscposPrinter.ALIGN.CENTER,
													],
													['(Ky & Ghi ro Ho ten)', '(Ky & Ghi ro Ho ten)'],
													{},
												);
												await BluetoothEscposPrinter.printPic(signature, {
													width: 200,
													left: 20,
												});
											} catch (e) {
												console.log(e)
												Alert.alert(translate('notification'), "Lỗi",
													[{ text: "lại" }],
													{ cancelable: false });
											}
										} else {
											Alert.alert(translate('notification'), "Chưa quét bình nào",
												[{ text: "lại" }],
												{ cancelable: false });
										}
									}}
								>
									<Text style={styles.txtFinish}>{translate('SCAN_ACCEPT')}</Text>
								</TouchableOpacity>
							</View>
						</WingBlank>
					</Flex.Item>
				</Flex>
			</ScrollView>
		);
	}

	// Bluetooth
	_renderRow(rows) {
		let items = [];
		for (let i in rows) {
			let row = rows[i];
			if (row.address) {
				items.push(
					<TouchableOpacity
						key={new Date().getTime() + i}
						style={styles.wtf}
						onPress={() => {
							this.setState({
								loading: true,
							});
							BluetoothManager.connect(row.address).then(
								s => {
									this.setState({
										loading: false,
										boundAddress: row.address,
										name: row.name || 'UNKNOWN',
									});
								},
								e => {
									this.setState({
										loading: false,
									});
									Alert.alert(translate('notification'), "Lỗi",
										[{ text: "lại" }],
										{ cancelable: false });
								},
							);
						}}
					>
						<Text style={styles.name}>{row.name || 'UNKNOWN'}</Text>
						<Text style={styles.address}>{row.address}</Text>
					</TouchableOpacity>,
				);
			}
		}
		return items;
	}

	// _scan() {
	//     this.setState({
	//         loading: true
	//     })
	//     BluetoothManager.scanDevices()
	//         .then((s) => {
	//             var ss = s;
	//             var found = ss.found;
	//             try {
	//                 found = JSON.parse(found);//@FIX_it: the parse action too weired..
	//             } catch (e) {
	//                 //ignore
	//             }
	//             var fds = this.state.foundDs;
	//             if (found && found.length) {
	//                 fds = found;
	//             }
	//             this.setState({
	//                 foundDs: fds,
	//                 loading: false
	//             });
	//         }, (er) => {
	//             this.setState({
	//                 loading: false
	//             })
	//             alert('error' + JSON.stringify(er));
	//         });
	// }
}

export const mapStateToProps = state => ({
	userInfor: state.auth.user,
	listChildCompany: state.inspector.listChildCompany,
	// exportPlaceCylinder: state.exportPlaces.exportPlace,
	// isAuthLoading: state.auth.loading,
	isCylindersLoading: state.cylinders.loading,
	// error: state.auth.error,
	// fromUser: state.auth.user.id,
	// cyclinder: state.cylinders.cyclinder,
	cylinders: state.cylinders.cylinders,
	cyclinderAction: state.cylinders.cyclinderAction,
	userType: state.auth.user.userType,
	// generalList: state.auth.general,
	// factoryList: state.auth.factory,
	// stationList: state.auth.station,
	// agencyList: state.auth.agency,
	// typeForPartner: state.cylinders.typeForPartner,
	// destinationList: destinationList(state, state),
	// listNameDriver: state.auth.listNameDriver,
	// id: state.auth.user.id,
	// strFromUser: state.auth.user.name,
	list_inforCylinder: state.print.list_inforCylinder,
	inforTBComp: state.auth.inforTBComp,
	listCustomer: state.customer.resultCustomer,
});

export default connect(mapStateToProps, {
	//updateCylinders, 
	//fetchUsers, exportPlace, getListDriver, returnGas, getLstCylinder,
	updateCylinders,
	getallchild,
	getLstCylinder,
	getUserInfo,
	importDupCylinder,
	//getLstWeight,
	getListCustomerType,
})(TurnbackByDriver);
