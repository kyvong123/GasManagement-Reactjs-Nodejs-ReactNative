import { Table,Collapse} from "antd";
import 'antd/dist/antd.css';
import React from "react";
import showToast from "showToast";
import getAllSupport from "../../../../api/getAllSupport";
import "./Support.scss";

const { Panel } = Collapse;
class frequentlyAskedQuestions extends React.Component{
constructor(props){
    super(props)
    this.state={
        listData:[],
        flag:false,
        flagmenu:false,
    }
    
}

async componentDidMount(){
   await this.getAll()
}
async getAll(){
    const data = await getAllSupport();
    if(data){
        if(data.data.success === true){
            this.setState({
                listData:data.data.Result,
            })
        }
    }else{
        showToast("Có lỗi lấy dữ liệu")
    }
}

checked=()=>{
    this.setState({
        flagmenu:!this.state.flagmenu,
        flag:!this.state.flag,
    })
}
data = ()=>{
    let arr = [];
   for(let i = 0; i < this.state.listData.length;i++){
       arr.push({
            content:this.state.listData[i].Content,
            title:this.state.listData[i].Support.title,
       })
   }
   return arr;
}
render(){
    console.log("data",this.state.listData)
    const show = (this.state.flagmenu)?"show":"";
    const column=[
        {
            title:'',
            dataIndex:'title',
            key:'title',
        },
    ]
    return(
        <div className="main-content" id="frequently">
            <div className="card">
                <div className="card-title">
                    <div className="flexbox">
                        <h4>Các câu hỏi thường gặp</h4>
                    </div>
                </div>
            </div>
            <ul className="menu1">
            {/*this.state.listData.length!==0?this.state.listData.map((v,index)=>{
                      return    <Collapse accordion>
                                    <Panel header={v.title} key={v.id}>
                                        <p>{v.content}</p>
                                    </Panel>
                                </Collapse>
                }):""*/
                <Table
                columns={column}
                dataSource={this.data()}
                expandedRowRender={ record=>
                    record.content.map((item,index)=>
                         (
                             <div key={index} style={{marginTop:'10px'}}>
                                <p style={{fontWeight:400,textAlign:"justify",marginBottom:'5px'}}>{item.content}</p>
                                {item.support_img.map((itemm,indexx)=>(
                                    <div key={indexx} style={{textAlign:'center'}}>
                                        <img src={itemm.url_img} style={{width:'350px'}}/>
                                    </div>
                                ))}                              
                            </div>
                        )
                    )
                   
                   }
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                >
                </Table>
            }
            </ul>
        </div>
    );
}

}
export default frequentlyAskedQuestions