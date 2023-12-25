// DeleteButton.js
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import SimpleModal from './SimpleModal'; // Import SimpleModal
// import MyPopup from '../util/MyPopup'

function DeleteButton({ postId, commentId, callback }) {
    const [modalOpen, setModalOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {
        variables: { postId, commentId },
        update(proxy) {
            // Update cache after post deletion
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
    
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(p => p.id !== postId)
                    }
                });
            }

            if (callback) {
                callback(); // Call the callback function
            }
        },
        onError(err) {
            console.error('Error deleting post:', err);
        }
    });

    return (
        <>
            {/* <MyPopup
                content={commentId ? 'Delete comment' : 'Delete post'}
            > */}
                <Button as="div" 
                    color="red" 
                    floated="right" 
                    onClick={() => setModalOpen(true)}
                >
                    <Icon name="trash" style={{ margin: 0 }}/>
                </Button>
            {/* </MyPopup> */}
            <SimpleModal
                open={modalOpen}
                message="Are you sure you want to delete this post?"
                onConfirm={() => {
                    deletePostOrMutation();
                    setModalOpen(false);
                }}
                onCancel={() => setModalOpen(false)}
            />
        </>
    );

}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

export default DeleteButton;
