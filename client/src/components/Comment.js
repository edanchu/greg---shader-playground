import axios from "axios";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

function Comment(props) {
  function handleLike() {
    if (!props.user) {
      toast.error("Must be signed in to like");
    } else {
      console.log("here");
      axios.put("/api/user/like-comment/" + props.comment._id);
    }
  }

  return (
    <>
      <Row>
        <Col xs={2}>
          <img
            src={"/avatars/" + props.comment.ownerAvatar}
            alt="avatar-img"
            width="40"
            height="40"
            className="profileImage"
          />
        </Col>
        <Col>
          <h3>{props.comment.ownerName}</h3>
          <p>{props.comment.content}</p>
        </Col>
      </Row>
      <button>
        <i className="fas fa-thumbs-up" onClick={handleLike} />
      </button>
      <p>{props.comment.likes.length}</p>
    </>
  );
}
// add link to profile

export default Comment;
