import React, { Component } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	TouchableOpacity,
	Image,
	ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { COLOR } from '../constants';

import { getToken, getUserInfo } from '../helper/auth';

import { getSignature } from '../actions/AuthActions';
import { Actions } from 'react-native-router-flux';
import SignatureCapture from 'react-native-signature-capture';
import moment from 'moment';

import {
	//Button,
	WingBlank,
	Flex,
	InputItem,
	Card,
	WhiteSpace,
} from '@ant-design/react-native/lib';

const styles = StyleSheet.create({
	txtError: {
		fontSize: 18,
		color: COLOR.RED,
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
	image: {
		width: 200,
		height: 100,
	},
	cardView: {
		width: '90%',
		borderWidth: 1,
		marginVertical: 10,
		borderRadius: 5,
		borderColor: '#8d8d8d',
		padding: 10,
	},
});

import { setLanguage, getLanguage } from '../helper/auth';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

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

class Signature extends Component {
	constructor(props) {
		super(props);
		//chooseLanguageConfig('vi');
		this.state = {
			signature: '',
			idDriver: props.idDriver,
		};
	}

	// onChange = (e) => {
	//     let target = e.target;
	//     let name = target.name;
	//     let value = target.value;
	//     this.setState({
	//       [name]: value
	//     });
	//   };

	componentDidMount = async () => {
		//const id_Driver = "5ea1011740aafe29b0c925ce";
		//this.props.getSignature(id_Driver);
		this.props.getSignature(this.state.idDriver);
		const languageCode = await getLanguage();
		if (languageCode) {
			RNLocalize.addEventListener(
				'change',
				this.handleChangeLanguage(languageCode),
			);
		}
		// try {
		//   const token = await getToken();
		//   const user = await getUserInfo();
		//   if (user) {
		//     this.setState({ email: user.email })
		//   }
		// } catch (error) {
		//   console.log("Khong lay  duoc userInfo");
		// }
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
		//this.setState({languageCode: lgnCode});

		chooseLanguageConfig(lgnCode);
	};

	//   handleSubmit = (e) => {
	//     e.preventDefault();

	//     this.setState({ submitted: true });

	//     const { email, password, new_password, new_password_confirm } = this.state;
	//     //Alert.alert(oldPassWord);
	//     if (!password || !new_password || !new_password_confirm) {
	//       alert(translate('REQUIRED_FIELDS'));
	//     } else if (new_password !== new_password_confirm) {
	//       alert(translate('NEW_PASSWORD_AND_CONFIRMATION_PASSWORD_NOT_MATCH'));
	//     } else {

	//       if (password, new_password, new_password_confirm) {
	//         this.props.changePassword(email, password, new_password, new_password_confirm);
	//       }


	//     }
	//   };

	//   renderError = error => {
	//     return (
	//       <WingBlank>
	//         <WhiteSpace size="lg" />
	//         <Text style={styles.txtError}>
	//         {error === "ajax error 500"
	//         ? translate('CONNECTION_ERROR')
	//         : error}
	//         </Text>
	//       </WingBlank>
	//     );
	//   };

	saveSign() {
		this.refs.sign.saveImage();
	}

	resetSign() {
		this.refs.sign.resetImage();
	}

	_onSaveEvent(result) {
		//result.encoded - for the base64 encoded png
		//result.pathName - for the file path name
	}
	_onDragEvent() {
		// This callback will be called when the user enters signature
	}

	render() {
		// const { password, new_password, new_password_confirm, submitted } = this.state;
		// const { isLoading, error } = this.props;
		const { signatureDriver } = this.props;
		return (
			<ScrollView style={{ flex: 1 }}>
				<View
					style={{
						width: '100%',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Text
						style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20 }}
					>
						{translate('delivery_history')}
					</Text>
					{/* <Text>{signatureDriver ? signatureDriver.data : "Khonng co"}</Text> */}
					{signatureDriver ? (
						signatureDriver.data.map(sgnDriver => {
							return (
								<TouchableOpacity

									onPress={() => {
										this.setState({ isShowModalSearch: false }, () => {
											Actions['DetailForDriver']({
												data: "5f8d342d33fdc525f860da92"

											})

										})
									}
									}
								>
									<View>
										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													color: COLOR.LIGHTBLUE,
													fontSize: 15,
													fontWeight: 'bold',
												}}
											>
												{translate('DRIVER')} :{' '}
											</Text>
											<Text>{sgnDriver?.driver}</Text>
										</View>

										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													color: COLOR.LIGHTBLUE,
													fontSize: 15,
													fontWeight: 'bold',
												}}
											>
												{translate('Number_of_gas_cylinders')} :{' '}
											</Text>
											<Text>{sgnDriver?.numberOfCylinder}</Text>
										</View>

										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													color: COLOR.LIGHTBLUE,
													fontSize: 15,
													fontWeight: 'bold',
												}}
											>
												{translate('Delivery_date')} :{' '}
											</Text>
											<Text>
												{moment(sgnDriver?.createdAt)
													.utcOffset(7)
													.format('DD/MM/YYYY , LTS')}
											</Text>
										</View>

										<View style={{ flexDirection: 'row' }}>
											<Text
												style={{
													color: COLOR.LIGHTBLUE,
													fontSize: 15,
													fontWeight: 'bold',
												}}
											>
												{translate('License_plates')} :{' '}
											</Text>
											<Text>{sgnDriver?.license_plate}</Text>
										</View>
									</View>

									<View
										style={{
											width: '100%',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Image
											style={styles.image}
											resizeMode={'center'}
											source={{
												uri: 'data:image/png;base64,' + sgnDriver?.signature,
											}}
										/>
									</View>
								</TouchableOpacity>
							);
						})
					) : (
						<Text>{translate('not_delivery_history')}</Text>
					)}
					{/* <SignatureCapture
                    style={[{flex:1},styles.signature]}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={true}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"portrait"}/>

                <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => { this.saveSign() } } >
                        <Text>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => { this.resetSign() } } >
                        <Text>Reset</Text>
                    </TouchableOpacity>

                </View> */}
				</View>
			</ScrollView>
		);
	}
}

export const mapStateToProps = state => ({
	idDriver: state.auth.user.id,
	signatureDriver: state.auth.signature,
	error: state.auth.error,
});

export default connect(mapStateToProps, { getSignature })(Signature);
// export default Signature
