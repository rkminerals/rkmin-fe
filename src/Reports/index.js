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
    const [infoType, setInfoType] = useState(null);
    const [showMineralInfo, setShowMineralInfo] = useState(false); 

    const modalHeaders = [
        "",
        "Mineral Info.",
        "Powder Info."
    ] 

   

    useEffect(()=>{
        let componentMounted = true;
        axios.get(API_BASE + "/api/mineralModel", {
            headers : {
              'Authorization': `${sessionStorage.getItem('rkminToken')}`
            }
          }).then((res) => {
            console.log(res.data);
            if(componentMounted){
                setMinerals(res.data.content);
                setDataLoading(false);
            }
            return () => { componentMounted=true }
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
        dataLoading == true ? <span><h2><br/></h2><Spin style={{paddingTop:'40px'}} size="large" /><br/><br/>creating reports ...</span> :
        <Row>
            <Col span={24} align="center" style={{paddingTop: '20px', paddingLeft: '50px'}}> 
                {/* <h3 style={{paddingLeft: '5px'}}>Reports  </h3>
                <hr/>  */}
                    <Button style={{marginRight: '10px'}} onClick={()=>{setInfoType(1); calMineralInfo();}}>Minerals Info.</Button> 
                     
                         <Button style={{marginRight: '10px'}} onClick={()=>{setInfoType(2); setShowMineralInfo(true);}}>Powder Info.</Button>
                          

                    <Button type="primary" id="downloadEntriesButton" onClick={()=>{
                        let password = prompt('Password is required to proceed');
                        if(password === 'admin@321') {
                            document.getElementById('iE').style.display = 'inline-block';
                            document.getElementById('gE').style.display = 'inline-block';
                            document.getElementById('dE').style.display = 'inline-block';
                            document.getElementById('downloadEntriesButton').style.display = 'none';
                        } else {
                            alert('Incorrect password');
                        }
                    }} style={{marginTop: '10px'}}>Download Entries</Button>
                    
                    <a id="iE" style={{marginRight: '10px', display: 'none'}} href={`${API_BASE}/api/incomingEntryModel/allInReport`}>
                        <Button>Incoming Entries <DownloadOutlined style={{color:'#1890ff'}} size="large"/></Button>
                    </a>
                    <br/>
                    <br/>
                    <a id="gE" style={{marginRight: '10px', display: 'none'}} href={`${API_BASE}/api/grindingEntryModel/allInReport`}>
                        <Button>Grinding Entries <DownloadOutlined style={{color:'#1890ff'}}/></Button>
                    </a>
                    <br/>
                    <br/>
                    <a id="dE" style={{marginRight: '10px', display: 'none'}} href={`${API_BASE}/api/powderDispatchingEntryModel/allInReport`}>
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
             {infoType == 1 ? <div>
                            {
                               minerals.length != 0 ? minerals.map((mineral) => {
                                   return <table style={{marginTop:'20px'}}><h4>{ mineral.mineralName }</h4>
                                   {
                                       mineral.rockTypes.length != 0 ? mineral.rockTypes.map((type)=>{

                                            return  <tr><td style={{border:'2px solid silver', padding:'5px 10px'}}>{type.rockType}, {type.supplier} </td> <td style={{border:'2px solid silver', padding:'5px 10px'}}>{type.typeBalance} {mineral.measuringUnit}</td></tr>
                                                
                                       }) : ""
                                   }
                               
                               </table>}) : ""
                            }
            </div>  : ""}
            {infoType == 2 ?  <div>
                            {
                               minerals.length != 0 ? minerals.map((mineral) => {
                                   return <table style={{marginTop:'20px'}}><h4>{ mineral.mineralName }</h4>
                                   {
                                       mineral.powderGrades.length != 0 ? mineral.powderGrades.map((grade)=>{

                                            return  <tr><td style={{border:'2px solid silver', padding:'5px 10px'}}>{grade.gradeName}, {grade.supplier} </td> <td style={{border:'2px solid silver', padding:'5px 10px'}}>{grade.gradeBalance} {mineral.measuringUnit}</td></tr>
                                                
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
