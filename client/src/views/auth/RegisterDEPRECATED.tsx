import { scrypt } from "scrypt-js";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../generated/graphql";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();

  const history = useHistory();

  return <div className="col-lg-8 offset-lg-2"></div>;
};
