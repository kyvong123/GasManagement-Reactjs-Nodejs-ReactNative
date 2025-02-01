import React from 'react';
import { connect } from 'react-redux';
import {
  Scene,
  Router,
  Reducer,
  Overlay,
  Modal,
  Drawer,
  Stack,
  Lightbox,
  ActionConst
} from 'react-native-router-flux';

import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';


import SignInStep1 from './containers/Auth/SigninStep1';
import SignInStep2 from './containers/Auth/SigninStep2';
import Homepage from './containers/App/Home';
import HomeSearch from './containers/App/HomeSearch';

import ArticlesPage from './containers/Articles/Articles';
import ArticleSearch from './containers/Articles/ArticleSearch';
import ArticleDetailPage from './containers/Articles/ArticleDetail';
import ArticleFilters from './containers/Articles/ArticleFilters';
import ServiceDetail from './containers/Services/ServiceDetail';
// import SortNavbar from './components/Articles/SortNavBar';
import FilterNavbar from './components/Articles/FilterNavBar';
import ServiceNav from './components/Services/ServiceNav';

import DrawerContent from './components/App/DrawerContent';
import DemoLightbox from './components/App/DemoLightbox';
import ErrorModal from './components/App/ErrorModal';
import Splash from './components/App/Splash';
import {NavBarWithLogo, CustomNavbar, NavBarSwitchDomain} from './components/Common';
import {ArticleListNav} from './components/Articles';
import SigninAnotherStep1 from './containers/Auth/SigninAnotherStep1';
import SigninAnotherStep2 from './containers/Auth/SigninAnotherStep2';
import SigninAnotherDomain from './containers/Auth/SigninAnotherDomain';

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action)=>{
      console.log("Router changed:", action);
      return defaultReducer(state, action);
  };
};

const RouterComponent = () => (
    <Router createReducer={reducerCreate}>
    <Overlay key="overlay">
      <Modal key="modal" hideNavBar transitionConfig={() => ({ screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid })}>
        <Scene key="splash" hideNavBar component={Splash} initial={true}/>
        <Stack key="auth" titleStyle={{ alignSelf: 'center' }} init={true} type={ActionConst.RESET}>
          <Scene key="signInStep1" navBar={NavBarWithLogo} component={SignInStep1} back={false} title="login1"/>
          <Scene key="signInStep2" navBar={NavBarWithLogo} component={SignInStep2} back={false} title="login2"/>
        </Stack>
        <Lightbox key="app" type={ActionConst.RESET}>
          {/* <Stack key="app" titleStyle={{ alignSelf: 'center' }}> */}
            <Drawer drawer hideNavBar key="drawer" contentComponent={DrawerContent} drawerWidth={300}>
            {/* <Scene panHandlers={null} key='vick'> */}
            <Scene key="home" component={Homepage} navBar={CustomNavbar} back={false} type={ActionConst.RESET} navType='menu' initial/>
            <Stack key="anotherAuth">
              <Scene key="signInAnotherStep1" navBar={NavBarSwitchDomain} component={SigninAnotherStep1} title="loginAnother1"/>
              <Scene key="signInAnotherStep2" navBar={NavBarSwitchDomain} component={SigninAnotherStep2} title="loginAnother2"/>
            </Stack>
            <Scene key="signInAnotherDomain" navBar={NavBarSwitchDomain} component={SigninAnotherDomain} title="loginAnotherDomain"/>
              <Scene key="articles">
                {/* <Scene key="services" component={ServicesPage} navBar={CustomNavbar} navType='menu' NavRight={ServiceNav} initial/> */}
                <Scene key="articleList" component={ArticlesPage} navBar={ArticleListNav}/>
                <Scene key="articleSearch" component={ArticleSearch} navBar={ArticleListNav}/>
                <Scene key="articlesDetail" component={ArticleDetailPage} navBar={CustomNavbar} navType='close' />
              </Scene>
              <Stack key="searchArticles">
                <Scene key="search" component={HomeSearch} navBar={ArticleListNav}/>
                <Scene key="searchDetail" component={ArticleDetailPage} navBar={CustomNavbar} navType='close' />
              </Stack>
            {/* </Scene> */}
            </Drawer>
          {/* </Stack> */}
          <Scene key="demoLightBox" component={DemoLightbox} />
        </Lightbox>
        <Scene key="error" component={ErrorModal} />
        <Scene key='serviceDetail' component={ServiceDetail}/>
        <Scene key="articleFilters" component={ArticleFilters} />
      </Modal>

      {/* <Scene component={MessageBar} /> */}
    </Overlay>
  </Router>
  );

export default connect()(RouterComponent);
