// 📁 파일 위치: src/App.js

import React, { useState } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './screens/Dashboard/Dashboard';
import LambdaMonitor from './screens/MonitoringScreens/AWSMonitoring/LambdaMonitor';
import DynamoDBMonitor from './screens/MonitoringScreens/AWSMonitoring/DynamoDBMonitor';
import WAFMonitor from './screens/MonitoringScreens/AWSMonitoring/WAFMonitor';
import GuardDutyMonitor from './screens/MonitoringScreens/AWSMonitoring/GuardDutyMonitor';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // 페이지 네비게이션 핸들러
    const handleNavigate = (pageId, path) => {
        setCurrentPage(pageId);
        console.log(`네비게이션: ${pageId} (${path})`);
    };

    // 사용자 정보
    const userInfo = {
        name: 'DefenseAI Guardian',
        role: 'System Administrator'
    };

    // 시스템 상태
    const systemStatus = {
        connected: true,
        threats: 5,
        notifications: 3
    };

    // 현재 페이지 렌더링
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'lambda':
                return <LambdaMonitor />;
            case 'dynamodb':
                return <DynamoDBMonitor />;
            case 'waf':
                return <WAFMonitor />;
            case 'guardduty':
                return <GuardDutyMonitor />;
            case 'security':
                return (
                    <div className="page-placeholder">
                        <h2>🛡️ 보안 모니터링</h2>
                        <p>보안 모니터링 페이지 개발 중...</p>
                    </div>
                );
            case 'threats':
                return (
                    <div className="page-placeholder">
                        <h2>🚨 위협 분석</h2>
                        <p>위협 분석 페이지 개발 중...</p>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="page-placeholder">
                        <h2>📊 분석 리포트</h2>
                        <p>분석 리포트 페이지 개발 중...</p>
                    </div>
                );
            case 'battle':
                return (
                    <div className="page-placeholder">
                        <h2>⚔️ AI 전투 로그</h2>
                        <p>AI 전투 로그 페이지 개발 중...</p>
                    </div>
                );
            case 'system':
                return (
                    <div className="page-placeholder">
                        <h2>🔧 시스템 관리</h2>
                        <p>시스템 관리 페이지 개발 중...</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="page-placeholder">
                        <h2>⚙️ 환경 설정</h2>
                        <p>환경 설정 페이지 개발 중...</p>
                    </div>
                );
            case 'help':
                return (
                    <div className="page-placeholder">
                        <h2>❓ 도움말</h2>
                        <p>도움말 페이지 개발 중...</p>
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="App">
            {/* 헤더 */}
            <Header
                userInfo={userInfo}
                systemStatus={systemStatus}
                onLogout={() => alert('로그아웃')}
                onSettings={() => handleNavigate('settings', '/settings')}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                soundEnabled={soundEnabled}
            />

            {/* 네비게이션 */}
            <Navigation
                currentPage={currentPage}
                onNavigate={handleNavigate}
                collapsed={navCollapsed}
                onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
            />

            {/* 메인 콘텐츠 */}
            <main className={`main-content ${navCollapsed ? 'nav-collapsed' : ''}`}>
                {renderCurrentPage()}
            </main>
        </div>
    );
}

export default App;