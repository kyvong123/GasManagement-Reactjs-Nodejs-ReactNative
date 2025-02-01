import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default CheckBox = props => {
	return (
		<TouchableOpacity onPress={props.onPress} style={styles.container}>
			{props.status == 'checked' ? (
				<Icon name="check" color="#F6921E" size={17} />
			) : null}
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	container: {
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 1,
		borderWidth: 1,
		borderColor: '#F6921E',
	},
	innerCheck: {
		width: 15,
		height: 15,
		borderRadius: 10,
		backgroundColor: '#F6921E',
	},
});
