
// import { createContext, useState, useEffect, useContext } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// const isTokenExpired = (token) => {
//   try {
//     const { exp } = jwtDecode(token);
//     return Date.now() >= exp * 1000;
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     return true;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const [auth, setAuth] = useState(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const empId = localStorage.getItem("empId");
//     return { token, role, empId };
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token && isTokenExpired(token)) {
//       logout();
//       navigate("/login");
//     }
//   }, []);

//   const login = (token, role, empId) => {
//     const formattedRole =
//       role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", formattedRole);
//     localStorage.setItem("empId", empId);
//     setAuth({ token, role: formattedRole, empId });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("empId");
//     setAuth({ token: null, role: null, empId: null });
//   };

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// export default AuthContext;
import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const empId = localStorage.getItem("empId");
    return { token, role, empId };
  });

  const [user, setUser] = useState(null); // 🌟 Profile store karega
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  //  Auto logout if token expired
  // ---------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      logout();
      navigate("/login");
    }
  }, []);

  // ---------------------------------------------------
  //  Fetch user profile from backend (auto)
  // ---------------------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.token || !auth.empId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:9000/api/employee/employee/${auth.empId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const data = await res.json();
        setUser(data); // Profile store
      } catch (error) {
        console.error("Profile fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth]);

  // ---------------------------------------------------
  //  LOGIN
  // ---------------------------------------------------
  const login = (token, role, empId) => {
    const formattedRole =
      role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    localStorage.setItem("token", token);
    localStorage.setItem("role", formattedRole);
    localStorage.setItem("empId", empId);

    setAuth({ token, role: formattedRole, empId });
  };

  // ---------------------------------------------------
  //  LOGOUT
  // ---------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("empId");

    setAuth({ token: null, role: null, empId: null });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
