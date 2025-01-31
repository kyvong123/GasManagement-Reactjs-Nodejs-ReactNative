import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import TextArea from 'react-validation/build/textarea';
import required from 'required';

class AddReportPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content:'',
        };
    }


    async submit(event) {

        event.preventDefault();
        // if (this.state.position.length === 0) {
        //     showToast('Chưa chọn vị trí!', 3000);
        //     return;
        // }
        let data= this.form.getValues();
        if(data.user===null||data.user==="")
            await this.props.addReport(null,this.props.listProducts[parseInt(data.cylinder)].id,data.content);
        else
            await this.props.addReport(this.props.listUsers[parseInt(data.user)].id,this.props.listProducts[parseInt(data.cylinder)].id,data.content);



        const modal = $("#create-report");
        modal.modal('hide');
        return;
    }

    render() {
        return (
            <div className="modal fade" id="create-report" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tạo Mới Báo Cáo</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Form ref={c => {this.form = c}} className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="form-group">
                                                <label>Người báo cáo </label>
                                                <Select className="form-control"
                                                        name="user"
                                                      >
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listUsers.map((item, index) => <option value={index} key={index}>{item.name}</option>)}
                                                </Select>
                                                {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} />*/}
                                            </div>
                                        </div>
                                       <div className="col-md-6">
                                           <label>Sản phẩm </label>
                                           <Select className="form-control"
                                                   name="cylinder"
                                                   validations={[required]}>
                                               <option value="">-- Chọn --</option>
                                               {this.props.listProducts.map((item, index) => <option value={index} key={index}>{item.serial}</option>)}
                                           </Select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <label>Nội dung</label>
                                        <div className="form-group">


                                                <TextArea  type="text"
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
                                    <Button className="btn btn-primary">Lưu</Button>
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

export default AddReportPopup;