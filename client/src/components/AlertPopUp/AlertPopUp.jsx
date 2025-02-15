import React from 'react';
import styles from './AlertPopUp.module.css';

function AlertPopUp({ setShowAlert, showAlert }) {
  function closeAlert() {
    setShowAlert({ message: '', status: false });
  }
  const messageParts = showAlert.message.split('no allergies');
  return (
    <div className='alert'>
      <div className='alertModal'>
        <div className='alert-modal-content'>
          <div id='alertWrapper' className='alert-wrapper'>
            <button onClick={closeAlert} className='alert-close-icon'>
              ×
            </button>
            <div className='d-flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='35'
                height='35'
                viewBox='0 0 24 24'
                fill='#de1327'
                className='alert-status-icon'
              >
                <path d='M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z'></path>
              </svg>
              <div className='alert-dialogue'>
                <h3 className='alert-text'>Alert</h3>
                <p className='alert-quote mb-0'>
                  {messageParts[0].replace('"', '')}
                  <span className='highlight'>no allergies</span>
                  {messageParts[1].replace('"', '')}
                </p>
                <button
                  onClick={closeAlert}
                  type='button'
                  className='close-alert-btn'
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
