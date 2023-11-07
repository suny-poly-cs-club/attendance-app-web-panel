import {FC, MouseEventHandler, ReactEventHandler, ReactNode, useCallback, useEffect, useRef} from "react";

import {Cross1Icon} from '@radix-ui/react-icons';

import styles from './Modal.module.css';

const Modal: FC<{
  isOpen: boolean;
  children: ReactNode
  onClose: () => void;
  closeOnClickOutside?: boolean
  title: string;
}> = ({isOpen, children, title, onClose, closeOnClickOutside = true}) => {
  const ref = useRef<HTMLDialogElement>(null);

  const onClick: MouseEventHandler = useCallback(event => {
    if (closeOnClickOutside && event.target === ref.current) {
      onClose();
    }
  }, [onClose]);

  const onCancel: ReactEventHandler<HTMLDialogElement> = useCallback(event => {
    event.preventDefault();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen])

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      onClick={onClick}
      onCancel={onCancel}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>
          {title}
        </h1>

        <Cross1Icon
          className={styles.closeIcon}
          role="button"
          onClick={() => onClose()}
        />

        <hr className={styles.sectionDivider} />

        {children}
      </div>
    </dialog>
  )
}
export default Modal;
