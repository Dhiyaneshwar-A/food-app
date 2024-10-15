import React, { useState, useEffect, useRef } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
    });

    const [image, setImage] = useState(null); // Uncontrolled: Track image with useState.
    const fileInputRef = useRef(); // Uncontrolled: useRef to handle file input directly.

    // Controlled change handler for text inputs.
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Lifecycle: Log when component mounts.
    useEffect(() => {
        console.log('Add component mounted');
        return () => {
            console.log('Add component unmounted'); // Cleanup on unmount.
        };
    }, []);

    // On form submission.
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    // Reset form after successful submission.
    const resetForm = () => {
        setData({
            name: "",
            description: "",
            price: "",
            category: "Salad",
        });
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input.
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                {/* Image Upload */}
                <div className='add-img-upload flex-col'>
                    <p>Upload image</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <label htmlFor="image" onClick={() => fileInputRef.current.click()}>
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload Preview"
                        />
                    </label>
                </div>

                {/* Product Name */}
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input
                        name='name'
                        value={data.name}
                        onChange={onChangeHandler}
                        type="text"
                        placeholder='Type here'
                        required
                    />
                </div>

                {/* Product Description */}
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea
                        name='description'
                        value={data.description}
                        onChange={onChangeHandler}
                        rows={6}
                        placeholder='Write content here'
                        required
                    />
                </div>

                {/* Category and Price */}
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select
                            name='category'
                            value={data.category}
                            onChange={onChangeHandler}
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>

                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input
                            name='price'
                            value={data.price}
                            onChange={onChangeHandler}
                            type="number"
                            placeholder='25'
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button type='submit' className='add-btn'>
                    ADD
                </button>
            </form>
        </div>
    );
};

export default Add;
