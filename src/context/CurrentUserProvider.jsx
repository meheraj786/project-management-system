import React,{ useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue } from "firebase/database";
import { UserContext } from "./UserContext";


const CurrentUserProvider = ({ children }) => {
  const user = useSelector((state) => state.userInfo.value);
  const db = getDatabase();
const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem("currentUser")) || null
);

useEffect(() => {
  if (!user?.uid) return;
  const starCountRef = ref(db, "users/" + user.uid);
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    const updatedUser = { ...data, id: snapshot.key };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  });
}, [db, user?.uid]);

  return (
    <UserContext.Provider value={{ currentUser }}>{children}</UserContext.Provider>
  );
};

export default CurrentUserProvider;
