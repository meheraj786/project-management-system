import React,{ useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue } from "firebase/database";
import { UserContext } from "./UserContext";


const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const user = useSelector((state) => state.userInfo.value);
  const db = getDatabase();
  useEffect(() => {
    const starCountRef = ref(db, "users/" + user.uid);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentUser({ ...data, id: snapshot.key });
    });
  }, [db]);

  return (
    <UserContext.Provider value={{ currentUser }}>{children}</UserContext.Provider>
  );
};

export default CurrentUserProvider;
