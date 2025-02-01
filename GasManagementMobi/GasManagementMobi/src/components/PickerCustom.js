import React, { useEffect, forwardRef, useImperativeHandle, useState, } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import Modal from 'react-native-modal';
import {
    TextField,

} from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { cleanAccents } from './../helper/words';

const PickerCustom = forwardRef((props, ref) => {
    const [Open, setOpen] = useState(false);
    const [listOri, setListOri] = useState([]);
    const [listCurrent, setListCurrent] = useState([]);
    const [value, setValue] = useState();
    const [index, setIndex] = useState();
    const [label, setLabel] = useState();


    const openModal = () => {
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
    }

    useImperativeHandle(ref, () => ({

        open: () => { openModal() },
        close: () => { closeModal() }

    }));

    useEffect(() => {
        getList()

    }, [Open])

    const getList = () => {

        setListOri(props.listItem ? props.listItem : []);
        setListCurrent(props.listItem ? props.listItem : [])

    }

    useEffect(() => {
        props.setValue({ value, label, index })

    }, [value])

    const onSearch = (e) => {
        const inputValue = e.toLowerCase()
        const arrayFilter = listOri.filter((_value) => {
            const valueLowerCase = _value.label.toLowerCase()
            const valueCleanedAccents = cleanAccents(valueLowerCase)
            return (
                valueLowerCase.indexOf(inputValue) != -1 ||
                valueCleanedAccents.indexOf(inputValue) != -1
            )
        })

        setListCurrent(arrayFilter)

    }




    return (
        <>
            <TouchableOpacity style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderColor: props.error ? 'red' : 'gray', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => { openModal() }}>
                <Text>{label ? label : props.placeholder}</Text>
                <Icon name='chevron-down' size={30} color={'#000'}></Icon>
            </TouchableOpacity>
            <Text style={{ color: 'red', fontSize: 13 }}>{props.error ? props.error : null}</Text>
            <Modal
                isVisible={Open}
                onBackdropPress={closeModal}
            >
                <View style={{ width: '100%', backgroundColor: '#FFF', marginVertical: 100 }}>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ width: '80%' }}>
                            <TextField
                                label='keyword'
                                onChangeText={onSearch}

                            />
                        </View>
                        <Icon name='account-search' size={30} style={{ marginTop: 5 }}></Icon>
                    </View>
                    <ScrollView style={{ width: '100%', padding: 20, }}>

                        {listCurrent.map((value, index) => (
                            <TouchableOpacity onPress={() => { setValue(value.value); setIndex(index); setLabel(value.label); closeModal() }}>
                                <Text style={{ fontSize: 17, marginVertical: 10 }}>{value?.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <Text></Text>

                    </ScrollView>
                </View>
            </Modal>
        </>
    )
})

export default PickerCustom
