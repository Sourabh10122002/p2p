import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    // Mapping variants to our new CSS classes
    const variantClass = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        gradient: 'btn-gradient',
        outline: 'btn-secondary', // Fallback for outline to secondary style for now
    }[variant] || 'btn-primary';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn ${variantClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
