// 📁 파일 위치: src/screens/MonitoringScreens/AWSMonitoring/DynamoDBMonitor/DynamoDBMonitor.js

import React, { useState, useEffect, useRef } from 'react';
import { 
    Database, 
    Activity, 
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
    HardDrive,
    Zap,
    Users,
    Eye
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './DynamoDBMonitor.css';

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DynamoDBMonitor = () => {
    const [dynamoData, setDynamoData] = useState({
        tables: [],
        metrics: null,
        operations: [],
        capacity: null,
        costs: null
    });
    const [selectedTable, setSelectedTable] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const intervalRef = useRef(null);

    // DynamoDB 테이블 목록 데이터
    const mockTables = [
        {
            name: 'ThreatDetectionLogs',
            status: 'ACTIVE',
            itemCount: 125647,
            storageSize: 2.4, // GB
            readCapacity: { provisioned: 25, consumed: 12, utilization: 48 },
            writeCapacity: { provisioned: 15, consumed: 8, utilization: 53 },
            billingMode: 'PROVISIONED',
            createdDate: '2024-01-01T00:00:00Z',
            globalTables: false,
            streamEnabled: true,
            encryption: 'AWS_MANAGED'
        },
        {
            name: 'UserSessions',
            status: 'ACTIVE',
            itemCount: 45123,
            storageSize: 0.8,
            readCapacity: { provisioned: 10, consumed: 6, utilization: 60 },
            writeCapacity: { provisioned: 10, consumed: 4, utilization: 40 },
            billingMode: 'PROVISIONED',
            createdDate: '2023-12-15T10:30:00Z',
            globalTables: true,
            streamEnabled: false,
            encryption: 'CUSTOMER_MANAGED'
        },
        {
            name: 'SecurityAlerts',
            status: 'ACTIVE',
            itemCount: 89456,
            storageSize: 1.6,
            readCapacity: { provisioned: 20, consumed: 15, utilization: 75 },
            writeCapacity: { provisioned: 20, consumed: 12, utilization: 60 },
            billingMode: 'PROVISIONED',
            createdDate: '2024-01-10T15:20:00Z',
            globalTables: false,
            streamEnabled: true,
            encryption: 'AWS_MANAGED'
        },
        {
            name: 'SystemConfigs',
            status: 'ACTIVE',
            itemCount: 2456,
            storageSize: 0.1,
            readCapacity: { provisioned: 5, consumed: 2, utilization: 40 },
            writeCapacity: { provisioned: 5, consumed: 1, utilization: 20 },
            billingMode: 'ON_DEMAND',
            createdDate: '2023-11-20T08:45:00Z',
            globalTables: false,
            streamEnabled: false,
            encryption: 'AWS_MANAGED'
        }
    ];

    // 메트릭 데이터 생성
    const generateMetrics = () => {
        const now = new Date();
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 24;

        const operations = Array.from({ length: Math.floor(hours / interval) }, (_, i) => {
            const time = new Date(now.getTime() - (hours - i * interval) * 60 * 60 * 1000);
            return {
                timestamp: time.toISOString(),
                time: time.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                reads: Math.floor(Math.random() * 1000) + 200,
                writes: Math.floor(Math.random() * 500) + 100,
                queries: Math.floor(Math.random() * 300) + 50,
                scans: Math.floor(Math.random() * 100) + 10,
                errors: Math.floor(Math.random() * 5),
                throttles: Math.floor(Math.random() * 3)
            };
        });

        const totalReads = operations.reduce((sum, op) => sum + op.reads, 0);
        const totalWrites = operations.reduce((sum, op) => sum + op.writes, 0);
        const totalErrors = operations.reduce((sum, op) => sum + op.errors, 0);
        const totalThrottles = operations.reduce((sum, op) => sum + op.throttles, 0);

        // 용량 사용률 계산
        const totalProvisionedRead = mockTables.reduce((sum, table) => 
            sum + (table.readCapacity.provisioned || 0), 0);
        const totalConsumedRead = mockTables.reduce((sum, table) => 
            sum + (table.readCapacity.consumed || 0), 0);
        const totalProvisionedWrite = mockTables.reduce((sum, table) => 
            sum + (table.writeCapacity.provisioned || 0), 0);
        const totalConsumedWrite = mockTables.reduce((sum, table) => 
            sum + (table.writeCapacity.consumed || 0), 0);

        return {
            operations,
            summary: {
                totalReads,
                totalWrites,
                totalErrors,
                totalThrottles,
                errorRate: ((totalErrors / (totalReads + totalWrites)) * 100).toFixed(2),
                throttleRate: ((totalThrottles / (totalReads + totalWrites)) * 100).toFixed(2)
            },
            capacity: {
                read: {
                    provisioned: totalProvisionedRead,
                    consumed: totalConsumedRead,
                    utilization: ((totalConsumedRead / totalProvisionedRead) * 100).toFixed(1)
                },
                write: {
                    provisioned: totalProvisionedWrite,
                    consumed: totalConsumedWrite,
                    utilization: ((totalConsumedWrite / totalProvisionedWrite) * 100).toFixed(1)
                }
            },
            costs: {
                storage: mockTables.reduce((sum, table) => sum + (table.storageSize * 0.25), 0).toFixed(2),
                readCapacity: (totalProvisionedRead * 0.0065 * 24 * 30).toFixed(2),
                writeCapacity: (totalProvisionedWrite * 0.0065 * 24 * 30).toFixed(2),
                total: (mockTables.reduce((sum, table) => sum + (table.storageSize * 0.25), 0) + 
                       (totalProvisionedRead * 0.0065 * 24 * 30) + 
                       (totalProvisionedWrite * 0.0065 * 24 * 30)).toFixed(2)
            }
        };
    };

    // 데이터 로드
    const loadData = () => {
        setIsLoading(true);
        
        setTimeout(() => {
            const metrics = generateMetrics();
            setDynamoData({
                tables: mockTables,
                metrics: metrics.summary,
                operations: metrics.operations,
                capacity: metrics.capacity,
                costs: metrics.costs
            });
            
            if (!selectedTable && mockTables.length > 0) {
                setSelectedTable(mockTables[0]);
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

    // 읽기/쓰기 작업 차트
    const operationsChartData = {
        labels: dynamoData.operations.map(op => op.time),
        datasets: [
            {
                label: '읽기 작업',
                data: dynamoData.operations.map(op => op.reads),
                borderColor: '#00ccff',
                backgroundColor: 'rgba(0, 204, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '쓰기 작업',
                data: dynamoData.operations.map(op => op.writes),
                borderColor: '#00ff41',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 용량 사용률 차트
    const capacityChartData = {
        labels: ['읽기 용량', '쓰기 용량'],
        datasets: [
            {
                label: '프로비저닝됨',
                data: [dynamoData.capacity?.read.provisioned || 0, dynamoData.capacity?.write.provisioned || 0],
                backgroundColor: 'rgba(0, 204, 255, 0.6)',
                borderColor: '#00ccff',
                borderWidth: 2
            },
            {
                label: '사용됨',
                data: [dynamoData.capacity?.read.consumed || 0, dynamoData.capacity?.write.consumed || 0],
                backgroundColor: 'rgba(0, 255, 65, 0.6)',
                borderColor: '#00ff41',
                borderWidth: 2
            }
        ]
    };

    // 테이블 크기 분포
    const tableSizeData = {
        labels: dynamoData.tables.map(table => table.name),
        datasets: [
            {
                data: dynamoData.tables.map(table => table.storageSize),
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

    if (isLoading) {
        return (
            <div className="dynamodb-monitor loading">
                <div className="loading-spinner">
                    <RefreshCw className="spin" />
                    <span>DynamoDB 데이터 로딩 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dynamodb-monitor">
            {/* 헤더 */}
            <div className="monitor-header">
                <div className="header-left">
                    <div className="monitor-title">
                        <Database className="title-icon" />
                        <h1>DynamoDB 모니터링</h1>
                    </div>
                    <div className="monitor-subtitle">
                        실시간 DynamoDB 테이블 성능 및 용량 모니터링
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
                        <div className="metric-value">{dynamoData.metrics?.totalReads?.toLocaleString() || '0'}</div>
                        <div className="metric-label">총 읽기 작업</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +8.3%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <Zap />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{dynamoData.metrics?.totalWrites?.toLocaleString() || '0'}</div>
                        <div className="metric-label">총 쓰기 작업</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +12.7%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon error">
                        <AlertTriangle />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">{dynamoData.metrics?.errorRate || '0'}%</div>
                        <div className="metric-label">오류율</div>
                        <div className="metric-change negative">
                            <TrendingDown />
                            -0.5%
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        <DollarSign />
                    </div>
                    <div className="metric-content">
                        <div className="metric-value">${dynamoData.costs?.total || '0'}</div>
                        <div className="metric-label">월간 예상 비용</div>
                        <div className="metric-change positive">
                            <TrendingUp />
                            +2.1%
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
                            <h3>읽기/쓰기 작업 추이</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Line data={operationsChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>용량 사용률</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Bar data={capacityChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-header">
                            <h3>테이블 저장 공간 분포</h3>
                        </div>
                        <div className="chart-wrapper">
                            <Doughnut data={tableSizeData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* 테이블 목록 */}
                <div className="tables-section">
                    <div className="section-header">
                        <h3>DynamoDB 테이블 목록</h3>
                        <button className="add-table-btn">
                            <Settings />
                            테이블 관리
                        </button>
                    </div>

                    <div className="tables-list">
                        {dynamoData.tables.map((table, index) => (
                            <div 
                                key={index}
                                className={`table-card ${selectedTable?.name === table.name ? 'selected' : ''}`}
                                onClick={() => setSelectedTable(table)}
                            >
                                <div className="table-header">
                                    <div className="table-name">{table.name}</div>
                                    <div className={`table-status ${table.status.toLowerCase()}`}>
                                        {table.status === 'ACTIVE' ? <CheckCircle /> : <AlertTriangle />}
                                        {table.status}
                                    </div>
                                </div>

                                <div className="table-metrics">
                                    <div className="metric-row">
                                        <span className="metric-label">아이템 수:</span>
                                        <span className="metric-value">{table.itemCount.toLocaleString()}</span>
                                    </div>
                                    <div className="metric-row">
                                        <span className="metric-label">저장 크기:</span>
                                        <span className="metric-value">{table.storageSize}GB</span>
                                    </div>
                                    <div className="metric-row">
                                        <span className="metric-label">읽기 용량:</span>
                                        <span className="metric-value">
                                            {table.readCapacity.consumed}/{table.readCapacity.provisioned} 
                                            ({table.readCapacity.utilization}%)
                                        </span>
                                    </div>
                                    <div className="metric-row">
                                        <span className="metric-label">쓰기 용량:</span>
                                        <span className="metric-value">
                                            {table.writeCapacity.consumed}/{table.writeCapacity.provisioned}
                                            ({table.writeCapacity.utilization}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="table-features">
                                    <div className="feature-tags">
                                        <span className="feature-tag">{table.billingMode}</span>
                                        {table.globalTables && <span className="feature-tag global">글로벌 테이블</span>}
                                        {table.streamEnabled && <span className="feature-tag stream">스트림</span>}
                                        <span className="feature-tag encryption">{table.encryption}</span>
                                    </div>
                                </div>

                                <div className="table-actions">
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

            {/* 용량 상세 정보 */}
            <div className="capacity-details">
                <div className="section-header">
                    <h3>용량 상세 정보</h3>
                </div>

                <div className="capacity-grid">
                    <div className="capacity-card">
                        <div className="capacity-header">
                            <h4>읽기 용량 단위 (RCU)</h4>
                            <div className="capacity-utilization">
                                <span>{dynamoData.capacity?.read.utilization || '0'}% 사용중</span>
                            </div>
                        </div>
                        <div className="capacity-content">
                            <div className="capacity-bar">
                                <div 
                                    className="capacity-fill read"
                                    style={{ width: `${dynamoData.capacity?.read.utilization || 0}%` }}
                                ></div>
                            </div>
                            <div className="capacity-values">
                                <span>사용: {dynamoData.capacity?.read.consumed || 0}</span>
                                <span>프로비저닝: {dynamoData.capacity?.read.provisioned || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="capacity-card">
                        <div className="capacity-header">
                            <h4>쓰기 용량 단위 (WCU)</h4>
                            <div className="capacity-utilization">
                                <span>{dynamoData.capacity?.write.utilization || '0'}% 사용중</span>
                            </div>
                        </div>
                        <div className="capacity-content">
                            <div className="capacity-bar">
                                <div 
                                    className="capacity-fill write"
                                    style={{ width: `${dynamoData.capacity?.write.utilization || 0}%` }}
                                ></div>
                            </div>
                            <div className="capacity-values">
                                <span>사용: {dynamoData.capacity?.write.consumed || 0}</span>
                                <span>프로비저닝: {dynamoData.capacity?.write.provisioned || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="capacity-card cost">
                        <div className="capacity-header">
                            <h4>비용 분석</h4>
                            <div className="capacity-utilization">
                                <span>월간 예상</span>
                            </div>
                        </div>
                        <div className="capacity-content">
                            <div className="cost-breakdown">
                                <div className="cost-item">
                                    <span className="cost-label">저장소:</span>
                                    <span className="cost-value">${dynamoData.costs?.storage || '0'}</span>
                                </div>
                                <div className="cost-item">
                                    <span className="cost-label">읽기 용량:</span>
                                    <span className="cost-value">${dynamoData.costs?.readCapacity || '0'}</span>
                                </div>
                                <div className="cost-item">
                                    <span className="cost-label">쓰기 용량:</span>
                                    <span className="cost-value">${dynamoData.costs?.writeCapacity || '0'}</span>
                                </div>
                                <div className="cost-item total">
                                    <span className="cost-label">총 비용:</span>
                                    <span className="cost-value">${dynamoData.costs?.total || '0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상태 바 */}
            <div className="monitor-footer">
                <div className="footer-info">
                    <span>마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}</span>
                    <span>활성 테이블: {dynamoData.tables.filter(t => t.status === 'ACTIVE').length}개</span>
                    <span>총 테이블: {dynamoData.tables.length}개</span>
                    <span>총 아이템: {dynamoData.tables.reduce((sum, t) => sum + t.itemCount, 0).toLocaleString()}개</span>
                </div>
                
                <div className="footer-status">
                    <div className="status-indicator online">
                        <CheckCircle />
                        DynamoDB 서비스 정상
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamoDBMonitor;
