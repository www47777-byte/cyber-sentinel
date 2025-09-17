import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

const ProgressBar = ({
    value = 0, // 0-100
    max = 100,
    size = 'medium', // small, medium, large
    variant = 'primary', // primary, success, warning, danger, info
    showLabel = true,
    showPercentage = true,
    label = '',
    animated = true,
    striped = false,
    glowing = false,
    className = '',
    ...props
}) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    // 부드러운 애니메이션을 위한 값 보간
    useEffect(() => {
        if (!animated) {
            setAnimatedValue(value);
            return;
        }

        const startValue = animatedValue;
        const endValue = Math.min(Math.max(value, 0), max);
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutCubic 이징
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (endValue - startValue) * eased;

            setAnimatedValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, max, animated]);

    const percentage = Math.round((animatedValue / max) * 100);
    const clampedValue = Math.min(Math.max(animatedValue, 0), max);

    const progressClasses = [
        'cyber-progress',
        `cyber-progress--${size}`,
        `cyber-progress--${variant}`,
        striped && 'cyber-progress--striped',
        glowing && 'cyber-progress--glowing',
        animated && 'cyber-progress--animated',
        className
    ].filter(Boolean).join(' ');

    // 값에 따른 자동 색상 결정
    const getVariantByValue = (val) => {
        if (variant !== 'primary') return variant;
        if (val >= 80) return 'success';
        if (val >= 60) return 'primary';
        if (val >= 40) return 'warning';
        return 'danger';
    };

    const currentVariant = getVariantByValue(percentage);

    return (
        <div className={`${progressClasses} cyber-progress--${currentVariant}`} {...props}>
            {(showLabel || label) && (
                <div className="cyber-progress__header">
                    <span className="cyber-progress__label">
                        {label || `진행률`}
                    </span>
                    {showPercentage && (
                        <span className="cyber-progress__percentage">
                            {percentage}%
                        </span>
                    )}
                </div>
            )}
            
            <div className="cyber-progress__track">
                <div 
                    className="cyber-progress__fill"
                    style={{ 
                        '--progress-value': `${(clampedValue / max) * 100}%`,
                        '--progress-color': `var(--color-${currentVariant})`
                    }}
                >
                    <div className="cyber-progress__shine"></div>
                    {striped && <div className="cyber-progress__stripes"></div>}
                </div>
                
                {glowing && (
                    <div className="cyber-progress__glow" 
                         style={{ width: `${(clampedValue / max) * 100}%` }}>
                    </div>
                )}
            </div>

            {/* 세그먼트 표시 (25%, 50%, 75%) */}
            <div className="cyber-progress__segments">
                <div className="cyber-progress__segment" style={{ left: '25%' }}></div>
                <div className="cyber-progress__segment" style={{ left: '50%' }}></div>
                <div className="cyber-progress__segment" style={{ left: '75%' }}></div>
            </div>
        </div>
    );
};

export default ProgressBar;