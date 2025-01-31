import React, { useState, useEffect } from 'react';
//import excelDuplicateCylinder from "../../../../api/excelCylinderDuplicate"
import ReactCustomLoading from "ReactCustomLoading";
import Form from "react-validation/build/form";
import required from "required";
import findDestination from "../../../api/findDestination"
function FindDestination() {
    const [loading, setLoading] = useState(false);
    const [listCylinder, setListCylinder] = useState([])
    async function handleFileUpload(event) {
        setLoading(true)
        console.log("bbbb", event)
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.onload = async function (event) {
            // The file's text will be printed here
            let result = event.target.result;
            let array_id = result.split("\n");
            let cylinders_list = [];

            for (let i = 0; i < array_id.length; i++) {
                if (array_id[i].trim() !== '') {
                    array_id[i].replace('\r', '').replace('\n', '')
                    cylinders_list.push(array_id[i].trim());

                }
            }
            let resultDestination = await findDestination(cylinders_list)
            setLoading(false)
            if (resultDestination.data.success === true) {
                setListCylinder(resultDestination.data.data)
            }

        };
        fileReader.readAsText(file);

    }
    return (
        <div className="main-content">
            <ReactCustomLoading isLoading={loading} />
            <div className="card">
                <div className="card-title">
                    <div className="flexbox">

                        <div className="modal-body">
                            <Form
                                ref={(c) => {
                                    // this.form = c;
                                }}
                                className="card"
                            >

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Hãy nhập tin từ đầu đọc</label>
                                            <div className="form-group d-flex">
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    name="upload_file"
                                                    accept='.txt'
                                                    onChange={(event) => handleFileUpload(event)}
                                                    // ref={(input) => {
                                                    //     this.fileInput = input
                                                    // }}
                                                    validations={[required]}
                                                />
                                                <input type="reset" value="Đặt lại" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <table
                                                    className="table table-hover text-center table-striped table-bordered seednet-table-keep-column-width"
                                                    cellSpacing="0"
                                                >
                                                    <thead className="table__head">
                                                        <tr>
                                                            <th scope="col">STT</th>
                                                            <th scope="col">Mã bình</th>
                                                            <th scope="col">Điểm đến</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listCylinder.map((store, index) => {

                                                            return (<tr>
                                                                <td scope="row" className="text-center">{index + 1}</td>
                                                                <td scope="row" className="text-center">{store.serial}</td>
                                                                <td scope="row" className="text-center">{store.destination}</td>
                                                            </tr>)


                                                        })}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default FindDestination
