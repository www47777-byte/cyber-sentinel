// 📁 파일 위치: src/data/threatTypes.js

// ==========================================
// 🚨 위협 유형 정의 데이터
// ==========================================

// 기본 위협 유형 카테고리
export const THREAT_CATEGORIES = {
    WEB_ATTACKS: {
        id: 'web_attacks',
        name: '웹 애플리케이션 공격',
        description: '웹 애플리케이션을 대상으로 하는 공격',
        icon: '🌐',
        color: '#ff6600',
        severity: 'high'
    },
    NETWORK_ATTACKS: {
        id: 'network_attacks',
        name: '네트워크 공격',
        description: '네트워크 프로토콜을 악용한 공격',
        icon: '🌐',
        color: '#ff0040',
        severity: 'critical'
    },
    MALWARE: {
        id: 'malware',
        name: '악성코드',
        description: '악성 소프트웨어 및 바이러스',
        icon: '🦠',
        color: '#ff0040',
        severity: 'critical'
    },
    SOCIAL_ENGINEERING: {
        id: 'social_engineering',
        name: '사회공학 공격',
        description: '인간의 심리를 악용한 공격',
        icon: '🎭',
        color: '#ffaa00',
        severity: 'medium'
    },
    RECONNAISSANCE: {
        id: 'reconnaissance',
        name: '정찰 활동',
        description: '시스템 정보 수집 활동',
        icon: '🕵️',
        color: '#00ff41',
        severity: 'low'
    },
    PRIVILEGE_ESCALATION: {
        id: 'privilege_escalation',
        name: '권한 상승',
        description: '시스템 권한을 획득하려는 시도',
        icon: '⬆️',
        color: '#ff6600',
        severity: 'high'
    },
    DATA_EXFILTRATION: {
        id: 'data_exfiltration',
        name: '데이터 유출',
        description: '민감한 데이터를 외부로 전송하려는 시도',
        icon: '📤',
        color: '#ff0040',
        severity: 'critical'
    }
};

// 상세 위협 유형 정의
export const THREAT_TYPES = {
    // 웹 애플리케이션 공격
    sql_injection: {
        id: 'sql_injection',
        name: 'SQL 인젝션',
        category: 'web_attacks',
        description: 'SQL 쿼리를 조작하여 데이터베이스에 무단 접근하려는 시도',
        severity: 'high',
        commonPorts: [80, 443, 3306, 5432],
        indicators: [
            'UNION SELECT',
            'DROP TABLE',
            'INSERT INTO',
            'DELETE FROM',
            '1=1',
            'OR 1=1',
            'admin\'--'
        ],
        preventionMethods: [
            '매개변수화된 쿼리 사용',
            '입력 검증 및 이스케이프',
            '최소 권한 원칙 적용',
            'WAF 규칙 적용'
        ],
        mitreTechnique: 'T1190',
        cveExamples: ['CVE-2021-44228', 'CVE-2020-1472']
    },
    
    xss: {
        id: 'xss',
        name: 'Cross-Site Scripting (XSS)',
        category: 'web_attacks',
        description: '악성 스크립트를 웹 페이지에 삽입하여 사용자를 공격',
        severity: 'medium',
        commonPorts: [80, 443],
        indicators: [
            '<script>',
            'javascript:',
            'onload=',
            'onerror=',
            'eval(',
            'document.cookie',
            'alert('
        ],
        preventionMethods: [
            '입력 검증 및 이스케이프',
            'Content Security Policy 적용',
            'HttpOnly 쿠키 사용',
            '출력 인코딩'
        ],
        mitreTechnique: 'T1189',
        cveExamples: ['CVE-2021-44515', 'CVE-2020-24009']
    },

    csrf: {
        id: 'csrf',
        name: 'Cross-Site Request Forgery (CSRF)',
        category: 'web_attacks',
        description: '사용자 모르게 악의적인 요청을 전송하도록 유도',
        severity: 'medium',
        commonPorts: [80, 443],
        indicators: [
            '예상치 못한 POST 요청',
            '인증된 사용자의 의심스러운 액션',
            'Referer 헤더 부재'
        ],
        preventionMethods: [
            'CSRF 토큰 사용',
            'SameSite 쿠키 속성',
            'Referer 검증',
            '중요 작업 재인증'
        ],
        mitreTechnique: 'T1189',
        cveExamples: ['CVE-2021-26855', 'CVE-2020-1745']
    },

    // 네트워크 공격
    brute_force: {
        id: 'brute_force',
        name: '무차별 공격 (Brute Force)',
        category: 'network_attacks',
        description: '반복적인 로그인 시도로 계정을 침해하려는 공격',
        severity: 'medium',
        commonPorts: [22, 23, 21, 25, 110, 143, 993, 995, 3389],
        indicators: [
            '반복적인 로그인 실패',
            '동일 IP에서 다수 계정 시도',
            '일반적인 비밀번호 패턴',
            '높은 빈도의 인증 요청'
        ],
        preventionMethods: [
            '계정 잠금 정책',
            '강력한 비밀번호 정책',
            '2단계 인증',
            'IP 기반 차단',
            '로그인 지연 구현'
        ],
        mitreTechnique: 'T1110',
        cveExamples: ['CVE-2020-1472', 'CVE-2019-0708']
    },

    ddos: {
        id: 'ddos',
        name: 'DDoS 공격',
        category: 'network_attacks',
        description: '다수의 소스에서 동시에 대상 시스템을 마비시키려는 공격',
        severity: 'critical',
        commonPorts: [80, 443, 53, 123],
        indicators: [
            '비정상적으로 높은 트래픽',
            '동일한 요청의 반복',
            '다수 IP에서의 동시 접근',
            '서비스 응답 속도 저하'
        ],
        preventionMethods: [
            'DDoS 보호 서비스',
            '트래픽 분산',
            '레이트 리미팅',
            'CDN 사용',
            '이상 트래픽 탐지'
        ],
        mitreTechnique: 'T1498',
        cveExamples: ['CVE-2020-17530', 'CVE-2019-17571']
    },

    port_scan: {
        id: 'port_scan',
        name: '포트 스캔',
        category: 'reconnaissance',
        description: '시스템의 열린 포트를 탐지하려는 정찰 활동',
        severity: 'low',
        commonPorts: ['all'],
        indicators: [
            '짧은 시간 내 다수 포트 접근',
            'TCP SYN 패킷 다량 발생',
            '응답하지 않는 포트 접근',
            '순차적 포트 접근 패턴'
        ],
        preventionMethods: [
            '불필요한 포트 차단',
            '방화벽 규칙 강화',
            '포트 숨김 기술',
            '침입 탐지 시스템'
        ],
        mitreTechnique: 'T1046',
        cveExamples: []
    },

    // 악성코드
    ransomware: {
        id: 'ransomware',
        name: '랜섬웨어',
        category: 'malware',
        description: '파일을 암호화하고 몸값을 요구하는 악성코드',
        severity: 'critical',
        commonPorts: [445, 139, 3389],
        indicators: [
            '대량 파일 암호화 활동',
            '의심스러운 파일 확장자 변경',
            '몸값 요구 메시지',
            '시스템 복구 기능 비활성화',
            'C&C 서버 통신'
        ],
        preventionMethods: [
            '정기적 백업',
            '엔드포인트 보호',
            '사용자 교육',
            '시스템 패치',
            '네트워크 분할'
        ],
        mitreTechnique: 'T1486',
        cveExamples: ['CVE-2017-0144', 'CVE-2020-1472']
    },

    trojan: {
        id: 'trojan',
        name: '트로이 목마',
        category: 'malware',
        description: '정상 프로그램으로 위장한 악성 소프트웨어',
        severity: 'high',
        commonPorts: [80, 443, 8080, 9999],
        indicators: [
            '알려지지 않은 프로세스 실행',
            '외부 서버와의 의심스러운 통신',
            '시스템 리소스 비정상 사용',
            '보안 소프트웨어 비활성화',
            '파일 시스템 변경'
        ],
        preventionMethods: [
            '안티바이러스 솔루션',
            '파일 무결성 모니터링',
            '애플리케이션 화이트리스팅',
            '네트워크 모니터링',
            '사용자 권한 제한'
        ],
        mitreTechnique: 'T1547',
        cveExamples: ['CVE-2021-34527', 'CVE-2020-17087']
    },

    // 사회공학 공격
    phishing: {
        id: 'phishing',
        name: '피싱',
        category: 'social_engineering',
        description: '사용자를 속여 개인정보나 인증정보를 탈취하려는 시도',
        severity: 'medium',
        commonPorts: [80, 443, 25, 587],
        indicators: [
            '의심스러운 이메일 링크',
            '유명 사이트 위조',
            '긴급성을 강조하는 메시지',
            '개인정보 요구',
            '맞춤법 오류가 많은 내용'
        ],
        preventionMethods: [
            '사용자 보안 교육',
            '이메일 필터링',
            'URL 분석',
            '2단계 인증',
            '정기적인 보안 훈련'
        ],
        mitreTechnique: 'T1566',
        cveExamples: []
    },

    spear_phishing: {
        id: 'spear_phishing',
        name: '스피어 피싱',
        category: 'social_engineering',
        description: '특정 개인이나 조직을 대상으로 한 맞춤형 피싱 공격',
        severity: 'high',
        commonPorts: [80, 443, 25, 587],
        indicators: [
            '개인화된 공격 메시지',
            '내부 정보 활용',
            '신뢰할 만한 발신자 위장',
            '업무 관련 내용',
            '특정 대상 집중 공격'
        ],
        preventionMethods: [
            '고급 이메일 보안',
            '임직원 대상 훈련',
            '소셜 미디어 정보 관리',
            '내부 정보 접근 제한',
            '인시던트 대응 체계'
        ],
        mitreTechnique: 'T1566.001',
        cveExamples: []
    },

    // 고급 지속 위협 (APT)
    apt: {
        id: 'apt',
        name: '고급 지속 위협 (APT)',
        category: 'network_attacks',
        description: '장기간에 걸쳐 지속적으로 이루어지는 고도화된 공격',
        severity: 'critical',
        commonPorts: [80, 443, 53, 22],
        indicators: [
            '장기간 은밀한 침투',
            '다단계 공격 기법',
            '맞춤형 악성코드',
            '내부 이동 (Lateral Movement)',
            '데이터 수집 및 유출',
            '국가 지원 공격 그룹'
        ],
        preventionMethods: [
            '제로 트러스트 아키텍처',
            '고급 위협 탐지',
            '네트워크 분할',
            '지속적인 모니터링',
            '위협 인텔리전스',
            '인시던트 대응팀'
        ],
        mitreTechnique: 'Multiple',
        cveExamples: ['CVE-2021-44228', 'CVE-2020-1472']
    }
};

// 공격 벡터 정의
export const ATTACK_VECTORS = {
    email: {
        name: '이메일',
        description: '이메일을 통한 공격',
        commonThreats: ['phishing', 'spear_phishing', 'malware'],
        icon: '📧'
    },
    web: {
        name: '웹 애플리케이션',
        description: '웹 애플리케이션 취약점 악용',
        commonThreats: ['sql_injection', 'xss', 'csrf'],
        icon: '🌐'
    },
    network: {
        name: '네트워크',
        description: '네트워크 프로토콜 악용',
        commonThreats: ['brute_force', 'ddos', 'port_scan'],
        icon: '🌐'
    },
    usb: {
        name: 'USB/이동식 저장장치',
        description: 'USB 등 이동식 저장장치를 통한 감염',
        commonThreats: ['malware', 'trojan'],
        icon: '💾'
    },
    social: {
        name: '사회공학',
        description: '인간의 심리를 악용한 공격',
        commonThreats: ['phishing', 'spear_phishing'],
        icon: '🎭'
    }
};

// 위협 심각도 레벨
export const SEVERITY_LEVELS = {
    critical: {
        level: 4,
        name: '치명적',
        color: '#ff0040',
        bgColor: 'rgba(255, 0, 64, 0.1)',
        description: '즉시 대응이 필요한 매우 심각한 위협',
        responseTime: '즉시 (15분 이내)',
        autoBlock: true
    },
    high: {
        level: 3,
        name: '높음',
        color: '#ff6600',
        bgColor: 'rgba(255, 102, 0, 0.1)',
        description: '신속한 대응이 필요한 심각한 위협',
        responseTime: '1시간 이내',
        autoBlock: false
    },
    medium: {
        level: 2,
        name: '보통',
        color: '#ffaa00',
        bgColor: 'rgba(255, 170, 0, 0.1)',
        description: '적절한 시간 내 대응이 필요한 위협',
        responseTime: '4시간 이내',
        autoBlock: false
    },
    low: {
        level: 1,
        name: '낮음',
        color: '#00ff41',
        bgColor: 'rgba(0, 255, 65, 0.1)',
        description: '모니터링 및 분석이 필요한 위협',
        responseTime: '24시간 이내',
        autoBlock: false
    }
};

// 위협 상태 정의
export const THREAT_STATUS = {
    active: {
        name: '활성',
        color: '#ff0040',
        description: '현재 진행 중인 위협'
    },
    mitigated: {
        name: '완화됨',
        color: '#ffaa00',
        description: '부분적으로 차단된 위협'
    },
    blocked: {
        name: '차단됨',
        color: '#00ff41',
        description: '완전히 차단된 위협'
    },
    investigating: {
        name: '조사 중',
        color: '#00ccff',
        description: '분석 및 조사가 진행 중인 위협'
    }
};

// 대응 액션 정의
export const RESPONSE_ACTIONS = {
    block_ip: {
        name: 'IP 차단',
        description: '공격자 IP 주소를 차단',
        automated: true,
        severity: ['critical', 'high']
    },
    quarantine: {
        name: '격리',
        description: '감염된 시스템을 네트워크에서 격리',
        automated: false,
        severity: ['critical', 'high', 'medium']
    },
    alert: {
        name: '알림',
        description: '보안 담당자에게 알림 전송',
        automated: true,
        severity: ['critical', 'high', 'medium', 'low']
    },
    log: {
        name: '로그 기록',
        description: '보안 로그에 이벤트 기록',
        automated: true,
        severity: ['critical', 'high', 'medium', 'low']
    }
};
