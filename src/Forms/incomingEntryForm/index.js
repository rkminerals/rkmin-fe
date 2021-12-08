import React, { useState } from 'react';
import moment from 'moment';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Modal
  } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import { API_BASE } from '../../apiBaseInfo';
import { successToast, failureToast } from '../../App';
import {LoadingOutlined} from '@ant-design/icons';


function IncomingEntryForm(props) { 
        const [componentSize, setComponentSize] = useState('small');

        const [submitFormLoader, setSubmitFormLoader] = useState(false);
        const [deleteByIdLoader, setDeleteByIdLoader] = useState(false);

        //form payload
        const [date, setDate] = useState(null);
        const [mineralName, setMineralName] = useState(null);
        const [mineralId, setMineralId] = useState(null);
        const [supplier, setSupplier] = useState(null);
        const [truckNumber, setTruckNumber] = useState(null);
        const [quantity, setQuantity] = useState(null);
        const [remarks, setRemarks] = useState(null);
        const [rockType, setRockType] = useState(null);

        // affirmation after saving into the DB
        const [showAffirmation, setShowAffermation] = useState(false);
        const [dataAffirmationFromDB, setDataAffirmationFromDB] = useState(null);

        const [mineralForComponent, setMineralForComponent] = useState(null);
        const [dateForComponent, setDateForComponent] = useState(null);

        const sendEntry = () => { 
            if(date == null || mineralId == null || mineralName == null || supplier == null || truckNumber  == null || quantity == null || rockType == null){
                failureToast("All fields are required");
            } else {
          setSubmitFormLoader(true);
            axios.post(API_BASE + "/api/incomingEntryModel",
            {
                    "incomingDate": date,  
                    "mineralId": mineralId,  
                    "mineralName":mineralName,    
                    "supplier": supplier,  
                    "rockType": rockType,  
                    "typeQuantity": quantity,
                    "truckNumber": truckNumber,
                    "remarks": remarks
            }
            ).then(res => {
                console.log(res.data.message);
                if(res.data.message == 'success'){
                axios.get(API_BASE + '/api/incomingEntryModel/getLastInserted').then((res) => {
                    setDataAffirmationFromDB(res.data.content);
                }).then(()=>{
                    setShowAffermation(true);
                    setSubmitFormLoader(false);

                })
              }
            }).catch(err => {
              setSubmitFormLoader(false);
              failureToast('Something went wrong while submitting the form');
            })
        }
        }

    return ( 
        <>
        <Row 
        style={{height: '75vh', overflowY: 'scroll', paddingBottom:'20px', paddingTop:'20px'}}
        
        >
            <Col xs={{span:24}} md={{span:20}}>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
                initialValues={{ size: componentSize }}
                onValuesChange={()=>{}}
                size={componentSize}
                onFinish={(values)=>{
                    console.log(values);
                }}
      > 
        <Form.Item label="Incoming Date" style={{textAlign:'left'}}>
          <DatePicker value={dateForComponent} onChange={(e) => {
              if(e){
                console.log(e._d);
                setDateForComponent(moment(e._d));
                var date = e._d.toString();
                var dateArray = date.split(" ");
                // customDateString Day/Month/DateOFMonth/Year/
                var customDateString = `${dateArray[0]}/${dateArray[1]}/${dateArray[2]}/${dateArray[3]}`;
                setDate(customDateString);
              }
          }} />
        </Form.Item>
        <Form.Item label="Mineral">
          <Select defaultValue={"Select"}
          value={mineralName}
          onChange={(value) => {
            console.log(value);
            setMineralName(value);
            props.minerals.map((mineral) => {
                if(mineral.mineralName == value){
                    setMineralId(mineral._id);
                    setMineralForComponent(mineral);
                }
            })
          }}>
              {
                  props.minerals.map((mineral) => {
                    return <Select.Option value={mineral.mineralName}>
                            {mineral.mineralName}
                        </Select.Option>
                  })
              } 
          </Select>
        </Form.Item>
        <Form.Item label="Supplier">
        <Select
        value={supplier}
        onChange={(value) => {
            setSupplier(value);
        }}
        >
              { 
                mineralForComponent != null ? mineralForComponent.suppliers.map((supplier) => {
                return <Select.Option value={supplier}>{supplier}</Select.Option>
                }) 
                :
                ""
              } 
          </Select>
        </Form.Item>

        <Form.Item label="Rock type">
        <Select
        value={rockType}
        onChange={(value) => {
            setRockType(value);
        }}
        >
              { 
                        mineralForComponent != null ? mineralForComponent.rockTypes.map((rockType) => {
                            if(rockType.supplier == supplier){
                            return <Select.Option value={rockType.rockType}>{rockType.rockType}</Select.Option>
                            }
                          })
                          :
                          ""
              } 
          </Select>
        </Form.Item> 
        <Form.Item label="Quantity" style={{textAlign:"left"}}>
          <InputNumber value={quantity} onChange={(value) => {
              if(value > 0){ setQuantity(value) }
              else {  
                failureToast("'Quantity' must be a positive number");
            }
          }} />
        </Form.Item>

        <Form.Item label="Truck number" style={{textAlign:"left"}}>
          <Input value={truckNumber} onChange={(e) => {
              setTruckNumber(e.target.value); 
          }}/>
        </Form.Item>

        <Form.Item  label="Remarks" style={{textAlign:"left"}}>
          <TextArea placeholder="type here ..." value={remarks} onChange={(e) => {
              setRemarks(e.target.value);
          }} />
        </Form.Item>
         
      </Form>
      </Col>
      <Col xs={{span:24}} md={{span:24}}>
        <Button style={{}} type="primary" onClick={sendEntry}>{submitFormLoader ? <LoadingOutlined/> : "Save"}</Button>  
          <Button style={{}} onClick={()=>{
               setShowAffermation(false); 

               setDateForComponent(null);
               setRemarks(null);
               setQuantity(null);
               setTruckNumber(null);
               setRockType(null);
               setMineralName(null);
               setMineralId(null);
               setSupplier(null);
          }} type="link">Reset</Button>
      </Col>
        </Row>

        <Modal title="Confirmation" visible={showAffirmation} 
        footer={[
          <Button key="back" type="ghost" onClick={() => {
            setDeleteByIdLoader(true);
            console.log(dataAffirmationFromDB);
              //delete the record from database and resubmit
              axios.post(API_BASE + "/api/incomingEntryModel/deleteById/" + dataAffirmationFromDB[0]._id, dataAffirmationFromDB[0]).then((res)=>{
                  // failureToast(res.data.message + "deleted");
                  // pdfEntryErrorReport.add(JSON.stringify(dataAffirmationFromDB));
                  // pdfEntryErrorReport.create().download();
              }).then(()=>{
                setShowAffermation(false);
                setDeleteByIdLoader(false);
              }).catch(err => {
                setDeleteByIdLoader(false);
                failureToast("Error! Not deleted")
              })
          }}>{deleteByIdLoader ? <LoadingOutlined/> : "Edit"}
          </Button>,
            <Button key="submit" type="primary" onClick={()=>{
                successToast("Entry Saved");
                setShowAffermation(false);
                
                setDateForComponent(null);
                setRemarks(null);
                setQuantity(null);
                setTruckNumber(null);
                setRockType(null);
                setMineralName(null);
                setMineralId(null);
                setSupplier(null);
                }}>
              Submit
            </Button>,
            // <Button
            //   key="link"
            //   href="https://google.com"
            //   type="primary"
            //   loading={loading}
            //   onClick={this.handleOk}
            // >
            //   Search on Google
            // </Button>,
          ]}  onCancel={() => {}}> 
            Please re-examin the submitted document
            <br/>
            <sub> Click on "Submit" to save or click on "Edit" to make changes  </sub>
            <br/>
            <hr/>
            <ul>
            {
            dataAffirmationFromDB? Object.keys(dataAffirmationFromDB[0]).map((key) => {
                if(key != "_id" && key != "timeStamp" && key != "__v") {
                     return <li>{key} : {dataAffirmationFromDB[0][key]}</li>
                } else {
                    return "";
                }
            })
            :
            ""
            }
            </ul>
        </Modal>
        </>
    );
}

export default IncomingEntryForm;