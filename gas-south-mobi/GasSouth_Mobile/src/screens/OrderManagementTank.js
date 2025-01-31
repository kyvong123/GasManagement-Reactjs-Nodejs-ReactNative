import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import tankTruckApi from '../api/tankTruck';
import IconAnt from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default function OrderManagementTank() {
  let cnt = 0;
  const [listOrder, setListOrder] = useState([]);
  const [listOrderTmp, setListOrderTmp] = useState([]);
  const [selectedTab, setSelectedTab] = useState({
    icon: 'format-list-numbered',
    text: translate("ALL"),
    status: 'All',
    id: 0
  });
  
  useEffect(() => {
    getData()
  },[])

  const getData = async () => {
    await tankTruckApi.getAllOrderTank()
    .then(data => {
      if (data.data.status) {
        setListOrder(data.data.OrderTank);
        setListOrderTmp(data.data.OrderTank);
      }
    })
  }

  const tabs = [
    {
      text: translate("ALL"),
      status: 'All',
      id: 0
    },
    {
      text: translate("INIT"),
      status: 'INIT',
      id: 1
    },
    {
      text: translate("CONFIRM"),
      status: 'PROCESSING',
      id: 2
    },
    {
      text: translate("CANCEL"),
      status: 'CANCEL',
      id: 3
    },
  ]

  const icons = [
    {
      icon: 'format-list-numbered',
      text: translate('Order'),
      status: 'All',
      id: 0
    },
    {
      icon: 'truck',
      text: translate('DELIVERING'),
      status: 'DELIVERING',
      id: 4
    }, 
    {
      icon: 'shield-check',
      text: translate('DONE'),
      status: 'DONE',
      id: 5
    }
  ]

  const onSearch = (text) => {
    const arrayFilter = listOrderTmp.filter((value) => {
      return (value.order.orderCode.toLowerCase().indexOf(text.toLowerCase()) != -1 
          || value.order.customergasId?.branchname.toLowerCase().indexOf(text.toLowerCase()) != -1);
    })
    setListOrder(text ? arrayFilter : listOrderTmp)
  }

  const changeTab = (selected) => {
    cnt = 0;
    if (selected.status == 'All') {
      setListOrder(listOrderTmp)
    } else {
      const arrayFilter = listOrderTmp.filter((value) => {
        return value.order.status == selected.status;
      })
      setListOrder(arrayFilter)
    }
  }

  const translateIcon = (status) => {
    switch(status) {
      case 'INIT':
        return <IconAnt name="retweet" size={15} color={'gray'}/>
      case 'PROCESSING':
        return <IconAnt name="checkcircle" size={15} color={'blue'}/>
      case 'DELIVERING':
        return <Icons name="truck-delivery-outline" size={15} color={'green'}/>
      case 'DONE':
        return <IconAnt name="checkcircleo" size={15} color={'green'}/>
      case 'CANCEL':
        return <IconAnt name="minuscircle" size={15} color={'red'}/>
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <Icons name="file-search-outline" size={25} color={'gray'}/>
        </View>
        <TextInput
        style={styles.searchInput}
        placeholder={translate("SEARCH")}
        onChangeText={text => onSearch(text)}/>
      </View>

      <View style={styles.topTabBar}>
        <FlatList
        data={tabs}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => {
          return(
            <TouchableOpacity 
            style={[styles.tabStyle, { backgroundColor: selectedTab.id == item.id? '#009347' : '#e0e0e0' }]}
            onPress={() => {
              setSelectedTab(item);
              changeTab(item);
            }}>
              <Text style={{color: selectedTab.id == item.id? '#fff':'#000'}}>{item.text}</Text>
            </TouchableOpacity>
          )
        }}
        />
      </View>

      <FlatList
        data={listOrder}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          cnt++;
          return (
            <TouchableOpacity
            style={[styles.orderStyle, {backgroundColor: cnt%2==0 ? '#eee' : '#fff'}]}
            onPress={() => {
              Actions['OrderDetailsTank']({
                data: item
              })
            }}>
              <View>
                <Text style={styles.orderText}>{item.order.orderCode}</Text>
                <Text style={{fontSize: 12}}>
                  <IconAnt name="clockcircleo" size={10}/>
                  {' '}{item.order.fromdeliveryDate} - {item.order.deliveryHours}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{paddingHorizontal: 5}}>{translateIcon(item.order.status)}</Text>
                <Text style={styles.orderText}>{item.order.customergasId?.branchname}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <View style={styles.bottomTabBar}>
        <FlatList
        data={icons}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => {
          return(
            <TouchableOpacity 
            style={styles.tabBottomStyle}
            onPress={() => {
              changeTab(item);
              setSelectedTab(item);
            }}>
              <Icons name={item.icon} size={25} color={selectedTab.id == item.id ? '#009347' : 'gray'}/>
              <Text style={{color: selectedTab.id == item.id ? '#009347' : 'gray'}}>{item.text}</Text>
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
  topTabBar: {
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabStyle: {
    width: 95,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2.5,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: '#aeaeae'
  },
  bottomTabBar: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    backgroundColor: '#fff'
  },
  tabBottomStyle: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center'
  },
  orderStyle: {
    height: 70,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 5
  },
  searchBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 5
  },
  searchInput: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '80%',
    height: 40,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    color: '#000',
  },
  searchIcon: {
    justifyContent:'center',
    height: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 5
  }
})
