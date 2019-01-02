import React, {Component} from 'react'
import AddPortfolio from './AddPortfolio'
import {Col, Row, Button, Table} from 'reactstrap'
import Addstock from './AddStock'
import PortfolioChart from './PortfolioChart'
import axios from 'axios'
import update from 'immutability-helper';

class Portfolio extends Component {
    constructor(props){
        super(props);
        this.state = {
            portfolioName: '',
            stockName: '',
            stockAmount: 1,
            portfolios: [],
            exchangeRate: '',
            selectedStocks: [],
        }
    }

    //get the exchange rate from usd to euro on initial loading
    UNSAFE_componentWillMount() {
        axios
            .get(
                `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=EVNDD17OHUNAZIMD`
            )
            .then(res => {
                const exchangeObj = res.data['Realtime Currency Exchange Rate'];
                const currencyObj = exchangeObj['5. Exchange Rate'];
                this.setState({
                    exchangeRate: currencyObj,
                });
            });
    }

    
    handlePortfolioName = (e)=>{
        this.setState({
            portfolioName: e.target.value,
        })

    }
    handleStockName = (e)=>{
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    //creates new portfolio
    createPortfolio = (toggle)=>{
        if(this.state.portfolioName === ''){
            alert('Portfolio name cannot be empty')
        } else{
            const portfolio = this.state.portfolios;
            const newPortfolio = {
                name: this.state.portfolioName,
                isEuro: true,
                stocks: [],
            }
            portfolio.push(newPortfolio)
            this.setState({
                portfolioName: '',
                portfolios: portfolio,
            })
            toggle();

        }
    }
    //removes the portfolio
    removePortfolio = (i)=>{
        let portfolios = this.state.portfolios;
        portfolios.splice(i, 1);
        this.setState({
            portfolios,
        })
    }

    //gets the stocks value from api and add to the related portfolio
    addStock = (index, toggle)=>{
        if(this.state.stockName === ''){
            alert('Please enter stock name')
        } else{
            const stockName = this.state.stockName.toUpperCase();
            const stockAmount = this.state.stockAmount;
            let portfolios = this.state.portfolios;
            axios
                .get(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${
                        stockName
                    }&interval=1min&apikey=EVNDD17OHUNAZIMD&outputsize=compact`
                ).then(res=>{
                    const data = res.data['Time Series (1min)']
                    const values = Object.values(data)
                    const unitValue = values[0]['1. open']
                    const total = Number.parseFloat(stockAmount * unitValue).toFixed(3)
                    const totalValue = total
                    const stock = {
                        stockName,
                        stockAmount,
                        unitValue,
                        totalValue,
                    }
                    portfolios[index].stocks.push(stock);
                    this.setState({
                        portfolios,
                    })
                }).catch(e=>alert('stock doesnot exist'))
            this.setState({
                stockName: '',
                stockAmount: 1,
            })
            toggle()
        }
    }
    //toggle the button name for displaying dollar and euro
    toggleButton = (i)=>{
        this.setState({
            portfolios: update(this.state.portfolios, {
                [i]: {
                    isEuro: {$set: !this.state.portfolios[i].isEuro},
                },
            }),
        })
    }

    //selects the stock from each portfolio and save for deletion
    selectedStock = (stockName)=>{
        const selectedStocks = this.state.selectedStocks;
        if(selectedStocks.includes(stockName)){
            const index = selectedStocks.indexOf(stockName);
            selectedStocks.splice(index, 1);
        } else{
            selectedStocks.push(stockName);
        }

        this.setState({
            selectedStocks,
        })
        
    }
    //removes selected stocks from each portfolio
    removeSelectedStocks = (i)=>{
        const stocks = this.state.portfolios[i].stocks;
        const selectedStocks = this.state.selectedStocks;
        const newStocks = stocks.filter(item=>!selectedStocks.includes(item.stockName))
    
        this.setState({
            portfolios: update(this.state.portfolios, {
                [i]: {
                    stocks: {
                        $set: newStocks,
                    },
                },
            }),
            selectedStocks: [],
        })
    }

    //total values of each portfolio
    countValue = (i)=>{
        let value = [0];
        let portfolio = this.state.portfolios[i]
        portfolio.stocks.map(item=>value.push(Number(item.totalValue)))
        if(portfolio.isEuro){
            const totalValue = value.reduce((total, num)=>total + num)
            return Number.parseFloat(totalValue).toFixed(3) + '$'
        } else{
            const totalValue = value.reduce((total, num)=>total + num) * this.state.exchangeRate;
            return Number.parseFloat(totalValue).toFixed(3) + '€'
        }
        
    }
    render() {
        const portfolios = this.state.portfolios.map((item, i)=>(
            <Col xs="12" lg="6" key={i}>
                <div className="portfolio-box">
                    <div className="portfolio-header">
                        <span className="portfolio-name">{item.name}</span>
                        <span><Button color="primary" onClick={()=>this.toggleButton(i)}>{this.state.portfolios[i].isEuro ? 'Show in Euro' : 'Show in Dollar'}</Button></span>
                        <span><Button 
                            color="danger" 
                            style={{'borderRadius': '50%'}}
                            onClick={()=>{if(window.confirm('Are you sure you want to delete this item?')) this.removePortfolio(i)}}>X</Button>
                        </span>
                    </div>
                    <div className="portfolio-body">
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Stock</th>
                                    <th>Amount</th>
                                    <th>Unit Value</th>
                                    <th>Total Value</th>
                                    <th />
                                </tr>
                            </thead>
                            {item.stocks.map((stockItem, i)=>(
                                <tbody key={i}>
                                    <tr>
                                        <td>{stockItem.stockName}</td>
                                        <td>{stockItem.stockAmount}</td>
                                        <td>{item.isEuro ? 
                                            Number(stockItem.unitValue) + '$' : 
                                            Number.parseFloat(Number(stockItem.unitValue) * this.state.exchangeRate).toFixed(3) + '€'}
                                        </td>
                                        <td>{item.isEuro ? 
                                            Number(stockItem.totalValue) + '$' : 
                                            Number.parseFloat(Number(stockItem.totalValue) * this.state.exchangeRate).toFixed(3) + '€'}
                                        </td>
                                        <td><input type="checkbox" onClick={()=>this.selectedStock(stockItem.stockName)} /></td>
                                    </tr>
                                </tbody>
                            ))}
                            
                        </Table>
                    </div>
                    <p>Total Value: {this.countValue(i)}</p>
                    <div className="portfolio-footer">
                        <Addstock 
                            stockName={this.state.stockName}
                            stockAmount={this.state.stockAmount}
                            handleStockName={this.handleStockName}
                            addStock={this.addStock}
                            index = {i}
                        />
                        <PortfolioChart id={i} portfolios={this.state.portfolios} />
                        <span><Button color="danger" onClick={()=>this.removeSelectedStocks(i)}>Remove Selected</Button></span>
                    </div>
                </div>
            </Col>
        ))
        return (
            <div>
                <AddPortfolio
                    portfolioName={this.state.portfolioName}
                    handlePortfolioName={this.handlePortfolioName}
                    createPortfolio={this.createPortfolio}
                />
                <Row>
                    {portfolios}
                </Row>
            </div>
        )
    }
}

export default Portfolio
