import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary', // primary, secondary, danger, success, warning, ghost
    size = 'medium', // small, medium, large
    disabled = false,
    loading = false,
    icon = null,
    iconPosition = 'left', // left, right
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const handleClick = (e) => {
        if (disabled || loading) return;
        onClick?.(e);
    };

    const buttonClasses = [
        'cyber-button',
        `cyber-button--${variant}`,
        `cyber-button--${size}`,
        fullWidth && 'cyber-button--full-width',
        disabled && 'cyber-button--disabled',
        loading && 'cyber-button--loading',
        className
    ].filter(Boolean).join(' ');

    const renderIcon = (position) => {
        if (loading && position === 'left') {
            return <Loader2 className="cyber-button__icon cyber-button__icon--loading" size={16} />;
        }
        if (icon && iconPosition === position) {
            return <span className="cyber-button__icon">{icon}</span>;
        }
        return null;
    };

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={handleClick}
            disabled={disabled || loading}
            {...props}
        >
            <span className="cyber-button__content">
                {renderIcon('left')}
                <span className="cyber-button__text">{children}</span>
                {renderIcon('right')}
            </span>
            <div className="cyber-button__glow"></div>
            <div className="cyber-button__ripple"></div>
        </button>
    );
};

export default Button;