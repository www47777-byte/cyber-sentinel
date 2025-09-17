// 📁 파일 위치: src/components/layout/Header/Header.js

import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Bell, 
    Settings, 
    User, 
    Power, 
    Volume2, 
    VolumeX,
    Wifi,
    WifiOff,
    Activity
} from 'lucide-react';
import './Header.css';

const Header = ({ 
    userInfo = { name: 'DefenseAI Guardian', role: 'System Administrator' },
    systemStatus = { connected: true, threats: 0, notifications: 3 },
    onLogout,
    onSettings,
    onToggleSound,
    soundEnabled = true
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [networkStatus, setNetworkStatus] = useState('online');

    // 실시간 시계 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 네트워크 상태 체크
    useEffect(() => {
        const checkNetwork = () => {
            setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        };

        window.addEventListener('online', checkNetwork);
        window.addEventListener('offline', checkNetwork);

        return () => {
            window.removeEventListener('online', checkNetwork);
            window.removeEventListener('offline', checkNetwork);
        };
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const getThreatLevelColor = (threats) => {
        if (threats === 0) return '#00ff41';
        if (threats < 5) return '#ffaa00';
        return '#ff0040';
    };

    const getSystemStatusText = () => {
        if (!systemStatus.connected) return '연결 끊김';
        if (systemStatus.threats > 0) return '위협 감지됨';
        return '시스템 정상';
    };

    return (
        <header className="cyber-header">
            {/* 왼쪽 로고 영역 */}
            <div className="header-left">
                <div className="logo-section">
                    <Shield className="logo-icon" />
                    <div className="logo-text">
                        <h1 className="logo-title">DefenseAI</h1>
                        <span className="logo-subtitle">Guardian System</span>
                    </div>
                </div>
            </div>

            {/* 중앙 시스템 상태 영역 */}
            <div className="header-center">
                <div className="system-status">
                    <div className="status-indicator">
                        <div 
                            className={`status-dot ${systemStatus.connected ? 'online' : 'offline'}`}
                            style={{ 
                                backgroundColor: systemStatus.connected ? '#00ff41' : '#ff0040',
                                boxShadow: `0 0 10px ${systemStatus.connected ? '#00ff41' : '#ff0040'}`
                            }}
                        />
                        <span className="status-text">{getSystemStatusText()}</span>
                    </div>

                    <div className="threat-counter">
                        <Activity className="threat-icon" />
                        <span 
                            className="threat-count"
                            style={{ color: getThreatLevelColor(systemStatus.threats) }}
                        >
                            위협: {systemStatus.threats}
                        </span>
                    </div>

                    <div className="network-status">
                        {networkStatus === 'online' ? (
                            <Wifi className="network-icon online" />
                        ) : (
                            <WifiOff className="network-icon offline" />
                        )}
                        <span className={`network-text ${networkStatus}`}>
                            {networkStatus === 'online' ? '네트워크 연결됨' : '네트워크 오프라인'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 오른쪽 사용자 & 컨트롤 영역 */}
            <div className="header-right">
                {/* 날짜/시간 */}
                <div className="datetime-section">
                    <div className="current-time">{formatTime(currentTime)}</div>
                    <div className="current-date">{formatDate(currentTime)}</div>
                </div>

                {/* 알림 */}
                <div className="notification-section">
                    <button className="notification-btn">
                        <Bell className="notification-icon" />
                        {systemStatus.notifications > 0 && (
                            <span className="notification-badge">
                                {systemStatus.notifications}
                            </span>
                        )}
                    </button>
                </div>

                {/* 사운드 토글 */}
                <div className="sound-section">
                    <button 
                        className="sound-btn"
                        onClick={onToggleSound}
                        title={soundEnabled ? "사운드 끄기" : "사운드 켜기"}
                    >
                        {soundEnabled ? <Volume2 /> : <VolumeX />}
                    </button>
                </div>

                {/* 설정 */}
                <div className="settings-section">
                    <button 
                        className="settings-btn"
                        onClick={onSettings}
                        title="시스템 설정"
                    >
                        <Settings className="settings-icon" />
                    </button>
                </div>

                {/* 사용자 정보 */}
                <div className="user-section">
                    <div className="user-info">
                        <div className="user-name">{userInfo.name}</div>
                        <div className="user-role">{userInfo.role}</div>
                    </div>
                    <div className="user-avatar">
                        <User className="user-icon" />
                    </div>
                </div>

                {/* 로그아웃 */}
                <div className="logout-section">
                    <button 
                        className="logout-btn"
                        onClick={onLogout}
                        title="시스템 종료"
                    >
                        <Power className="logout-icon" />
                    </button>
                </div>
            </div>

            {/* 배경 애니메이션 */}
            <div className="header-background-animation">
                <div className="scan-line"></div>
                <div className="cyber-grid"></div>
            </div>
        </header>
    );
};

export default Header;