import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Comment from '../components/Comment';
import './CommentSection.css';
import { Figure, Button } from 'react-bootstrap';

function CommentSection(props) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (props.projectId !== undefined) {
      axios.get('/api/user/get-comments/' + props.projectId).then((res) => {
        setComments(res.data);
      });
    }
  }, []);

  function addComment(comment) {
    axios
      .post('/api/user/add-comment/' + props.projectId, {
        content: comment,
      })
      .then((res) => {
        axios.get('/api/user/get-comments/' + props.projectId).then((res) => {
          setComments(res.data);
        });
      });
  }

  return (
    <Container className='comment-box' style={{ paddingTop: '30px' }}>
      <Row className='comment-form'>
        {props.user ? (
          <>
            <Col xs={2} xl={1}>
              <img
                // width={70}
                width={'100%'}
                src={'/avatars/' + props.user.avatar}
                alt='user-avatar'
                style={{
                  minWidth: '50px',
                  width: '120%',
                  margin: 'auto',
                }}
              />
            </Col>
            <Col>
              <textarea
                type='text'
                placeholder='Comment...'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                id='comment'
                name='configname'
                className='comment-form-input'
              />
              <Button
                style={{ float: 'left' }}
                onClick={() => {
                  addComment(commentText);
                  setCommentText('');
                }}
              >
                Submit Comment
              </Button>
            </Col>
          </>
        ) : (
          <textarea
            disabled
            style={{ float: 'right', flex: '1', resize: 'none' }}
            value='Sign In To Comment'
          />
        )}
      </Row>
      {comments.map(
        (comment) =>
          comment && (
            <Comment comment={comment} user={props.user} key={comment._id} />
          )
      )}
    </Container>
  );
}

export default CommentSection;
