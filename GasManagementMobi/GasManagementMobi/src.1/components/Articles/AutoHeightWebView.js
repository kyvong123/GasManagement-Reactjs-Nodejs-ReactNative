import React, { Component } from 'react';
import {WebView, Dimensions} from "react-native";
import PropTypes from 'prop-types';
import {COLOR} from '../../constants';

const script = `
<script>
	window.location.hash = 1;
    var calculator = document.createElement("div");
    calculator.id = "height-calculator";
    while (document.body.firstChild) {
        calculator.appendChild(document.body.firstChild);
    }
	document.body.appendChild(calculator);
    document.title = calculator.scrollHeight;
</script>
`;
const style = `
<style>
body, html, #height-calculator {
    margin: 0;
    padding: 0;
}
#height-calculator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
</style>
`;
const styles = {
    webviewStyle: {
        width: Dimensions.get('window').width-20
    }
};
class AutoHeightWebView extends Component
{
	constructor(props) {
        super(props);

        this.state = {
           Height:0
        };
    }
    onNavigationChange(event) {
        if (event.title) {
            const htmlHeight = Number(event.title); // convert to number
            this.setState({Height:htmlHeight});
        }

     }
    render () {

        const {rawHtml}=this.props;
    	return (
    		<WebView scrollEnabled={false}
                source={{html:rawHtml+style+script}} 
                style={[styles.webviewStyle,{height:this.state.Height}]}
      			javaScriptEnabled ={true}
      			onNavigationStateChange={this.onNavigationChange.bind(this)}>
			</WebView>

    		);
    }

}
AutoHeightWebView.propTypes = {
    rawHtml: PropTypes.string,
};
export default AutoHeightWebView;