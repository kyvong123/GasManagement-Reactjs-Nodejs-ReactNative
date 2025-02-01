import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, Text, StyleSheet, View } from 'react-native';
// import {Picker } from '@react-native-community/picker';
import {
  Card,
  WingBlank,
  WhiteSpace,
  List,
} from '@ant-design/react-native/lib/';
import { COLOR } from '../constants';
import { connect } from 'react-redux';
import { report, reportChart, reportChartBar } from '../actions/ReportActions';
import { FACTORY, STATION, GENERAL, AGENCY, FIXER, IMPORT } from '../types';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DatePicker from 'react-native-datepicker';

import moment from 'moment';
import { PieChart, BarChart, StackedBarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { setLanguage, getLanguage } from '../helper/auth';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { color } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';




const translationGetters = {
  en: () => require('../languages/en.json'),
  vi: () => require('../languages/vi.json'),
};

const chooseLanguageConfig = lgnCode => {
  let fallback = { languageTag: 'vi' };
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode };
  }

  const { languageTag } = fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};


const DATA_newBotlle = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'First Item',
    num: '5'

  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Second Item',
    num: '5'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '5'
  },
  {
    id: '58694a0f-88-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '5'
  },
  {
    id: '58694a0f-99-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '5'
  },
  {
    id: '58694a0f-11-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '5'
  },
];
const DATA_oldBotlle = [
  {
    id: 'bd7acbea-fs-46c2-aed5-3ad53abb28ba',
    name: 'First Item',
    num: '1'

  },
  {
    id: '3ac68afc-44-48d3-a4f8-fbd91aa97f63',
    name: 'Second Item',
    num: '2'
  },
  {
    id: '58694a0f-88-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '3'
  },
  {
    id: '58694a0f-45-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '4'
  },
  {
    id: '58694a0f-9-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '5'
  },
  {
    id: '58694a0f-18-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '6'
  },
  {
    id: '58694a0f-19-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '7'
  },
  {
    id: '58694a0f-20-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '8'
  },
  {
    id: '58694a0f-21-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '9'
  },
  {
    id: '58694a0f-22-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '10'
  },
  {
    id: '58694a0f-23-471f-bd96-145571e29d72',
    name: 'Third Item',
    num: '5'
  },
];

const Item = ({ name, num, index }) => (

  <View style={{
    padding: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch', marginTop: 5,
    backgroundColor: index % 2 == 0 ? '#E8E8E8' : '#FFFFFF',
  }}>
    <Text >{name} </Text>
    <Text style={{ marginRight: 10, textAlign: 'right' }}>{num}</Text>

  </View>

);

const renderItem = ({ item, index }) => (
  <Item name={item.name} num={item.num} index={index} />
);


const NewBottle = () => (
  <View >
    <FlatList
      data={DATA_newBotlle}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  </View>
);

const OldBottle = () => (

  <View >
    <ScrollView vertical={true}>
      <FlatList
        data={DATA_oldBotlle}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  </View>

);

// This is our placeholder component for the tabs
// This will be rendered when a tab isn't loaded yet
// You could also customize it to render different content depending on the route
const LazyPlaceholder = ({ route }) => (
  <View style={styles.scene}>
    <Text>Loading {route.title}…</Text>
  </View>
);




const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
const screenWidthPieChart = Dimensions.get('window').width + 100;
//const Item = List.Item;
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
    flex: 1,
    backgroundColor: '#cbe8ba',
    color: COLOR.BLACK,
    fontWeight: 'bold',

  },
  scene: {
    padding: 80
  },
  title_num: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
    flex: 1,
    textAlign: "right",
    backgroundColor: '#cbe8ba',
    color: COLOR.BLACK,
    fontWeight: 'bold',

  },
  itemStyle: {
    color: COLOR.BLUE,
    fontSize: 12,
  },
  txtError: {
    fontSize: 18,
    color: COLOR.RED,
  },
});

const stackedBarChartData_out = {
  labels: ["Test1", "Test2", "Test3", "Test4"],
  legend: [],
  data: [
    [12, 24],
    [12, 30],
    [30, 10],
    [50, 12]
  ],
  barColors: ["#009900", "#FF9900"],

};
const stackBarChartData_in = {
  labels: ["Test1", "Test2", "Test3", "Test4"],
  legend: [],
  data: [
    [30],
    [10, 30],
    [20, 10],
    [40, 12]
  ],
  barColors: ["#009900", "#FF9900"],
};
// const chartConfig = {
// 	backgroundGradientFrom: '#1E2923',
// 	backgroundGradientFromOpacity: 0,
// 	backgroundGradientTo: '#08130D',
// 	backgroundGradientToOpacity: 0.5,
// 	paddingLeft: 10,
// 	color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
// 	strokeWidth: 2, // optional, default 3
// 	barPercentage: 0.5,
// };

class DailyReport extends Component {
  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');

    this.state = {
      date: '',
      startDate: '',
      endDate: '',
      err: '',
      reports: '',
      objectData: [
        { label: translate('ALL'), value: 0 },
        { label: translate('PARTNER_HIRED_SHELLS'), value: 1 },
        { label: translate('PARTNER_BUY_SHELLS'), value: 2 },
        { label: translate('SUBSIDIARY'), value: 3 },
        { label: translate('REPAIR_FACTORY'), value: 4 },
        ,
      ],
      brand: 'uk',
      colorArray: [
        'rgba(131, 167, 234, 1)',
        '#EA9197',
        'red',
        '#ffffff',
        'rgb(0, 0, 255)',
        'orange',
        'green',
        ,
      ],
      dataPieChart: [],
      // tabview
      tabview:
      {
        index: 0,
        routes: [
          { key: 'first', title: 'Sản suất mới' },
          { key: 'second', title: 'Bình sửa chữa' },
        ]
      }


    };
  }

  _handleIndexChange = index => {
    this.state.tabview.index = index
    this.setState({ ...this.state.tabview })
  }

  _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;

  componentWillReceiveProps(nextProps) {
    const arrPieChart = [];

    const arrBarChartLabel = [];

    const arrBarChartDataSets = [];

    let dataBarCharts = '';

    let i = 0;
    if (nextProps.reports !== this.props.reports) {
      this.setState({ reports: nextProps.reports });
    }
    if (nextProps.reportCharts !== this.props.reportCharts) {
      for (let itemPieChart in nextProps.reportCharts) {
        let dataName = this.translateReportChart(itemPieChart);

        arrPieChart.push({
          name: dataName,
          population: nextProps.reportCharts[itemPieChart],
          color: this.state.colorArray[i],
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        });

        i = i + 1;
      }
      this.setState({ dataPieChart: arrPieChart });
    }
    if (nextProps.reportChartBars !== this.props.reportChartBars) {
      for (let itemPieChart in nextProps.reportChartBars) {
        let dataName = this.translateReportChart(itemPieChart);

        arrBarChartLabel.push(dataName);

        arrBarChartDataSets.push(nextProps.reportChartBars[itemPieChart]);

        i = i + 1;
      }
      dataBarCharts = {
        labels: arrBarChartLabel,
        datasets: [
          {
            data: arrBarChartDataSets,
          },
        ],
      };
      this.setState({ dataBarChart: dataBarCharts });
    }
  }

  componentDidMount = async () => {
    this.props.report(
      moment().format('MM/DD/YYYY'),
      moment().format('MM/DD/YYYY'),
    );
    this.props.reportChart();

    this.props.reportChartBar(
      this.props.user.id,
      moment().toISOString(),
      moment().toISOString(),
    );
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          'change',
          this.handleChangeLanguage(languageCode),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        'change',
        this.handleChangeLanguage(languageCode),
      );
    }
  };

  handleChangeLanguage = lgnCode => {
    setLanguage(lgnCode);
    //this.setState({ languageCode: lgnCode });

    chooseLanguageConfig(lgnCode);
  };

  renderErr(error) {
    return (
      <WingBlank>
        <WhiteSpace size="lg" />
        <Text style={styles.txtError}>{error}</Text>
      </WingBlank>
    );
  }

  handleChange = (date, params) => {
    const { endDate, startDate } = this.state;
    if (params === 0) {
      if (Date.parse(date) <= Date.parse(endDate) || endDate === '') {
        this.setState({ err: '', startDate: date }, () => {
          this.props.report(
            this.state.startDate,
            this.state.endDate
              ? this.state.endDate
              : moment().format('MM/DD/YYYY'),
          );
          this.props.reportChartBar(
            this.props.user.id,
            this.state.startDate,
            this.state.endDate
              ? this.state.endDate
              : moment().format('MM/DD/YYYY'),
          );
        });
        return;
      }
      this.setState({
        err: translate('START_DATE_CANNOT_BE_GREATER_THAN_END_DATE'),
      });
    } else {
      if (Date.parse(date) >= Date.parse(startDate) || startDate === '') {
        this.setState(
          {
            err: '',
            endDate: date,
          },
          () => {
            this.props.report(
              this.state.startDate ? this.state.startDate : this.state.endDate,
              this.state.endDate,
            );
            this.props.reportChartBar(
              this.props.user.id,
              this.state.startDate ? this.state.startDate : this.state.endDate,
              this.state.endDate,
            );
          },
        );
        return;
      }
      this.setState({
        err: translate('START_DATE_CANNOT_BE_GREATER_THAN_END_DATE'),
      });
      return false;
    }
  };
  translateReportChart = item => {
    let reportVN = '';

    switch (item) {
      case 'inventoryAtMySelf':
        return (reportVN = translate('IN_STOCK'));
      case 'atResident':
        return (reportVN = translate('SOLD_TO_THE_PEOPLE'));
      case 'else':
        return (reportVN = translate('BEING_ELSEWHERE'));
      case 'atFactoryChilds':
        return (reportVN = translate('EXISTING_SUBSIDIARY'));
      case 'atGeneralChilds':
        return (reportVN = translate('EXISTING_TRADER'));
      case 'atAgencyChilds':
        return (reportVN = translate('EXISTING_RETAIL_STORE'));
      case 'atPartners':
        return (reportVN = translate('EXIST_PARTNER'));
      case 'atFixer':
        return (reportVN = translate('EXIST_REPAIR_FACTORY'));
      case 'totalFixer':
        return (reportVN = translate('LABEL_REPAIR_FACTORY'));
      case 'totalGeneral':
        return (reportVN = translate('LABEL_TRADER'));
      case 'totalAgency':
        return (reportVN = translate('RETAIL_STORE'));
      case 'totalCompanyChild':
        return (reportVN = translate('SUBSIDIARY'));
      case 'totalBuyPartner':
        return (reportVN = translate('PARTNER_BOUGHT_OFF'));
      case 'totalRentPartner':
        return (reportVN = translate('RENTAL_PARTNER'));
      default:
        return (reportVN = '');
    }
  };
  translateReport = (item, userType) => {
    let reportVN = '';
    switch (item[0]) {
      case 'totalAgency':
        reportVN = translate('TOTAL_AGENCY');
        break;

      case 'totalExportToAgency':
        reportVN = translate('TOTAL_EXPORT_TO_AGENCY');
        break;

      case 'totalExportToCustomer':
        reportVN = translate('TOTAL_EXPORT_TO_CUSTOMER');
        break;

      case 'totalExportToGeneral':
        reportVN = translate('TOTAL_EXPORT_TO_GENERAL');
        break;

      case 'totalExportToStation':
        reportVN = translate('TOTAL_EXPORT_TO_STATION');
        break;

      case 'totalGeneral':
        reportVN = translate('TOTAL_GENERAL');
        break;

      case 'totalImportCylinder':
        reportVN = translate('TOTAL_IMPORT_CYLINDER');
        break;

      case 'totalCreatedCylinder':
        reportVN = translate('TOTAL_CREATED_CYLINDER');
        break;

      case 'totalStation':
        reportVN = translate('TOTAL_STATION');
        break;

      case 'totalImportFromStation':
        if (userType === FACTORY) {
          reportVN = translate('TOTAL_IMPORT_FROM_STATION');
        } else {
          reportVN = translate('TOTAL_IMPORT');
        }
        break;

      case 'totalTurnBack':
        reportVN = translate('TOTAL_TURNBACK');
        break;

      case 'totalExports':
        reportVN = translate('TOTAL_EXPORTS');
        break;

      case 'totalSales':
        reportVN = translate('TOTAL_SALES');
        break;

      case 'reveneu':
        reportVN = translate('REVENUE_VND');
        break;

      case 'totalExportSale':
        reportVN = translate('TOTAL_EXPORT_SALE');
        break;

      case 'totalExportRent':
        reportVN = translate('TOTAL_EXPORT_RENT');
        break;

      case 'totalImportSale':
        reportVN = translate('TOTAL_IMPORT_SALE');
        break;

      case 'totalImportRent':
        reportVN = translate('TOTAL_IMPORT_RENT');
        break;

      case 'totalImportFixer':
        reportVN = translate('TOTAL_IMPORT_FIXER');
        break;

      case 'totalExportFixer':
        reportVN = translate('TOTAL_EXPORT_FIXER');
        break;

      default:
        reportVN = '';
        break;
    }
    if (item[0] !== 'revenue') {
      return (
        <Item
          extra={
            <Text style={styles.itemStyle}>
              {typeof item[1] === 'number'
                ? item[1].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                : item[1]}
            </Text>
          }
        >
          <Text style={styles.itemStyle}>{reportVN}</Text>
        </Item>
      );
    } else {
      return (
        <Item
          extra={
            <Text style={styles.itemStyle}>
              {typeof item[1] === 'number'
                ? item[1].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                : item[1]}
            </Text>
          }
        >
          <Text style={styles.itemStyle}>{reportVN}</Text>
        </Item>
      );
    }
  };

  renderCard = () => {
    const dataReport = this.state.reports;

    const { userType, user } = this.props;

    if (userType === FACTORY) {
      for (let item in dataReport) {
        if (
          item !== 'totalAgency' &&
          item !== 'totalExportToGeneral' &&
          item !== 'totalGeneral' &&
          item !== 'totalExportToAgency' &&
          item !== 'totalImportCylinder' &&
          item !== 'totalTurnBack' &&
          item !== 'totalCreatedCylinder' &&
          item !== 'totalExportSale' &&
          item !== 'totalExportRent' &&
          item !== 'totalImportSale' &&
          item !== 'totalImportRent'
        ) {
          delete dataReport[item];
        }
      }
    } else if (userType === GENERAL) {
      for (let item in dataReport) {
        if (
          item !== 'totalAgency' &&
          item !== 'totalImportCylinder' &&
          item !== 'totalExports'
        ) {
          delete dataReport[item];
        }
      }
    } else if (userType === AGENCY) {
      if (user.parentRoot === '') {
        for (let item in dataReport) {
          if (
            item !== 'totalImportCylinder' &&
            item !== 'totalSales' &&
            item !== 'reveneu' &&
            item !== 'totalCreatedCylinder'
          ) {
            delete dataReport[item];
          }
        }
      } else {
        for (let item in dataReport) {
          if (
            item !== 'totalImportCylinder' &&
            item !== 'totalSales' &&
            item !== 'reveneu'
          ) {
            delete dataReport[item];
          }
        }
      }
    } else if (userType === FIXER) {
      for (let item in dataReport) {
        if (item !== 'totalImportFixer' && item !== 'totalExportFixer') {
          delete dataReport[item];
        }
      }
    }
    // else if (userType === STATION) {
    //     for (let item in dataReport) {
    //         if (item !== "totalImportFromStation" && item !== "totalExports") {
    //             delete dataReport[item]
    //         }
    //     }
    // }
    //TODO AGENCY , GENERAL
    const result = Object.keys(dataReport).map(function (key) {
      return [key, dataReport[key]];
    });
    return (

      <ScrollView>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch' }}>
          <Text style={styles.title}>Tổng số bình đã tạo </Text>
          <Text style={styles.title_num}>2500</Text>
        </View>
        <View>
          <ScrollView>
            <TabView
              lazy
              navigationState={this.state.tabview}
              renderScene={SceneMap({
                first: NewBottle,
                second: OldBottle,
              })}
              renderLazyPlaceholder={this._renderLazyPlaceholder}
              onIndexChange={this._handleIndexChange}
              initialLayout={{ width: Dimensions.get('window').width }}
            />
          </ScrollView>
        </View>
        <View >
          <Text style={styles.title}>Tổng số bình đã xuất</Text>
        </View>
        <View>
          <Text style={styles.title}>Tổng số bình đã nhập</Text>
        </View>
        <View>
          <Text style={styles.title}>Tổng số bình tồn kho</Text>
        </View>
      </ScrollView>
    );
  };

  render() {
    return (
      <ScrollView>
        {this.props.user.userType !== 'Agency' &&
          this.props.user.userType !== 'Fixer' ? (
          <ScrollView horizontal={true}>
            <StackedBarChart
              style={{
                marginTop: 45,
                marginVertical: 8,
                borderRadius: 16,
              }}
              data={stackedBarChartData_out}
              width={screenWidthPieChart}
              height={220}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
            />
          </ScrollView>
        ) : null}
        <Text style={{
          textAlign: "center",
          fontWeight: "bold",
          color: 'blue'
        }}>{translate('SHIPMENT_CHART')}</Text>
        {this.props.user.userType !== 'Agency' &&
          this.props.user.userType !== 'Fixer' ? (
          <ScrollView horizontal={true}>
            <StackedBarChart
              style={{
                marginTop: 80,
                marginVertical: 8,
                borderRadius: 16,
              }}
              data={stackBarChartData_in}
              width={screenWidthPieChart}
              height={220}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,

                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
            />
          </ScrollView>
        ) : null}
        <Text style={{
          textAlign: "center",
          fontWeight: "bold",
          color: 'blue'
        }}>{translate('IMPORT_CHART')}</Text>
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 30,
              paddingHorizontal: 5,

            }}
          >
            <DatePicker
              style={{ flex: 1, marginLeft: 10, borderRadius: 5, borderWidth: 1 }}
              date={this.state.startDate}
              mode="date"
              placeholder={translate('START_DATE')}
              format="MM/DD/YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                datePicker: {
                  backgroundColor: 'white',
                  color: 'black'
                },
                datePickerCon: {
                  color: 'black',
                  backgroundColor: 'white',
                },
                dateIcon: {
                  marginLeft: 0,


                },
                dateInput: {
                  backgroundColor: "#FFFFFF",
                  marginLeft: 0,
                  borderRadius: 5
                },
              }}
              onDateChange={date => this.handleChange(date, 0)}
            />
            <DatePicker
              style={{ flex: 1, marginLeft: 10, borderRadius: 5, borderWidth: 1 }}
              date={this.state.endDate}
              mode="date"
              placeholder={translate('END_DATE')}
              format="MM/DD/YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                datePicker: {
                  backgroundColor: 'white',
                  color: 'black'
                },
                datePickerCon: {
                  color: 'black',
                  backgroundColor: 'white',
                },
                dateIcon: {
                  marginLeft: 0,

                },
                dateInput: {
                  backgroundColor: "#FFFFFF",
                  marginLeft: 0,
                  borderRadius: 5
                },
                // ... You can check the source to find the other keys.
              }}

              onDateChange={date => this.handleChange(date, 1)}
            />
          </View>

          {this.renderErr(this.state.err)}
        </View>

        {this.renderCard()}

      </ScrollView>
    );
  }
}

DailyReport.propTypes = {};
export const mapStateToProps = state => ({
  reports: state.report.report,
  reportCharts: state.report.reportChart,
  userType: state.auth.user.userType,
  reportChartBars: state.report.reportChartBar,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  report,
  reportChart,
  reportChartBar,
})(DailyReport);
