import React from 'react';
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";

class RegisterSuccess extends React.Component{
    render()
    {
        
        return (
            <div>
                <Header/>
                <Main />
                <Footer />
                <script src="assets/js/core.min.js"></script>
                <script src="assets/js/app.min.js"></script>
                <script src="assets/js/script.min.js"></script>
            </div>

        );
    }
}
export default RegisterSuccess;