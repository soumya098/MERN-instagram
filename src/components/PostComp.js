import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { db, auth } from "../firebase";
import firebase from "firebase";

function PostComp({ imageUrl, username, caption, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscibe;
    if (postId) {
      unsubscibe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          console.log(snapshot.docs[0]?.data());
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }

    return () => {
      unsubscibe();
    };
  }, [postId]);

  const renderComments = comments.map((comment) => (
    <p key={comment.id}>
      <strong>{comment.data.username}</strong> {comment.data.text}
    </p>
  ));

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: auth.currentUser.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="/" alt={username} />
        <h3>{username}</h3>
      </div>
      <img src={imageUrl} alt="" className="post__image" />
      <h4 className="post__caption">
        <strong>{username}</strong> {caption}
      </h4>
      <div className="post__comments">{renderComments}</div>
      {auth.currentUser && (
        <form className="post__commentbox">
          <input
            type="text"
            className="post__input"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className={
              !comment ? "post__commentbtn" : "post__commentbtnenabled"
            }
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            post
          </button>
        </form>
      )}
    </div>
  );
}

export default PostComp;
