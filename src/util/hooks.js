import { useState } from 'react'

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const onSubmit = (event) => {
        event.preventDefault();
    
        let newErrors = {};
        if (!values.username.trim()) newErrors.username = "Username must not be empty";
        if (!values.email.trim()) newErrors.email = "Email must not be empty";
        if (!values.password) newErrors.password = "Password must not be empty";
        if (!values.confirmPassword) newErrors.confirmPassword = "Confirm Password must not be empty";
        if (values.password !== values.confirmPassword) newErrors.confirmPassword = "Passwords must match";        
        
        if (Object.keys(newErrors).length === 0) {
            callback();
        }
    }

    return {
        onChange,
        onSubmit,
        values,
        errors,
        setErrors
    }
}