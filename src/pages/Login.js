import { Button, Form} from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks'

function Login(props) {
    const context = useContext(AuthContext)
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const { onChange, values } = useForm(loginUserCallback, {
        username: '',
        password: ''
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, {data: { login: userData}}) {
            context.login(userData);
            navigate('/');
        },
        onError(err) {
            const serverErrors = err.graphQLErrors?.[0]?.extensions?.exception?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
            } else {
                setErrors({ general: "Wrong credentials." });
            }
        },
        variables: values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        
    
        let newErrors = {};
        if (!values.username.trim()) newErrors.username = "Username must not be empty";
        if (!values.password) newErrors.password = "Password must not be empty";
        
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
            loginUserCallback();
        }
    };
    

    function loginUserCallback() {
        loginUser();
    }    

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Login</h1>
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
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
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

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
                username: $username
                password: $password
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Login;