import { Login } from "../Auth/Login";
import { Modal } from "../Modal/Modal";
import { useModal } from "../hook/useModal";
import "./header.css";
import search from "/public/image/search.png";
import user from "/public/image/user.png";
import arrow from "/public/image/arrow.png";
import { useTokenContext } from "../hook/useTokenContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/public/image/logo.png";
import React from "react";

interface HeaderProps {
  onSearchInputChange: (value: string) => void;
}
export function Header({ onSearchInputChange }: HeaderProps) {
  const {
    isOpen: isOpenLogin,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
  } = useModal();
  const { token } = useTokenContext();
  console.log(token);

  const [value, setValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onSearchInputChange(inputValue);
  };

  return (
    <header className="header">
      <div className="aside-header">
        <Link to="/" className="aside-logo">
          <img src={logo} alt="Логотип" />
        </Link>
      </div>
      <div className="header-search">
        <img src={search} alt="search" />
        <input
          type="text"
          className="header-input"
          placeholder="Что будем искать?"
          value={value}
          onChange={handleInputChange}
        />
      </div>
      {token ? (
        <div className="header-user">
          <div className="header-user__content">
            <img src={user} alt="user" />
            <p className="header-user__name">User</p>
          </div>
          <img src={arrow} alt="arrow" />
        </div>
      ) : (
        <button className="header-btn" onClick={openLoginModal}>
          Войти
        </button>
      )}
      {isOpenLogin && (
        <Modal onClose={closeLoginModal}>
          <Login closeLoginModal={closeLoginModal} />
        </Modal>
      )}
    </header>
  );
}
