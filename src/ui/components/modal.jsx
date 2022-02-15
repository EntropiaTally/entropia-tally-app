import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ type, title, isOpen, closeModal, className, children }) => (
  <div className={`modal ${isOpen ? 'is-active' : ''} ${className}`}>
    <div className="modal-background" />
    {type === 'simple' && (
      <div className="modal-content">
        <div className="box">
          {children}
        </div>
      </div>
    )}
    {type === 'card' && (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title ? title : '-'}</p>
          <button type="button" className="delete" aria-label="close" onClick={() => closeModal()} />
        </header>
        <section className="modal-card-body content">
          {children}
        </section>
      </div>
    )}
  </div>
);

Modal.defaultProps = {
  type: 'simple',
  title: null,
  isOpen: false,
  className: '',
};

Modal.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any,
};

export default Modal;
