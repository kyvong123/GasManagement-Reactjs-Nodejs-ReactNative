import React, { Component } from 'react';
import moment from "moment";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import './Header.scss'
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStartL: '',
            dateEnd: '',

            index: null,
            dateStart: undefined,
            dateEnd: undefined
        }
    }
    dateFormat = "DD/MM/YYYY";

    handleClickFilter = (index) => {
        this.setState({
            index: index
        })
        if (index === this.state.index) {
            this.setState({
                index: null
            })
        }
        if (index === 0) {
            this.setState({
                dateStart: (moment().startOf("isoday")),
                dateEnd: (moment().endOf("isoday"))
            })
        }
        if (index === 1) {
            this.setState({
                dateStart: (moment().startOf("isoweek")),
                dateEnd: (moment().endOf("isoweek"))
            })

        }
        if (index === 2) {
            this.setState({
                dateStart: (moment().startOf("isomonth")),
                dateEnd: (moment().endOf("isomonth"))
            })

        }
        if (index === 3) {
            this.setState({
                dateStart: moment()
                    .startOf("isomonth")
                    .subtract(1, "isomonths"),
                dateEnd: moment()
                    .subtract(1, "isomonths")
                    .endOf("month")
                    
            })

        }
    }
    handleChangeDateStart = (date) => {
        this.setState({
            dateStart: date
        })
    }
    handleChangeDateEnd = (date) => {
        this.setState({
            dateEnd: date
        })
    }
    render() {
        return (
            <div className='header'>
                <div className='btn-group container'>
                    <div className='row align-center justify-content-md-start'>
                        <div onClick={() => this.handleClickFilter(0)} className={`btn-item col ${this.state.index === 0 ? 'active' : null}`}><span>Hôm nay</span></div>
                        <div onClick={() => this.handleClickFilter(1)} className={`btn-item col ${this.state.index === 1 ? 'active' : null}`}><span>Tuần này</span></div>
                        <div onClick={() => this.handleClickFilter(2)} className={`btn-item col ${this.state.index === 2 ? 'active' : null}`}><span>Tháng này</span></div>
                        <div onClick={() => this.handleClickFilter(3)} className={`btn-item col ${this.state.index === 3 ? 'active' : null}`}><span>Tháng trước </span></div>
                        <div className='date-picker col-6'>
                            <DatePicker
                                placeholder='Tháng bắt đầu'
                                onChange={(date) => this.handleChangeDateStart(date)}
                                value={this.state.dateStart}
                                format={this.dateFormat}
                            />
                            <DatePicker
                                placeholder='Tháng Kết thúc'
                                onChange={(date) => this.handleChangeDateEnd(date)}
                                value={this.state.dateEnd}
                                format={this.dateFormat}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;