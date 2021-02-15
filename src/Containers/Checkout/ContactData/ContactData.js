import React, { Component } from 'react'


import Spinner from '../../../Components/UI/Spinner/Spinner'
import axios from '../../../axios-orders'
import Button from '../../../Components/UI/Button/Button'
import classes from './ContactData.module.css'

class ContactData extends Component{
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        //alert('You Continue')
        this.setState({ loading: true })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'James Aktinson',
                address: {
                    street: 'My Street',
                    zipCode: '5875664',
                    country: 'USA'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                //console.log(response)
                this.setState({ loading: false});
                this.props.history.push('/')
            })
            .catch(error => {
                //console.log(error);
                this.setState({ loading: false});
            });
    }

    render() {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if (this.state.loading){
            form = <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
};

export default ContactData