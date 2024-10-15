import React, { useContext, useEffect, useState, useRef } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod"); // Controlled component
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const phoneInputRef = useRef(null); // Uncontrolled component

    const { 
        getTotalCartAmount, token, food_list, cartItems, 
        url, setCartItems, currency, deliveryCharge 
    } = useContext(StoreContext);

    const navigate = useNavigate();

    // Controlled component for input change
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    // Place Order function with logic based on payment type
    const placeOrder = async (e) => {
        e.preventDefault();
        const phone = phoneInputRef.current.value; // Uncontrolled component value

        const orderItems = food_list
            .filter(item => cartItems[item._id] > 0)
            .map(item => ({
                ...item,
                quantity: cartItems[item._id]
            }));

        const orderData = {
            address: { ...data, phone }, // Merged with uncontrolled input value
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        };

        try {
            const endpoint = payment === "stripe" 
                ? "/api/order/place" 
                : "/api/order/placecod";

            const response = await axios.post(url + endpoint, orderData, {
                headers: { token }
            });

            if (response.data.success) {
                if (payment === "stripe") {
                    window.location.replace(response.data.session_url);
                } else {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                }
            } else {
                throw new Error("Order placement failed");
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };

    // Lifecycle effect to validate token and cart amount
    useEffect(() => {
        if (!token) {
            toast.error("Please sign in to place an order.");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, navigate, getTotalCartAmount]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='firstName' 
                        onChange={onChangeHandler} 
                        value={data.firstName} 
                        placeholder='First name' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='lastName' 
                        onChange={onChangeHandler} 
                        value={data.lastName} 
                        placeholder='Last name' 
                        required 
                    />
                </div>
                <input 
                    type="email" 
                    name='email' 
                    onChange={onChangeHandler} 
                    value={data.email} 
                    placeholder='Email address' 
                    required 
                />
                <input 
                    type="text" 
                    name='street' 
                    onChange={onChangeHandler} 
                    value={data.street} 
                    placeholder='Street' 
                    required 
                />
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='city' 
                        onChange={onChangeHandler} 
                        value={data.city} 
                        placeholder='City' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='state' 
                        onChange={onChangeHandler} 
                        value={data.state} 
                        placeholder='State' 
                        required 
                    />
                </div>
                <div className="multi-field">
                    <input 
                        type="text" 
                        name='zipcode' 
                        onChange={onChangeHandler} 
                        value={data.zipcode} 
                        placeholder='Zip code' 
                        required 
                    />
                    <input 
                        type="text" 
                        name='country' 
                        onChange={onChangeHandler} 
                        value={data.country} 
                        placeholder='Country' 
                        required 
                    />
                </div>
                {/* Uncontrolled input */}
                <input 
                    type="text" 
                    name='phone' 
                    placeholder='Phone' 
                    ref={phoneInputRef} 
                    required 
                />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>{currency}{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>{currency}{getTotalCartAmount() + deliveryCharge}</b>
                        </div>
                    </div>
                </div>

                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD (Cash on Delivery)</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe (Credit / Debit)</p>
                    </div>
                </div>

                <button className='place-order-submit' type='submit'>
                    {payment === "cod" ? "Place Order" : "Proceed To Payment"}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;
