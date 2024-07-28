// Login.tsx
import { Button } from "../UI/Button/Button";
import "./auth.css";
import { useForm } from "react-hook-form";
import React from "react";
import { useLoginMutation } from "../store/action/actionApi";
import { useTokenContext } from "../hook/useTokenContext";

type LoginProps = {
  closeLoginModal: () => void;
};
type FormDataType = {
  username: string;
  password: string;
  access_token: string;
};

export function Login({ closeLoginModal }: LoginProps) {
  const [loginUser, { error }] = useLoginMutation();
  const { setToken } = useTokenContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>();

  const onSubmit = async (data: FormDataType) => {
    const token = await loginUser(data);
    if (token.data?.access_token) {
      localStorage.setItem("token", token.data?.access_token);
      setToken(token.data?.access_token);
      closeLoginModal();
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          {...register("username", { required: true })}
          placeholder="Логин"
          className={errors.username ? "form-input error" : "form-input"}
          value="string"
        />
      </div>
      <div className="form-group">
        <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="Пароль"
          className={errors.password ? "form-input error" : "form-input"}
          value="string"
        />
      </div>
      <div className="form-btn__group">
        <Button text="Войти" />
        {error && <p className="error-message">Ошибка при входе</p>}
      </div>
    </form>
  );
}
