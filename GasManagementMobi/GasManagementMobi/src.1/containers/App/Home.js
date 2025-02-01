import React, { Component } from 'react';
import { View, Dimensions, Image, Text, ScrollView, Animated } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';

// import { NavigationActions } from 'react-navigation';
import {COLOR} from '../../constants';
import withNetInfo from '../../helpers/withNetinfo';
import {SearchGroup, HeaderInfo} from '../../components/App/home';
import { queryChanged } from '../../containers/Filters/FilterActions';
import { showSearchBox } from '../../containers/Articles/ArticleActions';
import ServicePage from '../Services/Services';

const {width} = Dimensions.get('window');

const HEADER_MAX_HEIGHT = 204;
const HEADER_MIN_HEIGHT = 51;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = {
    scrollWrapper: {
        backgroundColor: COLOR.WHITE,
        flex: 1
    },
    moreArticle: {
        flexDirection: 'row',
        position: 'absolute',
        flex: 1,
        bottom: 16,
        width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stickHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        width
    }
};
export class Home extends Component {
    constructor(props){
        super(props);
        this.state= {
            scrollY: new Animated.Value(0)
        };
    }
    renderServices = () => (
            <View style={{flex: 1, marginTop: HEADER_MAX_HEIGHT}}>
                <ServicePage/>
            </View>
        )
    handleSearch = (keyword) =>{
        this.props.queryChanged({search: keyword, page: 1, services: null});
        this.props.showSearchBox();
        Actions.searchArticles();
    }
    onFocus = () =>{
        if(this.state.scrollY._value < HEADER_SCROLL_DISTANCE){

            this.scroll.scrollTo({y: HEADER_SCROLL_DISTANCE});
        }
    }
    render(){
        const {loading, metaData} = this.props;
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const headerTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -145],
            extrapolate: 'clamp',
          });
        return (
            <View style={{flex: 1}}>
                <ScrollView ref={(ref) => this.scroll = ref}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                    )}
                    style={styles.scrollWrapper}
                >
                    {this.renderServices()}
                </ScrollView>
                <Animated.View style={[styles.stickHeader, {height: headerHeight}]}>
                    <HeaderInfo loading={loading} metaData={metaData} translateY={headerTranslate}/>
                    <SearchGroup handleSearch={this.handleSearch} onFocus={this.onFocus}/>
                </Animated.View>
                
            </View>
            );
    }
}

const propTypes = {
    navigation: PropTypes.object,
    loading: PropTypes.bool,
    metaData: PropTypes.object,
    queryChanged: PropTypes.func,
    showSearchBox: PropTypes.func,
};

class HomeContainer extends Component {
    // TODO: handleSearch
    // TODO: handlePressButton (show browse articles)
    render() {
        return <Home/>;
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.get('AuthReducer').get('userInfo'),
    loading: state.get('AuthReducer').get('serverData').get('loading'),
    metaData: state.get('AuthReducer').get('serverData').get('metaData').toJS()
});

HomeContainer.propTypes = propTypes;
Home.propTypes = propTypes;

export default connect(mapStateToProps, {queryChanged, showSearchBox})(withNetInfo(Home));