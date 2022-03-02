import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Button, Divider, Menu, Dropdown, Space, Spin } from 'antd';
import axios from 'axios';
import { API_BASE } from '../apiBaseInfo';
import IncomingEntryForm from './incomingEntryForm';
import GrindingEntryForm from './grindingEntryForm';
import PowderDispatchingEntryForm from './powderDispatchEntryForm';

import {LineChartOutlined, FormOutlined} from '@ant-design/icons' 

const { TabPane } = Tabs;

function Forms(props) {

    const [minerals, setMinerals] = useState([]);
    const [apploading, setAppLoading] = useState(true);

    useEffect(()=>{
      apiCall(); 
        function apiCall() {
          axios.get(API_BASE + "/api/mineralModel", {
            headers : {
              'Authorization': `${sessionStorage.getItem('rkminToken')}`
            }
          }).then((res) => {
            console.log(res);

            // const link = document.createElement('a');
            // link.href = `${res.data}`;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
 
              setMinerals(res.data.content);
              setAppLoading(false);
            
            // return () => { componentMounted = false }
        }).catch(()=>{
              alert('something wrong in fetching the data. Please refresh!');
        })}
    },[])


    const topTabs = [
        {
            title: "🏠 Home",
            content: apploading ? <span><h2><br/></h2><Spin style={{paddingTop:'40px'}} size="large" /><br/><br/>loading</span> : <h2><FormOutlined style={{fontSize:'30px', paddingTop:'30px'}}/><br/> <sub>Application is ready</sub></h2>
        },
        {
            title: "Incoming",
            content: apploading ? <span><Spin style={{paddingTop:'30px'}} size="large" /><br/><br/>loading</span> : <IncomingEntryForm minerals={minerals} />
        },
        {
            title: "Grinding",
            content: apploading ? <span><Spin style={{paddingTop:'30px'}} size="large" /><br/><br/>loading</span> : <GrindingEntryForm minerals={minerals} />
        },
        {
            title: "Dispatch",
            content: apploading ? <span><Spin size="large" /><br/><br/>loading</span> : <PowderDispatchingEntryForm minerals={minerals} />
        }
    ]

    const menu = (
        <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
            3rd menu item
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
        <>
          <Row>
              <Col span={24}>
                <Tabs
                style={{paddingTop:''}}
                defaultActiveKey="1" tabPosition={"top"} size="default" onChange={(e)=>{if(e === "🏠 Home-key") {
                  window.location.reload();
                }}}>
                {
                        topTabs.map((tab) => {
                            return <TabPane tab={tab.title} key={tab.title + "-key"}>
                              <span>{tab.content}</span>
                            </TabPane>
                        })
                    }
                </Tabs>
            </Col>
          </Row>
        </>
    );
}

export default Forms;