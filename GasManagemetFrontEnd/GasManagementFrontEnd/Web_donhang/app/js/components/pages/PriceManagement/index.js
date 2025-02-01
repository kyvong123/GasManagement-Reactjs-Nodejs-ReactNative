import Provider from "./context/Provider";
import MainPage from './MainPage'
const OrderManagement = () => {
    return (
        <Wrapper>
            <Provider>
                <MainPage />
            </Provider>
        </Wrapper>
    );
};

export default OrderManagement;
