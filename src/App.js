import React, { useState, useEffect } from "react";
import "./App.css";
import HeaderComp from "./components/HeaderComp";
import PostComp from "./components/PostComp";
import FooterComp from "./components/FooterComp";
import InstagramEmbed from "react-instagram-embed";
import axios from "./components/axios";
import Pusher from "pusher-js";

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () =>
    await axios.get("/sync").then((responce) => {
      setPosts(responce.data);
    });

  useEffect(() => {
    fetchPosts();
    return () => {
      fetchPosts();
    };
  }, []);

  useEffect(() => {
    const pusher = new Pusher("8fed390a4b1f3ac6b4b5", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      console.log(data);
      fetchPosts(); //refetch to render in frontend
    });
  }, []);

  const postcomp = posts.map((post) => (
    <PostComp
      key={post._id}
      postId={post._id}
      username={post.user}
      imageUrl={post.image}
      caption={post.caption}
      coms={post.comments}
    />
  ));

  const oEmbed = {
    app_Id: "828189387760159",
    clientToken: "d0c2968af39961c91c3c398f85960bcd",
  };

  return (
    <div className="app">
      <HeaderComp />
      <div className="app__posts">
        <div className="app__postsLeft">{postcomp}</div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/BVHqd-pD3B4/"
            clientAccessToken={`${oEmbed.app_Id}|${oEmbed.clientToken}`}
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      <FooterComp />
    </div>
  );
}

export default App;
