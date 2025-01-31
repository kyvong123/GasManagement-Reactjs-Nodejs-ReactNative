import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Actions } from 'react-native-router-flux';

const CustomNavbar_New = ({ title, backScreenKey }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                onPress={() => Actions[backScreenKey]({})}
            >
                <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View>
                {/* <MenuIcon name="menu" size={30} color="#fff" /> */}
            </View>
        </View>
    )
}

export default CustomNavbar_New

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#009347',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'
    }
})

