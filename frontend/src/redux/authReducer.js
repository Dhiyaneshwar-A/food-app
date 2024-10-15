import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './authActions';

const initialState = {
    token: localStorage.getItem('token') || null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, token: action.payload.token, error: null };
        case LOGIN_FAILURE:
            return { ...state, error: action.payload };
        case LOGOUT:
            return { ...state, token: null, error: null };
        default:
            return state;
    }
};

export default authReducer; // Ensure it's a default export
