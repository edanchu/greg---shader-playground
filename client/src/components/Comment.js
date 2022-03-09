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
        <Col xs={2}>
          <h4>{props.comment.ownerName}</h4>
          <Figure.Image
            src={"/avatars/" + props.comment.ownerAvatar}
            width={60}
            height={60}
          />
        </Col>
        <Col xs={10}>
          <p className='comment-existing'>{props.comment.content}</p>
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
