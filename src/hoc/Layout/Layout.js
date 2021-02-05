import React, {Component} from 'react'

import Auxillary from '../Auxillary/Auxillary'
import classes from './Layout.module.css'
import Toolbar from '../../Components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../Components/Navigation/SideDrawer/SideDrawer'
import { render } from '@testing-library/react'

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer:false})
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevState) =>{
            return {showSideDrawer: !prevState.showSideDrawer}
        })
    }


    render() {
        return(
            <Auxillary>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer closed={this.sideDrawerClosedHandler} open={this.state.showSideDrawer}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxillary>
        );
    }
}

export default Layout