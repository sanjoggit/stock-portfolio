import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

class AddStock extends Component {
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
        const {stockName, stockAmount, handleStockName, addStock, index} = this.props;
        return (
            <div>
                <div><Button color="primary" className="add-portfolio" onClick={this.toggle}>Add Stock</Button></div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add stock</ModalHeader>
                    <ModalBody>
                        <form>
                            <div>
                                <label><h6>Stock Name</h6></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Stock Name"
                                    name="stockName"
                                    style={{textTransform: 'uppercase'}}
                                    value={stockName}
                                    onChange={handleStockName}
                                />
                            </div>
                            <div>
                                <label><h6>Stock Amount</h6></label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="0" 
                                    name="stockAmount"
                                    value={stockAmount}
                                    onChange={handleStockName}
                                />
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
                        <Button color="primary" onClick={()=>addStock(index, this.toggle)}>Create</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default AddStock
