import React, { Component } from "react";
import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	Dimensions,
} from "react-native";
import { PieChart, } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const chartConfig = {
	backgroundColor: "#e26a00",
	backgroundGradientFrom: "#fb8c00",
	backgroundGradientTo: "#ffa726",
	decimalPlaces: 0, // optional, defaults to 2dp
	color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
	labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
	style: {
		borderRadius: 16
	},
	propsForDots: {
		r: "6",
		strokeWidth: "2",
		stroke: "#ffa726"
	}
}

const data = [
	{
		name: "45kg",
		population: 3,
		color: "#a6dba0",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "20kg",
		population: 3,
		color: "#c7f79d",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "12kg",
		population: 3,
		color: "#5aae61",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "Sữa chửa",
		population: 1,
		color: "#1b7837",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
];

const afterdata = [];
for (let i = 0; i < data.length; i += 2) {
	let childArr = data.slice(i, i + 2)
	afterdata.push(childArr)
}


class InventoryChart extends Component {
	render() {
		// let Item = data.map((title)=>
		// 	<Text style={{fontSize:18}}>{title.name}</Text>
		// )
		return (
			<SafeAreaView>
				<ScrollView>
					<PieChart
						data={data}
						width={width}
						height={450}
						chartConfig={chartConfig}
						accessor="population"
						backgroundColor="transparent"
						paddingLeft="100"
						hasLegend={false}
					/>
					<View>
						<View style={{ flexDirection: 'row', alignItems: 'stretch', padding: 10 }}>
							{data.map((title) =>
								<View style={{ flexDirection: 'row', alignItems: 'stretch', padding: 15 }}>
									<View style={{ width: 20, height: 20, marginTop: 10, backgroundColor: title.color }} />
									<Text style={{ fontSize: 18, marginTop: 10 }}>{title.name}</Text>
								</View>
							)}
							{/*{afterdata.map(childArr =>
								childArr.map(item =>
									<View style={{flexDirection:'row',alignItems:'stretch', padding:15}}>
										<View style={{width:20, height:20, marginTop:10, backgroundColor:title.color}}/>
										<Text style={{fontSize:18, marginTop:10}}>{title.name}</Text>
									</View>
									))}*/}
						</View>
					</View>
					<View>
						<Text style={{ fontSize: 25, marginTop: 10, fontWeight: 'bold', textAlign: 'center' }}>Biểu đồ tồn kho</Text>
					</View>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

export default InventoryChart;