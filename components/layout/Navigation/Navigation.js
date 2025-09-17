// 📁 파일 위치: src/components/layout/Navigation/Navigation.js

import React, { useState, useEffect } from 'react';
import { 
    Home,
    Shield,
    Activity,
    Eye,
    Database,
    Cloud,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Zap,
    Target,
    BarChart3,
    AlertTriangle,
    Server,
    Lock
} from 'lucide-react';
import './Navigation.css';

const Navigation = ({ 
    currentPage = 'dashboard',
    onNavigate,
    collapsed = false,
    onToggleCollapse
}) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [systemMetrics, setSystemMetrics] = useState({
        threats: 0,
        blocked: 0,
        scans: 0
    });

    // 시스템 메트릭 업데이트 시뮬레이션
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemMetrics(prev => ({
                threats: Math.floor(Math.random() * 100),
                blocked: Math.floor(Math.random() * 50),
                scans: Math.floor(Math.random() * 20)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const navigationItems = [
        {
            id: 'dashboard',
            label: '메인 대시보드',
            icon: Home,
            path: '/dashboard',
            badge: null,
            description: '실시간 시스템 현황'
        },
        {
            id: 'security',
            label: '보안 모니터링',
            icon: Shield,
            path: '/security',
            badge: systemMetrics.threats > 0 ? systemMetrics.threats : null,
            description: '위협 탐지 및 차단'
        },
        {
            id: 'threats',
            label: '위협 분석',
            icon: AlertTriangle,
            path: '/threats',
            badge: systemMetrics.blocked > 0 ? systemMetrics.blocked : null,
            description: '공격 패턴 분석'
        },
        {
            id: 'monitoring',
            label: 'AWS 모니터링',
            icon: Cloud,
            path: '/monitoring',
            badge: null,
            description: 'AWS 서비스 상태',
            submenu: [
                { id: 'lambda', label: 'Lambda', icon: Zap },
                { id: 'dynamodb', label: 'DynamoDB', icon: Database },
                { id: 'waf', label: 'WAF', icon: Shield },
                { id: 'guardduty', label: 'GuardDuty', icon: Eye }
            ]
        },
        {
            id: 'analytics',
            label: '분석 리포트',
            icon: BarChart3,
            path: '/analytics',
            badge: null,
            description: '통계 및 보고서'
        },
        {
            id: 'battle',
            label: 'AI 전투 로그',
            icon: Target,
            path: '/battle',
            badge: systemMetrics.scans > 0 ? systemMetrics.scans : null,
            description: 'AI vs AI 배틀'
        },
        {
            id: 'system',
            label: '시스템 관리',
            icon: Server,
            path: '/system',
            badge: null,
            description: '시스템 설정 및 관리'
        }
    ];

    const bottomItems = [
        {
            id: 'settings',
            label: '환경 설정',
            icon: Settings,
            path: '/settings',
            description: '시스템 환경설정'
        },
        {
            id: 'help',
            label: '도움말',
            icon: HelpCircle,
            path: '/help',
            description: '사용자 가이드'
        }
    ];

    const handleItemClick = (item) => {
        if (onNavigate) {
            onNavigate(item.id, item.path);
        }
    };

    const renderNavigationItem = (item, isBottom = false) => {
        const isActive = currentPage === item.id;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const IconComponent = item.icon;

        return (
            <div key={item.id} className="nav-item-container">
                <div
                    className={`nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <div className="nav-item-content">
                        <div className="nav-icon-wrapper">
                            <IconComponent className="nav-icon" />
                            {item.badge && (
                                <span className="nav-badge">{item.badge}</span>
                            )}
                        </div>

                        {!collapsed && (
                            <>
                                <div className="nav-text">
                                    <span className="nav-label">{item.label}</span>
                                    <span className="nav-description">{item.description}</span>
                                </div>
                                
                                {hasSubmenu && (
                                    <ChevronRight className="nav-arrow" />
                                )}
                            </>
                        )}
                    </div>

                    {/* 호버 툴팁 (collapsed 모드일 때) */}
                    {collapsed && hoveredItem === item.id && (
                        <div className="nav-tooltip">
                            <div className="tooltip-content">
                                <div className="tooltip-title">{item.label}</div>
                                <div className="tooltip-description">{item.description}</div>
                                {item.badge && (
                                    <div className="tooltip-badge">알림: {item.badge}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 활성화 표시기 */}
                    {isActive && <div className="nav-active-indicator" />}
                </div>

                {/* 서브메뉴 */}
                {hasSubmenu && !collapsed && (
                    <div className="nav-submenu">
                        {item.submenu.map(subItem => {
                            const SubIconComponent = subItem.icon;
                            return (
                                <div
                                    key={subItem.id}
                                    className="nav-subitem"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick({ ...subItem, parent: item.id });
                                    }}
                                >
                                    <SubIconComponent className="nav-subicon" />
                                    <span className="nav-sublabel">{subItem.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className={`cyber-navigation ${collapsed ? 'collapsed' : ''}`}>
            {/* 토글 버튼 */}
            <div className="nav-header">
                <button 
                    className="nav-toggle"
                    onClick={onToggleCollapse}
                    title={collapsed ? "네비게이션 확장" : "네비게이션 축소"}
                >
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>

                {!collapsed && (
                    <div className="nav-title">
                        <Lock className="nav-title-icon" />
                        <span>시스템 메뉴</span>
                    </div>
                )}
            </div>

            {/* 실시간 상태 표시 */}
            {!collapsed && (
                <div className="nav-status">
                    <div className="status-item">
                        <Activity className="status-icon" />
                        <div className="status-info">
                            <span className="status-label">실시간 위협</span>
                            <span className="status-value">{systemMetrics.threats}</span>
                        </div>
                    </div>
                    <div className="status-item">
                        <Shield className="status-icon" />
                        <div className="status-info">
                            <span className="status-label">차단 완료</span>
                            <span className="status-value">{systemMetrics.blocked}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 메인 네비게이션 */}
            <div className="nav-main">
                <div className="nav-section">
                    {!collapsed && (
                        <div className="nav-section-title">메인 기능</div>
                    )}
                    <div className="nav-items">
                        {navigationItems.map(item => renderNavigationItem(item))}
                    </div>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <div className="nav-bottom">
                {!collapsed && (
                    <div className="nav-section-title">시스템</div>
                )}
                <div className="nav-items">
                    {bottomItems.map(item => renderNavigationItem(item, true))}
                </div>
            </div>

            {/* 배경 스캔 라인 */}
            <div className="nav-scan-lines">
                <div className="scan-line scan-line-1"></div>
                <div className="scan-line scan-line-2"></div>
                <div className="scan-line scan-line-3"></div>
            </div>
        </nav>
    );
};

export default Navigation;