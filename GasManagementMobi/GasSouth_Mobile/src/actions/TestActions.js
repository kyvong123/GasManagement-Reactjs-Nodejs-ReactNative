import { createAction, createActions } from 'redux-actions';
import { TEST123 } from '../types';

// export const {
//     testAction,
// } = createActions({
//     [TEST123]: (email, name, age) => ({ email, name, age }),
// });

const testAction = createAction(TEST123, (email, name, age) => ({ email, name, age }))

export { testAction }