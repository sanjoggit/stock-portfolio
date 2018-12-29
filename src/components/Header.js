import React, {Component} from 'react'
import {
    Navbar,
    NavbarBrand} from 'reactstrap'; 


class Header extends Component {
    render() {
        return (
            <div>
                <Navbar color="dark" >
                    <NavbarBrand>Stock Manager</NavbarBrand>
                </Navbar>
            </div>
        )
    }    
}

export default Header;
