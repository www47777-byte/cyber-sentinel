import React, { useState, useEffect } from 'react';
import { X, Sword, Shield, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../../ui/Button';
import StatusIndicator from '../../ui/StatusIndicator';
import './ManualBattleModal.css';

const ManualBattleModal = ({ isOpen, onClose, onBattleAction }) => {
    const [battleMode, setBattleMode] = useState('idle'); // idle, active, victory, defeat
    const [pendingThreats, setPendingThreats] = useState([]);
    const [battleStats, setBattleStats] = useState({
        totalThreats: 0,
        defeated: 0,
        blocked: 0,
        allowed: 0
    });

    // 위협 목록 시뮬레이션
    useEffect(() => {
        if (isOpen) {
            const mockThreats = [
                {
                    id: 1,
                    ip: '192.168.1.25',
                    type: 'DDoS Attack',
                    severity: 'critical',
                    riskScore: 95,
                    location: 'Russia',
                    detectedAt: new Date(Date.now() - 30000).toISOString(),
                    attempts: 1247,
                    pattern: 'Massive request flood',
                    recommendation: 'BLOCK'
                },
                {
                    id: 2,
                    ip: '10.0.0.100',
                    type: 'SQL Injection',
                    severity: 'high',
                    riskScore: 87,
                    location: 'China',
                    detectedAt: new Date(Date.now() - 120000).toISOString(),
                    attempts: 156,
                    pattern: 'Database query manipulation',
                    recommendation: 'BLOCK'
                },
                {
                    id: 3,
                    ip: '172.16.0.15',
                    type: 'Suspicious Scan',
                    severity: 'medium',
                    riskScore: 65,
                    location: 'Unknown',
                    detectedAt: new Date(Date.now() - 300000).toISOString(),
                    attempts: 23,
                    pattern: 'Port scanning activity',
                    recommendation: 'MONITOR'
                },
                {
                    id: 4,
                    ip: '203.0.113.45',
                    type: 'Brute Force',
                    severity: 'high',
                    riskScore: 82,
                    location: 'Brazil',
                    detectedAt: new Date(Date.now() - 180000).toISOString(),
                    attempts: 445,
                    pattern: 'Login attempt patterns',
                    recommendation: 'BLOCK'
                }
            ];

            setPendingThreats(mockThreats);
            setBattleStats({
                totalThreats: mockThreats.length,
                defeated: 0,
                blocked: 0,
                allowed: 0
            });
        }
    }, [isOpen]);

    // 전투 모드 활성화
    const activateBattleMode = () => {
        setBattleMode('active');
    };

    // 위협 처리
    const handleThreat = (threatId, action) => {
        const threat = pendingThreats.find(t => t.id === threatId);
        if (!threat) return;

        // 위협 목록에서 제거
        setPendingThreats(prev => prev.filter(t => t.id !== threatId));

        // 통계 업데이트
        setBattleStats(prev => ({
            ...prev,
            defeated: prev.defeated + 1,
            [action]: prev[action] + 1
        }));

        // 부모 컴포넌트에 알림
        onBattleAction?.(threat, action);

        // 모든 위협을 처리했으면 승리
        if (pendingThreats.length === 1) {
            setBattleMode('victory');
        }
    };

    // 모든 위협 자동 차단
    const blockAllThreats = () => {
        if (window.confirm('모든 위협을 차단하시겠습니까?')) {
            pendingThreats.forEach(threat => {
                onBattleAction?.(threat, 'blocked');
            });

            setBattleStats(prev => ({
                ...prev,
                defeated: prev.totalThreats,
                blocked: prev.totalThreats
            }));

            setPendingThreats([]);
            setBattleMode('victory');
        }
    };

    // 위협 무시 (모든 허용)
    const allowAllThreats = () => {
        if (window.confirm('모든 위협을 허용하시겠습니까? 이는 위험할 수 있습니다.')) {
            pendingThreats.forEach(threat => {
                onBattleAction?.(threat, 'allowed');
            });

            setBattleStats(prev => ({
                ...prev,
                defeated: prev.totalThreats,
                allowed: prev.totalThreats
            }));

            setPendingThreats([]);
            setBattleMode('defeat');
        }
    };

    // 위험도에 따른 색상
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'var(--danger-red)';
            case 'high': return 'var(--warning-yellow)';
            case 'medium': return 'var(--info-cyan)';
            case 'low': return 'var(--success-green)';
            default: return 'var(--text-muted)';
        }
    };

    // 권장 액션에 따른 아이콘
    const getRecommendationIcon = (recommendation) => {
        switch (recommendation) {
            case 'BLOCK': return <Shield className="block-icon" size={16} />;
            case 'MONITOR': return <Target className="monitor-icon" size={16} />;
            case 'ALLOW': return <CheckCircle className="allow-icon" size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="manual-battle-modal-overlay" onClick={onClose}>
            <div className="manual-battle-modal" onClick={e => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <div className="modal-title">
                        <Sword className="title-icon" />
                        <h2>수동 전투 모드</h2>
                        <StatusIndicator 
                            status={battleMode === 'active' ? 'active' : battleMode === 'victory' ? 'success' : 'idle'}
                            variant="badge"
                            size="small"
                        />
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 전투 통계 */}
                <div className="battle-stats">
                    <div className="stat-item">
                        <div className="stat-icon total">
                            <Target size={20} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{battleStats.totalThreats}</div>
                            <div className="stat-label">총 위협</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon defeated">
                            <Sword size={20} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{battleStats.defeated}</div>
                            <div className="stat-label">처리완료</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon blocked">
                            <Shield size={20} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{battleStats.blocked}</div>
                            <div className="stat-label">차단</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon allowed">
                            <CheckCircle size={20} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{battleStats.allowed}</div>
                            <div className="stat-label">허용</div>
                        </div>
                    </div>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="modal-content">
                    {battleMode === 'idle' && (
                        <div className="battle-start">
                            <div className="start-info">
                                <h3>수동 전투 모드</h3>
                                <p>감지된 위협에 대해 수동으로 대응 조치를 결정할 수 있습니다.</p>
                                
                                <div className="threat-preview">
                                    <h4>대기 중인 위협: {pendingThreats.length}개</h4>
                                    <div className="threat-summary">
                                        {pendingThreats.map(threat => (
                                            <div key={threat.id} className="threat-item-preview">
                                                <div 
                                                    className="severity-dot"
                                                    style={{ backgroundColor: getSeverityColor(threat.severity) }}
                                                ></div>
                                                <span className="threat-ip">{threat.ip}</span>
                                                <span className="threat-type">{threat.type}</span>
                                                <span className="threat-score">{threat.riskScore}점</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="battle-controls">
                                <Button 
                                    variant="primary" 
                                    size="large"
                                    icon={<Sword size={20} />}
                                    onClick={activateBattleMode}
                                >
                                    전투 시작
                                </Button>
                            </div>
                        </div>
                    )}

                    {battleMode === 'active' && (
                        <div className="active-battle">
                            <div className="battle-header">
                                <h3>위협 대응 중... ({pendingThreats.length}개 남음)</h3>
                                <div className="quick-actions">
                                    <Button 
                                        variant="danger" 
                                        size="small"
                                        onClick={blockAllThreats}
                                    >
                                        모두 차단
                                    </Button>
                                    <Button 
                                        variant="warning" 
                                        size="small"
                                        onClick={allowAllThreats}
                                    >
                                        모두 허용
                                    </Button>
                                </div>
                            </div>

                            <div className="threats-list">
                                {pendingThreats.map(threat => (
                                    <div key={threat.id} className="threat-card">
                                        <div className="threat-header">
                                            <div className="threat-title">
                                                <div 
                                                    className="severity-indicator"
                                                    style={{ backgroundColor: getSeverityColor(threat.severity) }}
                                                ></div>
                                                <div className="threat-info">
                                                    <div className="threat-ip">{threat.ip}</div>
                                                    <div className="threat-location">{threat.location}</div>
                                                </div>
                                                <div className="threat-score">
                                                    <span className="score-number">{threat.riskScore}</span>
                                                    <span className="score-label">위험도</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="threat-details">
                                            <div className="detail-row">
                                                <span className="detail-label">공격 유형:</span>
                                                <span className="detail-value">{threat.type}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">탐지 시간:</span>
                                                <span className="detail-value">
                                                    {new Date(threat.detectedAt).toLocaleTimeString('ko-KR')}
                                                </span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">시도 횟수:</span>
                                                <span className="detail-value">{threat.attempts}회</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">패턴:</span>
                                                <span className="detail-value">{threat.pattern}</span>
                                            </div>
                                            <div className="detail-row recommendation">
                                                <span className="detail-label">권장 조치:</span>
                                                <span className="detail-value recommendation-value">
                                                    {getRecommendationIcon(threat.recommendation)}
                                                    {threat.recommendation}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="threat-actions">
                                            <Button 
                                                variant="danger"
                                                size="small"
                                                icon={<Shield size={16} />}
                                                onClick={() => handleThreat(threat.id, 'blocked')}
                                            >
                                                차단
                                            </Button>
                                            <Button 
                                                variant="warning"
                                                size="small"
                                                icon={<Target size={16} />}
                                                onClick={() => handleThreat(threat.id, 'monitored')}
                                            >
                                                감시
                                            </Button>
                                            <Button 
                                                variant="success"
                                                size="small"
                                                icon={<CheckCircle size={16} />}
                                                onClick={() => handleThreat(threat.id, 'allowed')}
                                            >
                                                허용
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {battleMode === 'victory' && (
                        <div className="battle-result victory">
                            <div className="result-icon">
                                <CheckCircle size={64} className="victory-icon" />
                            </div>
                            <h3>전투 승리!</h3>
                            <p>모든 위협을 성공적으로 처리했습니다.</p>
                            
                            <div className="result-summary">
                                <div className="summary-row">
                                    <span>총 처리된 위협:</span>
                                    <span>{battleStats.defeated}개</span>
                                </div>
                                <div className="summary-row">
                                    <span>차단된 위협:</span>
                                    <span>{battleStats.blocked}개</span>
                                </div>
                                <div className="summary-row">
                                    <span>허용된 위협:</span>
                                    <span>{battleStats.allowed}개</span>
                                </div>
                                <div className="summary-row">
                                    <span>성공률:</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {battleMode === 'defeat' && (
                        <div className="battle-result defeat">
                            <div className="result-icon">
                                <AlertTriangle size={64} className="defeat-icon" />
                            </div>
                            <h3>주의 필요</h3>
                            <p>일부 위협이 허용되었습니다. 시스템을 주의 깊게 모니터링하세요.</p>
                            
                            <div className="result-summary">
                                <div className="summary-row">
                                    <span>총 처리된 위협:</span>
                                    <span>{battleStats.defeated}개</span>
                                </div>
                                <div className="summary-row">
                                    <span>차단된 위협:</span>
                                    <span>{battleStats.blocked}개</span>
                                </div>
                                <div className="summary-row warning">
                                    <span>허용된 위협:</span>
                                    <span>{battleStats.allowed}개</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 모달 푸터 */}
                <div className="modal-footer">
                    {battleMode === 'idle' && (
                        <Button variant="secondary" onClick={onClose}>
                            취소
                        </Button>
                    )}

                    {battleMode === 'active' && (
                        <div className="battle-progress">
                            <span>진행률: {Math.round((battleStats.defeated / battleStats.totalThreats) * 100)}%</span>
                        </div>
                    )}

                    {(battleMode === 'victory' || battleMode === 'defeat') && (
                        <>
                            <Button 
                                variant="secondary" 
                                onClick={() => {
                                    setBattleMode('idle');
                                    setBattleStats({ totalThreats: 0, defeated: 0, blocked: 0, allowed: 0 });
                                    setPendingThreats([]);
                                }}
                            >
                                새 전투
                            </Button>
                            <Button variant="primary" onClick={onClose}>
                                완료
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualBattleModal;