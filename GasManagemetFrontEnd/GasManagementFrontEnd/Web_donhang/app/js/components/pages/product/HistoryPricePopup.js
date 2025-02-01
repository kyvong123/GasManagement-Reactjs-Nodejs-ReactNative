import React from 'react';
import Form from 'react-validation/build/form';
import priceHistoryApi from "priceHistory"
import moment from 'moment'
class HistoryPricePopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listHistoryPrice: [],
            error: "",
            inputKey: Date.now(),
            product_id: "",
        };
    }
    async componentWillReceiveProps(nextprops) {
        if (nextprops.product_id !== this.props.product_id && nextprops.product_id !== "") {
            const result = await priceHistoryApi(nextprops.product_id)
            this.setState({ listHistoryPrice: result.data ? result.data.reverse() : null })
        }

    }
    render() {
        const { listHistoryPrice } = this.state
        return (
            <div className="modal fade" id="history-price" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Lịch sử sửa giá</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form ref={c => {
                                this.form = c
                            }} className="card" onSubmit={(event) => this.submitTextFile(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <table
                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                            cellSpacing="0">
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-70px align-middle">#STT</th>
                                                    <th className="w-120px text-center align-middle">Tên người sửa</th>
                                                    <th className="w-120px text-center align-middle">Giá</th>
                                                    <th className="w-120px text-center align-middle">Ngày sửa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listHistoryPrice.map((item, key) => {
                                                    return (<tr key={key}>
                                                        <td scope="row" className="text-center">{key}</td>
                                                        <td scope="row" className="text-center">{item.user.name}</td>
                                                        <td scope="row" className="text-center">{item.price}</td>
                                                        <td scope="row" className="text-center">{moment(item.updatedAt).format("DD/MM/YYYY")}</td>
                                                    </tr>)
                                                })}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HistoryPricePopup;