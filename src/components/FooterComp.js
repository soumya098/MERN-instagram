import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import firebase from "firebase";
import "./footer.css";

function FooterComp() {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [enable, setEnable] = useState(true);

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
            //post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageUrl: url,
              caption: caption,
              username: auth.currentUser.displayName,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="app__footer">
      <progress className="imageupload__progress" value={progress} max="100" />
      <input
        className="app__footercaption"
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input className="app__footerfile" type="file" onChange={handleChange} />
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
}

export default FooterComp;
