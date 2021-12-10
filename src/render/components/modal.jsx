import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ style, title, isOpen, closeModal, children }) => (
  <div className={`modal ${isOpen ? 'is-active' : ''}`}>
    <div className="modal-background" />
    {style === 'simple' && (
      <div className="modal-content">
        <div className="box">
          {children}
        </div>
      </div>
    )}
    {style === 'card' && (
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
  style: 'simple',
  title: null,
  isOpen: false,
};

Modal.propTypes = {
  style: PropTypes.string,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  children: PropTypes.any,
};

export default Modal;
