// SimpleModal.js
import React from 'react';

const SimpleModal = ({ open, message, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>Confirm Action</h2>
                </div>
                <div style={styles.content}>
                    <p>{message}</p>
                </div>
                <div style={styles.actions}>
                    <button onClick={onConfirm} style={{ ...styles.button, ...styles.confirmButton }}>Confirm</button>
                    <button onClick={onCancel} style={{ ...styles.button, ...styles.cancelButton }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        minWidth: '300px',
    },
    header: {
        marginBottom: '15px',
    },
    content: {
        marginBottom: '20px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        padding: '10px 20px',
        margin: '0 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: '#a333c8',
        color: 'white',
    },
    cancelButton: {
        backgroundColor: '#db2828',
        color: 'white',
    }
};

export default SimpleModal;
