import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Input, Button} from '../Common';

const propTypes = {
    handleAddComent: PropTypes.func,
    fieldId: PropTypes.number
};
const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        // height: 40,
        paddingTop: 0,
        paddingBottom: 8,
        paddingLeft: 0
    },
    inputStyle:{
        flex: 4,
        paddingRight: 5
    }
};

class ArticleCommentForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            comment: null
        };
        this.onCommentChanged = this.onCommentChanged.bind(this);
        this.handleAddComent = this.handleAddComent.bind(this);
    }
    onCommentChanged(val){
        this.setState({
            comment: val
        });
    }
    handleAddComent(){
        const {comment} = this.state;
        const {fieldId} = this.props;
        this.props.handleAddComent(fieldId,comment);
        this.setState({
            comment: null
        });
    }
    render() {
        const {container, inputStyle} = styles;
        return (
        //   <View>
        //       <Text>ArticleCommentForm</Text>
        //   </View>
            <View style={container}>
                <View style={inputStyle}>
                    <Input
                        multiline={true}
                        autoGrow={true}
                        placeholder='Enter your comment'
                        value={this.state.comment}
                        maxLength={1000}
                        onChangeText={this.onCommentChanged}
                        />
                </View>
                <Button onPress={this.handleAddComent} disabled={!this.state.comment} size='medium'>
                    Add
                </Button>
        </View>
        );
    }
}
ArticleCommentForm.propTypes = propTypes;
export default  ArticleCommentForm;
