import React, { useState, useEffect } from 'react';
import { X, Settings, CheckCircle, AlertCircle, XCircle, Activity } from 'lucide-react';
import Button from '../../ui/Button';
import ProgressBar from '../../ui/ProgressBar';
import StatusIndicator from '../../ui/StatusIndicator';
import './SystemCheckModal.css';

const SystemCheckModal = ({ isOpen, onClose, onComplete }) => {
    const [checkStep, setCheckStep] = useState('idle'); // idle, checking, completed
    const [progress, setProgress] = useState(0);
    const [currentCheck, setCurrentCheck] = useState('');
    const [checkResults, setCheckResults] = useState({});
    const [overallStatus, setOverallStatus] = useState('unknown');

    // 시스템 점검 항목들
    const checkItems = [
        { 
            id: 'aws_lambda', 
            name: 'AWS Lambda 함수', 
            description: 'Lambda 함수 상태 및 성능 확인',
            duration: 2000 
        },
        { 
            id: 'aws_dynamodb', 
            name: 'DynamoDB 테이블', 
            description: '데이터베이스 연결 및 성능 확인',
            duration: 2500 
        },
        { 
            id: 'aws_api_gateway', 
            name: 'API Gateway', 
            description: 'API 엔드포인트 응답 시간 확인',
            duration: 1800 
        },
        { 
            id: 'aws_cloudfront', 
            name: 'CloudFront CDN', 
            description: 'CDN 캐시 및 배포 상태 확인',
            duration: 2200 
        },
        { 
            id: 'aws_waf', 
            name: 'AWS WAF', 
            description: '웹 방화벽 규칙 및 차단 상태 확인',
            duration: 1500 
        },
        { 
            id: 'aws_guardduty', 
            name: 'GuardDuty', 
            description: '위협 탐지 서비스 상태 확인',
            duration: 2000 
        },
        { 
            id: 'system_resources', 
            name: '시스템 리소스', 
            description: 'CPU, 메모리, 디스크 사용량 확인',
            duration: 1200 
        },
        { 
            id: 'network_connectivity', 
            name: '네트워크 연결', 
            description: '내부 및 외부 네트워크 연결 상태 확인',
            duration: 1800 
        }
    ];

    // 시스템 점검 시작
    const startSystemCheck = async () => {
        setCheckStep('checking');
        setProgress(0);
        setCheckResults({});

        for (let i = 0; i < checkItems.length; i++) {
            const item = checkItems[i];
            setCurrentCheck(item.name);

            // 각 항목 점검 시뮬레이션
            await new Promise(resolve => {
                let itemProgress = 0;
                const interval = setInterval(() => {
                    itemProgress += 10;
                    const overallProgress = ((i * 100) + itemProgress) / checkItems.length;
                    setProgress(overallProgress);

                    if (itemProgress >= 100) {
                        clearInterval(interval);

                        // 랜덤 결과 생성 (대부분 성공)
                        const randomNum = Math.random();
                        let status, responseTime, details;

                        if (randomNum > 0.85) {
                            status = 'error';
                            responseTime = Math.floor(Math.random() * 5000) + 2000;
                            details = '연결 실패 또는 응답 없음';
                        } else if (randomNum > 0.7) {
                            status = 'warning';
                            responseTime = Math.floor(Math.random() * 2000) + 1000;
                            details = '응답 시간이 느림';
                        } else {
                            status = 'success';
                            responseTime = Math.floor(Math.random() * 500) + 100;
                            details = '정상 작동';
                        }

                        setCheckResults(prev => ({
                            ...prev,
                            [item.id]: {
                                name: item.name,
                                description: item.description,
                                status,
                                responseTime,
                                details,
                                checkedAt: new Date().toISOString()
                            }
                        }));

                        resolve();
                    }
                }, item.duration / 10);
            });
        }

        // 전체 상태 계산
        const results = Object.values(checkResults);
        const errorCount = results.filter(r => r.status === 'error').length;
        const warningCount = results.filter(r => r.status === 'warning').length;
        
        let overall;
        if (errorCount > 0) overall = 'error';
        else if (warningCount > 2) overall = 'warning';
        else overall = 'success';

        setOverallStatus(overall);
        setCheckStep('completed');
        setCurrentCheck('점검 완료');
        onComplete?.(checkResults);
    };

    // 모달 닫기
    const handleClose = () => {
        if (checkStep === 'checking') {
            if (window.confirm('시스템 점검이 진행 중입니다. 정말 취소하시겠습니까?')) {
                setCheckStep('idle');
                setProgress(0);
                onClose();
            }
        } else {
            setCheckStep('idle');
            setProgress(0);
            onClose();
        }
    };

    // 점검 재시작
    const restartCheck = () => {
        setCheckStep('idle');
        setProgress(0);
        setCheckResults({});
        setCurrentCheck('');
        setOverallStatus('unknown');
    };

    if (!isOpen) return null;

    return (
        <div className="system-check-modal-overlay" onClick={handleClose}>
            <div className="system-check-modal" onClick={e => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <div className="modal-title">
                        <Settings className="title-icon" />
                        <h2>시스템 점검</h2>
                        {checkStep === 'completed' && (
                            <StatusIndicator 
                                status={overallStatus === 'success' ? 'online' : overallStatus === 'warning' ? 'warning' : 'error'}
                                variant="badge"
                                size="small"
                                showLabel={false}
                            />
                        )}
                    </div>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="modal-content">
                    {checkStep === 'idle' && (
                        <div className="check-setup">
                            <div className="check-overview">
                                <h3>시스템 점검 항목</h3>
                                <p>다음 항목들에 대한 종합적인 상태 점검을 실시합니다:</p>
                            </div>

                            <div className="check-items-list">
                                {checkItems.map((item, index) => (
                                    <div key={item.id} className="check-item-preview">
                                        <div className="item-number">{index + 1}</div>
                                        <div className="item-content">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-description">{item.description}</div>
                                        </div>
                                        <div className="item-status">
                                            <Activity size={16} className="pending-icon" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="check-info">
                                <div className="info-item">
                                    <span className="info-label">예상 소요 시간:</span>
                                    <span className="info-value">약 2-3분</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">점검 항목 수:</span>
                                    <span className="info-value">{checkItems.length}개</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {checkStep === 'checking' && (
                        <div className="check-progress">
                            <div className="progress-info">
                                <h3>시스템 점검 진행 중...</h3>
                                <p className="current-check">
                                    <Activity className="spinner" size={16} />
                                    {currentCheck} 점검 중
                                </p>
                            </div>

                            <ProgressBar 
                                value={progress}
                                variant="primary"
                                size="large"
                                animated={true}
                                striped={true}
                                showPercentage={true}
                                label="진행률"
                            />

                            <div className="check-animation">
                                <div className="system-diagram">
                                    <div className="center-node">
                                        <div className="node-pulse"></div>
                                        <span>System</span>
                                    </div>
                                    <div className="connection-lines">
                                        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                                            <div 
                                                key={i} 
                                                className={`connection-line line-${i}`}
                                                style={{ '--delay': `${i * 0.2}s` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="service-nodes">
                                        {checkItems.slice(0, 8).map((item, i) => (
                                            <div 
                                                key={item.id} 
                                                className={`service-node node-${i}`}
                                                title={item.name}
                                            >
                                                {checkResults[item.id] ? (
                                                    checkResults[item.id].status === 'success' ? (
                                                        <CheckCircle size={12} className="success" />
                                                    ) : checkResults[item.id].status === 'warning' ? (
                                                        <AlertCircle size={12} className="warning" />
                                                    ) : (
                                                        <XCircle size={12} className="error" />
                                                    )
                                                ) : (
                                                    <div className="checking-dot"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {checkStep === 'completed' && (
                        <div className="check-results">
                            <div className="results-header">
                                <div className="overall-status">
                                    {overallStatus === 'success' && <CheckCircle className="success-icon" size={32} />}
                                    {overallStatus === 'warning' && <AlertCircle className="warning-icon" size={32} />}
                                    {overallStatus === 'error' && <XCircle className="error-icon" size={32} />}
                                    <div className="status-text">
                                        <h3>
                                            {overallStatus === 'success' && '시스템 정상'}
                                            {overallStatus === 'warning' && '주의 필요'}
                                            {overallStatus === 'error' && '문제 발견'}
                                        </h3>
                                        <p>
                                            {overallStatus === 'success' && '모든 시스템이 정상적으로 작동하고 있습니다.'}
                                            {overallStatus === 'warning' && '일부 시스템에서 성능 저하가 감지되었습니다.'}
                                            {overallStatus === 'error' && '일부 시스템에서 오류가 발견되었습니다.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="results-summary">
                                <div className="summary-stats">
                                    <div className="stat-item success">
                                        <div className="stat-number">
                                            {Object.values(checkResults).filter(r => r.status === 'success').length}
                                        </div>
                                        <div className="stat-label">정상</div>
                                    </div>
                                    <div className="stat-item warning">
                                        <div className="stat-number">
                                            {Object.values(checkResults).filter(r => r.status === 'warning').length}
                                        </div>
                                        <div className="stat-label">주의</div>
                                    </div>
                                    <div className="stat-item error">
                                        <div className="stat-number">
                                            {Object.values(checkResults).filter(r => r.status === 'error').length}
                                        </div>
                                        <div className="stat-label">오류</div>
                                    </div>
                                </div>
                            </div>

                            <div className="results-details">
                                <h4>상세 점검 결과</h4>
                                <div className="results-list">
                                    {Object.values(checkResults).map((result, index) => (
                                        <div key={index} className={`result-item ${result.status}`}>
                                            <div className="result-icon">
                                                {result.status === 'success' && <CheckCircle size={20} />}
                                                {result.status === 'warning' && <AlertCircle size={20} />}
                                                {result.status === 'error' && <XCircle size={20} />}
                                            </div>
                                            <div className="result-content">
                                                <div className="result-header">
                                                    <div className="result-name">{result.name}</div>
                                                    <div className="result-time">
                                                        {result.responseTime}ms
                                                    </div>
                                                </div>
                                                <div className="result-description">{result.description}</div>
                                                <div className="result-details">{result.details}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 모달 푸터 */}
                <div className="modal-footer">
                    {checkStep === 'idle' && (
                        <>
                            <Button variant="secondary" onClick={handleClose}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={startSystemCheck}>
                                점검 시작
                            </Button>
                        </>
                    )}

                    {checkStep === 'checking' && (
                        <Button variant="danger" onClick={handleClose}>
                            점검 중지
                        </Button>
                    )}

                    {checkStep === 'completed' && (
                        <>
                            <Button variant="secondary" onClick={restartCheck}>
                                다시 점검
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                확인
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemCheckModal;