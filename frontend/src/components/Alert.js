import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
    if (!message) return null;

    return (
        <div className={`alert alert-${type}`}>
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;
