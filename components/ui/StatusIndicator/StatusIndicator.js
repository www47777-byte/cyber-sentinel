import React from 'react';
import { 
    CheckCircle, 
    AlertCircle, 
    XCircle, 
    Clock, 
    Zap, 
    Shield,
    Activity,
    Wifi,
    WifiOff
} from 'lucide-react';
import './StatusIndicator.css';

const StatusIndicator = ({
    status = 'idle', // idle, loading, success, warning, error, online, offline, active, inactive
    size = 'medium', // small, medium, large
    variant = 'dot', // dot, icon, badge, pulse
    label = '',
    showLabel = true,
    animated = true,
    className = '',
    ...props
}) => {
    // 상태별 설정
    const statusConfig = {
        idle: {
            color: 'var(--text-muted)',
            icon: <Clock size={16} />,
            text: label || '대기 중',
            bgColor: 'rgba(128, 128, 128, 0.1)'
        },
        loading: {
            color: 'var(--primary-blue)',
            icon: <Activity size={16} />,
            text: label || '로딩 중',
            bgColor: 'var(--info-bg)'
        },
        success: {
            color: 'var(--success-green)',
            icon: <CheckCircle size={16} />,
            text: label || '성공',
            bgColor: 'var(--success-bg)'
        },
        warning: {
            color: 'var(--warning-yellow)',
            icon: <AlertCircle size={16} />,
            text: label || '경고',
            bgColor: 'var(--warning-bg)'
        },
        error: {
            color: 'var(--danger-red)',
            icon: <XCircle size={16} />,
            text: label || '오류',
            bgColor: 'var(--danger-bg)'
        },
        online: {
            color: 'var(--success-green)',
            icon: <Wifi size={16} />,
            text: label || '온라인',
            bgColor: 'var(--success-bg)'
        },
        offline: {
            color: 'var(--text-muted)',
            icon: <WifiOff size={16} />,
            text: label || '오프라인',
            bgColor: 'rgba(128, 128, 128, 0.1)'
        },
        active: {
            color: 'var(--primary-blue)',
            icon: <Zap size={16} />,
            text: label || '활성',
            bgColor: 'var(--info-bg)'
        },
        inactive: {
            color: 'var(--text-muted)',
            icon: <Shield size={16} />,
            text: label || '비활성',
            bgColor: 'rgba(128, 128, 128, 0.1)'
        }
    };

    const config = statusConfig[status] || statusConfig.idle;

    const indicatorClasses = [
        'cyber-status',
        `cyber-status--${size}`,
        `cyber-status--${variant}`,
        `cyber-status--${status}`,
        animated && 'cyber-status--animated',
        className
    ].filter(Boolean).join(' ');

    const renderIndicator = () => {
        switch (variant) {
            case 'icon':
                return (
                    <div className="cyber-status__icon" style={{ color: config.color }}>
                        {config.icon}
                    </div>
                );
            
            case 'badge':
                return (
                    <div 
                        className="cyber-status__badge"
                        style={{ 
                            color: config.color,
                            backgroundColor: config.bgColor,
                            borderColor: config.color
                        }}
                    >
                        <div className="cyber-status__badge-dot"></div>
                        <span className="cyber-status__badge-text">{config.text}</span>
                    </div>
                );
            
            case 'pulse':
                return (
                    <div className="cyber-status__pulse-container">
                        <div 
                            className="cyber-status__pulse-dot"
                            style={{ backgroundColor: config.color }}
                        ></div>
                        <div 
                            className="cyber-status__pulse-ring"
                            style={{ borderColor: config.color }}
                        ></div>
                    </div>
                );
            
            default: // dot
                return (
                    <div 
                        className="cyber-status__dot"
                        style={{ backgroundColor: config.color }}
                    ></div>
                );
        }
    };

    return (
        <div className={indicatorClasses} {...props}>
            {renderIndicator()}
            
            {showLabel && variant !== 'badge' && (
                <span 
                    className="cyber-status__label"
                    style={{ color: config.color }}
                >
                    {config.text}
                </span>
            )}
            
            {/* 글로우 효과 */}
            {animated && (
                <div 
                    className="cyber-status__glow"
                    style={{ 
                        backgroundColor: config.color,
                        filter: `drop-shadow(0 0 8px ${config.color})`
                    }}
                ></div>
            )}
        </div>
    );
};

export default StatusIndicator;