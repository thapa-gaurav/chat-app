import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSiningUp } = useAuthStore();

  const validateForm = (e) => {
    e.preventDefault();
  };

  return (
    
  );
};

export default SignUpPage;
