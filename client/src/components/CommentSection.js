import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Comment from '../components/Comment';

function CommentSection(props) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    axios.get('/api/user/get-comments/' + props.projectId).then((res) => {
      setComments(res.data);
    });
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
    <Container>
      {!props.user ? (
        <p>sign in to comment</p>
      ) : (
        <Row>
          <Col>
            <img
              width='40'
              height='40'
              alt='avatar-img'
              className='profileImage'
              src={props.user.avatar}
            />
          </Col>
          <Col>
            <input
              type='text'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              id='comment'
              name='configname'
            />
            <input
              type='button'
              value='Submit'
              onClick={() => {
                addComment(commentText);
              }}
            />
          </Col>
        </Row>
      )}
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
