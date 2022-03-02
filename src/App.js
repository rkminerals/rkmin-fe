import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Forms from './Forms';
import Reports from './Reports';

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Button, Col, Input } from 'antd';
import {LineChartOutlined, RollbackOutlined} from '@ant-design/icons';
import axios from 'axios';
import { API_BASE } from './apiBaseInfo';


export const successToast = (message) =>  toast.success(message, { 
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined, 
});

export const failureToast = (message) =>  toast.error(message, { 
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined, 
}); 

function App() {  
 
  return (
    <div className="App"> 
          {
            sessionStorage.getItem('rkminToken') != null ? <div>
            <Row>
        <Col span={24}>
        <div>
                      <Row style={{backgroundColor: '#1890ff', padding: '5px 20px', margin: '0px -30px'}}>
                          <Col span={12} style={{textAlign: "left"}}>
                              <Button type="text" style={{color: 'white', backgroundColor: 'transparent'}}
                              onMouseOver={(e) => { 
                                e.target.style.cursor = "none"; 
                              }}
                              size="large">R. Kk. MINERALS <sub> Stock Register</sub></Button>
                          </Col>
                          <Col span={12} style={{textAlign: "right"}}>
                              {/* <Link to="/reports"><Button type="ghost" style={{color: 'white',  border: '0px'}} size="large"> <LineChartOutlined /> Reports </Button></Link> */}
                          </Col>
                      </Row>
                  </div> 
        </Col>
      </Row>
  
      <Forms/>
      <br/><br/><br/><br/>
      <Reports/>
            </div> :
            <div>
              <Row style={{backgroundColor: '#1890ff', padding: '5px 20px', margin: '0px -30px'}}>
                          <Col span={12} style={{textAlign: "left"}}>
                              <Button type="text" style={{color: 'white', backgroundColor: 'transparent'}}
                              onMouseOver={(e) => { 
                                e.target.style.cursor = "none"; 
                              }}
                              size="large">R. K. MINERALS <sub> Stock Register</sub></Button>
                          </Col>
                          <Col span={12} style={{textAlign: "right"}}>
                          </Col>
                      </Row>

              <Row>
                <Col span={24} align="center" style={{paddingTop: '150px'}}> 
                  <br/>
                  <Input placeholder="Email" id="email" type="text" style={{width: '60%'}}/>
                  <br/>
                  <br/>
                  <Input placeholder="password" id="password" type="password" style={{width: '60%'}}/>
                              <br/>
                              <br/>
                  <Button type="primary"
                  onClick={()=>{
                    // alert(document.getElementById('email').value);
                    axios.post(API_BASE + '/api/auth/login', {
                                email: document.getElementById('email').value.toString() ,
                                password: document.getElementById('password').value.toString() ,
                      
                    }).then((res)=>{
                      // alert(document.getElementById('password').value);
                      console.log(res);
                      if(res.data.token != null){
                        sessionStorage.setItem('rkminToken', res.data.token);
                      } else {
                        alert(res.data.error);
                      }
                    }).then(()=>{
                      window.location.reload();
                    }).catch((err)=>{
                      alert(err);
                    })
                  }}
                  >Log in</Button>
                </Col>
              </Row>
            </div>
          }
      <ToastContainer
      position="bottom-right" />
    </div>
  );
}

export default App;