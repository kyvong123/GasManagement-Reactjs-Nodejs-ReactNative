import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import showToast from 'showToast';
//import getInformationFromCylinders from 'getInformationFromCylinders';
import getInformationFromCylindersExcel from "./../../../../api/getInformationFromCylindersExcel"
import Constant from "Constants";
import updateDateCylinderApi from 'updateDateCylinder'
import readXlsxFile from 'read-excel-file';
import { parseExcelDate } from 'read-excel-file';
import updateExcellCylinder from 'updateExcellCylinder';
var fileReader;
const schema = {
    'So seri': {
        prop: 'serial',
        type: String
        // Excel stores dates as integers.
        // E.g. '24/03/2018' === 43183.
        // Such dates are parsed to UTC+0 timezone with time 12:00 .
    },
    'Loai binh': {
        prop: 'classification',
        type: String
    },
    'Mau sac': {
        prop: 'color',
        type: String
    },
    'Loai van': {
        prop: 'valve',
        type: String
    },
    'Han kiem dinh': {
        prop: 'checkDate',
        type: Date
    },
    'Trong luong vo': {
        prop: 'weight',
        type: Number
    },
    'Thuong hieu': {
        prop: 'manufacture',
        type: String
    }
}
class updateDateCylinders extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: [],
            error: "",
            inputKey: Date.now(),
            file: null,
            checkedDate: "",
            dataIdCylinder: []
        };
    }

    async submit(event) {

        /*   event.preventDefault();
           // if (this.state.position.length === 0) {
           //     showToast('Chưa chọn vị trí!', 3000);
           //     return;
           // }
           let data= this.form.getValues();
           let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
           if(result)
           {
               const modal = $("#create-staff");
               modal.modal('hide');

           }

           return;*/
    }

    async submitTextFile(event) {
        event.preventDefault();
        //await this.getAllCylenders();
        /* if (!file) showToast('Vui lòng chọn file!', 3000);
         this.setState({isLoading: true});
         const result = await importProductsFromExcelAPI(file);
         this.setState({isLoading: false});
         console.log(result);
         if (result && result.status === 200) {
             if (typeof (result) !== 'undefined') {
                 showToast('Đưa vào thành công!', 3000);
                 this.props.refresh();
             }
             else {
                 //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
             }
             return;
         } else {
             showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
         }
         return;
         $("#import-product").modal('hide');
         return;*/
    }

    async submitUpdateFile() {
        let data = this.form.getValues();
        const { listProducts, dataIdCylinder } = this.state
        const arrDataID = []
        for (let i = 0; i < dataIdCylinder.length; i++) {
            arrDataID.push(dataIdCylinder[i].id)
        }
        console.log('ba', dataIdCylinder);
        console.log('ma', data.checkedDateUpdate)
        const result = await updateDateCylinderApi(arrDataID, data.checkedDateUpdate)
        console.log('sd', result)
        if (result.status === 200 || result.status === 201) {
            if (result.data.hasOwnProperty("err_msg")) {
                showToast(result.data.err_msg)
                this.setState({ error: result.data.err_msg, listProducts: [] })
            } else {
                showToast("Sửa thông tin bình thành công")
                this.setState({ listProducts: [], error: "" });
            }
            const modal = $("#update-cylinder-information");
            // modal.modal('hide');
            //that.props.getListProducts(cylinders_list);
        }
    }



    async submitUpdateFileExcel() {
        let data = this.form.getValues();
        const { dataIdCylinder } = this.state

        const arrDataID = []
        for (let i = 0; i < dataIdCylinder.length; i++) {
            arrDataID.push(dataIdCylinder[i])
        }
        console.log('arrdata', arrDataID);
        console.log('ba', dataIdCylinder);
        // console.log('ma', data.checkedDateUpdate)
        const result = await updateExcellCylinder(arrDataID)
        console.log('kết quả cập nhật', result)
        if (result.status === 200 || result.status === 201) {
            if (result.data.success === false) {
                showToast(result.data.message)
                this.setState({ error: result.data.err_msg, dataIdCylinder: [] })
            } else {
                showToast("Sửa thông tin bình thành công")
                this.setState({ dataIdCylinder: [], error: "" });
            }
            const modal = $("#update-cylinder-information");
            modal.modal('hide');
            //that.props.getListProducts(cylinders_list);
        }
    }


    handleFileUpload(event, isCheck) {
        let that = this;
        let file = null
        event.preventDefault();
        console.log(isCheck);
        if (isCheck) {
            this.submitUpdateFileExcel();
            //event.target.value = null
            this.fileInput.value = null
            this.setState({
                file,
                error: "",
                listProducts: [],
                dataIdCylinder: rows.rows
            })
        } else {
            file = event.target.files[0]
            fileReader = new FileReader();
            fileReader.onload = async function (event) {
                // The file's text will be printed here
                console.log("event.target.result;", event.target.result);
                let result = event.target.result;

                let array_id = result.split("\n");
                let cylinders_list = [];

                for (let i = 0; i < array_id.length; i++) {
                    if (array_id[i].trim() !== '') {
                        array_id[i].replace('\r', '').replace('\n', '')
                        cylinders_list.push(array_id[i].trim());
                    }
                }
                let resultSearch = await getInformationFromCylindersExcel(cylinders_list, Constant.CHANGE_DATE);
                // let resultSearch = await getInformationFromCylinders(cylinders_list, Constant.CHANGE_DATE);
                // let resultSearch = await getInformationFromCylinders(this.state.dataIdCylinder, Constant.CHANGE_DATE);

                cylinders_list = resultSearch.data;
                console.log(resultSearch);
                if (resultSearch.status === 200) {
                    if (resultSearch.data.hasOwnProperty("err_msg")) {
                        showToast(resultSearch.data.err_msg)
                        that.setState({ error: resultSearch.data.err_msg, dataIdCylinder: rows.rows })
                        return
                    }
                    that.setState({ listProducts: cylinders_list, error: "" });
                    //that.props.getListProducts(cylinders_list);
                }
            };
            fileReader.readAsText(file);
        }
    }

    handleFileUploadExcel = (event) => {
        console.log('sdsd', this.state.handleFileUploadExcel)
        //this.submitUpdateFile()
        readXlsxFile(event.target.files[0], { schema }).then(async (rows) => {
            console.log('rowsExcel', rows)
            this.setState({
                dataIdCylinder: rows.rows
            }, () => {
                //    console.log('xuat fle', dataIdCylinder)
            });
            console.log('duy', this.state.dataIdCylinder);
            console.log('luc', Constant.CHANGE_DATE);
            let resultSearch = await getInformationFromCylindersExcel(this.state.dataIdCylinder, Constant.CHANGE_DATE);
            //let resultSearch = await getInformationFromCylinders(this.state.dataIdCylinder, Constant.CHANGE_DATE);
            console.log('dúc23', resultSearch);
            // let resultSearch = await getInformationFromCylinders(cylinders_list, Constant.CHANGE_DATE);

        })
    }

    render() {
        return (
            <div className="modal fade" id="update-cylinder-information" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nhập File</h5>
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
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Hãy nhập tập tin từ đầu đọc</label>
                                                <div style={{ display: "flex" }}>
                                                    <input
                                                        // accept='.txt'
                                                        className="form-control"
                                                        type="file"
                                                        name="upload_file"
                                                        ref={(input) => {
                                                            this.fileInput = input
                                                        }}
                                                        onChange={(event) => this.handleFileUploadExcel(event)}
                                                        validations={[required]} />
                                                    <input type="reset" />
                                                </div>                                            
                                            </div>
                                            {this.state.error !== "" ? (<div>
                                                <label style={{ color: "red" }}>{this.state.error}</label>
                                            </div>) : null}

                                        </div>
                                        {/* <div className="form-group">
                                            <label>Ngày kiểm định</label>
                                            <div className="input-group"
                                                style={{display: "flex", flexWrap:"nowrap"}}
                                            >
                                                <Input ref={this.expiration_dateRef} type="text"
                                                    className="form-control"
                                                    value={this.state.checkedDate} validations={[required]}
                                                    name="checkedDateUpdate" id="checkedDateUpdate"
                                                    data-date-format="dd/mm/yyyy"
                                                    data-provide="datepicker" />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">
                                                        <i className="fa fa-calendar"></i>
                                                    </span>
                                                </div>
                                            </div> */}
                                        {/* <Input className="form-control" type="datetime" name="checkedDate" id="checkedDate" value={this.state.checkedDate} validations={[required]} />*/}
                                        {/* </div> */}
                                        <table
                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                            cellSpacing="0">
                                            <thead className="table__head">
                                                <tr>
                                                    {/* <th className="text-center w-70px">#STT</th>
                                                    <th className="w-120px text-center">Mã Bình</th>
                                                    <th className="w-120px text-center">Ngay kiem dinh</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {typeof this.state.listProducts !== "undefined" && this.state.listProducts.length > 0 ? this.state.listProducts.map((store, index) => {
                                                    console.log("store", store);
                                                    return (<tr key={index}>
                                                        {/* <td scope="row" className="text-center">{index + 1}</td>
                                                        <td scope="row" className="text-center">{store.serial}</td>
                                                        <td scope="row" className="text-center">{store.checkedDate}</td> */}

                                                    </tr>)
                                                }) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <button
                                        //disabled={(typeof this.state.listProducts === "undefined" || this.state.listProducts.length === 0)}
                                        className="btn btn-primary" onClick={(event) => {
                                            this.handleFileUpload(event, true)
                                        }} type="submit" data-toggle="modal">OK
                                    </button>
                                    <button
                                        //  onClick={(event) => this.handleFileUpload(event, true)}
                                        className="btn btn-secondary" type="reset"
                                        data-dismiss="modal"
                                        style={{ marginLeft: "10px" }}>Đóng
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

export default updateDateCylinders;
