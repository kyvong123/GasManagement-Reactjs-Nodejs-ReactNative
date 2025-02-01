import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Alert, FlatList } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from "react-native-vector-icons/AntDesign";
import tankTruckApi from '../api/tankTruck';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import moment from 'moment';

const screenWidth = Dimensions.get("window").width;

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default function FluctuationSurplus() {
  const [dateStart, setDateStart] = useState(translate("START_DATE"));
  const [dateEnd, setDateEnd] = useState(translate("END_DATE"));
  const [maxDate, setMaxDate] = useState(new Date());
  const [minDate, setMinDate] = useState();
  const [type ,setType] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState();
  const [warehouseData, setWarehouseData] = useState();
  const [chartLegend, setChartLegend] = useState();
  const [chartColor] = useState([
    'rgb(255,0,0)',
    'rgb(0,255,0)',
    'rgb(0,0,255)',
    'rgb(255,255,0)',
  ])

  const timePickerBtn = (type, date) => {
    const formatDate = (date) => {
      if (date != translate('START_DATE') && date != translate('END_DATE')) {
        return moment(date).format('DD/MM/YYYY')
      } else {
        return date
      }
    }
    return(
      <TouchableOpacity 
        style={styles.timePickerStyle}
        onPress={() => {
          setIsVisible(true);
          setType(type);
        }}>
        <Icon name={'calendar'} size={20} color="gray"/>
        <Text style={{color: '#000', paddingHorizontal: 5}}>{formatDate(date)}</Text>
      </TouchableOpacity>
    )
  }

  const handleDisplayData = async () => {
    if (dateStart == translate('START_DATE') || dateEnd == translate('END_DATE')) {
      Alert.alert(translate('notification'), translate('REQUIRED_FIELDS'))
    } else {
      onPlotChart();
      onDisplayWarehouseData();
    }
  }

  const onPlotChart = async () => {
    await tankTruckApi.checkSpurlus({
      fromDate: dateStart,
      toDate: dateEnd
    }).then(data => {
      let labelTmp = [];
      let listTmp1 = [];
      let listTmp2 = [];
      let listTmp3 = [];
      data.data.Result.map(value => {
        listTmp1.push(value.AfterImportExport);
        labelTmp.push(value.date)
      })
      for (let i = 0; i < listTmp1[0].length; i++) {
        listTmp2[i] = [];
      }
      for (let i=0; i < listTmp1[0].length; i++) {
        for (let j=0; j < listTmp1.length; j++) {
          listTmp2[i][j] = listTmp1[j][i];
        }
      }
      for (let i=0; i < listTmp2.length; i++) {
        listTmp3.push({
          data: listTmp2[i],
          color: () => chartColor[i],
          strokeWidth: 3,
        })
      }
      setChartLegend(data.data.Result[0].WareHouseName);
      setChartData({
        labels: labelTmp,
        datasets: listTmp3
      });
    })
  }

  const onDisplayWarehouseData = async () => {
    await tankTruckApi.ManageImportExportWareHouse({
      fromDate: minDate,
      toDate: maxDate
    }).then(data => {
      let listTmp1 = [];
      let listTmp2 = [];
      
      for (let i = 0; i < data.data.WareHouseName.length; i++) {
        listTmp2[i] = [
          data.data.BeforeImport[i], 
          data.data.Import[i], 
          data.data.Export[i], 
          data.data.AfterImportExport[i], 
        ];
        listTmp1.push({
          WareHouseName: data.data.WareHouseName[i],
          data: listTmp2[i]
        })
      }
      setWarehouseData(listTmp1)
    })
  }

  const getIndexOfData = () => {
    let result = []
    for (let i=0; i < chartData.datasets.length; i++) {
      result.push(i)
    }
    return result;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <ScrollView
        horizontal>
          <View style={styles.lineChartStyle}>
            {chartData ? (
              <>
                <LineChart
                  data={chartData}
                  width={screenWidth*2}
                  height={250}
                  yAxisInterval={1}
                  segments={4}
                  chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "1",
                      stroke: "#fff"
                    }
                  }}
                  style={{
                    marginVertical: 10,
                    borderRadius: 15
                  }}
                />
                <View style={styles.legendStyle}>
                  {getIndexOfData().map(i => {
                    return(
                      <>
                        <View style={[styles.legends, {backgroundColor: chartColor[i]}]}/><Text>{chartLegend[i]}</Text>
                      </>
                    )
                  })}
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.datePickStyle}>
          {timePickerBtn('dateStart', dateStart)}
          <Text>-</Text>
          {timePickerBtn('dateEnd', dateEnd)}
        </View>
        <View 
        style={{
          alignItems: 'center',
          padding: 10
        }}>
          <TouchableOpacity 
          style={styles.confirmBtn}
          onPress={handleDisplayData}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{translate('CONFIRM')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => {
            setDateStart(translate("START_DATE"));
            setDateEnd(translate("END_DATE"));
            setMaxDate(new Date());
            setMinDate();
          }}>
            <Text style={{ color: '#000', fontWeight: 'bold', textDecorationLine: 'underline' }}>{translate('RESET_DATE')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
        data={warehouseData}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return(
            <View>
              <View style={styles.warehouseData_labelStyle}>
                <Text style={styles.warehouseData_labelText} >{item.WareHouseName}</Text>
              </View>

              <View style={styles.warehouseData_dataRow}>
                <Text style={styles.warehouseData_dataText}>{translate('OPENING_BALANCE')}</Text>
                <Text style={styles.warehouseData_dataText}>{item.data[0]}</Text>
              </View>
              <View style={styles.warehouseData_dataRow}>
                <Text style={styles.warehouseData_dataText}>{translate('IMPORT_QUANTITY')}</Text>
                <Text style={styles.warehouseData_dataText}>{item.data[1]}</Text>
              </View>
              <View style={styles.warehouseData_dataRow}>
                <Text style={styles.warehouseData_dataText}>{translate('EXPORT_QUANTITY')}</Text>
                <Text style={styles.warehouseData_dataText}>{item.data[2]}</Text>
              </View>
              <View style={styles.warehouseData_dataRow}>
                <Text style={styles.warehouseData_dataText}>{translate('ENDING_BALANCE')}</Text>
                <Text style={styles.warehouseData_dataText}>{item.data[3]}</Text>
              </View>
            </View>
          )
        }}
        />

      </ScrollView>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={'date'}
        locale={'vi'}
        maximumDate={maxDate}
        minimumDate={minDate}
        onConfirm={(date) => {
          setIsVisible(false);
          switch(type){
            case 'dateStart':
              setDateStart(date);
              setMinDate(date);
              if (new Date().getTime() > date.getTime() + 7 * 24 * 60 * 60 * 1000){
                setMaxDate(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
              }
              break;
            case 'dateEnd':
              setDateEnd(date);
              setMaxDate(date);
              setMinDate(date.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
          }
        }}
        onCancel={() => setIsVisible(false)}
        confirmTextIOS="Chọn"
        cancelTextIOS="Bỏ chọn"
        headerTextIOS="Chọn thời gian"
        pickerContainerStyleIOS={{
          backgroundColor: 'grey',
          styleLabel: {
            color: '#fff'
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  lineChartStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  legendStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  legends: {
    width: 15,
    height: 15,
    marginHorizontal: 10,
  },
  datePickStyle: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timePickerStyle: {
    width: '45%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7.5,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5
  },
  confirmBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#F6921E',
    borderRadius: 5,
    marginBottom: 5,
  },
  warehouseData_labelStyle: {
    backgroundColor: '#009347',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  warehouseData_labelText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },
  warehouseData_dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  warehouseData_dataText: {
    fontSize: 16,
    color: '#000'
  }
})
