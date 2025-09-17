// 📁 파일 위치: src/screens/MonitoringScreens/AWSMonitoring/WAFMonitor/WAFMonitor.js

import React, { useState, useEffect, useRef } from 'react';
import { 
    Shield, 
    Activity, 
    Ban, 
    CheckCircle, 
    AlertTriangle, 
    XCircle,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Download,
    Settings,
    BarChart3,
    Globe,
    Eye,
    Filter,
    Zap
} from 'lucide-react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './WAFMonitor.css';

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const WAFMonitor = () => {
    const [wafData, setWafData] = useState({
        rules: [],
        metrics: null,
        requests: [],
        topCountries: [],
        topAttacks: [],
        costs: null
    });
    const [selectedRule, setSelectedRule] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const intervalRef = useRef(null);

    // WAF 규칙 목록 데이터
    const mockRules = [
        {
            name: 'SQLInjectionRule',
            type: 'MANAGED',
            status: 'ENABLED',
            action: 'BLOCK',
            priority: 1,
            matches: 1247,
            blocks: 1247,
            allows: 0,
            lastTriggered: '2024-01-15T10:30:00Z',
            cloudFront: true,
            albArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/1234567890123456'
        },
        {
            name: 'XSSProtectionRule',
            type: 'MANAGED',
            status: 'ENABLED',
            action: 'BLOCK',
            priority: 2,
            matches: 892,
            blocks: 856,
            allows: 36,
            lastTriggered: '2024-01-15T09:45:00Z',
            cloudFront: true,
            albArn: null
        },
        {
            name: 'RateLimitRule',
            type: 'CUSTOM',
            status: 'ENABLED',
            action: 'BLOCK',
            priority: 3,
            matches: 2156,
            blocks: 1892,
            allows: 264,
            lastTriggered: '2024-01-15T10:25:00Z',
            cloudFront: false,
            albArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/1234567890123456'
        },
        {
            name: 'GeoBlockingRule',
            type: 'CUSTOM',
            status: 'ENABLED',
            action: 'BLOCK',
            priority: 4,
            matches: 567,
            blocks: 567,
            allows: 0,
            lastTriggered: '2024-01-15T08:15:00Z',
            cloudFront: true,
            albArn: null
        },
        {
            name: 'BotControlRule',
            type: 'MANAGED',
            status: 'DISABLED',
            action: 'COUNT',
            priority: 5,
            matches: 345,
            blocks: 0,
            allows: 345,
            lastTriggered: '2024-01-14T16:30:00Z',
            cloudFront: false,
            albArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/1234567890123456'
        }
    ];

    // 메트릭 데이터 생성
    const generateMetrics = () => {
        const now = new Date();
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 24;

        const requests = Array.from({ length: Math.floor(hours / interval) }, (_, i) => {
            const time = new Date(now.getTime() - (hours - i * interval) * 60 * 60 * 1000);
            const total = Math.floor(Math.random() * 5000) + 1000;
            const blocked = Math.floor(total * (Math.random() * 0.3 + 0.1)); // 10-40% 차단
            return {
                timestamp: time.toISOString(),
                time: time.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                total,
                blocked,
                allowed: total - blocked,
                inspected: total,
                rateLimited: Math.floor(blocked * 0.3),
                geoBlocked: Math.floor(blocked * 0.2)
            };
        });

        const totalRequests = requests.reduce((sum, req) => sum + req.total, 0);
        const totalBlocked = requests.reduce((sum, req) => sum + req.blocked, 0);
        const totalAllowed = requests.reduce((sum, req) => sum + req.allowed, 0);

        // 상위 공격 유형
        const topAttacks = [
            { type: 'SQL Injection', count: 1247, percentage: 28.5 },
            { type: 'XSS', count: 892, percentage: 20.4 },
            { type: 'Rate Limiting', count: 756, percentage: 17.3 },
            { type: 'Bot Traffic', count: 634, percentage: 14.5 },
            { type: 'Geo Blocking', count: 567, percentage: 13.0 },
            { type: 'CSRF', count: 234, percentage: 5.4 },
            { type: 'Other', count: 45, percentage: 1.0 }
        ];

        // 상위 국가
        const topCountries = [
            { country: '중국', code: 'CN', requests: 2156, blocked: 1892, percentage: 35.2 },
            { country: '러시아', code: 'RU', requests: 1567, blocked: 1234, percentage: 25.6 },
            { country: '브라질', code: 'BR', requests: 892, blocked: 567, percentage: 14.6 },
            { country: '인도', code: 'IN', requests: 634, blocked: 345, percentage: 10.4 },
            { country: '미국', code: 'US', requests: 456, blocked: 234, percentage: 7.5 },
            { country: '기타', code: 'XX', requests: 389, blocked: 156, percentage: 6.7 }
        ];

        return {
            requests,
            summary: {
                totalRequests,
                totalBlocked,
                totalAllowed,
                blockRate: ((totalBlocked / totalRequests) * 100).toFixed(1),
                allowRate: ((totalAllowed / totalRequests) * 100).toFixed(1)
            },
            topAttacks,
            topCountries,
            costs: {
                webACL: 1.00,
                requests: (totalRequests / 1000000 * 0.60).toFixed(2),
                rules: mockRules.length * 1.00,
                total: (1.00 + (totalRequests / 1000000 * 0.60) + mockRules.length * 1.00).toFixed(2)
            }
        };
    };

    // 데이터 로드
    const loadData = () => {
        setIsLoading(true);
        
        setTimeout(() => {
            const metrics = generateMetrics();
            setWafData({
                rules: mockRules,
                metrics: metrics.summary,
                requests: metrics.requests,
                topCountries: metrics.topCountries,
                topAttacks: metrics.topAttacks,
                costs: metrics.costs
            });
            
            if (!selectedRule && mockRules.length > 0) {
                setSelectedRule(mockRules[0]);
            }
            
            setIsLoading(false);
            setLastUpdate(new Date());
        }, 1000);
    };

    useEffect(() => {
        loadData();
        intervalRef.current = setInterval(loadData, 30000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timeRange]);

    // 차트 설정
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#ffffff',
                    font: { family: 'Noto Sans KR', size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#00ccff',
                bodyColor: '#ffffff',
                borderColor: '#00ccff',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: { color: '#888888', font: { family: 'Noto Sans KR' } },
                grid: { color: 'rgba(0, 204, 255, 0.1)' }
            },
            y: {
                ticks: { color: '#888888', font: { family: 'Noto Sans KR' } },
                grid: { color: 'rgba(0, 204, 255, 0.1)' }
            }
        }
    };

    // 요청/차단 추이 차트
    const requestsChartData = {
        labels: wafData.requests.map(req => req.time),
        datasets: [
            {
                label: '총 요청',
                data: wafData.requests.map(req => req.total),
                borderColor: '#00ccff',
                backgroundColor: 'rgba(0, 204, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '차단됨',
                data: wafData.requests.map(req => req.blocked),
                borderColor: '#ff0040',
                backgroundColor: 'rgba(255, 0, 64, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '허용됨',
                data: wafData.requests.map(req => req.allowed),
                borderColor: '#00ff41',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 공격 유형 분포 차트
    const attackTypesData = {
        labels: wafData.topAttacks.map(attack => attack.type),
        datasets: [
            {
                data: wafData.topAttacks.map(attack => attack.count),
                backgroundColor: [
                    '#ff0040',
                    '#ff6600',
                    '#ffaa00',
                    '#00ccff',
                    '#00ff41',
                    '#cc00ff',
                    '#888888'
                ],
                borderColor: [
                    '#cc0033',
                    '#cc4400',
                    '#cc8800',
                    '#0099cc',
                    '#00cc33',
                    '#9900cc',
                    '#666666'
                ],
                borderWidth: 2
            }
        ]
    };

    // 국가별 요청 차트
    const countryRequestsData = {
        labels: wafData.topCountries.map(country => country.country),
        datasets: [
            {
                label: '총 요청',
                data: wafData.topCountries.map(country => country.requests),
                backgroundColor: 'rgba(0, 204, 255, 0.6)',
                borderColor: '#00ccff',
                borderWidth: 2
            },
            {
                label: '차단됨',
                data: wafData.topCountries.map(country => country.blocked),
                backgroundColor: 'rgba(255, 0, 64, 0.6)',
                borderColor: '#ff0040',
                borderWidth: 2
            }
        ]
    };

    if (isLoading) {
        return (
            <div className="waf-monitor loading">
                <div className="loading-spinner">
                    <RefreshCw className="spin" />
                    <span>WAF 데이터 로딩 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="waf-monitor">
            {/* 헤더 */}
            <div className="monitor-header">
                <div className="header-left">
                    <div className="monitor-title">
                        <Shield className="title-icon" />
                        <h1>AWS WAF 모니터링</h1>
                    </div>
                    <div className="monitor-subtitle">
                        실시간 웹 애플리케이션 방화벽 보안 모니터링
                    </div>
                </div>
                
                <div className="header-controls">
                    <select 
                        className="time-range-selector"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="24h">최근 24시간</option>
                        <option value="7d">최근 7일</option>
                        <option value="30d">최근 30일</option>
                    </select>
                    
                    <button className="refresh-btn" onClick={loadData}>
                        <RefreshCw />
                        새로고침
                    </button>
                    
                    <button className="download-btn">
                        <Download />
                        내보내기
                    </button>
                </div>
            </div>

            {/* 요약 메트릭 */}
            <div className="metrics-summary">
                <div className="metric-card">
                    <div className="metric-icon">
                        <Eye />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{wafData.metrics?.totalRequests?.toLocaleString() || '0'}</div>
                        <div className="metric-label">총 요청 수</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +15.2%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon blocked">
                        <Ban />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{wafData.metrics?.totalBlocked?.toLocaleString() || '0'}</div>
                        <div className="metric-label">차단된 요청</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +23.7%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon success">
                        <CheckCircle />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{wafData.metrics?.blockRate || '0'}%</div>
                        <div className="metric-label">차단율</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +2.1%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <Shield />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{wafData.rules.filter(r => r.status === 'ENABLED').length}</div>
                        <div className="metric-label">활성 규칙</div>
                        <div className="metric-change neutral">
                            <Activity />
                            {wafData.rules.length}개 중
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="monitor-content">
                {/* 차트 영역 */}
                <div className="charts-section">
                    <div className="chart-container large">
                        <div className="chart-header">
                            <h3>요청 및 차단 추이</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Line data={requestsChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>공격 유형 분포</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Doughnut data={attackTypesData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>국가별 요청</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Bar data={countryRequestsData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* 규칙 및 통계 */}
                <div className="rules-section">
                    <div className="section-header">
                        <h3>WAF 규칙 현황</h3>
                        <button className="add-rule-btn">
                            <Settings />
                            규칙 관리
                        </button>
                    </div>

                    <div className="rules-list">
                        {wafData.rules.map((rule, index) => (
                            <div 
                                key={index}
                                className={`rule-card ${selectedRule?.name === rule.name ? 'selected' : ''} ${rule.status.toLowerCase()}`}
                                onClick={() => setSelectedRule(rule)}
                            >
                                <div className="rule-header">
                                    <div className="rule-name">{rule.name}</div>
                                    <div className={`rule-status ${rule.status.toLowerCase()}`}>
                                        {rule.status === 'ENABLED' ? <CheckCircle /> : <XCircle />}
                                        {rule.status}
                                    </div>
                                </div>

                                <div className="rule-details">
                                    <div className="detail-row">
                                        <span className="detail-label">유형:</span>
                                        <span className={`detail-value ${rule.type.toLowerCase()}`}>{rule.type}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">작업:</span>
                                        <span className={`detail-value action-${rule.action.toLowerCase()}`}>{rule.action}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">우선순위:</span>
                                        <span className="detail-value">{rule.priority}</span>
                                    </div>
                                </div>

                                <div className="rule-metrics">
                                    <div className="metric-item">
                                        <span className="metric-number">{rule.matches.toLocaleString()}</span>
                                        <span className="metric-label">매치</span>
                                    </div>
                                    <div className="metric-item">
                                        <span className="metric-number blocked">{rule.blocks.toLocaleString()}</span>
                                        <span className="metric-label">차단</span>
                                    </div>
                                    <div className="metric-item">
                                        <span className="metric-number allowed">{rule.allows.toLocaleString()}</span>
                                        <span className="metric-label">허용</span>
                                    </div>
                                </div>

                                <div className="rule-platforms">
                                    {rule.cloudFront && <span className="platform-tag cloudfront">CloudFront</span>}
                                    {rule.albArn && <span className="platform-tag alb">ALB</span>}
                                </div>

                                <div className="rule-actions">
                                    <button className="action-btn">
                                        <BarChart3 />
                                        상세 로그
                                    </button>
                                    <button className="action-btn">
                                        <Settings />
                                        설정
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 상위 통계 */}
            <div className="statistics-section">
                <div className="stats-grid">
                    {/* 상위 공격 유형 */}
                    <div className="stats-card">
                        <div className="stats-header">
                            <h3>상위 공격 유형</h3>
                            <AlertTriangle className="stats-icon" />
                        </div>
                        <div className="stats-list">
                            {wafData.topAttacks.slice(0, 5).map((attack, index) => (
                                <div key={index} className="stats-item">
                                    <div className="stats-info">
                                        <span className="stats-name">{attack.type}</span>
                                        <span className="stats-count">{attack.count.toLocaleString()}</span>
                                    </div>
                                    <div className="stats-bar">
                                        <div 
                                            className="stats-fill attack"
                                            style={{ width: `${attack.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="stats-percentage">{attack.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 상위 차단 국가 */}
                    <div className="stats-card">
                        <div className="stats-header">
                            <h3>상위 차단 국가</h3>
                            <Globe className="stats-icon" />
                        </div>
                        <div className="stats-list">
                            {wafData.topCountries.slice(0, 5).map((country, index) => (
                                <div key={index} className="stats-item">
                                    <div className="stats-info">
                                        <span className="stats-name">
                                            <span className="country-flag">{country.code}</span>
                                            {country.country}
                                        </span>
                                        <span className="stats-count">{country.blocked.toLocaleString()}</span>
                                    </div>
                                    <div className="stats-bar">
                                        <div 
                                            className="stats-fill country"
                                            style={{ width: `${country.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="stats-percentage">{country.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 비용 분석 */}
                    <div className="stats-card cost-card">
                        <div className="stats-header">
                            <h3>WAF 비용 분석</h3>
                            <Filter className="stats-icon" />
                        </div>
                        <div className="cost-breakdown">
                            <div className="cost-item">
                                <span className="cost-label">Web ACL:</span>
                                <span className="cost-value">${wafData.costs?.webACL || '0'}</span>
                            </div>
                            <div className="cost-item">
                                <span className="cost-label">요청 처리:</span>
                                <span className="cost-value">${wafData.costs?.requests || '0'}</span>
                            </div>
                            <div className="cost-item">
                                <span className="cost-label">규칙 수:</span>
                                <span className="cost-value">${wafData.costs?.rules || '0'}</span>
                            </div>
                            <div className="cost-item total">
                                <span className="cost-label">총 비용 (일간):</span>
                                <span className="cost-value">${wafData.costs?.total || '0'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* WAF 설정 요약 */}
            <div className="configuration-summary">
                <div className="config-header">
                    <h3>WAF 설정 요약</h3>
                </div>
                <div className="config-grid">
                    <div className="config-item">
                        <div className="config-label">Web ACL</div>
                        <div className="config-value">DefenseAI-WebACL</div>
                    </div>
                    <div className="config-item">
                        <div className="config-label">연결된 리소스</div>
                        <div className="config-value">CloudFront + ALB</div>
                    </div>
                    <div className="config-item">
                        <div className="config-label">기본 액션</div>
                        <div className="config-value action-allow">ALLOW</div>
                    </div>
                    <div className="config-item">
                        <div className="config-label">샘플링 비율</div>
                        <div className="config-value">1000 요청 중 1개</div>
                    </div>
                    <div className="config-item">
                        <div className="config-label">로깅</div>
                        <div className="config-value status-enabled">ENABLED</div>
                    </div>
                    <div className="config-item">
                        <div className="config-label">리전</div>
                        <div className="config-value">us-east-1 (Global)</div>
                    </div>
                </div>
            </div>

            {/* 상태 바 */}
            <div className="monitor-footer">
                <div className="footer-info">
                    <span>마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}</span>
                    <span>활성 규칙: {wafData.rules.filter(r => r.status === 'ENABLED').length}개</span>
                    <span>총 규칙: {wafData.rules.length}개</span>
                    <span>차단율: {wafData.metrics?.blockRate || '0'}%</span>
                </div>
                
                <div className="footer-status">
                    <div className="status-indicator online">
                        <CheckCircle />
                        WAF 서비스 정상
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WAFMonitor;