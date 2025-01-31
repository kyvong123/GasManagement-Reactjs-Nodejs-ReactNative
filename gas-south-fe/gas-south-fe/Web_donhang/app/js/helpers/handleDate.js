import moment from "moment";
export const compareDate = (date) => {
    let momentPresent = moment().add(-1,"d");
    if (date > momentPresent) return 1;
    return -1;
};

export const handleShowDate = (date) => {
    if(!date){
        return ''
    }
    return moment(date).format("DD/MM/YYYY")
};
