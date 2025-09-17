// 📁 파일 위치: src/data/mockData.js

// ==========================================
// 📊 목 데이터 (Mock Data)
// ==========================================

// 실시간 시스템 메트릭
export const systemMetrics = {
    timestamp: new Date().toISOString(),
    cpu: {
        usage: 35.2,
        temperature: 52,
        cores: 8,
        processes: 156
    },
    memory: {
        used: 8.2,
        total: 16,
        available: 7.8,
        usage: 51.25
    },
    disk: {
        used: 245.6,
        total: 512,
        usage: 47.97,
        readSpeed: 120.5,
        writeSpeed: 85.3
    },
    network: {
        upload: 86.2,
        download: 63.7,
        latency: 15,
        packetsLost: 0.01
    },
    services: {
        total: 45,
        running: 42,
        stopped: 2,
        error: 1
    }
};

// 위협 탐지 데이터
export const threatData = [
    {
        id: 'THR-001',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5분 전
        type: 'sql_injection',
        level: 'high',
        sourceIP: '192.168.1.100',
        targetPort: 3306,
        status: 'blocked',
        description: 'SQL 인젝션 시도가 감지되었습니다.',
        location: '서울, 대한민국',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        attackVector: 'Web Application',
        confidence: 95
    },
    {
        id: 'THR-002',
        timestamp: new Date(Date.now() - 180000).toISOString(), // 3분 전
        type: 'brute_force',
        level: 'medium',
        sourceIP: '203.123.45.67',
        targetPort: 22,
        status: 'monitoring',
        description: 'SSH 무차별 공격이 감지되었습니다.',
        location: '상하이, 중국',
        userAgent: 'ssh-2.0',
        attackVector: 'SSH Protocol',
        confidence: 87
    },
    {
        id: 'THR-003',
        timestamp: new Date(Date.now() - 120000).toISOString(), // 2분 전
        type: 'port_scan',
        level: 'low',
        sourceIP: '10.0.0.45',
        targetPort: null,
        status: 'allowed',
        description: '내부 네트워크에서 포트 스캔이 감지되었습니다.',
        location: '내부 네트워크',
        userAgent: 'nmap',
        attackVector: 'Network Scan',
        confidence: 72
    },
    {
        id: 'THR-004',
        timestamp: new Date(Date.now() - 60000).toISOString(), // 1분 전
        type: 'xss',
        level: 'critical',
        sourceIP: '185.220.101.32',
        targetPort: 443,
        status: 'blocked',
        description: 'XSS 공격 시도가 감지되었습니다.',
        location: '프랑크푸르트, 독일',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        attackVector: 'Web Application',
        confidence: 98
    },
    {
        id: 'THR-005',
        timestamp: new Date().toISOString(), // 방금
        type: 'malware',
        level: 'critical',
        sourceIP: '198.51.100.25',
        targetPort: 80,
        status: 'quarantined',
        description: '악성코드 다운로드 시도가 차단되었습니다.',
        location: '뉴욕, 미국',
        userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0)',
        attackVector: 'Malware Download',
        confidence: 99
    }
];

// AWS 서비스 상태 데이터
export const awsServiceData = {
    lambda: {
        status: 'Active',
        functionsCount: 15,
        invocationsLast24h: 1247,
        errorsLast24h: 3,
        duration: {
            average: 245,
            p99: 1200,
            max: 2800
        },
        memory: {
            average: 128,
            peak: 256
        },
        costs: {
            daily: 2.45,
            monthly: 73.50
        }
    },
    dynamodb: {
        status: 'ACTIVE',
        tablesCount: 8,
        itemCount: 125647,
        storageSize: 1.2, // GB
        readCapacity: {
            provisioned: 25,
            consumed: 12
        },
        writeCapacity: {
            provisioned: 15,
            consumed: 8
        },
        costs: {
            daily: 3.20,
            monthly: 96.00
        }
    },
    waf: {
        status: 'Active',
        rulesCount: 12,
        requestsLast24h: 45230,
        blockedLast24h: 1247,
        allowedLast24h: 43983,
        topBlockedCountries: [
            { country: '중국', count: 456 },
            { country: '러시아', count: 234 },
            { country: '북한', count: 123 }
        ],
        costs: {
            daily: 1.50,
            monthly: 45.00
        }
    },
    guardduty: {
        status: 'ENABLED',
        findings: {
            high: 2,
            medium: 5,
            low: 16
        },
        lastUpdate: new Date(Date.now() - 900000).toISOString(), // 15분 전
        detectorId: 'gd-123456789',
        coverage: {
            ec2: true,
            dns: true,
            vpc: true,
            s3: false
        },
        costs: {
            daily: 5.80,
            monthly: 174.00
        }
    },
    cloudwatch: {
        status: 'Active',
        alarmsCount: 23,
        activeAlarms: 2,
        metricsCount: 1450,
        logsSize: 15.6, // GB
        retentionDays: 30,
        costs: {
            daily: 4.20,
            monthly: 126.00
        }
    }
};

// AI 배틀 로그 데이터
export const aiBattleData = [
    {
        id: 'BATTLE-001',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10분 전
        attacker: {
            name: 'Advanced Persistent Threat',
            type: 'AI_BOT',
            strength: 85,
            techniques: ['SQL_INJECTION', 'XSS', 'BRUTE_FORCE']
        },
        defender: {
            name: 'DefenseAI Guardian',
            type: 'AI_SENTINEL',
            strength: 92,
            techniques: ['PATTERN_ANALYSIS', 'BEHAVIOR_DETECTION', 'AUTO_BLOCK']
        },
        rounds: [
            {
                round: 1,
                attackType: 'sql_injection',
                defenseAction: 'pattern_match',
                result: 'blocked',
                damage: 0,
                duration: 1.2
            },
            {
                round: 2,
                attackType: 'xss',
                defenseAction: 'content_filter',
                result: 'blocked',
                damage: 0,
                duration: 0.8
            },
            {
                round: 3,
                attackType: 'brute_force',
                defenseAction: 'rate_limit',
                result: 'partially_blocked',
                damage: 15,
                duration: 3.5
            }
        ],
        outcome: 'DEFENDER_WIN',
        finalScore: {
            attacker: 15,
            defender: 100
        },
        duration: 5.5 // seconds
    },
    {
        id: 'BATTLE-002',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5분 전
        attacker: {
            name: 'Stealth Infiltrator',
            type: 'HUMAN_HACKER',
            strength: 78,
            techniques: ['SOCIAL_ENGINEERING', 'PRIVILEGE_ESCALATION', 'LATERAL_MOVEMENT']
        },
        defender: {
            name: 'DefenseAI Guardian',
            type: 'AI_SENTINEL',
            strength: 92,
            techniques: ['ANOMALY_DETECTION', 'USER_BEHAVIOR_ANALYSIS', 'NETWORK_MONITORING']
        },
        rounds: [
            {
                round: 1,
                attackType: 'social_engineering',
                defenseAction: 'user_verification',
                result: 'allowed',
                damage: 25,
                duration: 120.0
            },
            {
                round: 2,
                attackType: 'privilege_escalation',
                defenseAction: 'permission_check',
                result: 'blocked',
                damage: 0,
                duration: 2.1
            }
        ],
        outcome: 'DEFENDER_WIN',
        finalScore: {
            attacker: 25,
            defender: 85
        },
        duration: 122.1
    }
];

// 네트워크 트래픽 데이터 (시계열)
export const networkTrafficData = Array.from({ length: 24 }, (_, i) => {
    const hour = 23 - i;
    const timestamp = new Date();
    timestamp.setHours(hour, 0, 0, 0);
    
    return {
        timestamp: timestamp.toISOString(),
        time: `${hour.toString().padStart(2, '0')}:00`,
        inbound: Math.floor(Math.random() * 1000) + 500,
        outbound: Math.floor(Math.random() * 800) + 300,
        threats: Math.floor(Math.random() * 20),
        blocked: Math.floor(Math.random() * 15)
    };
}).reverse();

// 지리적 위협 데이터
export const geographicThreatData = [
    {
        country: '중국',
        countryCode: 'CN',
        coordinates: [116.4074, 39.9042], // 베이징
        threatCount: 1247,
        threatLevel: 'high',
        lastActivity: new Date(Date.now() - 120000).toISOString(),
        topAttackTypes: ['brute_force', 'port_scan', 'malware']
    },
    {
        country: '러시아',
        countryCode: 'RU',
        coordinates: [37.6176, 55.7558], // 모스크바
        threatCount: 892,
        threatLevel: 'high',
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        topAttackTypes: ['sql_injection', 'ddos', 'phishing']
    },
    {
        country: '미국',
        countryCode: 'US',
        coordinates: [-74.0060, 40.7128], // 뉴욕
        threatCount: 156,
        threatLevel: 'medium',
        lastActivity: new Date(Date.now() - 600000).toISOString(),
        topAttackTypes: ['xss', 'vulnerability_scan']
    },
    {
        country: '독일',
        countryCode: 'DE',
        coordinates: [13.4050, 52.5200], // 베를린
        threatCount: 89,
        threatLevel: 'medium',
        lastActivity: new Date(Date.now() - 900000).toISOString(),
        topAttackTypes: ['bot_traffic', 'scraping']
    },
    {
        country: '북한',
        countryCode: 'KP',
        coordinates: [125.7625, 39.0392], // 평양
        threatCount: 45,
        threatLevel: 'critical',
        lastActivity: new Date(Date.now() - 1800000).toISOString(),
        topAttackTypes: ['apt', 'zero_day_exploit']
    }
];

// 사용자 활동 로그
export const userActivityLogs = [
    {
        id: 'LOG-001',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        user: 'admin@company.com',
        action: 'LOGIN',
        ip: '192.168.1.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        success: true,
        details: '관리자 로그인 성공'
    },
    {
        id: 'LOG-002',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        user: 'security@company.com',
        action: 'BLOCK_IP',
        ip: '192.168.1.15',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        success: true,
        details: 'IP 203.123.45.67 수동 차단'
    },
    {
        id: 'LOG-003',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        user: 'operator@company.com',
        action: 'SYSTEM_SCAN',
        ip: '192.168.1.25',
        userAgent: 'Mozilla/5.0 (Ubuntu; Linux x86_64)',
        success: true,
        details: '전체 시스템 보안 스캔 실행'
    },
    {
        id: 'LOG-004',
        timestamp: new Date(Date.now() - 450000).toISOString(),
        user: 'unknown',
        action: 'FAILED_LOGIN',
        ip: '185.220.101.32',
        userAgent: 'curl/7.68.0',
        success: false,
        details: '잘못된 인증 정보로 로그인 시도'
    },
    {
        id: 'LOG-005',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        user: 'admin@company.com',
        action: 'CONFIG_CHANGE',
        ip: '192.168.1.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        success: true,
        details: 'WAF 규칙 업데이트'
    }
];

// 성능 메트릭 시계열 데이터
export const performanceMetrics = {
    cpu: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (59 - i) * 60000).toISOString(),
        value: Math.random() * 30 + 20 + Math.sin(i / 10) * 10
    })),
    memory: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (59 - i) * 60000).toISOString(),
        value: Math.random() * 20 + 40 + Math.sin(i / 8) * 5
    })),
    network: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (59 - i) * 60000).toISOString(),
        inbound: Math.random() * 100 + 50,
        outbound: Math.random() * 80 + 30
    })),
    threats: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (59 - i) * 60000).toISOString(),
        detected: Math.floor(Math.random() * 10),
        blocked: Math.floor(Math.random() * 8)
    }))
};

// 보안 규칙 데이터
export const securityRules = [
    {
        id: 'RULE-001',
        name: 'SQL 인젝션 방어',
        type: 'waf',
        enabled: true,
        priority: 1,
        conditions: [
            'REQUEST_URI contains "UNION SELECT"',
            'QUERY_STRING contains "DROP TABLE"',
            'BODY contains "script>"'
        ],
        action: 'BLOCK',
        lastTriggered: new Date(Date.now() - 300000).toISOString(),
        triggerCount: 47
    },
    {
        id: 'RULE-002',
        name: '브루트포스 공격 방어',
        type: 'rate_limit',
        enabled: true,
        priority: 2,
        conditions: [
            'REQUEST_COUNT > 10 per minute',
            'SOURCE_IP same for multiple failed logins'
        ],
        action: 'RATE_LIMIT',
        lastTriggered: new Date(Date.now() - 180000).toISOString(),
        triggerCount: 23
    },
    {
        id: 'RULE-003',
        name: '악성 IP 차단',
        type: 'ip_reputation',
        enabled: true,
        priority: 3,
        conditions: [
            'SOURCE_IP in threat_intelligence_feed',
            'GEO_COUNTRY in ["CN", "RU", "KP"]'
        ],
        action: 'BLOCK',
        lastTriggered: new Date(Date.now() - 120000).toISOString(),
        triggerCount: 156
    },
    {
        id: 'RULE-004',
        name: 'Bot 트래픽 탐지',
        type: 'bot_detection',
        enabled: false,
        priority: 4,
        conditions: [
            'USER_AGENT contains "bot"',
            'REQUEST_PATTERN suspicious'
        ],
        action: 'CAPTCHA',
        lastTriggered: null,
        triggerCount: 0
    }
];

// 알림 설정 데이터
export const notificationSettings = [
    {
        id: 'NOTIFY-001',
        type: 'threat_detected',
        enabled: true,
        channels: ['email', 'slack', 'webhook'],
        threshold: 'medium',
        cooldown: 300, // 5분
        recipients: ['security@company.com', 'admin@company.com']
    },
    {
        id: 'NOTIFY-002',
        type: 'system_alert',
        enabled: true,
        channels: ['email', 'sms'],
        threshold: 'high',
        cooldown: 600, // 10분
        recipients: ['ops@company.com']
    },
    {
        id: 'NOTIFY-003',
        type: 'performance_alert',
        enabled: false,
        channels: ['slack'],
        threshold: 'critical',
        cooldown: 900, // 15분
        recipients: ['devops@company.com']
    }
];

// 대시보드 위젯 구성
export const dashboardConfig = {
    layout: 'grid',
    columns: 3,
    widgets: [
        {
            id: 'widget-threats',
            type: 'threat_counter',
            position: { x: 0, y: 0, w: 1, h: 1 },
            title: '실시간 위협',
            dataSource: 'threats',
            refreshInterval: 5000
        },
        {
            id: 'widget-system',
            type: 'system_status',
            position: { x: 1, y: 0, w: 1, h: 1 },
            title: '시스템 상태',
            dataSource: 'system_metrics',
            refreshInterval: 10000
        },
        {
            id: 'widget-network',
            type: 'network_chart',
            position: { x: 2, y: 0, w: 1, h: 1 },
            title: '네트워크 트래픽',
            dataSource: 'network_traffic',
            refreshInterval: 30000
        },
        {
            id: 'widget-map',
            type: 'threat_map',
            position: { x: 0, y: 1, w: 2, h: 2 },
            title: '지리적 위협 분포',
            dataSource: 'geographic_threats',
            refreshInterval: 60000
        },
        {
            id: 'widget-logs',
            type: 'activity_logs',
            position: { x: 2, y: 1, w: 1, h: 2 },
            title: '활동 로그',
            dataSource: 'user_activity',
            refreshInterval: 15000
        }
    ]
};

// 시스템 설정 데이터
export const systemSettings = {
    general: {
        siteName: 'DefenseAI Guardian',
        timezone: 'Asia/Seoul',
        language: 'ko-KR',
        theme: 'cyber-blue',
        autoRefresh: true,
        refreshInterval: 30000
    },
    security: {
        sessionTimeout: 1800000, // 30분
        maxLoginAttempts: 5,
        lockoutDuration: 900000, // 15분
        passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true
        },
        twoFactorAuth: false,
        ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
        allowedCountries: ['KR', 'US', 'JP']
    },
    monitoring: {
        dataRetention: 90, // 일
        logLevel: 'INFO',
        enableRealTimeAlerts: true,
        performanceThresholds: {
            cpu: 80,
            memory: 85,
            disk: 90,
            network: 1000 // Mbps
        }
    },
    integrations: {
        slack: {
            enabled: true,
            webhookUrl: 'https://hooks.slack.com/services/...',
            channel: '#security-alerts'
        },
        email: {
            enabled: true,
            smtpServer: 'smtp.company.com',
            port: 587,
            username: 'alerts@company.com'
        },
        siem: {
            enabled: false,
            endpoint: 'https://siem.company.com/api',
            apiKey: '***'
        }
    }
};

// 통계 요약 데이터
export const securityStats = {
    today: {
        threatsDetected: 1247,
        threatsBlocked: 1156,
        attacksBlocked: 234,
        suspiciousActivity: 89,
        falsePositives: 12,
        systemUptime: 99.95
    },
    thisWeek: {
        threatsDetected: 8934,
        threatsBlocked: 8567,
        attacksBlocked: 1678,
        suspiciousActivity: 456,
        falsePositives: 89,
        systemUptime: 99.87
    },
    thisMonth: {
        threatsDetected: 35678,
        threatsBlocked: 34234,
        attacksBlocked: 6789,
        suspiciousActivity: 1234,
        falsePositives: 345,
        systemUptime: 99.92
    },
    comparison: {
        threatsVsLastWeek: 12.5, // % 증가
        blockedVsLastWeek: 15.2,
        uptimeVsLastMonth: -0.05,
        falsePositiveRate: 0.34
    }
};

// 보고서 템플릿 데이터
export const reportTemplates = [
    {
        id: 'REPORT-001',
        name: '일일 보안 요약',
        type: 'daily_summary',
        schedule: 'daily',
        time: '09:00',
        recipients: ['security@company.com'],
        sections: ['threats', 'system_status', 'top_attacks', 'recommendations'],
        format: 'pdf'
    },
    {
        id: 'REPORT-002',
        name: '주간 보안 분석',
        type: 'weekly_analysis',
        schedule: 'weekly',
        day: 'monday',
        time: '08:00',
        recipients: ['ciso@company.com', 'security-team@company.com'],
        sections: ['executive_summary', 'threat_trends', 'incident_analysis', 'compliance'],
        format: 'pdf'
    },
    {
        id: 'REPORT-003',
        name: '월간 컴플라이언스 리포트',
        type: 'compliance',
        schedule: 'monthly',
        date: 1,
        time: '07:00',
        recipients: ['compliance@company.com', 'audit@company.com'],
        sections: ['compliance_status', 'policy_violations', 'remediation_actions'],
        format: 'excel'
    }
];