import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {CardRowSection} from '../Common/';
import { COLOR } from '../../constants';

const styles = {
    container: {
        padding: 16,
        paddingRight: 30,
        borderBottomWidth: 1,
        borderColor: '#DDD',
        // borderRadius: 5,
        flex: 1,
        // position:'relative',
    },
    withoutPadding: {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0
      },
    titleStyle: {
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.LIGHTBLACK
    },
    descriptionStyle:{
        fontSize: 14,
        color: COLOR.LIGHTBLACK
    },
    detailStyle: {
        flexDirection: 'row',
        minWidth: 60,
        marginRight: 16,
        marginTop: 6
    },
    detailLabelStyle: {
        fontSize: 12,
        color: COLOR.GRAY
    },
    detailValueStyle: {
        fontSize: 12,
        fontWeight: '500'
    },
    // iconStyle: {
    //     position: 'absolute',
    //     right: 1,
    //     top: 1,
    //     padding: 10
    // }
};
class ArticleItem extends Component {
    constructor(props){
        super(props);
        // this.renderExcerpt = this.renderExcerpt.bind(this);
        // this.renderDropdownIcon = this.renderDropdownIcon.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderDetail = this.renderDetail.bind(this);
    }
    renderTitle(){
        const {title} = this.props.data.item;
        if(title){
            return <Text style={styles.titleStyle}>{title}</Text>;
        }
        return null;
    }
    renderDetail(label, value){
        let  data = 0;
        if(value || value === 0){data = value;}
        
        return  (
            <View style={styles.detailStyle}>
                <Text  style={styles.detailLabelStyle}>{label}</Text>
                <Text  style={styles.detailValueStyle}>{data}</Text>
            </View>
        );
            
        
        
    }
    
    // renderDropdownIcon(){
    //     const {handleToggle, data} = this.props;
    //     const {expand, id} = data.item;

    //     return  (
    //         <TouchableOpacity onPress={()=>handleToggle(id)} style={styles.iconStyle}>
    //             <Icon size={20} color='gray'>{expand ? 'keyboard_arrow_up': 'keyboard_arrow_down'}</Icon>
    //         </TouchableOpacity>
    //     );
    // }
    render() {
        const {onPress, data} = this.props;
        const {container} = styles;
        const {id, views, uses} = data.item;
        return (
            <CardRowSection style={styles.withoutPadding}>
                <TouchableOpacity onPress={()=>onPress(id)} style={container}> 
                    {this.renderTitle()}
                    <View style={{flex:1, flexDirection:'row'}}>
                       {this.renderDetail('Views: ',views)}
                       {this.renderDetail('Uses: ',uses)}
                    </View>
                    {/* {this.renderDropdownIcon()} */}
                </TouchableOpacity>
            </CardRowSection>
        );
    }
}

ArticleItem.propTypes = {
    onPress: PropTypes.func,
    // handleToggle: PropTypes.func,
    data: PropTypes.object
};

export default ArticleItem;