import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput,
    ActivityIndicator
} from "react-native";
import { PieChart, BarChart, StackedBarChart, LineChart } from "react-native-chart-kit";

import { COLOR } from "../constants";

const translationGetters = {
    en: () => require('../languages/en.json'),
    vi: () => require('../languages/vi.json'),
}

const dataLineChart = {
    labels: ["1/9", "2/9", "3/9", "4/9", "5/9", "6/9", "7/9"],
    datasets: [
        {
            data: [1, 7, 4, 5, 8, 3, 12],
            color: (opacity = 1) => `#1cc910`,
            colors: `#1cc910`, // optional
            strokeWidth: 1, // optional
            name: 'Cần Thơ'
        },
        {
            data: [12, 34, 65, 76, 34, 23, 35],
            color: (opacity = 1) => `#33CCFF`, // optional
            strokeWidth: 1, // optional
            colors: `#33CCFF`,
            name: 'Dung Quất'
        },

        {
            data: [21, 10, 65, 44, 41, 12, 124],
            color: (opacity = 1) => `#FF0000`, // optional
            strokeWidth: 1, // optional
            colors: `#FF0000`,
            name: 'Gò Dầu'
        },
        {
            data: [20, 55, 41, 42, 11, 55, 12],
            color: (opacity = 1) => `#CC00CC`, // optional
            strokeWidth: 1, // optional
            colors: `#CC00CC`,
            name: 'VT-GAS'
        },
    ],
};

const chartConfigLineChart = {
    // backgroundColor: '#e26a00',
    // backgroundGradientFrom: '#ffffff',
    // backgroundGradientTo: '#ffffff',
    // decimalPlaces: 2, // optional, defaults to 2dp
    // color: (opacity = 1) => `#1E2923`,
    // labelColor: (opacity = 1) => `#1E2923`,
    // style: {
    //     borderRadius: 16,
    // },
    // propsForDots: {
    //     r: '6',
    //     strokeWidth: '1',
    //     stroke: '#ffa726',
    // },
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#1E2923",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `#1E2923`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: "#fff",
};

const { width } = Dimensions.get("window")

const screenWidthPieChart = Dimensions.get('window').width + 200

class LinerChart extends Component {
    render() {
        return (
            <View>
                <View>
                    <ScrollView horizontal={true}>
                        <LineChart
                            data={dataLineChart}
                            width={Dimensions.get('window').width} // from react-native
                            height={220}
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={chartConfigLineChart}
                            withInnerLines={false}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginTop: 20,
                            }}
                        />
                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'stretch', }}>
                    {dataLineChart.datasets.map((title) =>
                        <View style={{ flexDirection: 'row', alignItems: 'stretch', margin: width / 50 }}>
                            <View style={{ width: 15, height: 15, backgroundColor: title.colors }} />
                            <Text style={{ fontSize: 14, marginLeft: 10 }}>{title.name}</Text>
                        </View>
                    )}
                </View>

                <View style={{ alignItems: "center", marginTop: 10 }}>
                    <Text style={{ color: COLOR.BLACK, fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
                        Biến động số dư
                                </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    txtError: {
        fontSize: 15,
        color: COLOR.RED,
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FFB52B',
        width: "91%",
        borderRadius: 1,
    },
    buttonTitle: {
        color: COLOR.WHITE,
        fontWeight: "bold",
        fontSize: 18,
        paddingVertical: 12
    },
    statisticContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "rgba(131, 167, 234, 1)",
    },
    statisticText: {
        color: COLOR.BLACK,
        fontWeight: "bold",
        fontSize: 20,
    },
    listCotainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.LIGHTGRAY,
    },
    listText: {
        color: COLOR.BLACK,
        fontSize: 15,
    },
    title: {
        fontSize: 20,
        padding: 10,
        color: COLOR.BLACK,
        fontWeight: 'bold'
    },
    scene: {
        padding: 80
    },
    title_num: {
        fontSize: 20,
        padding: 10,
        textAlign: "right",
        color: COLOR.BLACK,
        fontWeight: 'bold',

    },
    itemStyle: {
        color: COLOR.BLUE,
        fontSize: 12,
    },
    lineBottom: {
        flex: 1,
        height: 2,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0
    },
    btnTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    }
})

export default LinerChart;
