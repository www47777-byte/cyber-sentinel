// 📁 파일 위치: src/utils/formatters.js

// ==========================================
// 🎨 데이터 포맷팅 함수들
// ==========================================

// 위협 관련 포맷터
export const threatFormatters = {
    // 위협 레벨 라벨 포맷팅
    formatThreatLevel: (level) => {
        const levels = {
            low: { label: '낮음', color: '#00ff41', icon: '🟢' },
            medium: { label: '보통', color: '#ffaa00', icon: '🟡' },
            high: { label: '높음', color: '#ff6600', icon: '🟠' },
            critical: { label: '치명적', color: '#ff0040', icon: '🔴' }
        };
        return levels[level] || { label: '알 수 없음', color: '#666666', icon: '⚪' };
    },

    // 위협 타입 포맷팅
    formatThreatType: (type) => {
        const types = {
            'sql_injection': 'SQL 인젝션',
            'xss': 'XSS 공격',
            'brute_force': '무차별 공격',
            'malware': '악성코드',
            'phishing': '피싱',
            'dos': 'DOS 공격',
            'ddos': 'DDOS 공격',
            'port_scan': '포트 스캔',
            'vulnerability_scan': '취약점 스캔',
            'unauthorized_access': '무단 접근'
        };
        return types[type] || type;
    },

    // 공격 소스 포맷팅
    formatAttackSource: (source) => {
        const sources = {
            'external': '외부',
            'internal': '내부',
            'unknown': '알 수 없음',
            'bot': '봇',
            'human': '사람'
        };
        return sources[source] || source;
    },

    // 차단 상태 포맷팅
    formatBlockStatus: (status) => {
        const statuses = {
            'blocked': { label: '차단됨', color: '#ff0040', icon: '🚫' },
            'allowed': { label: '허용됨', color: '#00ff41', icon: '✅' },
            'monitoring': { label: '모니터링', color: '#ffaa00', icon: '👁️' },
            'quarantined': { label: '격리됨', color: '#ff6600', icon: '🔒' }
        };
        return statuses[status] || { label: status, color: '#666666', icon: '❓' };
    }
};

// 시스템 상태 포맷터
export const systemFormatters = {
    // 시스템 상태 포맷팅
    formatSystemStatus: (status) => {
        const statuses = {
            'online': { label: '온라인', color: '#00ff41', icon: '🟢' },
            'offline': { label: '오프라인', color: '#666666', icon: '⚫' },
            'warning': { label: '경고', color: '#ffaa00', icon: '⚠️' },
            'error': { label: '오류', color: '#ff0040', icon: '❌' },
            'maintenance': { label: '점검중', color: '#00ccff', icon: '🔧' }
        };
        return statuses[status] || { label: '알 수 없음', color: '#666666', icon: '❓' };
    },

    // CPU 사용률 포맷팅
    formatCpuUsage: (usage) => {
        const percentage = Math.round(usage);
        let level = 'normal';
        let color = '#00ff41';
        
        if (percentage > 80) {
            level = 'critical';
            color = '#ff0040';
        } else if (percentage > 60) {
            level = 'high';
            color = '#ff6600';
        } else if (percentage > 40) {
            level = 'medium';
            color = '#ffaa00';
        }
        
        return {
            percentage: `${percentage}%`,
            level,
            color,
            label: `CPU: ${percentage}%`
        };
    },

    // 메모리 사용률 포맷팅
    formatMemoryUsage: (used, total) => {
        const percentage = Math.round((used / total) * 100);
        const usedGB = (used / (1024 ** 3)).toFixed(1);
        const totalGB = (total / (1024 ** 3)).toFixed(1);
        
        let level = 'normal';
        let color = '#00ff41';
        
        if (percentage > 85) {
            level = 'critical';
            color = '#ff0040';
        } else if (percentage > 70) {
            level = 'high';
            color = '#ff6600';
        } else if (percentage > 50) {
            level = 'medium';
            color = '#ffaa00';
        }
        
        return {
            percentage: `${percentage}%`,
            used: `${usedGB}GB`,
            total: `${totalGB}GB`,
            level,
            color,
            label: `메모리: ${usedGB}GB / ${totalGB}GB (${percentage}%)`
        };
    },

    // 네트워크 속도 포맷팅
    formatNetworkSpeed: (bytesPerSecond) => {
        const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
        let value = bytesPerSecond;
        let unitIndex = 0;
        
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex++;
        }
        
        return {
            value: value.toFixed(1),
            unit: units[unitIndex],
            label: `${value.toFixed(1)} ${units[unitIndex]}`,
            raw: bytesPerSecond
        };
    },

    // 업타임 포맷팅
    formatUptime: (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) {
            return `${days}일 ${hours}시간 ${minutes}분`;
        } else if (hours > 0) {
            return `${hours}시간 ${minutes}분`;
        } else {
            return `${minutes}분`;
        }
    }
};

// AWS 서비스 포맷터
export const awsFormatters = {
    // Lambda 함수 상태 포맷팅
    formatLambdaStatus: (status) => {
        const statuses = {
            'Active': { label: '활성', color: '#00ff41', icon: '✅' },
            'Inactive': { label: '비활성', color: '#666666', icon: '⚫' },
            'Failed': { label: '실패', color: '#ff0040', icon: '❌' },
            'Pending': { label: '대기중', color: '#ffaa00', icon: '⏳' }
        };
        return statuses[status] || { label: status, color: '#666666', icon: '❓' };
    },

    // DynamoDB 상태 포맷팅
    formatDynamoDBStatus: (status) => {
        const statuses = {
            'ACTIVE': { label: '활성', color: '#00ff41', icon: '✅' },
            'CREATING': { label: '생성중', color: '#ffaa00', icon: '⏳' },
            'UPDATING': { label: '업데이트중', color: '#00ccff', icon: '🔄' },
            'DELETING': { label: '삭제중', color: '#ff6600', icon: '🗑️' },
            'INACCESSIBLE_ENCRYPTION_CREDENTIALS': { label: '암호화 오류', color: '#ff0040', icon: '🔒' }
        };
        return statuses[status] || { label: status, color: '#666666', icon: '❓' };
    },

    // WAF 규칙 결과 포맷팅
    formatWAFAction: (action) => {
        const actions = {
            'ALLOW': { label: '허용', color: '#00ff41', icon: '✅' },
            'BLOCK': { label: '차단', color: '#ff0040', icon: '🚫' },
            'COUNT': { label: '카운트', color: '#00ccff', icon: '📊' },
            'CAPTCHA': { label: '캡차', color: '#ffaa00', icon: '🤖' }
        };
        return actions[action] || { label: action, color: '#666666', icon: '❓' };
    },

    // GuardDuty 위협 심각도 포맷팅
    formatGuardDutySeverity: (severity) => {
        if (severity >= 8.5) {
            return { label: '높음', color: '#ff0040', level: 'HIGH' };
        } else if (severity >= 4.0) {
            return { label: '보통', color: '#ffaa00', level: 'MEDIUM' };
        } else {
            return { label: '낮음', color: '#00ff41', level: 'LOW' };
        }
    },

    // CloudWatch 메트릭 단위 포맷팅
    formatCloudWatchUnit: (unit, value) => {
        const units = {
            'Seconds': { label: '초', formatter: (v) => `${v.toFixed(2)}초` },
            'Microseconds': { label: '마이크로초', formatter: (v) => `${(v/1000).toFixed(2)}ms` },
            'Milliseconds': { label: '밀리초', formatter: (v) => `${v.toFixed(2)}ms` },
            'Bytes': { label: 'bytes', formatter: (v) => formatBytes(v) },
            'Kilobytes': { label: 'KB', formatter: (v) => `${v.toFixed(2)}KB` },
            'Megabytes': { label: 'MB', formatter: (v) => `${v.toFixed(2)}MB` },
            'Gigabytes': { label: 'GB', formatter: (v) => `${v.toFixed(2)}GB` },
            'Terabytes': { label: 'TB', formatter: (v) => `${v.toFixed(2)}TB` },
            'Percent': { label: '%', formatter: (v) => `${v.toFixed(1)}%` },
            'Count': { label: '개', formatter: (v) => Math.round(v).toLocaleString() },
            'Count/Second': { label: '개/초', formatter: (v) => `${v.toFixed(1)}/초` }
        };
        
        const unitConfig = units[unit] || { label: unit, formatter: (v) => v.toString() };
        return unitConfig.formatter(value);
    }
};

// 네트워크 관련 포맷터
export const networkFormatters = {
    // IP 주소 포맷팅 (마스킹)
    formatIPAddress: (ip, maskLevel = 0) => {
        if (maskLevel === 0) return ip;
        
        const parts = ip.split('.');
        switch (maskLevel) {
            case 1: // 마지막 옥텟 마스킹
                return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
            case 2: // 마지막 두 옥텟 마스킹
                return `${parts[0]}.${parts[1]}.***.***.`;
            case 3: // 첫 번째 옥텟만 표시
                return `${parts[0]}.***.***.***`;
            default:
                return ip;
        }
    },

    // 포트 번호 설명
    formatPortDescription: (port) => {
        const commonPorts = {
            20: 'FTP 데이터',
            21: 'FTP 제어',
            22: 'SSH',
            23: 'Telnet',
            25: 'SMTP',
            53: 'DNS',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            993: 'IMAPS',
            995: 'POP3S',
            3389: 'RDP',
            5432: 'PostgreSQL',
            3306: 'MySQL',
            6379: 'Redis',
            27017: 'MongoDB'
        };
        
        const description = commonPorts[port];
        return description ? `${port} (${description})` : port.toString();
    },

    // 프로토콜 포맷팅
    formatProtocol: (protocol) => {
        const protocols = {
            'tcp': 'TCP',
            'udp': 'UDP',
            'icmp': 'ICMP',
            'http': 'HTTP',
            'https': 'HTTPS',
            'ftp': 'FTP',
            'ssh': 'SSH',
            'smtp': 'SMTP'
        };
        return protocols[protocol.toLowerCase()] || protocol.toUpperCase();
    },

    // 대역폭 사용량 포맷팅
    formatBandwidth: (bytes, timeFrame = 'second') => {
        const speed = formatBytes(bytes);
        const timeFrames = {
            'second': '/초',
            'minute': '/분',
            'hour': '/시간',
            'day': '/일'
        };
        return `${speed}${timeFrames[timeFrame] || ''}`;
    }
};

// 보안 관련 포맷터
export const securityFormatters = {
    // 취약점 점수 포맷팅 (CVSS)
    formatCVSSScore: (score) => {
        let severity = 'None';
        let color = '#666666';
        
        if (score === 0) {
            severity = '없음';
            color = '#00ff41';
        } else if (score <= 3.9) {
            severity = '낮음';
            color = '#00ff41';
        } else if (score <= 6.9) {
            severity = '보통';
            color = '#ffaa00';
        } else if (score <= 8.9) {
            severity = '높음';
            color = '#ff6600';
        } else {
            severity = '치명적';
            color = '#ff0040';
        }
        
        return {
            score: score.toFixed(1),
            severity,
            color,
            label: `${score.toFixed(1)} (${severity})`
        };
    },

    // 암호화 강도 포맷팅
    formatEncryptionStrength: (bits) => {
        if (bits >= 256) {
            return { level: '매우 강함', color: '#00ff41', bits: `${bits}bit` };
        } else if (bits >= 128) {
            return { level: '강함', color: '#00ccff', bits: `${bits}bit` };
        } else if (bits >= 64) {
            return { level: '보통', color: '#ffaa00', bits: `${bits}bit` };
        } else {
            return { level: '약함', color: '#ff0040', bits: `${bits}bit` };
        }
    },

    // 로그인 시도 결과 포맷팅
    formatLoginAttempt: (result) => {
        const results = {
            'success': { label: '성공', color: '#00ff41', icon: '✅' },
            'failed': { label: '실패', color: '#ff0040', icon: '❌' },
            'blocked': { label: '차단됨', color: '#ff6600', icon: '🚫' },
            'suspicious': { label: '의심스러움', color: '#ffaa00', icon: '⚠️' }
        };
        return results[result] || { label: result, color: '#666666', icon: '❓' };
    }
};

// 차트 데이터 포맷터
export const chartFormatters = {
    // 시계열 데이터 포맷팅
    formatTimeSeriesData: (data, timeFormat = 'HH:mm') => {
        return data.map(item => ({
            ...item,
            time: new Date(item.timestamp).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                ...(timeFormat.includes('ss') && { second: '2-digit' })
            })
        }));
    },

    // 파이 차트 데이터 포맷팅
    formatPieChartData: (data, totalLabel = '전체') => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        return data.map(item => ({
            ...item,
            percentage: ((item.value / total) * 100).toFixed(1),
            label: `${item.name}: ${item.value} (${((item.value / total) * 100).toFixed(1)}%)`
        }));
    },

    // 막대 차트 색상 생성
    generateChartColors: (count, palette = 'cyber') => {
        const palettes = {
            cyber: ['#00ccff', '#00ff41', '#ffaa00', '#ff6600', '#ff0040'],
            blue: ['#001f3f', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970'],
            warm: ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#0074D9']
        };
        
        const colors = palettes[palette] || palettes.cyber;
        const result = [];
        
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        
        return result;
    }
};

// 헬퍼 함수들
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

// 유효성 검사 포맷터
export const validationFormatters = {
    // 오류 메시지 포맷팅
    formatErrorMessage: (field, rule, value) => {
        const messages = {
            required: `${field}은(는) 필수 입력 항목입니다.`,
            email: '올바른 이메일 주소를 입력해주세요.',
            minLength: `${field}은(는) 최소 ${rule.min}자 이상이어야 합니다.`,
            maxLength: `${field}은(는) 최대 ${rule.max}자까지 입력 가능합니다.`,
            pattern: `${field}의 형식이 올바르지 않습니다.`,
            numeric: `${field}은(는) 숫자만 입력 가능합니다.`,
            range: `${field}은(는) ${rule.min}과 ${rule.max} 사이의 값이어야 합니다.`
        };
        return messages[rule.type] || `${field} 검증에 실패했습니다.`;
    },

    // 성공 메시지 포맷팅
    formatSuccessMessage: (action) => {
        const messages = {
            save: '저장되었습니다.',
            update: '수정되었습니다.',
            delete: '삭제되었습니다.',
            create: '생성되었습니다.',
            send: '전송되었습니다.',
            login: '로그인되었습니다.',
            logout: '로그아웃되었습니다.'
        };
        return messages[action] || '작업이 완료되었습니다.';
    }
};

// 검색 결과 포맷터
export const searchFormatters = {
    // 검색 결과 하이라이트
    highlightSearchTerm: (text, searchTerm) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    // 검색 통계 포맷팅
    formatSearchStats: (total, page, pageSize, searchTime) => {
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, total);
        const timeMs = (searchTime * 1000).toFixed(0);
        
        return `총 ${total.toLocaleString()}개 결과 중 ${start}-${end}번째 (${timeMs}ms)`;
    }
};