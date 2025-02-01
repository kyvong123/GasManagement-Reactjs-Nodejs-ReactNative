import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Components
import AlarmList from './AlarmList';

const Home = () => {
    const handleAddAlarm = () => {
        Actions.Alarm();
    };

    return (
        <View style={{ display: 'flex', flex: 1 }}>
            <SafeAreaView style={{ display: 'flex', flex: 1 }}>
                <AlarmList />
            </SafeAreaView>
        </View>
    );
};

export default Home;