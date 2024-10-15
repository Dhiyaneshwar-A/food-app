import axios from 'axios';
import { toast } from 'react-toastify';

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Login or Register User Action Creator
export const authUser = (data, isLogin, url) => async (dispatch) => {
    try {
        const endpoint = isLogin ? `${url}/api/user/login` : `${url}/api/user/register`;
        const response = await axios.post(endpoint, data);

        if (response.data.success) {
            const token = response.data.token;
            localStorage.setItem('token', token);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: { token },
            });

            toast.success('Successfully logged in!');
        } else {
            toast.error(response.data.message);
            dispatch({ type: LOGIN_FAILURE, payload: response.data.message });
        }
    } catch (error) {
        toast.error('Something went wrong. Please try again.');
        dispatch({ type: LOGIN_FAILURE, payload: error.message });
    }
};

// Logout User Action Creator
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
};

