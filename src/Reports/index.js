import React, { useEffect, useState } from 'react';
import { API_BASE } from '../apiBaseInfo';
import { Button, Row, Col, Modal, Spin } from 'antd';
import { failureToast, successToast } from '../App';
import axios from 'axios'; 
import fileDownload from 'react-file-download';
import { Link } from 'react-router-dom';
import { DownloadOutlined, RollbackOutlined } from '@ant-design/icons'


function Reports(props) {

    const [minerals, setMinerals] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const [mineralStock, setMineralStock] = useState([]);
    const [powderStock, setPowderStock] = useState({});
    const [infoType, setInfoType] = useState(null);
    const [showMineralInfo, setShowMineralInfo] = useState(false);
    const [totalPowderBalance, setTotalPowder] = useState(false);

    const modalHeaders = [
        "",
        "Mineral Info.",
        "Powder Info."
    ] 

   

    useEffect(()=>{
        axios.get(API_BASE + "/api/mineralModel").then((res) => {
            console.log(res.data);
            setMinerals(res.data.content);
            setDataLoading(false);
        }).catch(()=>{
            window.location.reload();
            failureToast('something went wrong in fetching the app data');
        })
    },[]) 

    const calMineralInfo = () => {
        var j = [];
        if(minerals.length != 0) {minerals.map((mineral) => {
            var mineralBalance = 0;
            mineral.rockTypes.map((rockType) => {
                mineralBalance += rockType.typeBalance;
            })  
            j.push({mineralName: mineral.mineralName, mineralBalance : mineralBalance, measuringUnit : mineral.measuringUnit});
        })
        setMineralStock(j);
        setShowMineralInfo(true)
    }
    };

   
    

    return (
        dataLoading == true ? <span><h2><br/></h2><Spin style={{paddingTop:'40px'}} size="large" /><br/><br/>loading</span> :
        <Row>
            <Col span={2} style={{paddingTop: '10px'}}>
                <Link to="/"><Button type="ghost" size="large" style={{border: '0px'}}> <RollbackOutlined /> Back</Button></Link>
            </Col>
            <Col span={22} align="left" style={{paddingTop: '20px', paddingLeft: '50px'}}> 
                <h3 style={{paddingLeft: '5px'}}>Reports</h3>
                <br/> 
                    <Button style={{marginRight: '10px'}} onClick={()=>{setInfoType(1); calMineralInfo();}}>Minerals Info.</Button> 
                    <br/>
                    <br/>
                         <Button style={{marginRight: '10px'}} onClick={()=>{setInfoType(2); setShowMineralInfo(true);}}>Powder Info.</Button>
                         <br/> 
                         <br/> 
                    <a style={{marginRight: '10px'}} href="http://localhost:3001/api/incomingEntryModel/allInReport">
                        <Button>Incoming Entries <DownloadOutlined style={{color:'#1890ff'}} size="large"/></Button>
                    </a>
                    <br/>
                    <br/>
                    <a style={{marginRight: '10px'}} href="http://localhost:3001/api/grindingEntryModel/allInReport">
                        <Button>Grinding Entries <DownloadOutlined style={{color:'#1890ff'}}/></Button>
                    </a>
                    <br/>
                    <br/>
                    <a style={{marginRight: '10px'}} href="http://localhost:3001/api/powderDispatchingEntryModel/allInReport">
                        <Button>Powder Dispatching Entries <DownloadOutlined style={{color:'#1890ff'}}/></Button>
                    </a> 
            </Col>
            <Modal title={modalHeaders[infoType]} visible={showMineralInfo} 
        footer={[
            <Button key="submit" type="primary" onClick={()=>{ 
                setShowMineralInfo(false);
                }}>
              Ok
            </Button>, 
          ]}  onCancel={() => {setShowMineralInfo(false);}}> 
          <div style={{height:'40vh', overflowY:'scroll'}}>
             {infoType == 1 ? <table>
               <tr><td style={{border:'0px solid black', padding:'5px'}}><b> Mineral </b></td> <td style={{border:'0px solid black', padding:'5px'}}><b>Balance</b></td></tr>
                            {
                               mineralStock.length != 0 ? mineralStock.map((mineral) => {
                               return <tr><td style={{border:'2px solid silver', padding:'5px 10px'}}>{mineral.mineralName} </td> <td style={{border:'2px solid silver', padding:'5px 10px'}}>{mineral.mineralBalance} {mineral.measuringUnit}</td></tr>
                               }) : ""
                            }
            </table> : ""}
            {infoType == 2 ?  <div>
                            {
                               minerals.length != 0 ? minerals.map((mineral) => {
                                   var totalPowder
                                   return <table style={{marginTop:'20px'}}><h4>{ mineral.mineralName }</h4>
                                   {
                                       mineral.powderGrades.length != 0 ? mineral.powderGrades.map((grade)=>{

                                            return  <tr><td style={{border:'2px solid silver', padding:'5px 10px'}}>{grade.gradeName} </td> <td style={{border:'2px solid silver', padding:'5px 10px'}}>{grade.gradeBalance} {mineral.measuringUnit}</td></tr>
                                                
                                       }) : ""
                                   }
                               
                               </table>}) : ""
                            }
            </div> : ""}
            </div>
        </Modal>
        </Row>
    );
}

export default Reports;
