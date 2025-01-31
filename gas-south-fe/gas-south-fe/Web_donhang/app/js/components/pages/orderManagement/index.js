
import styled from "styled-components";
import Content from "./Content";
import Provider from "./context/Provider";
const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
`;

const OrderManagement = () => {
    return (
        <Wrapper>
        <Provider>
                <Content />
        </Provider>
            </Wrapper>
    );
};

export default OrderManagement;
