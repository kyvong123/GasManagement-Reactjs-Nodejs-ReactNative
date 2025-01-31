import React from 'react';
import validator from 'validator';

const email = (value) => {
    if (!validator.isEmail(value)) {
        return <div className='text-danger'>{value} không hợp lệ</div>;
    }
};

export default email;