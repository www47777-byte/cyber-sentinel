// 📁 파일 위치: src/screens/MonitoringScreens/AWSMonitoring/GuardDutyMonitor/GuardDutyMonitor.js

import React, { useState, useEffect, useRef } from 'react';
import { 
    Eye, 
    Shield, 
    AlertTriangle, 
    Activity, 
    MapPin,
    Clock,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Download,
    Settings,
    Filter,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
import './GuardDutyMonitor.css';

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

const GuardDutyMonitor = () => {
    const [guardDutyData, setGuardDutyData] = useState({
        findings: [],
        metrics: null,
        timeline: [],
        costs: null
    });
    const [selectedFinding, setSelectedFinding] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const intervalRef = useRef(null);

    // GuardDuty 탐지 결과 데이터
    const mockFindings = [
        {
            id: 'GD-001',
            type: 'UnauthorizedAPICall',
            severity: 8.5,
            title: '무단 AWS API 호출 탐지',
            description: '알 수 없는 IP 주소에서 의심스러운 AWS API 호출이 탐지되었습니다.',
            sourceIP: '185.220.101.32',
            targetService: 'EC2',
            targetResource: 'i-0123456789abcdef0',
            country: '독일',
            region: 'us-east-1',
            firstSeen: '2024-01-15T10:30:00Z',
            lastSeen: '2024-01-15T10:45:00Z',
            status: 'ACTIVE',
            confidence: 9.2,
            count: 15
        },
        {
            id: 'GD-002',
            type: 'Backdoor:EC2/C&CActivity.B',
            severity: 7.8,
            title: 'C&C 서버 통신 탐지',
            description: 'EC2 인스턴스가 알려진 악성 C&C 서버와 통신하고 있습니다.',
            sourceIP: '203.123.45.67',
            targetService: 'EC2',
            targetResource: 'i-0987654321fedcba0',
            country: '중국',
            region: 'us-east-1',
            firstSeen: '2024-01-15T09:15:00Z',
            lastSeen: '2024-01-15T10:30:00Z',
            status: 'ACTIVE',
            confidence: 8.7,
            count: 23
        },
        {
            id: 'GD-003',
            type: 'Recon:EC2/PortProbeUnprotectedPort',
            severity: 4.2,
            title: '포트 스캔 활동 탐지',
            description: 'EC2 인스턴스에서 포트 스캔 활동이 탐지되었습니다.',
            sourceIP: '10.0.1.45',
            targetService: 'EC2',
            targetResource: 'i-0456789012345678',
            country: '미국',
            region: 'us-east-1',
            firstSeen: '2024-01-15T08:20:00Z',
            lastSeen: '2024-01-15T08:35:00Z',
            status: 'ARCHIVED',
            confidence: 6.5,
            count: 8
        },
        {
            id: 'GD-004',
            type: 'CryptoCurrency:EC2/BitcoinTool.B',
            severity: 6.3,
            title: '암호화폐 채굴 탐지',
            description: 'EC2 인스턴스에서 암호화폐 채굴 관련 활동이 탐지되었습니다.',
            sourceIP: '172.16.0.25',
            targetService: 'EC2',
            targetResource: 'i-0123789456012345',
            country: '미국',
            region: 'us-west-2',
            firstSeen: '2024-01-14T16:30:00Z',
            lastSeen: '2024-01-15T02:15:00Z',
            status: 'SUPPRESSED',
            confidence: 7.1,
            count: 42
        }
    ];

    // 메트릭 데이터 생성
    const generateMetrics = () => {
        const now = new Date();
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 24;

        const timeline = Array.from({ length: Math.floor(hours / interval) }, (_, i) => {
            const time = new Date(now.getTime() - (hours - i * interval) * 60 * 60 * 1000);
            return {
                timestamp: time.toISOString(),
                time: time.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                high: Math.floor(Math.random() * 5),
                medium: Math.floor(Math.random() * 10) + 5,
                low: Math.floor(Math.random() * 15) + 10,
                total: 0
            };
        }).map(item => ({
            ...item,
            total: item.high + item.medium + item.low
        }));

        const totalFindings = timeline.reduce((sum, t) => sum + t.total, 0);
        const highSeverity = timeline.reduce((sum, t) => sum + t.high, 0);
        const mediumSeverity = timeline.reduce((sum, t) => sum + t.medium, 0);
        const lowSeverity = timeline.reduce((sum, t) => sum + t.low, 0);

        return {
            timeline,
            summary: {
                totalFindings,
                highSeverity,
                mediumSeverity,
                lowSeverity,
                activeFindings: mockFindings.filter(f => f.status === 'ACTIVE').length,
                archivedFindings: mockFindings.filter(f => f.status === 'ARCHIVED').length
            },
            costs: {
                events: (totalFindings * 0.0001).toFixed(4),
                storage: 2.50,
                analysis: 1.20,
                total: ((totalFindings * 0.0001) + 2.50 + 1.20).toFixed(2)
            }
        };
    };

    // 데이터 로드
    const loadData = () => {
        setIsLoading(true);
        
        setTimeout(() => {
            const metrics = generateMetrics();
            let filteredFindings = mockFindings;
            
            if (severityFilter !== 'all') {
                filteredFindings = mockFindings.filter(finding => {
                    if (severityFilter === 'high') return finding.severity >= 7.0;
                    if (severityFilter === 'medium') return finding.severity >= 4.0 && finding.severity < 7.0;
                    if (severityFilter === 'low') return finding.severity < 4.0;
                    return true;
                });
            }
            
            setGuardDutyData({
                findings: filteredFindings,
                metrics: metrics.summary,
                timeline: metrics.timeline,
                costs: metrics.costs
            });
            
            if (!selectedFinding && filteredFindings.length > 0) {
                setSelectedFinding(filteredFindings[0]);
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
    }, [timeRange, severityFilter]);

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

    // 탐지 타임라인 차트
    const timelineChartData = {
        labels: guardDutyData.timeline.map(t => t.time),
        datasets: [
            {
                label: '높음',
                data: guardDutyData.timeline.map(t => t.high),
                borderColor: '#ff0040',
                backgroundColor: 'rgba(255, 0, 64, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '보통',
                data: guardDutyData.timeline.map(t => t.medium),
                borderColor: '#ffaa00',
                backgroundColor: 'rgba(255, 170, 0, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '낮음',
                data: guardDutyData.timeline.map(t => t.low),
                borderColor: '#00ff41',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 심각도 분포 차트
    const severityDistributionData = {
        labels: ['높음 (7.0+)', '보통 (4.0-6.9)', '낮음 (<4.0)'],
        datasets: [
            {
                data: [
                    guardDutyData.metrics?.highSeverity || 0,
                    guardDutyData.metrics?.mediumSeverity || 0,
                    guardDutyData.metrics?.lowSeverity || 0
                ],
                backgroundColor: ['#ff0040', '#ffaa00', '#00ff41'],
                borderColor: ['#cc0033', '#cc8800', '#00cc33'],
                borderWidth: 2
            }
        ]
    };

    const getSeverityLevel = (severity) => {
        if (severity >= 8.5) return { level: 'CRITICAL', color: '#ff0040', label: '치명적' };
        if (severity >= 7.0) return { level: 'HIGH', color: '#ff6600', label: '높음' };
        if (severity >= 4.0) return { level: 'MEDIUM', color: '#ffaa00', label: '보통' };
        return { level: 'LOW', color: '#00ff41', label: '낮음' };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return '#ff0040';
            case 'ARCHIVED': return '#888888';
            case 'SUPPRESSED': return '#ffaa00';
            default: return '#00ccff';
        }
    };

    if (isLoading) {
        return (
            <div className="guardduty-monitor loading">
                <div className="loading-spinner">
                    <RefreshCw className="spin" />
                    <span>GuardDuty 데이터 로딩 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="guardduty-monitor">
            {/* 헤더 */}
            <div className="monitor-header">
                <div className="header-left">
                    <div className="monitor-title">
                        <Eye className="title-icon" />
                        <h1>AWS GuardDuty 모니터링</h1>
                    </div>
                    <div className="monitor-subtitle">
                        지능형 위협 탐지 및 보안 이벤트 모니터링
                    </div>
                </div>
                
                <div className="header-controls">
                    <select 
                        className="severity-filter"
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                    >
                        <option value="all">모든 심각도</option>
                        <option value="high">높음 (7.0+)</option>
                        <option value="medium">보통 (4.0-6.9)</option>
                        <option value="low">낮음 (&lt;4.0)</option>
                    </select>
                    
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
                        <AlertTriangle />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{guardDutyData.metrics?.totalFindings || '0'}</div>
                        <div className="metric-label">총 탐지 건수</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +18.3%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon critical">
                        <XCircle />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{guardDutyData.metrics?.highSeverity || '0'}</div>
                        <div className="metric-label">고위험 탐지</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +5
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon active">
                        <Activity />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{guardDutyData.metrics?.activeFindings || '0'}</div>
                        <div className="metric-label">활성 탐지</div>
                        <div className="metric-change negative">
                            <TrendingDown />
                            -2
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <CheckCircle />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{guardDutyData.metrics?.archivedFindings || '0'}</div>
                        <div className="metric-label">처리 완료</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +12
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="monitor-content">
                {/* 차트 영역 */}
                <div className="charts-section">
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>위협 탐지 추이</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Line data={timelineChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>심각도별 분포</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Doughnut data={severityDistributionData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* 탐지 결과 목록 */}
                <div className="findings-section">
                    <div className="section-header">
                        <h3>GuardDuty 탐지 결과</h3>
                        <button className="settings-btn">
                            <Settings />
                            설정
                        </button>
                    </div>

                    <div className="findings-list">
                        {guardDutyData.findings.map((finding, index) => {
                            const severityInfo = getSeverityLevel(finding.severity);
                            return (
                                <div 
                                    key={index}
                                    className={`finding-card ${selectedFinding?.id === finding.id ? 'selected' : ''} ${finding.status.toLowerCase()}`}
                                    onClick={() => setSelectedFinding(finding)}
                                >
                                    <div className="finding-header">
                                        <div 
                                            className="finding-severity"
                                            style={{ backgroundColor: severityInfo.color }}
                                        >
                                            {finding.severity.toFixed(1)}
                                        </div>
                                        <div className="finding-title">{finding.title}</div>
                                        <div 
                                            className="finding-status"
                                            style={{ color: getStatusColor(finding.status) }}
                                        >
                                            {finding.status}
                                        </div>
                                    </div>

                                    <div className="finding-details">
                                        <p>{finding.description}</p>
                                        
                                        <div className="finding-meta">
                                            <div className="meta-item">
                                                <MapPin className="meta-icon" />
                                                <span>{finding.sourceIP} ({finding.country})</span>
                                            </div>
                                            <div className="meta-item">
                                                <Shield className="meta-icon" />
                                                <span>{finding.targetService}</span>
                                            </div>
                                            <div className="meta-item">
                                                <Clock className="meta-icon" />
                                                <span>{new Date(finding.firstSeen).toLocaleString('ko-KR')}</span>
                                            </div>
                                        </div>

                                        <div className="finding-metrics">
                                            <div className="metric-item">
                                                <span className="metric-label">신뢰도:</span>
                                                <span className="metric-value">{finding.confidence}/10</span>
                                            </div>
                                            <div className="metric-item">
                                                <span className="metric-label">발생 횟수:</span>
                                                <span className="metric-value">{finding.count}회</span>
                                            </div>
                                            <div className="metric-item">
                                                <span className="metric-label">대상:</span>
                                                <span className="metric-value">{finding.targetResource}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="finding-actions">
                                        <button className="action-btn primary">상세 보기</button>
                                        <button className="action-btn">아카이브</button>
                                        <button className="action-btn">억제</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 상태 바 */}
            <div className="monitor-footer">
                <div className="footer-info">
                    <span>마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}</span>
                    <span>활성 탐지: {guardDutyData.metrics?.activeFindings || 0}건</span>
                    <span>총 탐지: {guardDutyData.findings.length}건</span>
                    <span>예상 비용: ${guardDutyData.costs?.total || '0'}/일</span>
                </div>
                
                <div className="footer-status">
                    <div className="status-indicator online">
                        <CheckCircle />
                        GuardDuty 서비스 정상
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuardDutyMonitor;