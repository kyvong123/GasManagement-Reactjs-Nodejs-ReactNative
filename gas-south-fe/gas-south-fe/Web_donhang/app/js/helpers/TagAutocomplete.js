import React from 'react';

import Select from 'react-select';

class TagAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            multi: true,
            multiValue: [],
            options: this.props.options,
            value: []
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.valueInit !== this.props.valueInit) {
            this.setState({multiValue: this.props.valueInit});
            this.props.getValues( this.props.valueInit);
        }
    }

    handleOnChange = (value) => {
        this.setState({multiValue: value});
        this.props.getValues(value);
    };

    render() {

        const {multi, multiValue, options, value} = this.state;
        const test = [
            {label: 3, value: "Bananas"},
            {label: 4, value: "Mangos"},
            {label: 5, value: "Lemons"}
        ];
        //console.log(this.props.valueInit);

        return (
            <div className="section">

                <Select.Creatable
                    multi={multi}
                    options={this.props.re_options}
                    onChange={this.handleOnChange}
                    placeholder="Chọn..."
                    value={multi ? multiValue : value}
                    promptTextCreator={() => {
                        return;
                    }}
                    // tags={test}
                />
                <div className="hint">{this.props.hint}</div>

            </div>
        );
    }
}

export default TagAutocomplete;