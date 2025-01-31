import React, {Component} from 'react';
import { View,Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isEqual } from 'lodash';
import { Actions } from 'react-native-router-flux';
import pluralize from 'pluralize';
import { CardColumnSection } from '../Common';
import { COLOR } from '../../constants';

const styles= {
    containerStyle: {
        backgroundColor: COLOR.BACKGROUNDGRAY,
        paddingBottom: 16,
        paddingTop: 16
    },
    breadcrumb:{
        fontSize: 14,
        marginBottom: 8,
        marginRight: 15,
        color: COLOR.BLACK
    },
    serviceNameStyle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 3,
        color: COLOR.BLACK
    },
    descriptionStyle: {
        color: COLOR.LIGHTBLACK
    },
    breadcrumbWrapper: {
        flexDirection: 'row'
    },
    detailWrapper: {
        flexDirection: 'row'
    },
    info: {
        flex: 5
    },
    rightGroupStyle: {
        justifyContent: 'flex-end',
        flex: 1,
        flexDirection: 'row'
    },
    detailStyle:{
        fontSize: 12,
        color: COLOR.DARKGRAY,
    },
};
const propTypes = {
    service: PropTypes.object,
    showInfo: PropTypes.func,
    cleanSearch: PropTypes.func,
    total: PropTypes.number,
    isShowingSearchResult: PropTypes.bool
};
class ArticleService extends Component {
    handleServiceClick = () => {
        this.props.cleanSearch();
        Actions.pop();
    }
    renderBreadcrumb = (service) => {
        const {  breadcrumb, breadcrumbWrapper } = styles;
        if(service && service !== null){
            return (
                <View style={breadcrumbWrapper}>
                    <TouchableOpacity onPress={Actions.app}><Text style={breadcrumb}>{`Home >`}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.handleServiceClick}><Text numberOfLines={1} ellipsizeMode ={'tail'} style={breadcrumb}>{service.name}</Text></TouchableOpacity>
                </View>
            );
        }
        return (
            <TouchableOpacity onPress={Actions.app}><Text style={breadcrumb}>{`Home >`}</Text></TouchableOpacity>
        );
    }
    render(){
        const {service, isShowingSearchResult, total} = this.props;
        if(!service){
            return null;
        }

        const { containerStyle, breadcrumb, serviceNameStyle} = styles;
        if(isShowingSearchResult){
            return (
                <CardColumnSection style={containerStyle}>
                    {this.renderBreadcrumb(service)}
                    <Text style={serviceNameStyle}>Search results</Text>
                    <Text style={styles.detailStyle}>{`${total} ${pluralize('article',total)}`}</Text>
                </CardColumnSection>
            );
        }
        return (
            <CardColumnSection style={containerStyle}>
                <TouchableOpacity onPress={Actions.app}><Text style={breadcrumb}>{`Home >`}</Text></TouchableOpacity>
                <View style={styles.detailWrapper}>
                    <View style={styles.info}>
                        <Text style={serviceNameStyle}>{service.name}</Text>
                        <Text style={styles.detailStyle}>{`${total} ${pluralize('article',total)}`}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this.props.showInfo(service.id)} style={styles.rightGroupStyle}>
                        <Icon size={24} color='gray'>info_outline</Icon>
                    </TouchableOpacity>
                </View>
            </CardColumnSection>
        );
    }
};

ArticleService.propTypes = propTypes;
export default ArticleService;
