import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	Dimensions,
	Image,
	ScrollView,
	BackHandler,
	TouchableOpacity,
} from 'react-native';
import GridView from 'react-native-super-grid';
import { Actions } from 'react-native-router-flux';
import { fetchUsers } from '../actions/AuthActions';
import Images from '../constants/image';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import saver from '../utils/saver';
import {
	EXPORT,
	RENT,
	TO_FIX,
	BUY,
	EXPORT_PARTNER,
	RETURN_CYLINDER,
} from '../types';
import {
	changeCyclinderAction,
	deleteCylinders,
	typeForPartner,
} from '../actions/CyclinderActions';

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

const { width } = Dimensions.get('window');
const itemWith = width / 2;

const styles = StyleSheet.create({
	gridView: {
		paddingTop: 25,
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
});

class ExportCylinderEmpty extends Component {
	constructor(props) {
		super(props);
		//chooseLanguageConfig('vi');
		this.state = {
			items: [],
			user: this.props.user,
			backClickCount: 0,
			dataButton: [
				{
					name: translate('SELL'),
					code: '#009347',
					action: EXPORT,
					iconName: 'export',
					typeForPartner: BUY,
				},
				{
					name: translate('RENT'),
					code: '#009347',
					action: EXPORT,
					iconName: 'application-import',
					typeForPartner: RENT,
				},
				{
					name: translate('REPAIR'),
					code: '#F6921E',
					action: EXPORT,
					iconName: 'calendar-export',
					typeForPartner: TO_FIX,
				},
			],
		};
	}

	// static getDerivedStateFromProps = (props, state) => {
	//   // const items = getRole(this.props.roles)
	//   if (
	//     !isEqual(props.user, state.user)
	//   ) {
	//     return {
	//       items: getRole(props.user.role)
	//     };
	//   }
	//   return null;
	// }
	componentDidMount = async () => {
		this.props.deleteCylinders();
		this.props.fetchUsers();
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
	navigateAction = (action, type, typeForPartner) => {
		this.props.changeCyclinderAction(action);
		this.props.typeForPartner(typeForPartner);
		saver.setDataCyclinder(action);
		saver.setTypeCyclinder(type);
		Actions[EXPORT_PARTNER]();
	};

	componentWillMount() {
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButton.bind(this),
		);
	}

	componentWillUnmount = async () => {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackButton.bind(this),
		);
		const languageCode = await getLanguage();
		if (languageCode) {
			RNLocalize.addEventListener(
				'change',
				this.handleChangeLanguage(languageCode),
			);
		}
	};

	handleChangeLanguage = lgnCode => {
		setLanguage(lgnCode);
		//this.setState({ languageCode: lgnCode });

		chooseLanguageConfig(lgnCode);
	};

	_spring() {
		this.setState({ backClickCount: 1 });
	}

	handleBackButton = () => {
		this.state.backClickCount === 1 ? BackHandler.exitApp() : this._spring();
		return true;
	};

	render() {
		// Taken from https://flatuicolors.com/
		// const items = [
		//   { name: 'Kiểm tra thông tin', code: '#1abc9c', action: Actions.scan },
		//   { name: 'Xem báo cáo thống kê', code: '#16a085' },
		//   { name: 'Gửi thông báo', code: '#3498db' },
		//   { name: 'Xem phản hồi từ người tiêu dùng', code: '#9b59b6' },
		// ];

		// const items = this.state.items
		if (!this.props.user) {
			return null;
		}
		return (
			<ScrollView>
				<View>
					<Image
						style={{ width: width, height: 150 }}
						source={Images.BANNER1}
					/>
				</View>

				<GridView
					itemDimension={itemWith}
					data={this.state.dataButton}
					style={styles.gridView}
					renderItem={item => (
						<TouchableOpacity
							onPress={() =>
								item.hasOwnProperty('type')
									? this.navigateAction(
											item.action,
											item.type,
											item.typeForPartner,
									  )
									: this.navigateAction(item.action, '', item.typeForPartner)
							}
						>
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
			</ScrollView>
		);
	}
}

export const mapStateToProps = state => ({
	user: state.auth.user,
	loading: state.auth.loading,
});

export default connect(mapStateToProps, {
	changeCyclinderAction,
	deleteCylinders,
	fetchUsers,
	typeForPartner,
})(ExportCylinderEmpty);
