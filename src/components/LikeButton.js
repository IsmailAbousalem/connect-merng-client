import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // import useNavigate
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likeCount, likes }}) {
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate(); // useNavigate for redirection

    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        onError: (err) => {
            // Handle the error here, for example, by showing a notification
            // Then, redirect to login if user is not logged in
            if (!user) {
                navigate('/login');
            }
        }
    });

    const handleLike = () => {
        if (!user) {
            navigate('/login');
        } else {
            likePost();
        }
    };

    const likeButton = user ? (
        liked ? (
            <Button color='purple'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='purple' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='purple' basic>
            <Icon name='heart' />
        </Button>
    );

    return (
        <Button as='div' labelPosition='right' onClick={handleLike}>
            {likeButton}
            <Label basic color='purple' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`;

export default LikeButton;