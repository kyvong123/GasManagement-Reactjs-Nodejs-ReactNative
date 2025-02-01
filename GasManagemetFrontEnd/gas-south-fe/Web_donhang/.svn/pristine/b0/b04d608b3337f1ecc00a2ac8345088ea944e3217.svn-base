import React from 'react';

import Select from 'react-select';

class TagAutoComplete extends React.Component
{
    constructor(props) {
        super(props);
        this.state={
            multi: true,
            multiValue: [],
            options: this.props.options,
            value: []
        };

    }

    handleOnChange = (value) => {
        this.setState({ multiValue: value });
        this.props.getPosition(value);
    }


    render () {

        const { multi, multiValue, options, value } = this.state;
        return (
            <div className="section">

                <Select.Creatable
                    multi={multi}
                    options={this.props.data}
                    onChange={this.handleOnChange}
                    placeholder="Chọn..."
                    value={multi ? multiValue : value}
                    promptTextCreator={()=> {return ;}}

                />
                <div className="hint">{this.props.hint}</div>

            </div>
        );
    }
}


export default TagAutoComplete;