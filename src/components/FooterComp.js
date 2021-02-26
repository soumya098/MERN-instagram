import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import "./footer.css";
import axios from "./axios";

function FooterComp() {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [murl, setUrl] = useState("");
  const [enable, setEnable] = useState(true);
  const imageInputRef = React.useRef(); //to make input<file> element controlled
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
      //perform some clean up actions
      unsubscibe();
    };
  }, [user]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setEnable(false);
    } else {
      setEnable(true);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function.......
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //error function.........
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function........
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            axios.post("/upload", {
              image: url,
              caption: caption,
              user: user.displayName,
            });
            setProgress(0);
            setCaption("");
            imageInputRef.current.value = ""; //Resets the file name of the file input
            setImage(null); //Resets the value of the file input
            setEnable(true);
            window.scrollTo(0, 0);
          });
      }
    );
  };

  if (user != null) {
    return (
      <div className="app__footer">
        <progress
          className="imageupload__progress"
          value={progress}
          max="100"
        />
        <input
          className="app__footercaption"
          type="text"
          placeholder="Enter a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          className="app__footerfile"
          type="file"
          onChange={handleChange}
          accept="image/*"
          ref={imageInputRef} //Apply the ref to the input, now it's controlled
        />
        <button
          id="upload"
          className={enable ? "imageupload__btn" : "imageupload__btnenabled"}
          onClick={handleUpload}
          disabled={enable}
        >
          Upload
        </button>
      </div>
    );
  } else {
    return <div className="app__footer">login to upload</div>;
  }
}

export default FooterComp;
