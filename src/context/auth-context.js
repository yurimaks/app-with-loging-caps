import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLoging: (email, password) => {}
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged")
    if (isLogged === "1") setIsLoggedIn(true);
  }, [])

  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLogged");
  }

  const loginHandler = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLogged", 1);
  }

  return (
    <AuthContext.Provider value={
      {
        isLoggedIn: isLoggedIn,
        onLoging: loginHandler,
        onLogout: logoutHandler
      }
    }>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;