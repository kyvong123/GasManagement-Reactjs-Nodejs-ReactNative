import getUserCookies from "getUserCookies";
// body: {
// 	manufacture: value.manufacture,
// 	categoryCylinder: value.categoryCylinder,
// 	colorGas: value.colorGas,
// 	valve: value.valve,
// 	quantity: value.quantity,
// 	price: value.price,
// }

export const updateOrder = async (idDetail, idOrder, body) => {
    const user_cookies = await getUserCookies();
    const token = "Bearer " + user_cookies.token;
    const userID = user_cookies.user.id;
    const url = `${SERVERAPI}/orderDetail/update`;

    const params = {
        idDetail: idDetail,
        id: idOrder,
        userid: userID,
    }

    try {
        const response = await axios.put(url, body, {
            params: params,
            headers: {
                "Authorization": token
            }
        });

        return response.data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}