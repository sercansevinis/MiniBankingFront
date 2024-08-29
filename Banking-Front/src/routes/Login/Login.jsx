import "./style.scss";

// 3rd Party
import { useForm } from "react-hook-form";
import { Col } from "react-grid-system";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "react-oidc-context";

import {
  BankingCheckbox,
  BankingInput,
  BankingInputPassword,
} from "@components";

import { getCookie, setCookie } from "@utils";

import { setUser, setToken, setShowLoginAnim } from "./slice";

import useLogin from "./queries";
import loginSchema from "./validations";

function Login() {
  const dispatch = useDispatch();

  const auth = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      rememberMe: getCookie("rememberMe") || "N",
    },
  });

  const onSuccess = ({ authToken, user, dateFormat }) => {
    const rememberMe = getValues("rememberMe");

    dispatch(setUser(user));
    dispatch(setToken(authToken));
    if (rememberMe === "Y") {
      setCookie("rememberMe", "Y", 365);
    } else {
      setCookie("rememberMe", "N", 365);
    }
    dispatch(setShowLoginAnim(false));
  };

  const { mutate } = useLogin(onSuccess);

  const onSubmit = (form) => {
    mutate(form);
  };

  return (
    <form className="login-wrapper" onSubmit={handleSubmit(onSubmit)}>
      <div className="right">
        <span className="login-lorem">Welcome to Mini Banking App</span>
        <div className="form-container">
          <Col>
            <BankingInput
              name="username"
              control={control}
              placeholder="Username"
              error={errors.username}
              showUpperPlaceholder={true}
              formVerticalSpace={24}
            />
          </Col>
          <Col>
            <BankingInputPassword
              name="password"
              control={control}
              placeholder="Password"
              error={errors.password}
              showUpperPlaceholder={true}
              formVerticalSpace={20}
            />
          </Col>
          <Col>
            <BankingCheckbox
              name="rememberMe"
              control={control}
              label="Remember me"
              setValue={setValue}
              className="remember-me"
              formVerticalSpace={20}
            />
          </Col>
          <Col>
            <button type="submit" className="login-button">
              <span>Login</span>
            </button>
          </Col>
        </div>
      </div>
    </form>
  );
}

export default Login;
