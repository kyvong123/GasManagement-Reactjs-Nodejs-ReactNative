import { createActions } from 'redux-actions';
import {
    GCIT,
    GCITS,
    GCITF,
} from '../types';

export const {
    gcit,
    gcits,
    gcitf
} = createActions({
    [GCIT]: (target, endDate, statisticalType, typesOfChildren) => ({ target, endDate, statisticalType, typesOfChildren }),
    [GCITS]: (result_getCurrentInvenTory) => ({ result_getCurrentInvenTory }),
    [GCITF]: (error) => ({ error }),
});

