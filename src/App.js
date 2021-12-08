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
import { Row, Button, Col } from 'antd';
import {LineChartOutlined, RollbackOutlined} from '@ant-design/icons';


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
    <BrowserRouter>
     
      <Switch>
        <Route exact path="/">
          <div>
          <Row>
      <Col span={24}>
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
                            <Link to="/reports"><Button type="ghost" style={{color: 'white',  border: '0px'}} size="large"> <LineChartOutlined /> Reports </Button></Link>
                        </Col>
                    </Row>
                </div> 
      </Col>
    </Row>

    <Forms/>
          </div>
          
        </Route>
        <Route exact path="/reports">
        <div>
          <Row>
      <Col span={24}>
      <div>
                    <Row style={{backgroundColor: '#1890ff', padding: '5px 20px', margin: '0px -30px'}}>
                        <Col span={12} style={{textAlign: "left"}}>
                            <Button
                             onMouseOver={(e) => { 
                              e.target.style.cursor = "none"; 
                            }}
                             type="text" style={{color: 'white', backgroundColor: 'transparent'}} size="large">R. K. MINERALS</Button>
                        </Col>
                        <Col span={12} style={{textAlign: "right"}}>
                               </Col>
                    </Row>
                </div> 
      </Col>
    </Row>

    <Reports/>
          </div>
        </Route>
      </Switch>
    </BrowserRouter> 
      <ToastContainer
      position="bottom-right" />
    </div>
  );
}

export default App;
