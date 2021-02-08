import React, { Component } from 'react'

import Auxillary from '../../hoc/Auxillary/Auxillary'
import Burger from '../../Components/Burger/Burger'
import BuildControls from '../../Components/Burger/BuildControls/BuildControls'
import Modal from '../../Components/UI/Modal/Modal'
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../Components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICE = {
    salad: .5,
    cheese: .4,
    meat: 1.3,
    bacon: .7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        errorState: false
    }

    componentDidMount() {
        axios.get('https://react-burger-1d4fc-default-rtdb.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({error: true})
            })
    }

    updatePurchase(ingredients) {
        //console.log(Object.values(ingredients).some(amount => amount > 0));
        return Object.values(ingredients).some(amount => amount > 0)
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldprice = this.state.totalPrice;
        const newPrice = oldprice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients, purchasable: this.updatePurchase(updatedIngredients) })



    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (this.state.ingredients[type] === 0) {
            return;
        }
        else {
            const updatedCount = oldCount - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            }
            updatedIngredients[type] = updatedCount;
            const priceSubtraction = INGREDIENT_PRICE[type];
            const oldprice = this.state.totalPrice;
            const newPrice = oldprice - priceSubtraction;
            this.setState({ totalPrice: newPrice, ingredients: updatedIngredients, purchasable: this.updatePurchase(updatedIngredients) })
        }


    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        //alert('You Continue')
        this.setState({ loading: true })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
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
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                //console.log(error);
                this.setState({ loading: false, purchasing: false });
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0

        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

        if(this.state.ingredients) {
            burger = (
                <Auxillary>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler} />
                </Auxillary>
            )
            orderSummary = (
                <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice} />
            )
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
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

export default withErrorHandler(BurgerBuilder, axios)