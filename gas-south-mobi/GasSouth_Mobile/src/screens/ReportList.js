import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text } from 'react-native';
import { Card, WingBlank, WhiteSpace } from '@ant-design/react-native/lib/';
import {connect} from 'react-redux'
import {report} from '../actions/ReportActions'

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'

const translationGetters = {
  en: () => require('../languages/en.json'),
  vi: () => require('../languages/vi.json')
}

const chooseLanguageConfig = (lgnCode) => {
  let fallback = { languageTag: 'vi' }
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode }
  }

  const { languageTag } = fallback

  translate.cache.clear()

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

class ReportList extends Component {
    componentDidMount = async () => {
        this.props.report()
        try {
            const languageCode = await getLanguage();
            if (languageCode) {
                RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
            }
        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount = async () => {
        const languageCode = await getLanguage();
        if (languageCode) {
            RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
        }
    }

    handleChangeLanguage = (lgnCode) => {
        //setLanguage(lgnCode);
        chooseLanguageConfig(lgnCode)
    }

    renderCard = () => {
        return (
            <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                <Card.Header
                    title={translate('FEEDBACK')}
                    thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                />
                <Card.Body>
                    <WingBlank>
                        <Text>{translate('VERY_GOOD_PRODUCT_AFFORDABLE_PRICE')}</Text>
                    </WingBlank>
                </Card.Body>
                <Card.Footer content="Ngày tạo: 03/12/2018" />
                </Card>
                <WhiteSpace size="lg" />
            </WingBlank>
        )
    }
    render() {
        return (
            <ScrollView>
                {this.renderCard()}
                {this.renderCard()}
            </ScrollView>
        );
    }
}

ReportList.propTypes = {

};
export const mapStateToProps = state => ({
    report: state.report,
})
export default connect(mapStateToProps)(ReportList);