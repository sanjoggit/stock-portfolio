import React, {Component} from 'react';
import {Button, Row, Col,Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import axios from 'axios';
import update from 'immutability-helper'


class PortfolioChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            portfolios: [],
            data: {
                originalLabels: [],
                labels: [],
                datasets: [],
            },
            startDate: null,
            endDate: null,
        }
    }

    // toggling the chat modal
      toggle = ()=> {
          this.setState({
              modal: !this.state.modal,
          });
        
      }

      // receiving props from parent component
      UNSAFE_componentWillReceiveProps(nextProps){
          this.setState({
              portfolios: nextProps.portfolios,
          })
      }

      //get stocks from the state and using that state to call the api with stock values like dates and pushing those values in the state
      getStocks = (id)=>{          
          let lineData = this.state.data.datasets;
          this.state.portfolios[id].stocks.map(item=>(
              axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item.stockName}&outputsize=full&apikey=EVNDD17OHUNAZIMD`)
                  .then(res=>{
                      const data = res.data['Time Series (Daily)'];
                      const dates = Object.keys(data);
                      const values = Object.values(data);
                      const rate = values.map(item=> Number(item['1. open']))


                      this.setState({
                          data: update(this.state.data, {
                              labels: {
                                  $set: dates.reverse(),                                  
                              },
                              originalLabels: {
                                  $set: dates,
                              },
                          }),
                      })
                      

                      let color = '#' + (Math.random().toString(16) + '000000').substring(2,8);
                      const found = lineData.some(eachItem=>eachItem.label === item.stockName);
                      if(found === false){
                          lineData.push({
                              label: item.stockName,
                              data: rate.reverse(),
                              backgroundColor: color,
                              borderColor: color,
                              borderWidth: 2,
                              fill: false,
                              pointRadius: 0,
                          })
                      }
                     
                      this.setState({
                          data: update(this.state.data, {
                              datasets: {
                                  $set: lineData,
                              },
                          }),
                      })

                      

                  })
                  .catch(e=>console.log(e))
          )
          )  
          
          this.toggle()
      }

      // function for handling the changes for date inputs
      handleChange = (e)=>{
          this.setState({
              [e.target.name]: e.target.value,
          })
      }

      // filter the chat according to the dates provided
      filterChart = ()=>{
          let dates = this.state.data.originalLabels;
          const startDate = this.state.startDate;
          const endDate = this.state.endDate;
          if(startDate === null || endDate === null){
              alert('Please enter the date')
          } else if(new Date(startDate) > new Date(endDate)){
              alert('Start date must be less than end date')
          } else if(new Date(endDate) > new Date()){
              alert('End date cannot be present or after today')
          }
          else{
              const start = dates.indexOf(startDate);
              const end = dates.indexOf(endDate);
            
              let newDates = dates.slice(start, end + 1)
              this.setState({
                  data: update(this.state.data, {
                      labels: {
                          $set: newDates,
                      },
                  }),
              })
          }
      }
      render() {
          const {id} = this.props;
          const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;
          return (        
              <Row>
                  <Col xs="12">
                      <Button color="info" onClick={()=>this.getStocks(id)}>Perf Graph</Button>
                      <Modal 
                          isOpen={this.state.modal}
                          toggle={this.toggle}
                          className="modal-size"
                      >
                          <ModalHeader toggle={this.toggle} close={closeBtn}>Perf Chart</ModalHeader>
                          <ModalBody>
                              <Line
                                  data={this.state.data}
                                  height={400}
                                  options={{
                                      maintainAspectRatio: false,
                                  }}
                              />
                          </ModalBody>
                          <ModalFooter>
                              <span style={{'fontWeight': 'bold'}}>Start date:</span>
                              <input type="date" name="startDate" style={{'marginRight': '10px'}} onChange={this.handleChange} />
                              <span style={{'fontWeight': 'bold'}}>End Date:</span>
                              <input type="date" name="endDate" onChange={this.handleChange}/>
                              <Button color="primary" onClick={this.filterChart}>Filter</Button>{' '}
                              <Button color="secondary" onClick={this.toggle}>Close</Button>
                          </ModalFooter>                        
                      </Modal>
                  </Col>
              </Row>
          )
      }
}

export default PortfolioChart
