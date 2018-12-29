import React, {Component} from 'react'
import AddPortfolio from './AddPortfolio'
import {Col, Row, Button, Table} from 'reactstrap'
import Addstock from './AddStock'
import axios from 'axios'

class Portfolio extends Component {
    constructor(props){
        super(props);
        this.state = {
            portfolioName: '',
            stockName: '',
            stockAmount: 1,
            portfolios: [],
            exchangeRate: '',
        }
    }

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
    removePortfolio = (i)=>{
        let portfolios = this.state.portfolios;
        portfolios.splice(i, 1);
        this.setState({
            portfolios,
        })
    }

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
                })
            this.setState({
                stockName: '',
                stockAmount: 1,
            })
            toggle()
        }
    }
    toggleButton = (i)=>{
        this.setState({
            portfolios: [
                {
                    isEuro: !this.state.portfolios[i].isEuro,
                },
            ],
        })
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
                                        <td><input type="checkbox"/></td>
                                    </tr>
                                </tbody>
                            ))}
                            
                        </Table>
                    </div>
                    <p>Total Value:0</p>
                    <div className="portfolio-footer">
                        <Addstock 
                            stockName={this.state.stockName}
                            stockAmount={this.state.stockAmount}
                            handleStockName={this.handleStockName}
                            addStock={this.addStock}
                            index = {i}
                        />
                        <span><Button color="info">Perf Graph</Button></span>
                        <span><Button color="danger">Remove Selected</Button></span>
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
