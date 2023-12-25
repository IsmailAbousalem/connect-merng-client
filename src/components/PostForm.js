import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm() {
    const [values, setValues] = useState({ body: '' });
    const [validationError, setValidationError] = useState('');

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            try {
                // Read what's currently in the cache
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
    
                // Update the cache with the new post
                let newData;
                if (data && data.getPosts) {
                    newData = {
                        getPosts: [result.data.createPost, ...data.getPosts]
                    };
                } else {
                    newData = {
                        getPosts: [result.data.createPost]
                    };
                }
                
                // Write the updated data back to the cache
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
            } catch (e) {
                console.error("Error updating cache", e);
            }
    
            setValues({ body: '' }); // Reset form
        },
        onError(err) {
            console.error("Error creating post", err);
        }
    });

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
        setValidationError(''); // Clear validation error on change
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (values.body.trim() === '') {
            setValidationError("You can't create an empty post!"); // Set validation error
            return;
        }
        createPost();
    };

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Connect!"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false || validationError !== ''}
                    />
                    <Button type="submit" color="purple">
                        Submit
                    </Button>
                </Form.Field>
                {error && <div className="ui error message">{error.message}</div>}
            </Form>
            {validationError && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">
                        <li>{validationError}</li>
                    </ul>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`;

export default PostForm;
