import i18n from 'i18n-js';
import {memoize} from 'lodash';
import {setLanguage} from '../helper/auth';

const translationGetters = {
  en: () => require('../languages/en.json'),
  vi: () => require('../languages/vi.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
const chooseLanguageConfig = (lgnCode) => {
  let fallback = {languageTag: 'vi'};
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = {languageTag: lgnCode};
  }

  const {languageTag} = fallback;

  translate.cache.clear();

  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};

const handleChangeLanguage = (lgnCode) => {
  setLanguage(lgnCode);
  //this.setState({languageCode: lgnCode});

  chooseLanguageConfig(lgnCode);
};

export {handleChangeLanguage, translate};
