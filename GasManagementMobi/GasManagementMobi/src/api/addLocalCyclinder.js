import Item from '@ant-design/react-native/lib/list/ListItem';
import AsyncStorage from '@react-native-community/async-storage';


const addItem = async (id, serial, weight) => {
    try {
        let array = [];
        let getData = await AsyncStorage.getItem('listCyclinder');
        if (getData) {
            array = JSON.parse(getData);
            let check = array.filter((value) => value.id == id);
            if (check.length == 0) {
                array.push({
                    id,
                    serial,
                    weight
                })
            } else {
                array.push({
                    id,
                    serial,
                    weight
                })
            }

        } else {
            array.push({
                id,
                serial,
                weight
            })
        };



        await AsyncStorage.setItem('listCyclinder', JSON.stringify(array))

        return true;
    } catch (error) {
        console.log(error);

        return false
    }
}

const removeItem = async () => {
    try {
        await AsyncStorage.removeItem('listCyclinder');
        return false
    } catch (error) {
        console.log(error);

        return false
    }
}


const getItem = async () => {
    try {
        let getData = await AsyncStorage.getItem('listCyclinder');
        let array = JSON.parse(getData);
        return array
    } catch (error) {
        console.log(error);

        return false
    }
}

export default {
    addItem,
    removeItem,
    getItem
}

