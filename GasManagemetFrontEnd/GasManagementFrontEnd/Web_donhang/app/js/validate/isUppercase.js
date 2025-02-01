import React from 'react';

const isUppercase = (value) => {
    /* if ((/^[a-z]*$/).test(value)) {
        return <div className='text-danger'>{value} không hợp lệ vui lòng xài chữ thường</div>;
    } */
    const strings = value.slice(0, value.indexOf('@'))
    let i = 0;
    let character='';
    while (i <= strings.length){
        character = strings.charAt(i);
        if (!isNaN(character * 1)){
            
        } else {
            if (character == character.toUpperCase()) {
                return <div className='text-danger'>{value} không hợp lệ vui lòng xài chữ thường</div>;
            }
        }
        i++;
    }
};

export default isUppercase;