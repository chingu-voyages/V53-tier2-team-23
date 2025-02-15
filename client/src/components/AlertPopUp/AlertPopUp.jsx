import React from 'react';
import styles from './AlertPopUp.module.css';

const customStyles = {
  alert: styles.alert,
  alertModal: styles.alertModal,
  alertModalContent: styles['alert-modal-content'],
  alertWrapperClass: styles['alert-wrapper'],
  alertCloseIcon: styles['alert-close-icon'],
  dFlex: styles['d-flex'],
  alertStatusIcon: styles['alert-status-icon'],
  alertDialogue: styles['alert-dialogue'],
  alertText: styles['alert-text'],
  alertQuote: styles['alert-quote'],
  mbZero: styles['mb-0'],
  hightLight: styles['hightlight'],
  closeAlertBtn: styles['close-alert-btn'],
};

const {
  alert,
  alertModal,
  alertModalContent,
  alertWrapperClass,
  alertCloseIcon,
  dFlex,
  alertStatusIcon,
  alertDialogue,
  alertText,
  alertQuote,
  mbZero,
  hightLight,
  closeAlertBtn,
} = customStyles;

function AlertPopUp({ setShowAlert, showAlert }) {
  function closeAlert() {
    setShowAlert({ message: '', status: false });
  }
  const messageParts = showAlert.message.split('no allergies');
  return (
    <div className={alert}>
      <div className={alertModal}>
        <div className={alertModalContent}>
          <div id='alertWrapper' className={alertWrapperClass}>
            <button onClick={closeAlert} className={alertCloseIcon}>
              ×
            </button>
            <div className={dFlex}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='35'
                height='35'
                viewBox='0 0 24 24'
                fill='#de1327'
                className={alertStatusIcon}
              >
                <path d='M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z'></path>
              </svg>
              <div className={alertDialogue}>
                <h3 className={alertText}>Alert</h3>
                <p className={`${alertQuote} ${mbZero}`}>
                  {messageParts[0].replace('"', '')}
                  <span className={hightLight}>no allergies</span>
                  {messageParts[1].replace('"', '')}
                </p>
                <button
                  onClick={closeAlert}
                  type='button'
                  className={closeAlertBtn}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertPopUp;
