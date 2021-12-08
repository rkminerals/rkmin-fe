import React, { useState } from 'react';
import moment from 'moment';
import { PdfMakeWrapper } from 'pdfmake-wrapper'; 
import * as pdfFonts from "pdfmake/build/vfs_fonts";

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

function GrindingEntryForm(props) { 
        PdfMakeWrapper.setFonts(pdfFonts);
        const pdfEntryErrorReport = new PdfMakeWrapper();

        const [componentSize, setComponentSize] = useState('small');

        const [submitFormLoader, setSubmitFormLoader] = useState(false);
        const [deleteByIdLoader, setDeleteByIdLoader] = useState(false);

        // composition: [{inputPartRatio: Number, supplier: String, rockType: String}],

        const productionUnits = ['Unit 1', 'Unit 2']
        const shifts = ['Morning', 'Evening', 'Night']

        //form payload
        const [date, setDate] = useState(null);
        const [productionUnit, setProductionUnit] = useState(null);
        const [mineralId, setMineralId] = useState(null);
        const [shift, setShift] = useState(null);
        const [mineralName, setMineralName] = useState(null);
        const [quantity, setQuantity] = useState(null);
        const [gradeName, setGradeName] = useState(null);
        const [composition, setComposition] = useState([]);

        //for composition
        const [rockType, setRockType] = useState(null);
        const [supplier, setSupplier] = useState(null);
        const [partRatio, setPartRatio] = useState(null);

        // affirmation after saving into the DB
        const [showAffirmation, setShowAffermation] = useState(false);
        const [dataAffirmationFromDB, setDataAffirmationFromDB] = useState(null);

        const [mineralForComponent, setMineralForComponent] = useState(null);
        const [dateForComponent, setDateForComponent] = useState(null);

        const sendEntry = () => { 
          console.log(composition);
          var partRatioSum = 0;
          if(composition.length != 0){ composition.map((part) => {
            partRatioSum += part.inputPartRatio;
          })}
            if(date == null || mineralId == null || mineralName == null || quantity == null || composition == [] || gradeName == null || productionUnit == null || shift == null){
                failureToast("All fields are required");
            } else if(partRatioSum < 1 || partRatioSum > 1){
              failureToast("Sum of constituent partRatios must be 1");
            }else {
          setSubmitFormLoader(true);
            axios.post(API_BASE + "/api/grindingEntryModel",
            {
                    "grindingDate": date,
                    "productionUnitUsed": productionUnit, 
                    "shift": shift,  
                    "mineralId": mineralId,
                    "mineralName": mineralName,
                    "gradeName": gradeName,  
                    "quantityProduced": quantity, 
                    "composition": composition
            }
            ).then(res => {
                console.log(res.data.message);
                if(res.data.message == "success"){
                axios.get(API_BASE + '/api/grindingEntryModel/getLastInserted').then((res) => {
                    setDataAffirmationFromDB(res.data.content);
                }).then(()=>{
                    setShowAffermation(true);
                    setSubmitFormLoader(false);
                })
              }
            }).catch((err) => {
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
        <Form.Item label="Grinding Date" style={{textAlign:'left'}}>
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
        <Form.Item label="Production Unit">
          <Select defaultValue={"Select"}
          value={productionUnit}
          onChange={(value) => {
            console.log(value);
            setProductionUnit(value); 
          }}>
              {
                  productionUnits.map((unit) => {
                    return <Select.Option value={unit}>
                            {unit}
                        </Select.Option>
                  })
              } 
          </Select>
        </Form.Item>
        <Form.Item label="Shift">
          <Select defaultValue={"Select"}
          value={shift}
          onChange={(value) => {
            console.log(value);
            setShift(value); 
          }}>
              {
                  shifts.map((shift) => {
                    return <Select.Option value={shift}>
                            {shift}
                        </Select.Option>
                  })
              } 
          </Select>
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
        <Form.Item label="Grade">
        <Select
        value={gradeName}
        onChange={(value) => {
            setGradeName(value);
        }}
        >
              { 
                mineralForComponent != null ? mineralForComponent.powderGrades.map((grade) => {
                return <Select.Option value={grade.gradeName}>{grade.gradeName}</Select.Option>
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
        <Form.Item label="Composition" style={{textAlign:"left"}}>
          <sub>Part Ratio</sub><br/>
          <InputNumber value={partRatio} onChange={(value) => {
              if(value > 0){ setPartRatio(value) } 
          }} /><br/>
          <sub>Supplier</sub>
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
          <sub>Rock type</sub>

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
          <Button
          style={{marginTop:'5px'}}
          onClick={() => {
            if(partRatio == null || supplier == null || rockType == null){
              failureToast("Empty fields in 'Composition' are not allowed");
            } else {
              const compositionPart = {inputPartRatio: partRatio, supplier: supplier, rockType: rockType};
              composition.push(compositionPart);
              setPartRatio(null);
              setSupplier(null);
              setRockType(null);
            }
          }}
          >Add</Button>
          <span style={{ marginLeft: '20px'}}>
          <span style={{borderRadius:'2px', padding: '3.5px', marginLeft:'15px', color: 'yellow', backgroundColor: '#1890ff'}}>
              <span style={{color:'yellow'}}>{composition.length}</span> constituents
          </span>
          <Button
          style={{marginTop:'2px', marginLeft: '3px', border: '1px solid #1890ff'}}
          onClick={() => {
            setComposition([]);
          }}
          >Reset constituents</Button>
          </span>
        </Form.Item>
 
         
      </Form>
      </Col>
      <Col xs={{span:24}} md={{span:24}}>
          <Button style={{}} type="primary" onClick={sendEntry}>{ submitFormLoader? <LoadingOutlined/>:"Save"}</Button>  
          <Button style={{}} onClick={()=>{
               setShowAffermation(false); 

               setDateForComponent(null);
               setShift(null);
               setQuantity(null);
               setComposition([]); 
               setMineralName(null);
               setMineralId(null); 
               setGradeName(null);
               setProductionUnit(null);
          }} type="link">Reset</Button>
      </Col>
        </Row>

        <Modal title="Confirmation" visible={showAffirmation} 
        footer={[
            <Button key="back" type="ghost" onClick={() => {
              setDeleteByIdLoader(true);
              console.log(dataAffirmationFromDB);
                //delete the record from database and resubmit
                axios.post(API_BASE + "/api/grindingEntryModel/deleteById/" + dataAffirmationFromDB[0]._id, dataAffirmationFromDB[0]).then((res)=>{
                    // failureToast(res.data.message + "deleted");
                    // pdfEntryErrorReport.add(JSON.stringify(dataAffirmationFromDB));
                    // pdfEntryErrorReport.create().download();
                }).then(()=>{
                  setShowAffermation(false);
                  setDeleteByIdLoader(false);
                }).catch(err => {
                  failureToast("Error! Not deleted");
                  setDeleteByIdLoader(false);
                })
            }}>{deleteByIdLoader ? <LoadingOutlined/> : "Edit" }
            </Button>,
            <Button key="submit" type="primary" onClick={()=>{
                successToast("Entry Saved");
                setShowAffermation(false);
                
                setDateForComponent(null);
                setShift(null);
                setQuantity(null);
                setComposition([]); 
                setMineralName(null);
                setMineralId(null); 
                setGradeName(null);
                setProductionUnit(null);
                }}>
              Done
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
                     return <li>{key} : {JSON.stringify(dataAffirmationFromDB[0][key])}</li>
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

export default GrindingEntryForm;