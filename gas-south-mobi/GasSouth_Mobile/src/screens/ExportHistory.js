import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux';
import { getToken } from '../helper/auth';
import statisticsApi from '../api/statistics2';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import moment from 'moment';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
const widthScreen = Dimensions.get('window').width;

export default function ExportHistory() {
  const userInfo = useSelector(state => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [historyExports, setHistoryExports] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([1]);
  const [selectPage, setSelectPage] = useState(1); 

  useEffect(() => {
    getData(1)
  },[])

  const getData = async (page) => {
    setIsLoading(true);

    let token = await getToken();
    await statisticsApi.getExportHistory(
      'from',
      'EXPORT',
      userInfo.id,
      page,
      token
    ).then(data => {
      setHistoryExports(data.data.data);
      let listTmp = [];
      for (let i=1; i <= parseInt((data.data.count/10) + 0.5); i++) {
        listTmp.push({
          value: i,
        })
      }
      setPageNumbers(listTmp);
    })
    setIsLoading(false);
  }

  const handleChangePage = async (value) => {
    await getData(value)
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={'#009347'}/>
      ) : (
        <FlatList
          style={{marginBottom: (widthScreen/pageNumbers.length)-10}}
          data={historyExports}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <View style={styles.elementStyle}>
                {item.toArray.map(value => {
                  return (
                    <Text  style={{color: '#000', fontWeight: 'bold', fontSize: 17}}>
                      {translate('CUSTOMER')} {value?.name}
                    </Text>
                  )
                })}
                
                <View style={styles.rowStyle}>
                  <Text style={{color: '#000'}}>
                    {translate('EXPORT_DATE')}: {moment(item.createdAt).format('DD/MM/YYYY')}
                  </Text>
                  <Text style={{color: '#000'}}>
                    {translate('NUMBERS_OF')}: {item.amount}
                  </Text>
                </View>
                
                <View style={styles.rowStyle}>
                  <Text style={{color: '#000'}}>
                    {translate('DRIVER')}: {item.driver}
                  </Text>
                  <Text style={{color: '#000'}}>
                    {item.license_plate}
                  </Text>
                </View>
              </View>
            )
          }}
        />
      )}

      <View style={{
        position: 'absolute',
        bottom: 0
      }}>
        <FlatList
          data={pageNumbers}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({item}) => {
            return (
              <TouchableOpacity 
              style={[styles.numberBtn, {
                backgroundColor: selectPage==item.value ? '#009347' : '#eee',
                borderColor: selectPage==item.value ? '#009347' : '#eee',
                width: (widthScreen/pageNumbers.length)-10, 
                height: (widthScreen/pageNumbers.length)-10
              }]}
              onPress={() => {
                setSelectPage(item.value);
                handleChangePage(item.value);
              }}>
                <Text style={{color: selectPage==item.value ? '#fff' : '#000'}}>{item.value}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  numberBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  elementStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
