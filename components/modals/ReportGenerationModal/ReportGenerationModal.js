import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import Button from '../../ui/Button';
import ProgressBar from '../../ui/ProgressBar';
import './ReportGenerationModal.css';

const ReportGenerationModal = ({ isOpen, onClose, onGenerate }) => {
    const [step, setStep] = useState('setup'); // setup, generating, completed
    const [reportConfig, setReportConfig] = useState({
        type: 'security', // security, system, threat, comprehensive
        timeRange: '7d', // 1d, 7d, 30d, 90d, custom
        format: 'pdf', // pdf, excel, csv
        includeCharts: true,
        includeDetails: true,
        includeSummary: true,
        customStartDate: '',
        customEndDate: ''
    });
    const [progress, setProgress] = useState(0);
    const [currentTask, setCurrentTask] = useState('');
    const [generatedReport, setGeneratedReport] = useState(null);

    // 보고서 유형별 설정
    const reportTypes = {
        security: {
            name: '보안 분석 보고서',
            description: '보안 위협, 차단 현황, 취약점 분석',
            icon: '🛡️',
            sections: ['위협 탐지 현황', '차단 통계', '보안 취약점', '권장사항']
        },
        system: {
            name: '시스템 성능 보고서',
            description: 'AWS 서비스 상태, 성능 지표, 리소스 사용량',
            icon: '⚙️',
            sections: ['서비스 상태', '성능 지표', '리소스 사용량', '최적화 제안']
        },
        threat: {
            name: '위협 분석 보고서',
            description: '실시간 위협 현황, 공격 패턴, 대응 현황',
            icon: '🚨',
            sections: ['위협 현황', '공격 패턴', '대응 결과', '트렌드 분석']
        },
        comprehensive: {
            name: '종합 보고서',
            description: '보안, 시스템, 위협 분석을 포함한 전체 보고서',
            icon: '📋',
            sections: ['전체 요약', '보안 현황', '시스템 상태', '위협 분석', '종합 권장사항']
        }
    };

    const timeRanges = {
        '1d': '최근 1일',
        '7d': '최근 7일',
        '30d': '최근 30일',
        '90d': '최근 90일',
        'custom': '사용자 지정'
    };

    const formats = {
        pdf: { name: 'PDF', icon: '📄', description: '시각적 보고서, 프레젠테이션용' },
        excel: { name: 'Excel', icon: '📊', description: '데이터 분석, 가공 가능' },
        csv: { name: 'CSV', icon: '📈', description: '원시 데이터, 외부 도구 연동' }
    };

    // 보고서 생성 시작
    const startGeneration = async () => {
        setStep('generating');
        setProgress(0);

        const tasks = [
            { name: '데이터 수집 중', duration: 2000 },
            { name: '통계 분석 중', duration: 2500 },
            { name: '차트 생성 중', duration: 1800 },
            { name: '보고서 작성 중', duration: 2200 },
            { name: '파일 생성 중', duration: 1500 }
        ];

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            setCurrentTask(task.name);

            await new Promise(resolve => {
                let taskProgress = 0;
                const interval = setInterval(() => {
                    taskProgress += 10;
                    const overallProgress = ((i * 100) + taskProgress) / tasks.length;
                    setProgress(overallProgress);

                    if (taskProgress >= 100) {
                        clearInterval(interval);
                        resolve();
                    }
                }, task.duration / 10);
            });
        }

        // 생성된 보고서 정보
        const reportInfo = {
            id: Date.now().toString(),
            name: `${reportTypes[reportConfig.type].name}_${new Date().toISOString().split('T')[0]}`,
            type: reportConfig.type,
            format: reportConfig.format,
            size: Math.floor(Math.random() * 5000) + 1000, // KB
            createdAt: new Date().toISOString(),
            downloadUrl: '#', // 실제로는 서버에서 생성된 URL
            pageCount: reportConfig.type === 'comprehensive' ? 25 : 15
        };

        setGeneratedReport(reportInfo);
        setStep('completed');
        setCurrentTask('생성 완료');
        onGenerate?.(reportInfo);
    };

    // 설정 변경 핸들러
    const handleConfigChange = (key, value) => {
        setReportConfig(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // 다운로드 핸들러
    const handleDownload = () => {
        // 실제 환경에서는 파일 다운로드 로직
        console.log('다운로드:', generatedReport);
        
        // 시뮬레이션용 알림
        alert(`${generatedReport.name}.${generatedReport.format} 파일이 다운로드됩니다.`);
    };

    // 모달 닫기
    const handleClose = () => {
        if (step === 'generating') {
            if (window.confirm('보고서 생성이 진행 중입니다. 정말 취소하시겠습니까?')) {
                setStep('setup');
                setProgress(0);
                onClose();
            }
        } else {
            setStep('setup');
            setProgress(0);
            onClose();
        }
    };

    // 새 보고서 생성
    const createNewReport = () => {
        setStep('setup');
        setProgress(0);
        setGeneratedReport(null);
        setCurrentTask('');
    };

    if (!isOpen) return null;

    return (
        <div className="report-generation-modal-overlay" onClick={handleClose}>
            <div className="report-generation-modal" onClick={e => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className="modal-header">
                    <div className="modal-title">
                        <FileText className="title-icon" />
                        <h2>보고서 생성</h2>
                    </div>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="modal-content">
                    {step === 'setup' && (
                        <div className="report-setup">
                            {/* 보고서 유형 선택 */}
                            <div className="config-section">
                                <h3>보고서 유형</h3>
                                <div className="report-types">
                                    {Object.entries(reportTypes).map(([key, type]) => (
                                        <label 
                                            key={key} 
                                            className={`report-type-option ${reportConfig.type === key ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                value={key}
                                                checked={reportConfig.type === key}
                                                onChange={(e) => handleConfigChange('type', e.target.value)}
                                            />
                                            <div className="type-content">
                                                <div className="type-header">
                                                    <span className="type-icon">{type.icon}</span>
                                                    <strong>{type.name}</strong>
                                                </div>
                                                <p className="type-description">{type.description}</p>
                                                <div className="type-sections">
                                                    {type.sections.map((section, i) => (
                                                        <span key={i} className="section-tag">{section}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 기간 선택 */}
                            <div className="config-section">
                                <h3>분석 기간</h3>
                                <div className="time-range-selector">
                                    {Object.entries(timeRanges).map(([key, label]) => (
                                        <button
                                            key={key}
                                            className={`time-range-btn ${reportConfig.timeRange === key ? 'selected' : ''}`}
                                            onClick={() => handleConfigChange('timeRange', key)}
                                        >
                                            <Calendar size={16} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                
                                {reportConfig.timeRange === 'custom' && (
                                    <div className="custom-date-range">
                                        <div className="date-input">
                                            <label>시작일</label>
                                            <input
                                                type="date"
                                                value={reportConfig.customStartDate}
                                                onChange={(e) => handleConfigChange('customStartDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="date-input">
                                            <label>종료일</label>
                                            <input
                                                type="date"
                                                value={reportConfig.customEndDate}
                                                onChange={(e) => handleConfigChange('customEndDate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 출력 형식 */}
                            <div className="config-section">
                                <h3>출력 형식</h3>
                                <div className="format-selector">
                                    {Object.entries(formats).map(([key, format]) => (
                                        <label 
                                            key={key} 
                                            className={`format-option ${reportConfig.format === key ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                value={key}
                                                checked={reportConfig.format === key}
                                                onChange={(e) => handleConfigChange('format', e.target.value)}
                                            />
                                            <div className="format-content">
                                                <span className="format-icon">{format.icon}</span>
                                                <div className="format-info">
                                                    <strong>{format.name}</strong>
                                                    <span>{format.description}</span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 포함 옵션 */}
                            <div className="config-section">
                                <h3>포함 옵션</h3>
                                <div className="include-options">
                                    <label className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeSummary}
                                            onChange={(e) => handleConfigChange('includeSummary', e.target.checked)}
                                        />
                                        <span className="checkbox-label">
                                            <BarChart3 size={16} />
                                            요약 정보 포함
                                        </span>
                                    </label>
                                    
                                    <label className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeCharts}
                                            onChange={(e) => handleConfigChange('includeCharts', e.target.checked)}
                                        />
                                        <span className="checkbox-label">
                                            <BarChart3 size={16} />
                                            차트 및 그래프 포함
                                        </span>
                                    </label>
                                    
                                    <label className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            checked={reportConfig.includeDetails}
                                            onChange={(e) => handleConfigChange('includeDetails', e.target.checked)}
                                        />
                                        <span className="checkbox-label">
                                            <Filter size={16} />
                                            상세 데이터 포함
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="report-generation">
                            <div className="generation-info">
                                <h3>보고서 생성 중...</h3>
                                <p className="current-task">
                                    <span className="task-icon">📄</span>
                                    {currentTask}
                                </p>
                            </div>

                            <ProgressBar 
                                value={progress}
                                variant="primary"
                                size="large"
                                animated={true}
                                striped={true}
                                showPercentage={true}
                                label="생성 진행률"
                            />

                            <div className="generation-animation">
                                <div className="document-stack">
                                    <div className="document doc-1"></div>
                                    <div className="document doc-2"></div>
                                    <div className="document doc-3"></div>
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'completed' && (
                        <div className="report-completed">
                            <div className="completion-header">
                                <div className="success-icon">
                                    <FileText size={48} />
                                </div>
                                <h3>보고서 생성 완료</h3>
                                <p>요청하신 보고서가 성공적으로 생성되었습니다.</p>
                            </div>

                            <div className="report-info">
                                <div className="report-preview">
                                    <div className="preview-icon">{formats[generatedReport.format].icon}</div>
                                    <div className="report-details">
                                        <div className="report-name">{generatedReport.name}</div>
                                        <div className="report-meta">
                                            <span>형식: {formats[generatedReport.format].name}</span>
                                            <span>크기: {(generatedReport.size / 1024).toFixed(1)} MB</span>
                                            <span>페이지: {generatedReport.pageCount}p</span>
                                        </div>
                                        <div className="creation-time">
                                            생성일시: {new Date(generatedReport.createdAt).toLocaleString('ko-KR')}
                                        </div>
                                    </div>
                                </div>

                                <div className="report-actions">
                                    <Button 
                                        variant="primary" 
                                        icon={<Download size={16} />}
                                        onClick={handleDownload}
                                        size="large"
                                    >
                                        다운로드
                                    </Button>
                                </div>
                            </div>

                            <div className="report-summary">
                                <h4>보고서 요약</h4>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">보고서 유형:</span>
                                        <span className="summary-value">{reportTypes[reportConfig.type].name}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">분석 기간:</span>
                                        <span className="summary-value">{timeRanges[reportConfig.timeRange]}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">포함 섹션:</span>
                                        <span className="summary-value">{reportTypes[reportConfig.type].sections.length}개</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">생성 옵션:</span>
                                        <span className="summary-value">
                                            {[
                                                reportConfig.includeSummary && '요약',
                                                reportConfig.includeCharts && '차트',
                                                reportConfig.includeDetails && '상세정보'
                                            ].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 모달 푸터 */}
                <div className="modal-footer">
                    {step === 'setup' && (
                        <>
                            <Button variant="secondary" onClick={handleClose}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={startGeneration}>
                                보고서 생성
                            </Button>
                        </>
                    )}

                    {step === 'generating' && (
                        <Button variant="danger" onClick={handleClose}>
                            생성 중지
                        </Button>
                    )}

                    {step === 'completed' && (
                        <>
                            <Button variant="secondary" onClick={createNewReport}>
                                새 보고서
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

export default ReportGenerationModal;