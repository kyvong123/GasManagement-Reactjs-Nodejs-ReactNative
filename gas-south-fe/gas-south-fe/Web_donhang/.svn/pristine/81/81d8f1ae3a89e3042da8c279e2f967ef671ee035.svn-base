import React from 'react';


class tableDataInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProducts: []
        }
    }

    render() {
        return (
            <div className="modal fade row" id="table-data-info" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.name}</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table
                                className="table table-striped table-bordered seednet-table-keep-column-width"
                                cellSpacing="0">
                                <thead className="table__head">
                                <tr>
                                    <th className="text-center w-70px align-middle">#STT</th>
                                    <th className="w-120px text-center align-middle">Mã</th>
                                    <th className="w-100px text-center align-middle">Ngày kiểm định</th>
                                    <th className="w-100px text-center align-middle">Thương Hiệu</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.dataProducts.map((store, index) => {
                                    return (<tr key={index}>
                                        <td scope="row" className="text-center">{index + 1}</td>
                                        <td scope="row" className="text-center">{store.serial}</td>
                                        <td scope="row" className="text-center">{store.checkedDate}</td>
                                        <td scope="row"
                                            className="text-center">{!!store.manufacture ? store.manufacture.name : ""}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


        );
    }

}


export default tableDataInfo;
