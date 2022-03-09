import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Comment from "../components/Comment";
import './CommentSection.css'
import { Figure, Button } from 'react-bootstrap'

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
    <Container className='comment-box' style={{ paddingTop: '30px' }} >
      <Row className='comment-form'>
        {props.user ? (<>
          <Col xs={1}>
            <Figure.Image
              width={70}
              height={70}
              src={'/avatars/' + props.user.avatar}
            />
          </Col>
          <Col>
            <textarea
              type="text"
              placeholder="Comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              id="comment"
              name="configname"
              className='comment-form-input'
            />
            <Button style={{ float: 'left' }} onClick={() => { addComment(commentText); }}>Submit Comment</Button>
          </Col>
        </>
        ) : (
          <textarea disabled style={{ float: 'right', flex: "1", resize: 'none', }} value="Sign In To Comment" />
        )}</Row>
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
