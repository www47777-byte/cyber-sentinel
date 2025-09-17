// 📁 파일 위치: src/screens/MonitoringScreens/AWSMonitoring/LambdaMonitor/LambdaMonitor.js

import React, { useState, useEffect, useRef } from 'react';
import { 
    Activity, 
    Zap, 
    Clock, 
    DollarSign, 
    AlertTriangle, 
    CheckCircle,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Download,
    Settings,
    BarChart3,
    Cpu,
    MemoryStick
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import './LambdaMonitor.css';

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

const LambdaMonitor = () => {
    const [lambdaData, setLambdaData] = useState({
        functions: [],
        metrics: null,
        invocations: [],
        errors: [],
        costs: null
    });
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const intervalRef = useRef(null);

    // Lambda 함수 목록 데이터
    const mockFunctions = [
        {
            name: 'DefenseAI-ThreatDetector',
            runtime: 'python3.9',
            memorySize: 512,
            timeout: 30,
            status: 'Active',
            lastModified: '2024-01-15T10:30:00Z',
            version: '$LATEST',
            codeSize: 2.1, // MB
            handler: 'lambda_function.lambda_handler'
        },
        {
            name: 'SecurityPatternAnalyzer',
            runtime: 'nodejs18.x',
            memorySize: 256,
            timeout: 15,
            status: 'Active',
            lastModified: '2024-01-14T15:45:00Z',
            version: '1',
            codeSize: 1.8,
            handler: 'index.handler'
        },
        {
            name: 'AutoResponseTrigger',
            runtime: 'python3.9',
            memorySize: 1024,
            timeout: 60,
            status: 'Active',
            lastModified: '2024-01-13T09:20:00Z',
            version: '$LATEST',
            codeSize: 3.5,
            handler: 'response.main_handler'
        },
        {
            name: 'LogProcessor',
            runtime: 'java11',
            memorySize: 2048,
            timeout: 300,
            status: 'Inactive',
            lastModified: '2024-01-10T12:00:00Z',
            version: '2',
            codeSize: 15.2,
            handler: 'com.example.LogProcessor::handleRequest'
        }
    ];

    // 메트릭 데이터 생성
    const generateMetrics = () => {
        const now = new Date();
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 24;

        const invocations = Array.from({ length: Math.floor(hours / interval) }, (_, i) => {
            const time = new Date(now.getTime() - (hours - i * interval) * 60 * 60 * 1000);
            return {
                timestamp: time.toISOString(),
                time: time.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                count: Math.floor(Math.random() * 100) + 50,
                duration: Math.random() * 5000 + 200,
                errors: Math.floor(Math.random() * 5),
                coldStarts: Math.floor(Math.random() * 10)
            };
        });

        const totalInvocations = invocations.reduce((sum, inv) => sum + inv.count, 0);
        const totalErrors = invocations.reduce((sum, inv) => sum + inv.errors, 0);
        const avgDuration = invocations.reduce((sum, inv) => sum + inv.duration, 0) / invocations.length;
        const totalColdStarts = invocations.reduce((sum, inv) => sum + inv.coldStarts, 0);

        return {
            invocations,
            summary: {
                totalInvocations,
                totalErrors,
                errorRate: ((totalErrors / totalInvocations) * 100).toFixed(2),
                avgDuration: avgDuration.toFixed(0),
                totalColdStarts,
                coldStartRate: ((totalColdStarts / totalInvocations) * 100).toFixed(2)
            },
            costs: {
                requests: (totalInvocations * 0.0000002).toFixed(4),
                compute: (avgDuration * totalInvocations * 0.0000166667 / 1000).toFixed(4),
                total: ((totalInvocations * 0.0000002) + (avgDuration * totalInvocations * 0.0000166667 / 1000)).toFixed(4)
            }
        };
    };

    // 데이터 로드
    const loadData = () => {
        setIsLoading(true);
        
        // 시뮬레이션: API 호출
        setTimeout(() => {
            const metrics = generateMetrics();
            setLambdaData({
                functions: mockFunctions,
                metrics: metrics.summary,
                invocations: metrics.invocations,
                errors: metrics.invocations.filter(inv => inv.errors > 0),
                costs: metrics.costs
            });
            
            if (!selectedFunction && mockFunctions.length > 0) {
                setSelectedFunction(mockFunctions[0]);
            }
            
            setIsLoading(false);
            setLastUpdate(new Date());
        }, 1000);
    };

    useEffect(() => {
        loadData();
        
        // 자동 새로고침 (30초마다)
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
                    font: {
                        family: 'Noto Sans KR',
                        size: 12
                    }
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

    // 호출 수 차트 데이터
    const invocationChartData = {
        labels: lambdaData.invocations.map(inv => inv.time),
        datasets: [
            {
                label: '호출 수',
                data: lambdaData.invocations.map(inv => inv.count),
                borderColor: '#00ccff',
                backgroundColor: 'rgba(0, 204, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '에러',
                data: lambdaData.invocations.map(inv => inv.errors),
                borderColor: '#ff0040',
                backgroundColor: 'rgba(255, 0, 64, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 실행 시간 차트 데이터
    const durationChartData = {
        labels: lambdaData.invocations.map(inv => inv.time),
        datasets: [
            {
                label: '실행 시간 (ms)',
                data: lambdaData.invocations.map(inv => inv.duration),
                borderColor: '#00ff41',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 함수별 호출 분포 차트
    const functionDistributionData = {
        labels: lambdaData.functions.map(func => func.name),
        datasets: [
            {
                data: lambdaData.functions.map(() => Math.floor(Math.random() * 1000) + 100),
                backgroundColor: [
                    '#00ccff',
                    '#00ff41',
                    '#ffaa00',
                    '#ff6600'
                ],
                borderColor: [
                    '#0099cc',
                    '#00cc33',
                    '#cc8800',
                    '#cc4400'
                ],
                borderWidth: 2
            }
        ]
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}일 ${hours}시간 ${minutes}분`;
    };

    if (isLoading) {
        return (
            <div className="lambda-monitor loading">
                <div className="loading-spinner">
                    <RefreshCw className="spin" />
                    <span>Lambda 데이터 로딩 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="lambda-monitor">
            {/* 헤더 */}
            <div className="monitor-header">
                <div className="header-left">
                    <div className="monitor-title">
                        <Zap className="title-icon" />
                        <h1>AWS Lambda 모니터링</h1>
                    </div>
                    <div className="monitor-subtitle">
                        실시간 Lambda 함수 성능 및 메트릭 모니터링
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
                        <Activity />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{lambdaData.metrics?.totalInvocations?.toLocaleString() || '0'}</div>
                        <div className="metric-label">총 호출 수</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +12.5%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon error">
                        <AlertTriangle />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{lambdaData.metrics?.errorRate || '0'}%</div>
                        <div className="metric-label">에러율</div>
                        <div className="metric-change negative">
                            <TrendingDown />
                            -2.1%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <Clock />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{lambdaData.metrics?.avgDuration || '0'}ms</div>
                        <div className="metric-label">평균 실행 시간</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +5.2ms
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <DollarSign />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">${lambdaData.costs?.total || '0'}</div>
                        <div className="metric-label">총 비용</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +$0.02
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
                            <h3>호출 수 및 에러</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Line data={invocationChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>실행 시간</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Line data={durationChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>함수별 호출 분포</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Doughnut data={functionDistributionData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* 함수 목록 */}
                <div className="functions-section">
                    <div className="section-header">
                        <h3>Lambda 함수 목록</h3>
                        <button className="add-function-btn">
                            <Settings />
                            함수 관리
                        </button>
                    </div>

                    <div className="functions-list">
                        {lambdaData.functions.map((func, index) => (
                            <div 
                                key={index}
                                className={`function-card ${selectedFunction?.name === func.name ? 'selected' : ''}`}
                                onClick={() => setSelectedFunction(func)}
                            >
                                <div className="function-header">
                                    <div className="function-name">{func.name}</div>
                                    <div className={`function-status ${func.status.toLowerCase()}`}>
                                        {func.status === 'Active' ? <CheckCircle /> : <AlertTriangle />}
                                        {func.status}
                                    </div>
                                </div>

                                <div className="function-details">
                                    <div className="detail-row">
                                        <span className="detail-label">런타임:</span>
                                        <span className="detail-value">{func.runtime}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">메모리:</span>
                                        <span className="detail-value">{func.memorySize}MB</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">타임아웃:</span>
                                        <span className="detail-value">{func.timeout}초</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">코드 크기:</span>
                                        <span className="detail-value">{func.codeSize}MB</span>
                                    </div>
                                </div>

                                <div className="function-actions">
                                    <button className="action-btn">
                                        <BarChart3 />
                                        상세 메트릭
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

            {/* 상태 바 */}
            <div className="monitor-footer">
                <div className="footer-info">
                    <span>마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}</span>
                    <span>활성 함수: {lambdaData.functions.filter(f => f.status === 'Active').length}개</span>
                    <span>총 함수: {lambdaData.functions.length}개</span>
                </div>
                
                <div className="footer-status">
                    <div className="status-indicator online">
                        <CheckCircle />
                        Lambda 서비스 정상
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LambdaMonitor;