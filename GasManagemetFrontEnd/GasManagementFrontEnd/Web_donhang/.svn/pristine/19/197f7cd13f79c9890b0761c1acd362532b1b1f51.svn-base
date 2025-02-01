import React, { Component,useState,useEffect } from "react";
import {DatePicker, Divider, Select, Table, Pagination,Modal, Row, Col, Input, Button, Space, Icon,Form} from "antd";
import getHistoriesByType from "../../../../api/getHistoriesByType"
import getCylinderHistoryExcels from "../../../../api/getCylinderHistoryExcels"
import moment from "moment";
import getUserCookies from "getUserCookies";
import "./historyImport.scss";

const { RangePicker } = DatePicker;
function historyImport() {
  const defaultPageSize = {
    defaultPageSize: 5,
    };
  const  columnsToArrays=[
    {
      title: "Lịch sử xuất hàng",
      children: [
        {
          title: "Xuất đến",
          render:(text,record)=>{
            return record.name
          }
        },
        {
          title: "Địa chỉ",
          render:(text,record)=>{
            return record.address
          }
        },  
        {
          title: "Ngày xuất đến",
          render:(text,record)=>{
            return record.createdAt
          }
        },
      ]  
    }  
  ]
  const columns_history_export=[
    {
      title: "Lịch sử xuất hàng",
      children: [
        {
          title: "Xuất đến",
          render: ((record, index) => {
            const length = record.toArray.length;
            console.log("record.toArray", record.toArray);
            return length > 1 ? (
              <div className="text-success">
                <lable onClick={() => {
                  setToArrays(record.toArray);
                  handletoArray();
                }}>
                  {record.toArray ? record.toArray[length - 1].name : ""}
                </lable>
              </div>
            ) : (record.toArray.length > 0 ? record.toArray[length - 1].name : "")
          })
        },
        {
          title: "Ngày giờ",
          render: ((record, index) => {
            return moment(record.createdAt).format("DD-MM-YYYY hh:mm")
          })
        },
        {
          title: "Số lượng",
          render: ((record, index) => {
            return (record.numberOfCylinder).toLocaleString("nl-BE")
          })
        },
        {
          title: "Xuất excel",
          render: ((record, index) => {
            return <Form.Item>
              <Button type="primary" size="large" onClick={() => handleSeeExcel(record)}>Xuất excel</Button>
            </Form.Item>
          })
        },
      ]
    }
  ]
  const columns_history_import=[
    {
      title: "Lịch sử nhập hàng",
      children: [
        {
          title: "Nhập từ",
          render: ((record, index) => {
            return record.from ? record.from.name : ""
          })
        },
        {
          title: "Ngày giờ",
          render: ((record, index) => {
            return moment(record.createdAt).format("DD-MM-YYYY hh:mm")
          })
        },
        {
          title: "Số lượng",
          render: ((record, index) => {
            return (record.numberOfCylinder).toLocaleString("nl-BE")
          })
        },
        {
          title: "Xuất excel",
          render: ((record, index) => {
            return <Form.Item>
              <Button type="primary" size="large" onClick={() => handleSeeExcel(record)}>Xuất excel</Button>
            </Form.Item>
          })
        },
      ]
    }
  ]
  const columns_history = [
    {
      title: "Ngày giờ",
      ...getColumnSearchProps('createdAt'),
      render:((record,index)=>{
        return  moment(record.createdAt).format("DD-MM-YYYY hh:mm")
      })
    },
    {
      title: "Loại",
      ...getColumnSearchProps('type'),
      render:((record,index)=>{
        return  record.type==="EXPORT"?"Xuất vỏ":""
      })
    },
    {
      title: "Nơi nhận",
      ...getColumnSearchProps('name'),
      render:((record,index)=>{
        const length = record.toArray.length;
        // console.log("record.toArray",record.toArray[length-1].);
        return  record.toArray[length-1]?record.toArray[length-1].name:""
      })
    },
    {
      title: "Tài xế",
      ...getColumnSearchProps('driver'),
      render:((record,index)=>{
        return  record.driver
      })
    },
    {
      title: "Biển số xe",
      ...getColumnSearchProps('license_plate'),
      render:((record,index)=>{
        return  record.license_plate
      })
    },
    {
      title: "Số lượng",
      ...getColumnSearchProps('số lượng'),
      render:((record,index)=>{
        return   (record.numberOfCylinder).toLocaleString("nl-BE")
      })
    },
    {
      title: "Xuất excel",
      render:((record,index)=>{
        return <Form.Item>
        <Button type="primary" size="large" onClick={() => handleSeeExcel(record)}>Xuất excel</Button>
        </Form.Item>
      })
    },
    
  ]; 
   
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [to_or_from, setTo_Or_From] = useState("from");
  const [from_or_to, setFrom_Or_To] = useState("to");
  const [type, setType] = useState("EXPORT");
  const [typeImport, setTypeImport] = useState("IMPORT,TURN_BACK");
  const [page, setPage] = useState(1);
  const [pageImport, setPageImport] = useState(1);
  const [limit, setLimit] = useState(10);
  const [numberPages, setnumberPages] = useState(1);
  const [numberPagesImport, setnumberPagesImport] = useState(1);
  
  const [itemsPerPages, setItemsPerPages] = useState(10);
  const [exportData, setExportData] = useState([]);
  const [importData, setImportData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState("");
  const [user, setUser] = useState({});
  const [visibleToArray,setVisibleToArray]=useState(false);
  const [toArrays,setToArrays]=useState([]);  
  
  useEffect(()=>{
    async function history(startDate,endDate,to_or_from,type,page){
      let user_cookies = await getUserCookies();
      console.log("user_cookies",user_cookies.user);
      const data= await getHistoriesByType(
        startDate,
        endDate,
        to_or_from,
        type,
        page
      );
      let numberPages=Math.ceil(data.data.count/itemsPerPages);
      console.log("data.data.dataE",data.data.data)
      setExportData(data.data.data);
      setnumberPages(numberPages);
      setUser(user_cookies.user);
      
    }
    async function historyImport(startDate,endDate,to_or_from,type,pageImport){
      let user_cookies = await getUserCookies();
      // console.log("user_cookies",user_cookies.user);
      if((user_cookies.user.userRole==="Owner" && user_cookies.user.userType === "Factory")){
      const data= await getHistoriesByType(
        startDate,
        endDate,
        to_or_from,
        type,
        pageImport
      );
      let numberPages=Math.ceil(data.data.count/itemsPerPages);
      // console.log("data.data.data",data.data.data)
      setImportData(data.data.data);
      setnumberPagesImport(numberPages);
    }
  }
    
      historyImport(startDate,endDate,from_or_to,typeImport,pageImport);

    
    history(startDate,endDate,to_or_from,type,page); 
  },[page,startDate,pageImport]);
  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({  }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys}
            onChange={(e)=>handleChangeSelectedKeys(e)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
            <Button
              type="primary"
              //  onClick={ handleSearch(selectedKeys, confirm, dataIndex)}
              // icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button  size="small" style={{ width: 90 }}>
              Reset
            </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    }
  }
  function handletoArray(){
    setVisibleToArray(true);
  }  
  function handleThisTime() {
    //Javascript
    var el = document.getElementsByClassName("btn-history");
    el[0].classList.add("active");
    el[1].classList.remove("active");
    el[2].classList.remove("active");
    el[3].classList.remove("active");
    setStartDate(moment());
    setEndDate(moment());
  }
  // Lấy ngày hôm qua
  function handleYesterday() {
    $(".btn-history").each(function(item,index) {
      if(item===0){
      $(this).removeClass("active");
      }
      if(item===1){
        $(this).addClass("active");
      }
      if(item===2){
        $(this).removeClass("active");
      }
      if(item===3){
        $(this).removeClass("active");
      }
    });
    setStartDate(moment().subtract(1, 'days'), moment().subtract(1, 'days'));
    setEndDate(moment().subtract(1, 'days'), moment().subtract(1, 'days'))
  }
  //Lấy ngày trong tuần
  function handleThisWeek() {
    $(".btn-history").each(function(item,index) {
      if(item===0){
      $(this).removeClass("active");
      }
      if(item===1){
        $(this).removeClass("active");
      }
      if(item===2){
        $(this).addClass("active");
      }
      if(item===3){
        $(this).removeClass("active");
      }
    });
    setStartDate(moment().startOf('week'));
    setEndDate(moment().endOf('week'))
  }
  //Lấy ngày trong tháng
  function handleThisMonth() {
    $(".btn-history").each(function(item,index) {
      if(item===0){
      $(this).removeClass("active");
      }
      if(item===1){
        $(this).removeClass("active");
      }
      if(item===2){
        $(this).removeClass("active");
      }
      if(item===3){
        $(this).addClass("active");
      }
    });
    setStartDate(moment().startOf('month'))
    setEndDate(moment().endOf('month'))
  }
 
  function handleChangePage(onPage) {
    console.log("onPage",onPage);
    setPage(onPage);
    
  }
  function handleChangePageImport(onPage) {
    console.log("onPage",onPage);
    setPageImport(onPage);
    
  }
  function handleTime(value) {
    setStartDate(value[0]);
    setEndDate(value[1]);
  }
  async function handleSeeDashboard() {

  }
   function handleChangeSelectedKeys(e){
    setSelectedKeys(e.target.value ? [e.target.value] : [])
  }
  async function handleSeeExcel(e){
    
    if(e.numberOfCylinder==0){
      alert("Không có dữ liệu để xuất");
    }else {
      let dataExport=await getCylinderHistoryExcels(e.id);
    }
  }    
    return (
      <Row className="main-content">
        <Row className="card">
          <Row className="card-title-product">
            <div className="card-product-title-product">
              <h4>Báo cáo thống kê trạm </h4>
            </div>
            <Row className="card-product-left-product__report__body">
              <div className="container border">
                <Row className="card-product-left">
                  <div className="section-statistical1__report__title">                   
                      
                          <button
                            // className={activeTime===false?"btn-history active":"btn-history"}
                            className="btn-history "
                            onClick={handleThisTime}
                          >
                            Hôm nay
                      </button>
                          <button
                            className="btn-history"
                            onClick={handleYesterday}
                          >
                            Hôm qua
                      </button>
                          <button
                            className="btn-history"
                            onClick={handleThisWeek}
                          >
                            Tuần này
                      </button>
                          <button
                            className="btn-history"
                            onClick={handleThisMonth}
                          >
                            Tháng này
                      </button>
                          {/* <div>
                        <button className="btn-see"
                          onClick={handleSeeDashboard}
                        >
                        Xem
                        </button>
                      </div> */}
                       
                  </div>
                </Row>
                <Row className="card-product-right">
                  <div className="RangePicker--customN">
                    <RangePicker
                      value={[startDate, endDate]}
                      format={"DD/MM/YYYY"}
                      onChange={handleTime}
                    />
                  </div>   
                </Row>
                
                {/* <Row>
                  {(user.userRole === "SuperAdmin" && user.userType === "Fixer") &&
                    (
                      <Pagination
                        defaultCurrent={1}
                        defaultPageSize={itemsPerPages}
                        total={numberPages * itemsPerPages}
                        onChange={handleChangePage}
                      />
                    )}
                </Row> */}

              </div>
            </Row>
            <Modal
            title="Chi tiết điểm đến"
            visible={visibleToArray}
            onOk={() =>{
              setVisibleToArray(false);
            }}
            // confirmLoading={confirmLoading}
            onCancel={() =>{
              setVisibleToArray(false);
              }}
            >
            <Table
              dataSource={toArrays}
              columns={columnsToArrays}
              bordered={true}
              pagination={defaultPageSize}
            />
          </Modal>
          
          </Row>
          <Row className="section__body" id="historyImport">
                  {(user.userRole === "SuperAdmin" && user.userType === "Fixer") &&
                    (
                    <Row className="fixerB"> 
                     <Row className="B"> 
                      <Table
                        columns={columns_history}
                        dataSource={exportData}
                        bordered
                        pagination={
                          {
                            defaultCurrent:1,
                            defaultPageSize:itemsPerPages,
                            total:numberPages * itemsPerPages,
                            onChange:(onPage) => handleChangePage(onPage)
                        }
                      }
                      />
                      </Row>
                    </Row>  
                    )}
                  
                  {/* {(user.userRole === "Owner" && user.userType === "Factory") &&
                    (
                      <Col md={2}></Col>
                    )} */}
                  {/* {(user.userRole === "Owner" && user.userType === "Factory") &&
                    (
                      
                        <Row>
                          
                        </Row>
                      

                    )} */}
                    {(user.userRole === "Owner" && user.userType === "Factory") &&
                    (
                      
                        <Row className="sectionOwer">
                          <Row className="L">
                          <Table
                            columns={columns_history_import}
                            dataSource={importData}
                            bordered
                            pagination={
                              {
                                defaultCurrent:1,
                                defaultPageSize:itemsPerPages,
                                total:numberPagesImport * itemsPerPages,
                                onChange:(onPage) => handleChangePageImport(onPage)
                            }
                            }
                          />
                          </Row>   
                          <Row className="R">
                          <Table
                            columns={columns_history_export}
                            dataSource={exportData}
                            bordered
                            pagination={
                              {
                                defaultCurrent:1,
                                defaultPageSize:itemsPerPages,
                                total:numberPages * itemsPerPages,
                                onChange:(onPage) => handleChangePage(onPage)
                            }
                            }
                          />
                          </Row>
                          
                        </Row>
                    )}
              </Row>
          
        </Row>
      </Row>
    );
}

export default historyImport;
