import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLOR } from '../../../constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { translate } from '../../../utils/changeLanguage';
import LineOrderItem from '../../../components/LineOrderItem';
import { Actions } from 'react-native-router-flux';

const CreateNewOrderSuccessFull = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 2, }}>
                <View style={{ backgroundColor: COLOR.GREEN_MAIN, alignItems: 'center', paddingVertical: 20 }}>
                    <Text style={{ color: COLOR.WHITE, fontSize: 18, fontWeight: '600' }}>
                        {translate('CREATE_ORDERS')} {translate('SUCCESS')}</Text>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <LineOrderItem showLine={2} />
                </View>
            </View>
            <View style={{ flex: 7 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome5
                        name="check"
                        size={50}
                        style={{ color: COLOR.GREEN_MAIN, marginTop: 5 }}
                    />
                    <Text style={{
                        color: COLOR.GREEN_MAIN,
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginVertical: 15
                    }}>{translate('ORDER_SUCCESS')}</Text>
                    <Text style={styles.txtNotification}>{translate('YOUR_ORDER_HAS_BEEN_SUCCESSFULLY_CREATED')}</Text>
                    <Text style={styles.txtNotification}>{translate('THANK_YOU_FOR_YOUR_ORDER')}</Text>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={styles.btnContinue}
                    onPress={() => {
                        Actions['home']({});
                    }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: COLOR.WHITE
                        }}
                    >
                        {translate('DONE')}
                    </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    },
    txtNotification: {
        color: COLOR.BLACK,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    btnContinue: {
        backgroundColor: COLOR.ORANGE,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
});


export default CreateNewOrderSuccessFull;