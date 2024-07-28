import React, { useRef, useEffect, useCallback } from "react";
import "./dropdown.css";

interface DropdownProps {
  options: string[];
  onSelect: (option: string | boolean) => void;
  isOpen: boolean;
  selectedOption: string | null;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  isOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    onSelect(option);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onSelect(false);
      }
    },
    [onSelect]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-menu-item"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
