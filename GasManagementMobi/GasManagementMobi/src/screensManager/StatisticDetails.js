import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { getToken } from '../helper/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from "react-native-vector-icons/AntDesign";
import statisticsApi from '../api/statistics2';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import moment from 'moment';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const widthScreen = Dimensions.get('window').width;

const formatNumber = (amount, decimalCount = 0, decimal = "", thousands = ".") => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

cylinderTypes = ['B6', 'B12', 'B20', 'B45'];

export default function StatisticDetails(props) {
  const { userInfo } = props;

  let dateStartTmp = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;

  const [isLoading, setIsLoading] = useState(false);
  const [displayData, setDisplayData] = useState([]);
  const [displayDataStation, setDisplayDataStation] = useState([]);
  const [displayDataFixer, setDisplayDataFixer] = useState();
  const [dataTotalX, setDataTotalX] = useState();
  const [dataTotalY, setDataTotalY] = useState();
  const [dataTotalFixer, setDataTotalFixer] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [dateStart, setDateStart] = useState(String(new Date(dateStartTmp).toISOString()).substring(0, 10) + 'T17:00:00.000Z');
  const [dateEnd, setDateEnd] = useState(String(new Date().toISOString()).substring(0, 10) + 'T16:59:59.000Z');
  const [minDate, setMinDate] = useState();
  const [type, setType] = useState();
  const [selectedStatistics, setSelectedStatistics] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const dataColumn = [
    "create",
    "numberExport",
    "turnback",
    "inventory"
  ];
  const dataColumnStation = [
    "create",
    "numberExport",
    "exportShellToElsewhere",
    "importShellFromFixer",
    "importShellFromElsewhere",
    "turnback",
    "inventory",
  ];
  const dataColumnFixer = [
    "create",
    "exportShellToFixer",
    "inventory",
  ];
  

  const fixerTabs = [
    {
      id: 1,
      type: 'NEW',
      name: translate('NEW_PRODUCTION')
    },
    {
      id: 2,
      type: 'OLD',
      name: translate('REPAIR')
    }
  ];

  useEffect(() => {
    handleDisplayData('NEW')
  }, [])

  const timePickerBtn = (type, date) => {
    const formatDate = (date) => {
      if (date != translate('START_DATE') && date != translate('END_DATE')) {
        return moment(date).format('DD/MM/YYYY')
      } else {
        console.log('(date)', date)
        return date
      }
    }
    return (
      <TouchableOpacity
        style={styles.timePickerStyle}
        onPress={() => {
          setIsVisible(true);
          setType(type);
        }}>
        <Icon name={'calendar'} size={20} color="gray" />
        <Text style={{ color: '#000', paddingHorizontal: 5 }}>{formatDate(date)}</Text>
      </TouchableOpacity>
    )
  }

  const calTotalX = (data, dataColumn) => {
    let dictTmp = {};
    dataColumn.map(statistic => {
      let dictChild = {}
      cylinderTypes.map(type => {
        dictChild[type] = 0
      })
      dictChild['Total'] = 0
      if (statistic == 'numberExport') {
        dictChild['TotalKg'] = 0
      }
      dictTmp[statistic] = dictChild
    })

    data.map(child => {
      dataColumn.map(statistic => {
        cylinderTypes.map(type => {
          child.detail.map(detail => {
            if (type.includes(detail.code)) {
              dictTmp[statistic][type] += detail.statistic[statistic] || 0;
            }
          })
        })
      })
    })

    let totalYDict = calTotalY(data, dataColumn);
    data.map(child => {
      dataColumn.map(statistic => {
        dictTmp[statistic]['Total'] += totalYDict[child.name][statistic] || 0;
        if (statistic == 'numberExport') {
          dictTmp[statistic]['TotalKg'] += totalYDict[child.name][statistic + 'kg'] || 0;
        }
      })
    })
    return dictTmp;
  }

  const calTotalY = (data, dataColumn) => {
    let dictTmp = {};
    data.map(child => {
      let dictChild = {}
      dataColumn.map(statistic => {
        dictChild[statistic] = 0
        if (statistic == 'numberExport') {
          dictChild[statistic + 'kg'] = 0
        }
      })
      dictTmp[child.name] = dictChild
    })
    data.map(child => {
      dataColumn.map(statistic => {
        child.detail.map(value => {
          dictTmp[child.name][statistic] += value.statistic[statistic] || 0;
          if (statistic == 'numberExport') {
            if (child.name === 'Bình Khí') {
              dictTmp[child.name][statistic + 'kg'] = 0
            } else {
              dictTmp[child.name][statistic + 'kg'] += (value.statistic[statistic] || 0) * parseInt(value.name.split(' ')[1])
            }
          }
        })
      })
    })
    return dictTmp;
  }

  const handleDisplayData = async (condition) => {
    setIsLoading(true);
    let token = await getToken();
    if (dateStart == translate('START_DATE') || dateEnd == translate('END_DATE')) {
      Alert.alert(translate('notification'), translate('REQUIRED_FIELDS'))
    } else {
      if ((userInfo.userRole == 'SuperAdmin' && userInfo.userType == 'Factory')
        || (userInfo.userRole == 'SuperAdmin' && userInfo.userType == 'Region')) {
        await statisticsApi.getAggregate(
          userInfo.id,
          dateStart,
          dateEnd,
          token
        ).then(data => {
          if (data)
          {
            cylinderTypes = data.data.cylinderTypes;
            cylinderTypes = cylinderTypes && cylinderTypes.sort((a, b) => a > b ? 1 : -1);
          }
          
          if (data.data.success) {
            setDataTotalX(calTotalX(data.data.data, dataColumn));
            setDataTotalY(calTotalY(data.data.data, dataColumn));
            setDisplayData(data.data.data);
          }
        })
      } else if (userInfo.userRole == 'Owner' && userInfo.userType == 'Factory') {
        await statisticsApi.getStationDetail(
          userInfo.id,
          'byItself',
          dateStart,
          dateEnd,
          token
        ).then(data => {
          cylinderTypes = ['B6', 'B12', 'B20', 'B45'];
          if (data.data.success) {
            setDataTotalY(calTotalY(data.data.data, dataColumnStation));
            setDisplayDataStation(data.data.data);
          }
        })
      } else {
        await statisticsApi.getFixerDetail(
          userInfo.id,
          'byItself',
          condition,
          dateStart,
          dateEnd,
          '',
          token
        ).then(data => {
          let b = data.data.data[0];
          let dictTmp = {};
          let totalDict = {};
          dataColumnFixer.map(statistic => {
            cylinderTypes = data.data.cylinderTypes;
            let dictTmp1 = {};
            cylinderTypes = cylinderTypes.filter(item =>
            
              data.data.data[0].detail.some(element => 
                element.categoryCode == item)
            );
            let cylinderTypesName = [];
            cylinderTypes.map(type => {
              let categoryName;
              if (data.data.data[0].detail.some(element => {
                if (element.categoryCode == type) {
                  categoryName = element.categoryName;
                  return true;
                }
              })) {
                dictTmp1[categoryName] = data.data.data[0].detail.filter(value => type == value.categoryCode);
                cylinderTypesName.push(categoryName);
              }
            });
            if (cylinderTypesName.length >= cylinderTypes.length)
              cylinderTypes = cylinderTypesName;
            dictTmp[statistic] = dictTmp1;
            totalDict[statistic] = 0
          })

          dataColumnFixer.map(statistic => {
            cylinderTypes.map(type => {
              data.data.data[0].detail.map(detail => {
                if (type == detail.categoryName) {
                  totalDict[statistic] += detail[statistic]
                }
              })
            })
          })
          setDataTotalFixer(totalDict);
          setDisplayDataFixer(dictTmp);
        })
      }
    }
    setIsLoading(false);
  }

  const translateStatistic = (statistic) => {
    switch (statistic) {
      case 'create':
        return translate('TOTAL_JUST_CREATED');
      case 'numberExport':
        return translate('TOTAL_EXPORT_FIXER');
      case 'massExport':
        return translate('WEIGHT');
      case 'turnback':
        return translate('TOTAL_TURNBACK_SHELL');
      case 'inventory':
        return translate('TOTAL_IN_STOCK');
    }
  }

  const translateStatisticStation = (statistic) => {
    switch (statistic) {
      case 'create':
        return translate('CREATED_SHELL');
      case 'numberExport':
        return translate('EXPORTED_CYLINDERS');
      case 'massExport':
        return translate('WEIGHT');
      case 'turnback':
        return translate('TURNBACK_SHELL');
      case 'inventory':
        return translate('INVENTORY_SHELL');
      case 'exportShellToElsewhere':
        return translate('EXPORT_SHELL_TO_ELSEWHERE');
      case 'exportShellToFixer':
        return translate('EXPORT_SHELL_TO_FIXER');
      case 'importShellFromElsewhere':
        return translate('EXPORT_SHELL_FROM_ELSEWHERE');
      case 'importShellFromFixer':
        return translate('EXPORT_SHELL_FROM_FIXER');
      case 'cancel':
        return translate('CANCEL');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
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
            onPress={() => handleDisplayData('NEW')}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{translate('CONFIRM')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDateStart(translate("START_DATE"));
              setDateEnd(translate("END_DATE"));
              setMinDate();
            }}>
            <Text style={{ color: '#000', fontWeight: 'bold', textDecorationLine: 'underline' }}>{translate('RESET_DATE')}</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={'#009347'} />
        ) : (
          displayData.length > 0 ? (
            dataColumn.map(statistic => {
              return (
                <View style={styles.tableStyle}>

                  <View style={styles.rowStyle}>
                    <View style={[styles.elementStyle, { backgroundColor: '#009347', height: (widthScreen / 6) + 40, width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                      <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>
                        {userInfo.userType == 'Factory' ? translate('AGENCY_NAME') : translate('STATION_NAME')}
                      </Text>
                    </View>

                    <View>
                      <View style={styles.articleStyle}>
                        <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{translateStatistic(statistic)}</Text>
                      </View>
                      <View style={styles.rowStyle}>
                        {cylinderTypes.map(value => {
                          return (
                            <>
                              <View style={[styles.elementStyle, { backgroundColor: '#009347', width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                                <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>
                                  {value}
                                </Text>
                              </View>
                            </>
                          )
                        })}
                      </View>
                    </View>

                    <View style={[styles.elementStyle, { backgroundColor: '#009347', height: (widthScreen / 6) + 40, width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                      <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{statistic === 'numberExport' ? translate('TOTAL_CYLINDERS') : translate('TOTAL_SHELL')}</Text>
                    </View>

                    {statistic == 'numberExport' ? (
                      <View style={[styles.elementStyle, { backgroundColor: '#009347', height: (widthScreen / 6) + 40, width: widthScreen / 7 }]}>
                        <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{translate('WEIGHT')} (kg)</Text>
                      </View>
                    ) : null}
                  </View>
                  <FlatList
                    data={displayData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      item.detail = item.detail && item.detail.sort((a, b) => a.code > b.code ? 1 : -1);
                      return (
                        <View style={styles.rowStyle}>
                          <View style={[styles.elementStyle, { width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                            <Text style={styles.elementText}>
                              {item.name}
                            </Text>
                          </View>

                          {item.detail.map(value => {
                            return (
                              <View style={[styles.elementStyle, { width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                                <Text style={styles.elementText}>
                                  {formatNumber(value.statistic[statistic])}
                                </Text>
                              </View>
                            )
                          })}

                          <View style={[styles.elementStyle, { width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                            <Text style={[styles.elementText, { fontWeight: 'bold' }]}>
                              {formatNumber(dataTotalY[item.name][statistic])}
                            </Text>
                          </View>

                          {statistic == 'numberExport' ? (
                            <View style={[styles.elementStyle, { width: widthScreen / 7 }]}>
                              <Text style={[styles.elementText, { fontWeight: 'bold' }]}>
                                {formatNumber(dataTotalY[item.name][statistic + 'kg'])}
                              </Text>
                            </View>
                          ) : null}

                        </View>
                      )
                    }}
                  />
                  <View style={styles.rowStyle}>
                    <View style={[styles.elementStyle, { width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                      <Text style={styles.elementText}>
                        {translate('TOTAL')}
                      </Text>
                    </View>

                    {cylinderTypes.map(value => {
                      return (
                        <View style={[styles.elementStyle, { width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                          <Text style={styles.elementText}>
                            {formatNumber(dataTotalX[statistic][value])}
                          </Text>
                        </View>
                      )
                    })}

                    <View style={[styles.elementStyle, { width: statistic == 'numberExport' ? widthScreen / 7 : widthScreen / 6 }]}>
                      <Text style={[styles.elementText, { fontWeight: 'bold' }]}>
                        {formatNumber(dataTotalX[statistic]['Total'])}
                      </Text>
                    </View>

                    {statistic === 'numberExport' ? (
                      <View style={[styles.elementStyle, { width: widthScreen / 7 }]}>
                        <Text style={[styles.elementText, { fontWeight: 'bold' }]}>
                          {formatNumber(dataTotalX[statistic]['TotalKg'])}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              )
            })
          ) : (
            displayDataStation.length > 0 ? (
              dataColumnStation.map(statistic => {
                return (
                  <View style={styles.tableStationStyle}>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedStatistics.includes(statistic)) {
                          let listTmp = selectedStatistics.filter(value => {
                            return (value != statistic)
                          })
                          setSelectedStatistics(listTmp)
                        } else {
                          setSelectedStatistics([...selectedStatistics, statistic])
                        }
                      }}
                      style={[styles.articleStationStyle, {
                        backgroundColor: selectedStatistics.includes(statistic) ? '#cbe8ba' : '#fff1d7'
                      }]}>
                      <Text style={{ fontWeight: 'bold', color: '#000' }}>{translateStatisticStation(statistic)}</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.elementText, { fontWeight: 'bold', paddingHorizontal: 10 }]}>
                          {formatNumber(dataTotalY[displayDataStation[0].name][statistic])}
                        </Text>
                        <Icon name={selectedStatistics.includes(statistic) ? 'up' : 'down'} size={17} color={'#000'} />
                      </View>
                    </TouchableOpacity>
                    {selectedStatistics.includes(statistic) ? (
                      <>
                        <FlatList
                          data={displayDataStation}
                          keyExtractor={item => item.id}
                          renderItem={({ item }) => {
                            return (
                              <View>
                                {item.detail.map(value => {
                                  return (
                                    <View style={styles.elementStationStyle}>
                                      <Text style={styles.elementText}>
                                        {value.name}
                                      </Text>
                                      <Text style={styles.elementText}>
                                        {formatNumber(value.statistic[statistic])}
                                      </Text>
                                    </View>
                                  )
                                })}
                              </View>
                            )
                          }}
                        />
                        {statistic === 'numberExport' ? (
                          <View style={styles.elementStationStyle}>
                            <Text style={[styles.elementText, { fontWeight: 'bold' }]}>
                              {translate('TOTAL_WEIGHT')}
                            </Text>
                            <Text style={[styles.elementText, { fontWeight: 'bold' }]}>
                              {formatNumber(dataTotalY[displayDataStation[0].name][statistic + 'kg'])}
                            </Text>
                          </View>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                )
              })
            ) : (
              displayDataFixer ? (
                <View>
                  <View style={styles.fixerTabsSection}>
                    {fixerTabs.map(tab => {
                      return (
                        <TouchableOpacity
                          style={[styles.fixerTabStyle, {
                            borderBottomWidth: tab.id === selectedTab ? 2 : 0
                          }]}
                          onPress={() => {
                            handleDisplayData(tab.type);
                            setSelectedTab(tab.id);
                          }}>
                          <Text style={styles.elementText}>{tab.name}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>

                  {dataColumnFixer.map(statistic => {
                    return (
                      <View style={styles.tableStyle}>
                        <View style={[styles.elementStyle, { backgroundColor: '#009347', width: widthScreen, height: 40 }]}>
                          <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{translateStatisticStation(statistic)}</Text>
                        </View>
                        <View style={styles.rowStyle}>
                          <View style={[styles.elementStyle, { backgroundColor: '#009347', width: widthScreen / 3, height: 40 }]}>
                            <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{translate('CYLINDERS_TYPE')}</Text>
                          </View>
                          <View style={[styles.elementStyle, { backgroundColor: '#009347', width: widthScreen / 3, height: 40 }]}>
                            <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{translate('BRAND')}</Text>
                          </View>
                          <View style={[styles.elementStyle, { backgroundColor: '#009347', width: widthScreen / 3, height: 40 }]}>
                            <Text style={[styles.elementText, { color: '#fff', fontWeight: 'bold' }]}>{translate('TOTAL')}</Text>
                          </View>
                        </View>

                        <View>
                          {cylinderTypes.map(type => {
                            return (
                              <View style={styles.rowStyle}>
                                <View style={[styles.elementStyle, { width: widthScreen / 3, height: displayDataFixer[statistic][type] && displayDataFixer[statistic][type].length * 25 }]}>
                                  <Text style={styles.elementText}>{type}</Text>
                                </View>
                                <View style={{ flexDirection: 'column' }}>
                                  {displayDataFixer[statistic][type] && displayDataFixer[statistic][type].map(value => {
                                    return (
                                      <View style={[styles.elementStyle, { width: widthScreen / 3, height: 25 }]}>
                                        <Text style={[styles.elementText, { fontSize: 13 }]}>{value['manufactureName']}</Text>
                                      </View>
                                    )
                                  })}
                                </View>
                                <View style={{ flexDirection: 'column' }}>
                                  {displayDataFixer[statistic][type] && displayDataFixer[statistic][type].map(value => {
                                    return (
                                      <View style={[styles.elementStyle, { width: widthScreen / 3, height: 25 }]}>
                                        <Text style={styles.elementText}>{formatNumber(value[statistic])}</Text>
                                      </View>
                                    )
                                  })}
                                </View>
                              </View>
                            )
                          })}
                        </View>

                        <View style={styles.rowStyle}>
                          <View
                            style={[styles.elementStyle, {
                              paddingHorizontal: 10,
                              width: widthScreen * 2 / 3,
                              height: 40
                            }]}
                          >
                            <Text style={[styles.elementText, { fontWeight: 'bold' }]}>{translate('TOTAL')}</Text>
                          </View>
                          <View
                            style={[styles.elementStyle, {
                              width: widthScreen * 1 / 3,
                              height: 40
                            }]}
                          >
                            <Text style={[styles.elementText, { fontWeight: 'bold' }]}>{formatNumber(dataTotalFixer[statistic])}</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })}

                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text>{translate('NULL_DATA')}</Text>
                </View>
              )
            )
          )
        )}


      </ScrollView>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={'date'}
        // locale={'vi'}
        maximumDate={new Date()}
        // minimumDate={minDate}
        onConfirm={(date) => {
          // console.log('date_DateTimePickerModal', date)
          setIsVisible(false);
          switch (type) {
            case 'dateStart':
              let newDateStart = (new Date(date)).setHours(0, 0, 0, 0);
              // console.log('date_newDateStart', newDateStart)
              newDateStart = (new Date(newDateStart)).toISOString()
              // console.log('date_newDateStart', newDateStart)
              setDateStart(newDateStart);
              setMinDate(date);
              break;
            case 'dateEnd':
              let newDateEnd = (new Date(date)).setHours(23, 59, 59, 999);
              // console.log('newDateEnd', newDateEnd)
              newDateEnd = (new Date(newDateEnd)).toISOString()
              // console.log('date_newDateEnd', newDateEnd)
              setDateEnd(newDateEnd);
              break;
          }
        }}
        onCancel={() => setIsVisible(false)}
        confirmTextIOS="Chọn"
        cancelTextIOS="Bỏ chọn"
        headerTextIOS="Chọn thời gian"
        pickerContainerStyleIOS={{
          backgroundColor: '#fff',
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
  tableStyle: {
    alignItems: 'center',
    marginVertical: 10
  },
  articleStyle: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009347',
    borderColor: '#aaa',
    borderWidth: 0.5,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  elementStyle: {
    width: widthScreen / 6,
    height: widthScreen / 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#aaa',
    borderWidth: 0.5
  },
  elementText: {
    fontSize: 9,
    color: '#000',
    textAlign: 'center'
  },
  tableStationStyle: {
    alignItems: 'center',
  },
  articleStationStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: widthScreen,
    padding: 15,
    marginVertical: 1,
  },
  elementStationStyle: {
    width: widthScreen,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fixerTabsSection: {
    flexDirection: 'row',
  },
  fixerTabStyle: {
    justifyContent: 'center',
    width: widthScreen / 2,
    height: 50,
    borderTopWidth: 1,
    borderBottomColor: '#009347',
    borderTopColor: '#eee'
  }
})
