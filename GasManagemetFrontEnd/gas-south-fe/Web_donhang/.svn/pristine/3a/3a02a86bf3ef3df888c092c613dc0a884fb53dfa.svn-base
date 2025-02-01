import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import TextArea from 'react-validation/build/textarea';
import required from 'required';

class ViewReportPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content:'',
        };
    }


    async submit(event) {

        event.preventDefault();

        return;
    }

    render() {
        return (
            <div className="modal fade" id="view-report" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xem báo cáo</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Form ref={c => {this.form = c}} className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Người báo cáo </label>
                                            <div className="form-group">


                                                <Input disabled={true} type="text"
                                                       value={this.props.user}
                                                       className="form-control"
                                                       validations={[required]}
                                                       name="content" id="content"
                                                />


                                                {/* <Input className="form-control" type="datetime" name="checkedDate" id="checkedDate" value={this.state.checkedDate} validations={[required]} />*/}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Sản phẩm </label>
                                            <div className="form-group">


                                                <Input disabled={true} type="text"
                                                       value={this.props.cylinder}
                                                          className="form-control"
                                                          validations={[required]}
                                                          name="content" id="content"
                                                />


                                                {/* <Input className="form-control" type="datetime" name="checkedDate" id="checkedDate" value={this.state.checkedDate} validations={[required]} />*/}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <label>Nội dung</label>
                                            <div className="form-group">


                                                <TextArea disabled={true} type="text"
                                                          value={this.props.content}
                                                           rows={5}
                                                           className="form-control"
                                                           validations={[required]}
                                                           name="content" id="content"
                                                />


                                                {/* <Input className="form-control" type="datetime" name="checkedDate" id="checkedDate" value={this.state.checkedDate} validations={[required]} />*/}
                                            </div>
                                        </div>
                                    </div>

                                    {/*<div className="form-group">*/}
                                    {/*<label>Các vị trí</label>*/}
                                    {/*<TagAutoComplete getPosition={this.getPosition.bind(this)}*/}
                                    {/*data={this.state.job_titles}/>*/}
                                    {/*</div>*/}

                                </div>

                                <footer className="card-footer text-center">

                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                            style={{marginLeft: "10px"}}>Đóng
                                    </button>
                                </footer>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewReportPopup;