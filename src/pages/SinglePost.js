import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom'; // import useNavigate
import moment from 'moment';
import { Button, Card, Form, Grid, Image, Icon, Label } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost() {
    const { postId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // useNavigate for redirection
    const commentInputRef = useRef(null);

    const[comment, setComment] = useState('');

    const { loading, data, error } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    const deletePostCallback = () => {
        navigate('/'); // Redirect to home after deletion
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>Error loading post!</p>;


    let postMarkup;
    if (data.getPost) {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;
        

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                    <Image
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                    size = "small"
                    float = "right"/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr/>
                        <Card.Content extra>
                            <LikeButton user={user} post={{ id, likeCount, likes }}/>
                            <Button
                                as="div"
                                labelPosition="right"
                                onClick={() => console.log('Comment on post')}
                                >
                                    <Button basic color="blue">
                                        <Icon name ="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                        </Card.Content>
                    </Card>
                    {user && (
                        <Card fluid>
                            <Card.Content>
                            <p>Post a comment!</p>
                            <Form>
                                <div className="ui action input fluid">
                                    <input
                                        type="text"
                                        placeholder="Comment..."
                                        name="comment"
                                        value={comment}
                                        onChange={event => setComment(event.target.value)}
                                        ref={commentInputRef}
                                    />
                                    <button type="submit"
                                        className="ui button purple"
                                        disabled={comment.trim() === ''}
                                        onClick={submitComment}
                                        >
                                        Submit
                                    </button>
                                </div>
                            </Form>
                            </Card.Content>
                        </Card>
                        )}
                    {comments.map(comment => (
                        <Card fluid key={comment.id}>
                            <Card.Content>
                                {user && user.username === comment.username && (
                                    <DeleteButton postId={id} commentId={comment.id}/>
                                )}
                                <Card.Header>{comment.username}</Card.Header>
                                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{comment.body}</Card.Description>
                            </Card.Content>
                        </Card>
                    ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    } else {
        postMarkup = <p>Post not found</p>;
    }

    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`


export default SinglePost