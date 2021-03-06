import React, { Component } from 'react'
import { connect } from 'react-redux'

import Auxillary from '../../hoc/Auxillary/Auxillary'
import Burger from '../../Components/Burger/Burger'
import BuildControls from '../../Components/Burger/BuildControls/BuildControls'
import Modal from '../../Components/UI/Modal/Modal'
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../Components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import axios from '../../axios-orders'



export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchase(ingredients) {
        //console.log(Object.values(ingredients).some(amount => amount > 0));
        return Object.values(ingredients).some(amount => amount > 0)
    }

   

    purchaseHandler = () => {
        if (this.props.isAuthenticated ) {
            this.setState({ purchasing: true })
        }else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
    }
       

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

     purchaseContinueHandler = () => {
        //     const queryParams = [];
        //     for (let i in this.state.ingredients){
        //         queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        //     }
        //     queryParams.push('price=' + this.state.totalPrice);
        //     const queryString = queryParams.join('&');
        //     this.props.history.push({
        //         pathname: "/checkout",
        //         search: '?' + queryString
        //     });
        this.props.onInitPurchase();
        this.props.history.push('/checkout')
     }

    render() {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0

        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />

        if(this.props.ings) {
            burger = (
                <Auxillary>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchase(this.props.ings)}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated}
                        ordered={this.purchaseHandler} />
                </Auxillary>
            )
            orderSummary = (
                <OrderSummary
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price} />
            )
        }
   
        return (
            <Auxillary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxillary>
        );
    }

}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))