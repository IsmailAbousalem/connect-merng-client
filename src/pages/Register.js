import React from 'react'
import { useContext } from 'react'
// import { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks'


function Register(props) {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const { onChange, values, errors, setErrors } = useForm(registerUser, {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}) {
            context.login(userData);
            navigate('/');
        },
        onError(err) {
            const serverErrors = err.graphQLErrors?.[0]?.extensions?.exception?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
            } else {
                // Handle other types of errors
                setErrors({ general: "Username is already taken" });
            }
        },
        variables: values
    });


    const onSubmit = (event) => {
        event.preventDefault();
    
        let newErrors = {};
        if (!values.username.trim()) newErrors.username = "Username must not be empty";
        if (!values.email.trim()) newErrors.email = "Email must not be empty";
        if (!values.password) newErrors.password = "Password must not be empty";
        if (!values.confirmPassword) newErrors.confirmPassword = "Confirm Password must not be empty";
        if (values.password !== values.confirmPassword) newErrors.confirmPassword = "Passwords must match";
    
        setErrors(newErrors);
    
        // Only proceed with the mutation if there are no errors
        if (Object.keys(newErrors).length === 0) {
            registerUser();
        }
    }

    function registerUser(){
        addUser();
    }
    


    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password.."
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value => (
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id email username createdAt token
        }
    }
`

export default Register;