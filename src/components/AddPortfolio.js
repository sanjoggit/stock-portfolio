import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalFooter, ModalBody} from 'reactstrap'

class AddPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
    
        this.toggle = this.toggle.bind(this);
    }
    
    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }
    render() {
        const {portfolioName, handlePortfolioName, createPortfolio} = this.props
        return (
            <div>
                <Button color="primary" className="add-portfolio" onClick={this.toggle}>Add Portfolio</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Create new Portfolio</ModalHeader>
                    <ModalBody>
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="Portfolio Name"
                            value={portfolioName}
                            onChange={handlePortfolioName}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
                        <Button color="primary" onClick={()=>createPortfolio(this.toggle)}>Create</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default AddPortfolio
