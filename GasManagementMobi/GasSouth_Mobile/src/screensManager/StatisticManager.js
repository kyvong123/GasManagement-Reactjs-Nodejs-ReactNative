import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getLstChilds } from "../actions/OrderActions";
import { getToken } from '../helper/auth';
import { Actions } from 'react-native-router-flux';
import statisticsApi from '../api/statistics2';
import Images from "../constants/image";
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const widthScreen = Dimensions.get('window').width;
const screenTextSize = 17

const formatNumber = (amount, decimalCount = 0, decimal = "", thousands = ",") => {
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

export default function StatisticManager() {
  const userInfo = useSelector(state => state.auth.user);

  const [totalAmountOfInit, setTotalAmountOfInit] = useState();
  const [listChildren, setListChildren] = useState([]);

  const getTotalInitCylinders = async () => {
    let token = await getToken();
    await statisticsApi.getTotalInitCylinders(userInfo.id, token)
      .then(data => {
        setTotalAmountOfInit(data.data.data.numberCreated)
      })
  }

  const getListChildren = async () => {
    let token = await getToken();
    await statisticsApi.getListChildren({
      isChildOf: userInfo.id
    }, token)
      .then(data => {
        if (data.data.success) {
          setListChildren(data.data.data.filter(value => {
            return ((value.userRole === 'SuperAdmin' && value.userType === 'Region') || (value.userRole === 'SuperAdmin' && value.userType === 'Fixer'))
          }));
        }
      })
  }

  useEffect(() => {
    getListChildren(userInfo.id);
    getTotalInitCylinders();
  }, [])

  return (
    <ScrollView>
      <Image
        style={{ width: widthScreen, height: 150 }}
        source={Images.BANNER1}
      />

      <View style={styles.articleSection}>
        <Text style={styles.articleText}>{translate('TOTAL_INITIALIZATION')}</Text>
        <Text style={styles.articleText}>{formatNumber(totalAmountOfInit)}</Text>
      </View>

      <View style={styles.selectionSection}>
        <TouchableOpacity
          style={[styles.btnStyle, { width: widthScreen / 2 }]}
          onPress={() => {
            Actions['StatisticDetails']({
              userInfo: userInfo
            })
          }}>
          <Text style={styles.btnText}>{translate('ALL')}</Text>
        </TouchableOpacity>

        {userInfo.userRole == 'SuperAdmin' && userInfo.userType == 'Factory' ? (
          listChildren.map(child => {
            return (
              <View style={styles.agencySection}>
                <TouchableOpacity
                  style={[styles.btnStyle]}
                  onPress={() => {
                    Actions['StatisticDetails']({
                      userInfo: child
                    })
                  }}>
                  <Text style={styles.btnText}>{child.name}</Text>
                </TouchableOpacity>
                <FlatList
                  data={child.listChild}
                  numColumns={3}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={() => {
                          Actions['StatisticDetails']({
                            userInfo: item
                          })
                        }}>
                        <Text style={[styles.btnText, { fontSize: screenTextSize - 2 }]}>{item.name}</Text>
                      </TouchableOpacity>
                    )
                  }}
                />
              </View>
            )
          })
        ) : (
          (userInfo.userRole == 'SuperAdmin' && userInfo.userType == 'Region') ? (
            <FlatList
              data={listChildren}
              numColumns={3}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.btnStyle}
                    onPress={() => {
                      Actions['StatisticDetails']({
                        userInfo: item
                      })
                    }}>
                    <Text style={[styles.btnText, { fontSize: screenTextSize - 2 }]}>{item.name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          ) : null
        )}
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  articleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff1d7',
    padding: 10,
    marginVertical: 15,
  },
  articleText: {
    fontWeight: 'bold',
    fontSize: screenTextSize + 2,
    color: '#000'
  },
  agencySection: {
    width: '95%',
    alignItems: 'center',
    backgroundColor: 'rgba(238,238,238,0.5)',
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 10
  },
  selectionSection: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  btnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    paddingHorizontal: 5,
    width: (widthScreen / 3) - 20,
    height: 55,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
  },
  btnText: {
    fontSize: screenTextSize,
    color: '#000',
    textAlign: 'center'
  }
})
