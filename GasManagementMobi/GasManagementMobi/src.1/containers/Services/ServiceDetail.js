import React, { Component } from 'react';
import { View, Text, Image, WebView, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import withNetInfo from '../../helpers/withNetinfo';
import { BaseModal, Button, Spinner } from '../../components/Common';
import { quillStyle, COLOR } from '../../constants';


const {width, height} = Dimensions.get('window');
const propTypes = {
    service: PropTypes.object,
    loading: PropTypes.bool
};
const styles = {
    webViewStyle: {
        width,
        height,
        paddingTop: 0,
        paddingLeft: 16,
        paddingRight: 16
    },
    wrapper: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
};
class ServiceDetail extends Component {
    prepareContent = (service) => {
        let section='';
        if(service.name){
            if(service.icon&&service.icon.absoluteUrl){
                section = section.concat(`<div style="display: flex;flex-direction: row;flex-wrap: nowrap; align-items: center;"><img src="${service.icon.absoluteUrl}" alt="logo" width="56" height="56" style="margin-right: 16px; border-radius: 50%;"><h2 style="font-size: 16px; margin: 0;">${service.name}</h2></div>`);
            } else {
                section = section.concat(`<h2 style="font-size: 16px; margin-bottom: 3px;">${service.name}</h2>`);
            }
        }
        if(service.description){
            section = section.concat(`<h3 style="font-size: 16px; margin-bottom: 3px;">Service description</h3><div style="margin-bottom: 15px;">${service.description}</div>`);
        }
        if(service.business){
            section = section.concat(`<h3 style="font-size: 16px; margin-bottom: 3px; ">Business description</h3><div style="margin-bottom: 15px;">${service.business}</div>`);
        }
        const result=`<html><head><style>${quillStyle}</style></head><body>${section}</body></html>`;
        
        return result;
    }
    renderDetail = (service) => {
        const content = this.prepareContent(service);
        return (
            <View style={styles.webViewStyle}>
                <WebView
                    source={{html: content}}
                    />
            </View>
        );
    }
    renderContent = (loading, service) =>{
        if(loading){
            return <Spinner size='large'/>;
        }
        if(!service){
            return <Text>Your service's detail is emty</Text>;
        }
        return (
            <View>
                {this.renderDetail(service)}
            </View>
        );
    }
    render() {
        const { loading, service } = this.props;
        return (
            <BaseModal>
                <View style={styles.wrapper}>
                    {this.renderContent(loading, service)}
                </View>
            </BaseModal>
        );
    }
}

ServiceDetail.propTypes = propTypes;

const mapStateToProps = (state) => ({
    service: state.get('ServiceReducer').get('service').toJS(),
    loading: state.get('ServiceReducer').get('loading')
});

export default connect(mapStateToProps,null)(withNetInfo(ServiceDetail));