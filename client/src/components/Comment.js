import axios from 'axios';
import React, { useState } from 'react';
import { Col, Row, Figure, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './CommentSection.css';

function Comment(props) {
  const [comment, setComment] = useState(props.comment);
  const [liked, setLiked] = useState(
    props.comment.likes.includes(props.user?._id)
  );

  function handleLike() {
    if (!props.user) {
      toast.error('Must be signed in to like');
    } else {
      let newLikes = comment.likes;
      let likeStatus;
      if (comment.likes.indexOf(props.user._id) === -1) {
        newLikes.push(props.user._id);
        likeStatus = true;
      } else {
        newLikes = newLikes.filter((id) => id !== props.user._id);
        likeStatus = false;
      }
      axios
        .put('/api/user/update-comment/' + comment._id, {
          ...comment,
          likes: newLikes,
        })
        .then((res) => {
          setComment({ ...comment, likes: newLikes });
          setLiked(likeStatus);
        });
    }
  }

  return (
    <>
      <Row className='comment-existing-container'>
        <Col xs={2}>
          <h5>
            <a style={{ color: 'inherit' }} href={'/UserPage/' + comment.owner}>
              {comment.ownerName}
            </a>
          </h5>
          <Figure.Image
            src={'/avatars/' + comment.ownerAvatar}
            width={60}
            height={60}
          />
        </Col>
        <Col xs={10}>
          <p className='comment-existing'>{comment.content}</p>
        </Col>
        <Col>
          <Button
            variant='outline-primary'
            style={{ float: 'right', color: liked ? 'aqua' : 'lightgrey' }}
            onClick={handleLike}
          >
            <i className='fas fa-thumbs-up' /> {comment.likes.length}
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Comment;
