import React, {Component} from 'react'
import {Container} from 'reactstrap'
import Header from './components/Header'
import Portfolio from './components/Portfolio'
import './App.css'

class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <Container fluid>
                    <Portfolio />
                </Container>
            </div>
        );
    }
}

export default App



