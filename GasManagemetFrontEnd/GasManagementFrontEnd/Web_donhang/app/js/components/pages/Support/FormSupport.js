import React from "react"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import TextArea from "react-validation/build/textarea";
import getUserCookies from "./../../../helpers/getUserCookies";
import { CREATESUPPORT, UPDATESUPPORT, DELETEONEIMG, UPDATECONTENTSUPPORT, UPDATEIMAGESUPPORT } from "../../../config/config";
import callApi from "./../../../util/apiCaller";
import showToast from "showToast";

class formsupport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      title2: "",
      createdBy: "",
      idSupport: "",
      updatedBy: "",
      data: [
        {
          content: "",
          list_Image: [
            {
              url_img: ''
            }
          ],
        }
      ],
      data2: [],
      // list_Content:[],//lay gia trị mới khi thay doi  content
      list_img: [],//lay gia trị mới khi thay doi hình ảnh
      flag: false,
      mode: this.props.mode,
      idContentImage: '',//lấy idcontent của ảnh thay đổi
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.handleOnChangeFile2 = this.handleOnChangeFile2.bind(this);
  }

  onChange = (e) => {
    let value = e.target.value;
    this.setState({
      title: value,
    })
  }
  onChange2 = (e) => {
    let value = e.target.value;
    this.setState({
      title2: value,
    })
  }
  //
  //truyền props: khi props thay đổi thì gọi function này
  componentWillReceiveProps(nextprops) {
    //kt props có du liệu hay ko?
    if (nextprops && nextprops.listData && nextprops.mode === false) {
      this.setState({
        title2: typeof nextprops.listData.Support !== 'undefined' ? nextprops.listData.Support.title : '',
        idSupport: typeof nextprops.listData.Support !== 'undefined' ? nextprops.listData.Support.id : '',
        data2: typeof nextprops.listData.Content !== 'undefined' ? nextprops.listData.Content : '',
      })
    } else {
      this.setState({
        title: "",
        data: [
          {
            content: "",
            list_Image: [
              {
                url_img: ''
              }
            ],
          }
        ],
        data2: [],
      })
    }
  }
  //submit form
  async onSubmit(event) {
    event.preventDefault();
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let { createdBy } = this.state;
    //create khi mode = true
    if (this.props.mode) {
      createdBy = user_cookies ? user_cookies.user.id : "";
      let params = {
        title: this.state.title,
        createdBy: createdBy,
        data: this.state.data
      }
      let flag = false;
      this.state.data.map(it => {
        if (it.content === '') {
          flag = true;
        }
      })
      if (flag === true) {
        alert("Hãy nhập nội dung")
      } else {
        await callApi("POST", CREATESUPPORT, params, token).then(res => {
          if (res.data.success === true) {
            alert("Tạo thành công");
            this.setState({
              data: []
            })
            window.location.reload(false);
            const modal = $("#create-support");
            modal.modal("hide");
          }
          else {
            alert(res.data.message);
            return;
          }
        })
      }
      //}
    }
    //update khi mode == false
    else {
      let flag1 = false;
      let flag2 = false;
      let flag3 = false;
      //---------------------api cập nhật tiêu đề-------------------------------
      let { idSupport, title2, updatedBy } = this.state;
      updatedBy = user_cookies ? user_cookies.user.id : "";
      let params = {
        id: idSupport,
        title: title2,
        updatedBy: updatedBy,
        data: [],
      }
      await callApi("POST", UPDATESUPPORT, params, token).then(res => {
        if (res.data.success === true) {
          flag1 = true;
        } else {
          alert("lỗi khi cập nhật tiêu đề");
          return;
        }
      });
      //---------------------- api cập nhật content--------------------------------
      const ta = this.state.data2.map(is => ({ id: is.id, content: is.content }));
      let param = {
        updatedBy: updatedBy,
        list_Content: ta,
      }
      await callApi("POST", UPDATECONTENTSUPPORT, param, token).then(res => {
        if (res.data.success === true) {
          flag2 = true;
        } else {
          alert("lỗi khi cập nhật nội dung");
          return;
        }
      });
      //   //---------------------- api cập nhật hình ảnh--------------------------------
      let { data2 } = this.state;
      for (let j = 0; j < data2.length; j++) {
        let idContentold = data2[j].id
        let arr = data2[j].support_img.map(is => is.id);
        let a = arr[0];
        let arrimg = data2[j].support_img[0].url_img;
        let ojectimg = []
        ojectimg.push({ url_img: arrimg })
        if (data2[j].support_img[0].url_img === '') {
          if (data2[j].support_img[0].url_img === arrimg) {
            let paramDeleted = {
              deletedBy: user_cookies ? user_cookies.user.id : "",
              list_Image: [
                {
                  id: a
                }
              ]
            };
            await callApi("POST", DELETEONEIMG, paramDeleted, token).then(res => {
              if (res.data.success === true) {
              }
              else {
                alert("Tạo không thành công");
                return;
              }
            });
            let paramss = {
              supportID: this.state.idSupport,
              contentID: idContentold,
              createBy: user_cookies ? user_cookies.user.id : "",
              list_Image: ojectimg,
            }
            await callApi("POST", UPDATEIMAGESUPPORT, paramss, token).then(res => {
              if (res.data.success === true) {
                flag3 = true;
              } else {
                alert(res.data.message);
                return;
              }
            });
          } else {
            let paramDeleted = {
              deletedBy: user_cookies ? user_cookies.user.id : "",
              list_Image: [
                {
                  id: a
                }
              ]
            };
            await callApi("POST", DELETEONEIMG, paramDeleted, token).then(res => {
              if (res.data.success === true) {

              }
              else {
                alert("Tạo không thành công");
                return;
              }
            });
            let paramss = {
              supportID: this.state.idSupport,
              contentID: this.state.idContentImage,
              createBy: user_cookies ? user_cookies.user.id : "",
              list_Image: this.state.list_img,
            }
            await callApi("POST", UPDATEIMAGESUPPORT, paramss, token).then(res => {
              if (res.data.success === true) {
                flag3 = true;
              } else {
                alert(res.data.message);
                return;
              }
            });
            //if2
          }
        }
        //if 1
        else {
          if (data2[j].support_img[0].url_img === arrimg) {
            let paramDeleted = {
              deletedBy: user_cookies ? user_cookies.user.id : "",
              list_Image: [
                {
                  id: a
                }
              ]
            };
            await callApi("POST", DELETEONEIMG, paramDeleted, token).then(res => {
              if (res.data.success === true) {
              }
              else {
                alert("Tạo không thành công");
                return;
              }
            });
            let paramss = {
              supportID: this.state.idSupport,
              contentID: idContentold,
              createBy: user_cookies ? user_cookies.user.id : "",
              list_Image: ojectimg,
            }
            await callApi("POST", UPDATEIMAGESUPPORT, paramss, token).then(res => {
              if (res.data.success === true) {
                flag3 = true;
              } else {
                alert(res.data.message);
                return;
              }
            });
          } else {
            let paramDeleted = {
              deletedBy: user_cookies ? user_cookies.user.id : "",
              list_Image: [
                {
                  id: a
                }
              ]
            };
            await callApi("POST", DELETEONEIMG, paramDeleted, token).then(res => {
              if (res.data.success === true) {

              }
              else {
                alert("Tạo không thành công");
                return;
              }
            });
            let paramss = {
              supportID: this.state.idSupport,
              contentID: this.state.idContentImage,
              createBy: user_cookies ? user_cookies.user.id : "",
              list_Image: this.state.list_img,
            }
            await callApi("POST", UPDATEIMAGESUPPORT, paramss, token).then(res => {
              if (res.data.success === true) {
                flag3 = true;
              } else {
                alert(res.data.message);
                return;
              }
            });
          }

        }
      }
      // xet dk để thực hiện cập nhật
      if (flag1 === true && flag2 === true && flag3 === true) {
        alert("Cập nhật thành công");
        window.location.reload(false);
        const modal = $("#create-support");
        modal.modal("hide");
      }
    }
  }
  handleAddForm = () => {
    if (this.state.data.length > 0) {
      this.setState({
        flag: true,
      })
    }
    this.setState({
      data: [
        ...this.state.data,
        { content: '', list_Image: [{ url_img: '' },] }
      ]
    });
  }
  handleAddForm2 = () => {
    if (this.state.data2.length > 0) {
      this.setState({
        flag: true,
      })
    }
    this.setState({
      data2: [
        ...this.state.data2,
        { content: '', list_Image: [{ url_img: '' },] }
      ]
    });
  }
  handleDelForm = () => {
    const data1 = this.state.data;
    data1.splice(data1.length - 1, 1);
    if (data1.length === 1) {
      this.setState({
        data: this.state.data,
        flag: false,
      })
    } else if (data1.length > 1) {
      this.setState({
        data: data1,
      })
    }
  }
  handleDelForm2 = () => {
    const data1 = this.state.data2;
    data1.splice(data1.length - 1, 1);
    if (data1.length === 1) {
      this.setState({
        data2: this.state.data2,
        flag: false,
      })
    } else if (data1.length > 1) {
      this.setState({
        data2: data1,
      })
    }
  }
  //khi thêm ảnh thì image sẽ thêm vào mảng
  handleOnChangeFile = (event, index) => {
    event.preventDefault();
    let { files } = event.target;
    let filesSelected = files;
    let val = [...this.state.data];
    let sr = [];
    if (filesSelected.length > 0) {
      let seft = this;
      for (let i = 0; i < filesSelected.length; i++) {
        let fileToLoad = filesSelected[i];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(fileToLoad);
        fileReader.onload = function (fileLoadedEvent) {
          let srcData = fileLoadedEvent.target.result; // <--- data: base64
          // trường hợp lấy list mảng
          //  for(let j = 0;j < (val[index].list_Image.length);j++){
          //    val[index].list_Image[j].url_img = srcData
          //  } 
          val[index].list_Image[0].url_img = srcData
          seft.setState({
            data: val,
          });
        };
      }
    }

  }
  async handleOnChangeFile2(event, index) {
    event.preventDefault();
    //lay ảnh cần thay đổi

    let { files } = event.target;
    let filesSelected = files;
    // let dataFileName = [...this.state.listimage];
    let val = this.state.data2//
    console.log("lisst", val[index].support_img.map(i => i.url_img))
    let a = val[index].support_img.map(i => i.url_img);
    if (a[0] === '') { // điều kiện xét khi ảnh chỉ có 1 img nếu nhiều img thì xóa đk này
      if (filesSelected.length > 0) {
        let seft = this;
        let fileToLoad = filesSelected[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(fileToLoad);
        fileReader.onload = function (fileLoadedEvent) {
          let srcData = fileLoadedEvent.target.result; // <--- data: base64        
          val[index].support_img.map(i => i.url_img = srcData)
          seft.setState({
            data2: val,
            idContentImage: val[index].id,
            list_img: val[index].support_img,
          });
        };
      }
    } else {
      alert("hãy xóa ảnh cũ!!!!");
      return;
    }
  }
  // khi đoạn text được thay đổi sẽ thêm vào mảng data
  handleChangeText = (event, index) => {
    const val = [...this.state.data];
    val[index].content = event.target.value;
    this.setState({
      data: val,
    })
  }
  // khi đoạn text được thay đổi sẽ thêm vào mảng data2
  handleChangeText2 = (event, index) => {
    const val = [...this.state.data2];
    val[index].content = event.target.value;
  }
  //xóa hình trong mảng data2
  async deleteItemImg(id) {

    let val = [...this.state.data2];
    val.map(item => {
      item.support_img.map(itemm => {
        if (itemm.id === id) {
          itemm.url_img = '';
        }
      })
    });
    this.setState({
      data2: val,
    });
  }
  render() {
    let { title, data2, data, title2 } = this.state;
    return (
      <div>

        <div className="modal fade" id="create-support" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Tạo Mới Câu Hỏi
                </h5>
                <button type="button" className="close" data-dismiss="modal" >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Form
                  ref={(c) => {
                    this.form = c;
                  }}
                  className="card"
                  onSubmit={(event) => this.onSubmit(event)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Tiêu đề câu hỏi <span style={{ color: 'red' }}>*</span></label>
                          <Input
                            className="form-control"
                            type="text"
                            name="title"
                            onChange={this.onChange}
                            value={title}
                          />
                        </div>
                      </div>
                      {data.map((item, index) => (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Nội dung câu trả lời<span style={{ color: 'red' }}>*</span> </label>
                            <TextArea
                              className="form-control"
                              onChange={event => this.handleChangeText(event, index)}
                              value={item.content}
                            />
                          </div>
                          <div className="form-group ">
                            <label>Hình minh họa</label>
                            <input
                              type="file"
                              accept=".jpg, .png"
                              id={index}
                              onChange={event => this.handleOnChangeFile(event, index)}
                            />
                          </div>
                          <div className="form-group image">
                            <img src={item.list_Image.map(ii => ii.url_img)} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <a
                        id="nut"
                        onClick={this.handleAddForm}
                      > <i className="fa fa-plus"></i>
                      </a>
                      <a
                        id="nut"
                        onClick={this.handleDelForm}
                        style={{ display: this.state.flag ? 'block' : 'none' }}
                      ><i className="fa fa-minus"></i>
                      </a>
                      <p>Hãy click vào đây để tạo thêm nội dung câu hỏi</p>
                    </div>
                  </div>
                  <footer className="card-footer text-center">
                    <Button className="btn btn-primary" id="button">
                      Lưu
                    </Button>
                    <button
                      className="btn btn-secondary"
                      type="reset"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                    >
                      Đóng
                    </button>
                  </footer>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="update-support" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chỉnh Sửa Thông Tin Câu Hỏi
                </h5>
                <button type="button" className="close" data-dismiss="modal" >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Form
                  ref={(c) => {
                    this.form = c;
                  }}
                  className="card"
                  onSubmit={(event) => this.onSubmit(event)}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Tiêu đề câu hỏi <span style={{ color: 'red' }}>*</span></label>
                          <Input
                            className="form-control"
                            type="text"
                            name="title"
                            onChange={this.onChange2}
                            value={title2}
                          />
                        </div>
                      </div>
                      {data2.length != 0 ? data2.map((item, index) => (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Nội dung câu trả lời</label>
                            <TextArea
                              className="form-control"
                              name="conten"
                              onChange={(event) => this.handleChangeText2(event, index)}
                              value={item.content}
                            />
                          </div>
                          <div className="form-group ">
                            <label>Hình minh họa</label>
                            <input
                              type="file"
                              name="file"
                              accept=".jpg, .png"
                              onChange={event => this.handleOnChangeFile2(event, index)}
                            />

                          </div>
                          {item.support_img.map((ii, indexx) => {
                            return (
                              <div className="form-group image" key={indexx} >
                                <img src={ii.url_img} />
                                <i
                                  style={{
                                    display: ii.url_img === '' ? 'none' : 'block',
                                    position: 'relative',
                                    bottom: '72px',
                                    left: '217px',
                                    cursor: 'pointer'
                                  }}
                                  className="fa fa-trash-o"
                                  onClick={() => this.deleteItemImg(ii.id)}
                                ></i>
                              </div>
                            );
                          })}
                        </div>
                      )) : ''}
                    </div>
                    <div style={{ display: 'none' }}>
                      <a
                        id="nut"
                        onClick={this.handleAddForm2}
                      > <i className="fa fa-plus"></i>
                      </a>
                      <a
                        id="nut"
                        onClick={this.handleDelForm2}
                        style={{ display: this.state.flag ? 'block' : 'none' }}
                      ><i className="fa fa-minus"></i>
                      </a>
                      <p>Hãy click vào đây để tạo thêm nội dung câu hỏi</p>
                    </div>
                  </div>
                  <footer className="card-footer text-center">
                    <Button className="btn btn-primary" id="button">
                      Lưu
                    </Button>
                    <button
                      className="btn btn-secondary"
                      type="reset"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                    >
                      Đóng
                    </button>
                  </footer>
                </Form>

              </div>
            </div>
          </div>
        </div>


      </div>
    );
  }
}

export default formsupport