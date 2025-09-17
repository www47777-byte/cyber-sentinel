import React, { useState, useEffect } from 'react';
import { X, Ban, Shield, Search, Plus, Trash2, Eye, AlertTriangle } from 'lucide-react';
import Button from '../../ui/Button';
import Table from '../../ui/Table';
import StatusIndicator from '../../ui/StatusIndicator';
import './IPManagementModal.css';

const IPManagementModal = ({ isOpen, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('blocked'); // blocked, whitelist, add
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIPs, setSelectedIPs] = useState([]);
    const [newIP, setNewIP] = useState('');
    const [newReason, setNewReason] = useState('');
    const [blockedIPs, setBlockedIPs] = useState([]);
    const [whitelistIPs, setWhitelistIPs] = useState([]);

    // 모의 데이터 생성
    useEffect(() => {
        if (isOpen) {
            setBlockedIPs([
                {
                    id: 1,
                    ip: '192.168.1.25',
                    reason: 'DDoS 공격 시도',
                    severity: 'critical',
                    blockedAt: new Date(Date.now() - 3600000).toISOString(),
                    country: 'Unknown',
                    attempts: 1247,
                    lastAttempt: new Date(Date.now() - 1800000).toISOString()
                },
                {
                    id: 2,
                    ip: '10.0.0.100',
                    reason: 'SQL 인젝션 탐지',
                    severity: 'high',
                    blockedAt: new Date(Date.now() - 7200000).toISOString(),
                    country: 'Russia',
                    attempts: 85,
                    lastAttempt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: 3,
                    ip: '172.16.0.50',
                    reason: '무차별 공격',
                    severity: 'high',
                    blockedAt: new Date(Date.now() - 10800000).toISOString(),
                    country: 'China',
                    attempts: 156,
                    lastAttempt: new Date(Date.now() - 5400000).toISOString()
                }
            ]);

            setWhitelistIPs([
                {
                    id: 1,
                    ip: '192.168.1.10',
                    reason: '관리자 IP',
                    addedAt: new Date(Date.now() - 86400000).toISOString(),
                    addedBy: 'admin'
                },
                {
                    id: 2,
                    ip: '10.0.0.5',
                    reason: '신뢰할 수 있는 API 서버',
                    addedAt: new Date(Date.now() - 172800000).toISOString(),
                    addedBy: 'system'
                }
            ]);
        }
    }, [isOpen]);

    // 차단된 IP 테이블 컬럼
    const blockedColumns = [
        {
            key: 'ip',
            title: 'IP 주소',
            render: (value, row) => (
                <div className="ip-cell">
                    <span className="ip-address">{value}</span>
                    {row.country && <span className="country-tag">{row.country}</span>}
                </div>
            )
        },
        {
            key: 'reason',
            title: '차단 사유'
        },
        {
            key: 'severity',
            title: '위험도',
            render: (value) => (
                <StatusIndicator 
                    status={value === 'critical' ? 'error' : value === 'high' ? 'warning' : 'success'}
                    variant="badge"
                    size="small"
                />
            )
        },
        {
            key: 'attempts',
            title: '시도 횟수',
            render: (value) => (
                <span className="attempts-count">{value.toLocaleString()}</span>
            )
        },
        {
            key: 'blockedAt',
            title: '차단 시간',
            render: (value) => new Date(value).toLocaleString('ko-KR')
        },
        {
            key: 'actions',
            title: '작업',
            render: (_, row) => (
                <div className="table-actions">
                    <button 
                        className="action-btn view"
                        onClick={() => viewIPDetails(row)}
                        title="상세보기"
                    >
                        <Eye size={14} />
                    </button>
                    <button 
                        className="action-btn unblock"
                        onClick={() => unblockIP(row.id)}
                        title="차단 해제"
                    >
                        <Shield size={14} />
                    </button>
                </div>
            )
        }
    ];

    // 화이트리스트 테이블 컬럼
    const whitelistColumns = [
        {
            key: 'ip',
            title: 'IP 주소',
            render: (value) => <span className="ip-address">{value}</span>
        },
        {
            key: 'reason',
            title: '등록 사유'
        },
        {
            key: 'addedBy',
            title: '등록자'
        },
        {
            key: 'addedAt',
            title: '등록 시간',
            render: (value) => new Date(value).toLocaleString('ko-KR')
        },
        {
            key: 'actions',
            title: '작업',
            render: (_, row) => (
                <div className="table-actions">
                    <button 
                        className="action-btn remove"
                        onClick={() => removeFromWhitelist(row.id)}
                        title="화이트리스트에서 제거"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    // IP 차단 해제
    const unblockIP = (id) => {
        if (window.confirm('이 IP의 차단을 해제하시겠습니까?')) {
            setBlockedIPs(prev => prev.filter(ip => ip.id !== id));
            onUpdate?.('unblock', id);
        }
    };

    // 화이트리스트에서 제거
    const removeFromWhitelist = (id) => {
        if (window.confirm('이 IP를 화이트리스트에서 제거하시겠습니까?')) {
            setWhitelistIPs(prev => prev.filter(ip => ip.id !== id));
            onUpdate?.('removeWhitelist', id);
        }
    };

    // IP 상세보기
    const viewIPDetails = (ipData) => {
        alert(`IP: ${ipData.ip}\n사유: ${ipData.reason}\n시도횟수: ${ipData.attempts}\n국가: ${ipData.country}`);
    };

    // 새 IP 추가
    const addNewIP = () => {
        if (!newIP.trim()) {
            alert('IP 주소를 입력해주세요.');
            return;
        }

        // IP 주소 유효성 검사
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(newIP)) {
            alert('올바른 IP 주소 형식을 입력해주세요.');
            return;
        }

        const newEntry = {
            id: Date.now(),
            ip: newIP,
            reason: newReason || '수동 추가',
            blockedAt: new Date().toISOString(),
            severity: 'medium',
            country: 'Manual',
            attempts: 0,
            lastAttempt: new Date().toISOString()
        };

        if (activeTab === 'blocked') {
            setBlockedIPs(prev => [newEntry, ...prev]);
            onUpdate?.('block', newEntry);
        } else {
            const whitelistEntry = {
                ...newEntry,
                addedAt: newEntry.blockedAt,
                addedBy: 'admin'
            };
            setWhitelistIPs(prev => [whitelistEntry, ...prev]);
            onUpdate?.('whitelist', whitelistEntry);
        }

        setNewIP('');
        setNewReason('');
        setActiveTab(activeTab === 'add' ? 'blocked' : activeTab);
    };

    // 필터링된 데이터
    const filteredBlockedIPs = blockedIPs.filter(ip => 
        ip.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ip.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredWhitelistIPs = whitelistIPs.filter(ip => 
        ip.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ip.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="ip-management-modal-overlay" onClick={onClose}>
            <div className="ip-management-modal" onClick={e => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <div className="modal-title">
                        <Ban className="title-icon" />
                        <h2>IP 차단 관리</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="tab-navigation">
                    <button 
                        className={`tab-btn ${activeTab === 'blocked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blocked')}
                    >
                        <Ban size={16} />
                        차단된 IP ({blockedIPs.length})
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'whitelist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('whitelist')}
                    >
                        <Shield size={16} />
                        화이트리스트 ({whitelistIPs.length})
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        <Plus size={16} />
                        IP 추가
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="modal-content">
                    {(activeTab === 'blocked' || activeTab === 'whitelist') && (
                        <>
                            {/* 검색 및 필터 */}
                            <div className="search-section">
                                <div className="search-input">
                                    <Search size={16} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="IP 주소 또는 사유로 검색..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* 테이블 */}
                            <div className="table-section">
                                {activeTab === 'blocked' ? (
                                    <Table
                                        data={filteredBlockedIPs}
                                        columns={blockedColumns}
                                        pagination={true}
                                        pageSize={10}
                                        hoverable={true}
                                        variant="cyber"
                                        empty="차단된 IP가 없습니다"
                                    />
                                ) : (
                                    <Table
                                        data={filteredWhitelistIPs}
                                        columns={whitelistColumns}
                                        pagination={true}
                                        pageSize={10}
                                        hoverable={true}
                                        variant="cyber"
                                        empty="화이트리스트가 비어있습니다"
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'add' && (
                        <div className="add-ip-section">
                            <div className="add-form">
                                <h3>새 IP 추가</h3>
                                
                                <div className="form-group">
                                    <label>IP 주소</label>
                                    <input
                                        type="text"
                                        placeholder="예: 192.168.1.100"
                                        value={newIP}
                                        onChange={(e) => setNewIP(e.target.value)}
                                        className="ip-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>사유</label>
                                    <input
                                        type="text"
                                        placeholder="차단/허용 사유를 입력하세요"
                                        value={newReason}
                                        onChange={(e) => setNewReason(e.target.value)}
                                        className="reason-input"
                                    />
                                </div>

                                <div className="add-options">
                                    <Button 
                                        variant="danger" 
                                        icon={<Ban size={16} />}
                                        onClick={() => {
                                            setActiveTab('blocked');
                                            addNewIP();
                                        }}
                                        fullWidth
                                    >
                                        차단 목록에 추가
                                    </Button>
                                    
                                    <Button 
                                        variant="success" 
                                        icon={<Shield size={16} />}
                                        onClick={() => {
                                            setActiveTab('whitelist');
                                            addNewIP();
                                        }}
                                        fullWidth
                                    >
                                        화이트리스트에 추가
                                    </Button>
                                </div>
                            </div>

                            <div className="ip-help">
                                <div className="help-header">
                                    <AlertTriangle size={16} />
                                    <span>주의사항</span>
                                </div>
                                <ul>
                                    <li>IP 주소는 정확한 형식으로 입력해주세요 (예: 192.168.1.100)</li>
                                    <li>차단된 IP는 모든 서비스 접근이 차단됩니다</li>
                                    <li>화이트리스트의 IP는 모든 보안 검사를 우회합니다</li>
                                    <li>자신의 IP를 실수로 차단하지 않도록 주의하세요</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* 모달 푸터 */}
                <div className="modal-footer">
                    <div className="footer-info">
                        {activeTab === 'blocked' && (
                            <span>총 {blockedIPs.length}개의 IP가 차단되어 있습니다</span>
                        )}
                        {activeTab === 'whitelist' && (
                            <span>총 {whitelistIPs.length}개의 IP가 화이트리스트에 있습니다</span>
                        )}
                    </div>
                    <Button variant="primary" onClick={onClose}>
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default IPManagementModal;