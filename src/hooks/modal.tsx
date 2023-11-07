import {useState} from "react";

export const useModal = (defaultState = false) => {

  const [isOpen, setIsOpen] = useState(defaultState);

  const toggle = () => setIsOpen(s => !s);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {isOpen, toggle, open, close};
};
