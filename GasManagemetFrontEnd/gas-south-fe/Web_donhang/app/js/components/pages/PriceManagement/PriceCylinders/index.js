import React from 'react'
import MainPage from '../MainPage'
import Provider from "../context/Provider";

export default function index() {
    return (
        <Provider>
            <MainPage type={'Cylinders'} />
        </Provider>
    )
}
