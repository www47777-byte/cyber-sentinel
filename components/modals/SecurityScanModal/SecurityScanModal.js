import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '../../ui/Button';
import ProgressBar from '../../ui/ProgressBar';
import './SecurityScanModal.css';

const SecurityScanModal = ({ isOpen, onClose, onComplete }) => {
    const [scanStep, setScanStep] = useState('idle'); // idle, scanning, completed, error
    const [progress, setProgress] = useState(0);
    const [currentTask, setCurrentTask] = useState('');
    const [scanResults, setScanResults] = useState({});
    const [scanType, setScanType] = useState('quick'); // quick, full, custom

    // 스캔 단계 정의
    const scanTasks = [
        { id: 'network', name: '네트워크 보안 검사', duration: 2000 },
        { id: 'vulnerabilities', name: '취약점 스캔', duration: 3000 },
        { id: 'malware', name: '악성코드 검사', duration: 2500 },
        { id: 'firewall', name: '방화벽 규칙 검증', duration: 1500 },
        { id: 'access', name: '접근 권한 분석', duration: 2000 },
        { id: 'logs', name: '보안 로그 분석', duration: 1800 }
    ];

    // 스캔 실행
    const startScan = async () => {
        setScanStep('scanning');
        setProgress(0);
        setScanResults({});

        const tasks = scanType === 'quick' ? scanTasks.slice(0, 3) : scanTasks;
        
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            setCurrentTask(task.name);
            
            // 각 태스크 시뮬레이션
            await new Promise(resolve => {
                let taskProgress = 0;
                const interval = setInterval(() => {
                    taskProgress += 10;
                    const overallProgress = ((i * 100) + taskProgress) / tasks.length;
                    setProgress(overallProgress);
                    
                    if (taskProgress >= 100) {
                        clearInterval(interval);
                        
                        // 랜덤 결과 생성
                        const success = Math.random() > 0.2;
                        setScanResults(prev => ({
                            ...prev,
                            [task.id]: {
                                name: task.name,
                                status: success ? 'success' : 'warning',
                                issues: success ? 0 : Math.floor(Math.random() * 3) + 1,
                                details: success ? '정상' : `${Math.floor(Math.random() * 3) + 1}개 문제 발견`
                            }
                        }));
                        
                        resolve();
                    }
                }, task.duration / 10);
            });
        }

        setScanStep('completed');
        setCurrentTask('스캔 완료');
        onComplete?.(scanResults);
    };

    // 모달 닫기
    const handleClose = () => {
        if (scanStep === 'scanning') {
            if (window.confirm('스캔이 진행 중입니다. 정말 취소하시겠습니까?')) {
                setScanStep('idle');
                setProgress(0);
                onClose();
            }
        } else {
            setScanStep('idle');
            setProgress(0);
            onClose();
        }
    };

    // 스캔 재시작
    const restartScan = () => {
        setScanStep('idle');
        setProgress(0);
        setScanResults({});
        setCurrentTask('');
    };

    if (!isOpen) return null;

    return (
        <div className="security-scan-modal-overlay" onClick={handleClose}>
            <div className="security-scan-modal" onClick={e => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <div className="modal-title">
                        <Shield className="title-icon" />
                        <h2>보안 스캔</h2>
                    </div>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="modal-content">
                    {scanStep === 'idle' && (
                        <div className="scan-setup">
                            <div className="scan-type-selector">
                                <h3>스캔 유형 선택</h3>
                                <div className="scan-options">
                                    <label className={`scan-option ${scanType === 'quick' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            value="quick"
                                            checked={scanType === 'quick'}
                                            onChange={(e) => setScanType(e.target.value)}
                                        />
                                        <div className="option-content">
                                            <strong>빠른 스캔</strong>
                                            <span>기본 보안 검사 (약 2분)</span>
                                        </div>
                                    </label>
                                    
                                    <label className={`scan-option ${scanType === 'full' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            value="full"
                                            checked={scanType === 'full'}
                                            onChange={(e) => setScanType(e.target.value)}
                                        />
                                        <div className="option-content">
                                            <strong>전체 스캔</strong>
                                            <span>종합 보안 검사 (약 5분)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="scan-description">
                                <h4>스캔 항목</h4>
                                <ul>
                                    <li>🌐 네트워크 보안 상태 검사</li>
                                    <li>🔍 시스템 취약점 분석</li>
                                    <li>🦠 악성코드 및 위협 탐지</li>
                                    {scanType === 'full' && (
                                        <>
                                            <li>🛡️ 방화벽 규칙 검증</li>
                                            <li>👤 접근 권한 분석</li>
                                            <li>📋 보안 로그 분석</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {scanStep === 'scanning' && (
                        <div className="scan-progress">
                            <div className="progress-info">
                                <h3>보안 스캔 진행 중...</h3>
                                <p className="current-task">
                                    <Loader2 className="spinner" size={16} />
                                    {currentTask}
                                </p>
                            </div>
                            
                            <ProgressBar 
                                value={progress}
                                variant="primary"
                                size="large"
                                animated={true}
                                glowing={true}
                                showPercentage={true}
                            />

                            <div className="scan-animation">
                                <div className="scan-radar"></div>
                                <div className="scan-waves">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {scanStep === 'completed' && (
                        <div className="scan-results">
                            <div className="results-header">
                                <CheckCircle className="success-icon" size={24} />
                                <h3>스캔 완료</h3>
                            </div>

                            <div className="results-summary">
                                <div className="summary-item">
                                    <span className="label">검사 항목:</span>
                                    <span className="value">{Object.keys(scanResults).length}개</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">발견된 문제:</span>
                                    <span className="value warning">
                                        {Object.values(scanResults).reduce((sum, result) => sum + (result.issues || 0), 0)}개
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">보안 등급:</span>
                                    <span className="value success">양호</span>
                                </div>
                            </div>

                            <div className="results-details">
                                <h4>상세 결과</h4>
                                <div className="results-list">
                                    {Object.values(scanResults).map((result, index) => (
                                        <div key={index} className={`result-item ${result.status}`}>
                                            <div className="result-icon">
                                                {result.status === 'success' ? 
                                                    <CheckCircle size={16} /> : 
                                                    <AlertTriangle size={16} />
                                                }
                                            </div>
                                            <div className="result-content">
                                                <div className="result-name">{result.name}</div>
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
                    {scanStep === 'idle' && (
                        <>
                            <Button variant="secondary" onClick={handleClose}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={startScan}>
                                스캔 시작
                            </Button>
                        </>
                    )}

                    {scanStep === 'scanning' && (
                        <Button variant="danger" onClick={handleClose}>
                            스캔 중지
                        </Button>
                    )}

                    {scanStep === 'completed' && (
                        <>
                            <Button variant="secondary" onClick={restartScan}>
                                다시 스캔
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

export default SecurityScanModal;