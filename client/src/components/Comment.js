import axios from "axios";
import React from "react";
import { Col, Row, Figure, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import './CommentSection.css'

function Comment(props) {
  function handleLike() {
    if (!props.user) {
      toast.error('Must be signed in to like');
    } else {
      axios.put("/api/user/like-comment/" + props.comment._id);
    }
  }

  return (
    <>
      <Row className='comment-existing-container'>
        <Col xs={'auto'}>
          <h4>{props.comment.ownerName}</h4>
          <Figure.Image
            src={"/avatars/" + props.comment.ownerAvatar}
            width={60}
            height={60}
          />
        </Col>
        <Col xs={'auto'}>
          <textarea
            type="text"
            value={props.comment.content}
            className='comment-existing'
            disabled
            style={{ resize: 'none', marginTop: '1rem' }}
          />
        </Col>
        <Col>
          <Button style={{ float: 'right' }}>
            <i className="fas fa-thumbs-up" onClick={handleLike} />  {props.comment.likes.length}
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Comment;
