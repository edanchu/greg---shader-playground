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
        <Col xs={'auto'}>
          <h4>{comment.ownerName}</h4>
          <Figure.Image
            src={'/avatars/' + comment.ownerAvatar}
            width={60}
            height={60}
          />
        </Col>
        <Col xs={'auto'}>
          <textarea
            type='text'
            value={comment.content}
            className='comment-existing'
            disabled
            style={{ resize: 'none', marginTop: '1rem' }}
          />
        </Col>
        <Col>
          <Button style={{ float: 'right' }} onClick={handleLike}>
            <i className='fas fa-thumbs-up' /> {comment.likes.length}
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Comment;
