import React from 'react';

const required = (value) => {
    if (value && !value.toString().trim().length) {
        //     // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="text-danger">Không được để trống.</span>
    }
};

export default required;