import React, { useState } from 'react';
import { X, Eye, MapPin, Clock, AlertTriangle, Shield, Ban, CheckCircle } from 'lucide-react';
import Button from '../../ui/Button';
import StatusIndicator from '../../ui/StatusIndicator';
import Card from '../../ui/Card';
import './ThreatDetailModal.css';

const ThreatDetailModal = ({ isOpen, onClose, threatData, onAction }) => {
    const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, technical, actions

    if (!isOpen || !threatData) return null;

    // 위협 데이터 기본값 설정
    const threat = {
        ip: '192.168.1.25',
        type: 'DDoS Attack',
        severity: 'critical',
        riskScore: 95,
        location: 'Russia',
        detectedAt: new Date().toISOString(),
        attempts: 1247,
        pattern: 'Massive request flood',
        status: 'active',
        ...threatData
    };

    // 위협 액션 처리
    const handleAction = (action) => {
        onAction?.(threat, action);
        onClose();
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

    return (
        <div className="threat-detail-modal-overlay" onClick={onClose}>
            <div className="threat-detail-modal" onClick={e => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <div className="modal-title">
                        <Eye className="title-icon" />
                        <div className="title-content">
                            <h2>위협 상세 정보</h2>
                            <span className="threat-ip">{threat.ip}</span>
                        </div>
                        <StatusIndicator 
                            status={threat.severity === 'critical' ? 'error' : threat.severity === 'high' ? 'warning' : 'success'}
                            variant="badge"
                            size="small"
                        />
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 위협 요약 카드 */}
                <div className="threat-summary">
                    <Card variant="glass" className="summary-card">
                        <div className="summary-grid">
                            <div className="summary-item">
                                <div className="summary-icon">
                                    <AlertTriangle style={{ color: getSeverityColor(threat.severity) }} />
                                </div>
                                <div className="summary-content">
                                    <div className="summary-label">위험도</div>
                                    <div className="summary-value" style={{ color: getSeverityColor(threat.severity) }}>
                                        {threat.riskScore}/100
                                    </div>
                                </div>
                            </div>
                            
                            <div className="summary-item">
                                <div className="summary-icon">
                                    <MapPin className="location-icon" />
                                </div>
                                <div className="summary-content">
                                    <div className="summary-label">위치</div>
                                    <div className="summary-value">{threat.location || 'Unknown'}</div>
                                </div>
                            </div>
                            
                            <div className="summary-item">
                                <div className="summary-icon">
                                    <Clock className="time-icon" />
                                </div>
                                <div className="summary-content">
                                    <div className="summary-label">탐지 시간</div>
                                    <div className="summary-value">
                                        {new Date(threat.detectedAt).toLocaleString('ko-KR')}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="summary-item">
                                <div className="summary-icon">
                                    <Shield className="attempts-icon" />
                                </div>
                                <div className="summary-content">
                                    <div className="summary-label">시도 횟수</div>
                                    <div className="summary-value">{threat.attempts?.toLocaleString() || 0}회</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 탭 네비게이션 */}
                <div className="tab-navigation">
                    <button 
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        개요
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        타임라인
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
                        onClick={() => setActiveTab('technical')}
                    >
                        기술 정보
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('actions')}
                    >
                        대응 조치
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="modal-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <Card title="공격 정보" variant="primary">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">공격 유형:</span>
                                        <span className="info-value">{threat.type}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">공격 패턴:</span>
                                        <span className="info-value">{threat.pattern}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">대상 서비스:</span>
                                        <span className="info-value">웹 서버 (포트 80, 443)</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">사용된 도구:</span>
                                        <span className="info-value">알 수 없음</span>
                                    </div>
                                </div>
                            </Card>

                            <Card title="지리적 정보" variant="success">
                                <div className="geo-info">
                                    <div className="geo-item">
                                        <span className="geo-label">국가:</span>
                                        <span className="geo-value">{threat.location}</span>
                                    </div>
                                    <div className="geo-item">
                                        <span className="geo-label">ISP:</span>
                                        <span className="geo-value">알 수 없음</span>
                                    </div>
                                    <div className="geo-item">
                                        <span className="geo-label">조직:</span>
                                        <span className="geo-value">알 수 없음</span>
                                    </div>
                                </div>
                            </Card>

                            <Card title="위험 평가" variant="warning">
                                <div className="risk-assessment">
                                    <div className="risk-score">
                                        <div className="score-circle" style={{ 
                                            background: `conic-gradient(${getSeverityColor(threat.severity)} ${threat.riskScore}%, transparent 0)` 
                                        }}>
                                            <span className="score-number">{threat.riskScore}</span>
                                        </div>
                                        <div className="risk-details">
                                            <div className="risk-level" style={{ color: getSeverityColor(threat.severity) }}>
                                                {threat.severity.toUpperCase()}
                                            </div>
                                            <div className="risk-description">
                                                {threat.severity === 'critical' && '즉시 대응 필요'}
                                                {threat.severity === 'high' && '신속한 대응 권장'}
                                                {threat.severity === 'medium' && '주의 깊은 모니터링'}
                                                {threat.severity === 'low' && '정기적인 관찰'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="timeline-tab">
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-time">
                                        {new Date(threat.detectedAt).toLocaleTimeString('ko-KR')}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">위협 최초 탐지</div>
                                        <div className="timeline-description">
                                            {threat.ip}에서 {threat.type} 패턴 감지
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="timeline-item">
                                    <div className="timeline-time">
                                        {new Date(Date.now() - 60000).toLocaleTimeString('ko-KR')}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">공격 패턴 분석</div>
                                        <div className="timeline-description">
                                            AI 엔진에 의한 위협 분류 완료
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="timeline-item">
                                    <div className="timeline-time">
                                        {new Date(Date.now() - 30000).toLocaleTimeString('ko-KR')}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">위험도 평가</div>
                                        <div className="timeline-description">
                                            위험도 {threat.riskScore}점으로 평가됨
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="timeline-item current">
                                    <div className="timeline-time">현재</div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">대응 대기 중</div>
                                        <div className="timeline-description">
                                            관리자의 수동 대응을 기다리고 있습니다
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'technical' && (
                        <div className="technical-tab">
                            <Card title="네트워크 정보" variant="glass">
                                <div className="technical-grid">
                                    <div className="tech-item">
                                        <span className="tech-label">소스 IP:</span>
                                        <span className="tech-value font-mono">{threat.ip}</span>
                                    </div>
                                    <div className="tech-item">
                                        <span className="tech-label">User-Agent:</span>
                                        <span className="tech-value">Mozilla/5.0 (Suspicious Bot)</span>
                                    </div>
                                    <div className="tech-item">
                                        <span className="tech-label">요청 메서드:</span>
                                        <span className="tech-value">GET, POST</span>
                                    </div>
                                    <div className="tech-item">
                                        <span className="tech-label">포트:</span>
                                        <span className="tech-value">80, 443</span>
                                    </div>
                                </div>
                            </Card>

                            <Card title="페이로드 분석" variant="glass">
                                <div className="payload-info">
                                    <div className="payload-sample">
                                        <div className="payload-label">요청 샘플:</div>
                                        <pre className="payload-content">
{`GET /admin/login HTTP/1.1
Host: example.com
User-Agent: Bot/1.0
X-Forwarded-For: ${threat.ip}`}
                                        </pre>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'actions' && (
                        <div className="actions-tab">
                            <Card title="권장 대응 조치" variant="primary">
                                <div className="recommended-action">
                                    <div className="action-recommendation">
                                        <Shield className="action-icon recommended" />
                                        <div className="action-content">
                                            <div className="action-title">권장: IP 차단</div>
                                            <div className="action-description">
                                                위험도가 높으므로 즉시 차단을 권장합니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card title="사용 가능한 액션" variant="glass">
                                <div className="action-buttons">
                                    <Button 
                                        variant="danger" 
                                        icon={<Ban size={16} />}
                                        onClick={() => handleAction('block')}
                                        fullWidth
                                    >
                                        IP 차단
                                    </Button>
                                    
                                    <Button 
                                        variant="warning" 
                                        icon={<Eye size={16} />}
                                        onClick={() => handleAction('monitor')}
                                        fullWidth
                                    >
                                        모니터링 강화
                                    </Button>
                                    
                                    <Button 
                                        variant="success" 
                                        icon={<CheckCircle size={16} />}
                                        onClick={() => handleAction('allow')}
                                        fullWidth
                                    >
                                        허용 (화이트리스트)
                                    </Button>
                                </div>
                            </Card>

                            <Card title="추가 옵션" variant="glass">
                                <div className="additional-options">
                                    <label className="option-checkbox">
                                        <input type="checkbox" />
                                        <span>유사한 패턴의 IP도 함께 차단</span>
                                    </label>
                                    <label className="option-checkbox">
                                        <input type="checkbox" />
                                        <span>보안팀에 알림 전송</span>
                                    </label>
                                    <label className="option-checkbox">
                                        <input type="checkbox" />
                                        <span>상세 로그 기록</span>
                                    </label>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* 모달 푸터 */}
                <div className="modal-footer">
                    <div className="footer-info">
                        <span>위협 ID: {threat.id || 'TH-' + Date.now()}</span>
                    </div>
                    <Button variant="secondary" onClick={onClose}>
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ThreatDetailModal;