import React from 'react';
import './Card.css';

const Card = ({
    children,
    title = '',
    subtitle = '',
    variant = 'default', // default, primary, success, warning, danger, glass
    size = 'medium', // small, medium, large
    hoverable = false,
    clickable = false,
    glowing = false,
    animated = false,
    header = null,
    footer = null,
    icon = null,
    className = '',
    onClick,
    ...props
}) => {
    const cardClasses = [
        'cyber-card',
        `cyber-card--${variant}`,
        `cyber-card--${size}`,
        hoverable && 'cyber-card--hoverable',
        clickable && 'cyber-card--clickable',
        glowing && 'cyber-card--glowing',
        animated && 'cyber-card--animated',
        className
    ].filter(Boolean).join(' ');

    const handleClick = (e) => {
        if (clickable && onClick) {
            onClick(e);
        }
    };

    const hasHeader = title || subtitle || icon || header;

    return (
        <div 
            className={cardClasses}
            onClick={handleClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            {...props}
        >
            {/* 카드 글로우 효과 */}
            {glowing && <div className="cyber-card__glow"></div>}
            
            {/* 카드 헤더 */}
            {hasHeader && (
                <div className="cyber-card__header">
                    {header ? (
                        header
                    ) : (
                        <>
                            {icon && (
                                <div className="cyber-card__icon">
                                    {icon}
                                </div>
                            )}
                            <div className="cyber-card__header-content">
                                {title && (
                                    <h3 className="cyber-card__title">{title}</h3>
                                )}
                                {subtitle && (
                                    <p className="cyber-card__subtitle">{subtitle}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* 카드 본문 */}
            <div className="cyber-card__body">
                {children}
            </div>

            {/* 카드 푸터 */}
            {footer && (
                <div className="cyber-card__footer">
                    {footer}
                </div>
            )}

            {/* 테두리 애니메이션 */}
            {animated && (
                <div className="cyber-card__border-animation"></div>
            )}

            {/* 리플 효과 */}
            {clickable && (
                <div className="cyber-card__ripple"></div>
            )}
        </div>
    );
};

// 카드 헤더 컴포넌트
const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`cyber-card__header ${className}`} {...props}>
        {children}
    </div>
);

// 카드 본문 컴포넌트
const CardBody = ({ children, className = '', ...props }) => (
    <div className={`cyber-card__body ${className}`} {...props}>
        {children}
    </div>
);

// 카드 푸터 컴포넌트
const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`cyber-card__footer ${className}`} {...props}>
        {children}
    </div>
);

// 내보내기
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;