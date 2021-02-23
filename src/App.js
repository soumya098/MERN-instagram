import React, { useState, useEffect } from "react";
import "./App.css";
import HeaderComp from "./components/HeaderComp";
import PostComp from "./components/PostComp";
import { db, auth } from "./firebase";
import FooterComp from "./components/FooterComp";
import InstagramEmbed from "react-instagram-embed";

function App() {
  const [posts, setPosts] = useState([]);

  //run a code based on specific condition useEffect(code,condition);
  useEffect(() => {
    //this code run every time Posts collection is changes
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, pData: doc.data() }))
        );
      });
  }, [posts]);

  const postcomp = posts.map((post) => (
    <PostComp
      key={post.id}
      postId={post.id}
      username={post.pData.username}
      imageUrl={post.pData.imageUrl}
      caption={post.pData.caption}
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
            maxWidth={350}
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
      {auth.currentUser ? (
        <FooterComp />
      ) : (
        <div className="app__footer">
          <h3>you need to Signin to upload </h3>
        </div>
      )}
    </div>
  );
}

export default App;
