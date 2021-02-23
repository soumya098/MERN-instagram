import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import { auth } from "../firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid lightgray",
    boxShadow: theme.shadows[20],
    padding: theme.spacing(2, 5, 5),
  },
}));

function HeaderComp() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscibe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        setUser(authUser);
        console.log(`logged in as ${user?.displayName}`);
      } else {
        //user has looged out
        setUser(null);
        console.log("user logged out");
      }
    });
    return () => {
      //perform some clean up actions
      unsubscibe();
    };
  }, [user]);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, passwd)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, passwd).catch((error) => {
      alert(error.message);
    });
    setOpenSignIn(false);
  };

  const body1 = (
    <div style={modalStyle} className={classes.paper}>
      <center>
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
          className="header__image"
        />
      </center>
      <form className="app__signup">
        <Input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          value={[passwd]}
          onChange={(e) => setPasswd(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>
          SignUp
        </Button>
      </form>
    </div>
  );
  const body2 = (
    <div style={modalStyle} className={classes.paper}>
      <center>
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
          className="header__image"
        />
      </center>
      <form className="app__signup">
        <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          value={[passwd]}
          onChange={(e) => setPasswd(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>
          SignIn
        </Button>
      </form>
    </div>
  );

  return (
    <div className="app__header">
      <img
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="instagram logo"
        className="header__image"
      />
      {user ? (
        <Button
          onClick={() => {
            auth.signOut();
          }}
          color="primary"
          variant="outlined"
        >
          Logout
        </Button>
      ) : (
        <div className="app__logincontainer">
          <Button
            onClick={() => setOpen(true)}
            color="primary"
            variant="outlined"
          >
            sign up
          </Button>
          <Button
            onClick={() => setOpenSignIn(true)}
            color="primary"
            variant="outlined"
          >
            sign In
          </Button>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        {body1}
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        {body2}
      </Modal>
    </div>
  );
}

export default HeaderComp;
