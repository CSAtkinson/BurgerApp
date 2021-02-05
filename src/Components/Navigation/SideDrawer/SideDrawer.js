import React from 'react'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import classes from './SideDrawer.module.css'
import Backdrop from '../../UI/Backdrop/Backdrop'
import Auxillary from '../../../hoc/Auxillary/Auxillary'


const sideDrawer = (props) => {
    let attatchedClasses = [classes.SideDrawer, classes.Close]
    if (props.open) {
        attatchedClasses = [classes.SideDrawer, classes.Open]
    }
    return (
        <Auxillary>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className ={attatchedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo/>
                </div>
                
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Auxillary>
    );
};



export default sideDrawer