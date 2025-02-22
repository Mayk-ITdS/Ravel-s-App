import { useState } from "react";
import { loginUser } from "../../Store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        loginUser({ email, password }) as any
      );
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      } else {
        setError("Wrong email or password");
      }
    } catch (err) {
      setError("Login error occured.");
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    handleLogin,
  };
};
export default useAuthForm;
