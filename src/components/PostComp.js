import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { auth } from "../firebase";
import axios from "./axios";
import Pusher from "pusher-js";

function PostComp({ imageUrl, username, caption, postId, coms }) {
  const [comments, setComments] = useState(coms);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscibe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscibe();
    };
  }, [user]);

  useEffect(() => {
    const pusher = new Pusher("8fed390a4b1f3ac6b4b5", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("posts");
    channel.bind("updated", function (data) {
      if (postId === data.id) {
        setComments(data.data);
      }
    });
  }, []);

  const renderComments = comments?.map((comment, index) => (
    <p key={index}>
      <strong>{comment.user}</strong> {comment.text}
    </p>
  ));

  const postComment = (event) => {
    event.preventDefault();
    axios.put(`/:id`, {
      id: postId,
      comment: { user: user?.displayName, text: comment },
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
      {user && (
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
