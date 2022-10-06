import { ReactNode } from 'react';

import styles from './BaseModal.module.scss';

interface IBaseModalProps {
  title: string;
  onDismiss?: () => void;
  children: ReactNode;
}

const BaseModal = ({ title, onDismiss, children }: IBaseModalProps) => {
  return (
    <div className={ styles.modal }>
      <div className={ styles['modal__backdrop'] } onClick={ onDismiss }></div>

      <div className={ styles['modal__container'] }>
        <header className={ styles['modal__header'] }>
          <h2>{ title }</h2>

          <button
            type="button"
            className="btn"
            data-variant="burger"
            onClick={ onDismiss }
          >
            <span className="sr-only">Close Modal</span>
          </button>
        </header>

        <div className={ styles['modal__body'] }>
          { children }
        </div>
      </div>
    </div>
  );
};

export default BaseModal;