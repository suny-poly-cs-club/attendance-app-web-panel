// import {
//   type FC,
//   type MouseEventHandler,
//   type ReactEventHandler,
//   type ReactNode,
//   useCallback,
//   useEffect,
//   useRef,
// } from 'react';
//
// import styles from './Modal.module.css';
//
// const Modal: FC<{
//   isOpen: boolean;
//   children: ReactNode;
//   onClose: () => void;
//   closeOnClickOutside?: boolean;
//   title: string;
// }> = ({isOpen, children, title, onClose, closeOnClickOutside = true}) => {
//   const ref = useRef<HTMLDialogElement>(null);
//
//   const onClick: MouseEventHandler = useCallback(
//     event => {
//       if (closeOnClickOutside && event.target === ref.current) {
//         onClose();
//       }
//     },
//     [onClose, closeOnClickOutside]
//   );
//
//   const onCancel: ReactEventHandler<HTMLDialogElement> = useCallback(
//     event => {
//       event.preventDefault();
//       onClose();
//     },
//     [onClose]
//   );
//
//   useEffect(() => {
//     if (isOpen) {
//       ref.current?.showModal();
//     } else {
//       ref.current?.close();
//     }
//   }, [isOpen]);
//
//   return (
//     <dialog
//       ref={ref}
//       className={styles.modal}
//       onClick={onClick}
//       onCancel={onCancel}
//       onKeyDown{}
//     >
//       <div className={styles.container}>
//         <h1 className={styles.title}>{title}</h1>
//
//         <hr className={styles.sectionDivider} />
//
//         {children}
//       </div>
//     </dialog>
//   );
// };
// export default Modal;
