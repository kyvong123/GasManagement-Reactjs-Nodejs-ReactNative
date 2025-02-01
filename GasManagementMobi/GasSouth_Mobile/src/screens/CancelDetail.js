import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Alert
} from 'react-native';
import { setLanguage, getLanguage } from "../helper/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import LineOrderItem from '../../src/components/LineOrderItem';
import { setListOrder } from '../actions/OrderActions';
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';
import Img from '../constants/image'
import { connect } from "react-redux";
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { ScrollView } from 'react-native-gesture-handler';
import Textarea from "react-native-textarea";


const { width } = Dimensions.get('window');

const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json')
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingHorizontal: 15
    },
    textareaContainer: {
        width: 350,
        height: 400,
        padding: 5,
        borderWidth: 1,
        borderColor: "gray",
        marginLeft: 15,
        marginTop: 60,
        backgroundColor: "white",
    },
    btnSave: {
        backgroundColor: "#F6921E",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginTop: 30,
        padding: 12,
        margin: 130,
        borderRadius: 5,
        borderWidth: 0.2
    },
})

class CancelDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteOf: "",
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Textarea
                    containerStyle={styles.textareaContainer}
                    style={styles.textarea}
                    onChangeText={(text) => this.setState({ noteOf: text })}
                    defaultValue={this.state.noteOf}
                    placeholder={"Lý do hủy đơn hàng"}
                />
                <TouchableOpacity style={styles.btnSave}>
                    <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', alignSelf: 'center' }}>
                        Lưu
					</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default CancelDetail;
