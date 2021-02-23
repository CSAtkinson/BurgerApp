import React, { Component } from 'react'
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux'

import CheckoutSummary from '../../Components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from '../../Containers/Checkout/ContactData/ContactData'

class Checkout extends Component{
   

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        let summary = <Redirect to='/' />
        if (this.props.ings){
            summary = (
                <div>
                    <CheckoutSummary 
                        ingredients={this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinue={this.checkoutContinueHandler}/>
                    <Route 
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData}/>
                </div>
                
            )
        }
        return summary;               
            
        
    }
};

const mapStateToProps = state => {
    return {
        ings: state.ingredients
    }
}

export default connect(mapStateToProps)(Checkout)