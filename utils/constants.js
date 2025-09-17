// 📁 파일 위치: src/utils/constants.js

// ==========================================
// 🛠️ 시스템 상수 정의
// ==========================================

// API 엔드포인트
export const API_ENDPOINTS = {
    // AWS 서비스
    AWS_LAMBDA: '/api/aws/lambda',
    AWS_DYNAMODB: '/api/aws/dynamodb',
    AWS_WAF: '/api/aws/waf',
    AWS_GUARDDUTY: '/api/aws/guardduty',
    AWS_CLOUDWATCH: '/api/aws/cloudwatch',
    
    // 보안 서비스
    SECURITY_SCAN: '/api/security/scan',
    THREAT_ANALYSIS: '/api/security/threats',
    IP_MANAGEMENT: '/api/security/ip-management',
    SYSTEM_CHECK: '/api/security/system-check',
    
    // 인증
    AUTH_LOGIN: '/api/auth/login',
    AUTH_LOGOUT: '/api/auth/logout',
    AUTH_REFRESH: '/api/auth/refresh',
    
    // 데이터
    THREAT_DATA: '/api/data/threats',
    SYSTEM_METRICS: '/api/data/metrics',
    BATTLE_LOGS: '/api/data/battle-logs',
    REPORTS: '/api/data/reports'
};

// WebSocket 이벤트
export const WS_EVENTS = {
    // 연결 관련
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECTION_STATUS: 'connection_status',
    
    // 위협 관련
    THREAT_DETECTED: 'threat_detected',
    THREAT_BLOCKED: 'threat_blocked',
    THREAT_UPDATED: 'threat_updated',
    
    // 시스템 상태
    SYSTEM_STATUS: 'system_status',
    SYSTEM_METRICS: 'system_metrics',
    
    // AI 배틀
    AI_BATTLE_START: 'ai_battle_start',
    AI_BATTLE_UPDATE: 'ai_battle_update',
    AI_BATTLE_END: 'ai_battle_end',
    
    // AWS 메트릭
    AWS_METRICS: 'aws_metrics',
    LAMBDA_LOGS: 'lambda_logs',
    DYNAMODB_METRICS: 'dynamodb_metrics',
    WAF_ACTIVITY: 'waf_activity',
    GUARDDUTY_FINDINGS: 'guardduty_findings'
};

// 위협 레벨
export const THREAT_LEVELS = {
    LOW: {
        value: 'low',
        label: '낮음',
        color: '#00ff41',
        bgColor: 'rgba(0, 255, 65, 0.1)',
        priority: 1,
        autoBlock: false
    },
    MEDIUM: {
        value: 'medium',
        label: '보통',
        color: '#ffaa00',
        bgColor: 'rgba(255, 170, 0, 0.1)',
        priority: 2,
        autoBlock: false
    },
    HIGH: {
        value: 'high',
        label: '높음',
        color: '#ff6600',
        bgColor: 'rgba(255, 102, 0, 0.1)',
        priority: 3,
        autoBlock: true
    },
    CRITICAL: {
        value: 'critical',
        label: '치명적',
        color: '#ff0040',
        bgColor: 'rgba(255, 0, 64, 0.1)',
        priority: 4,
        autoBlock: true
    }
};

// 시스템 상태
export const SYSTEM_STATUS = {
    ONLINE: {
        value: 'online',
        label: '온라인',
        color: '#00ff41',
        icon: 'check-circle'
    },
    WARNING: {
        value: 'warning',
        label: '경고',
        color: '#ffaa00',
        icon: 'alert-triangle'
    },
    ERROR: {
        value: 'error',
        label: '오류',
        color: '#ff0040',
        icon: 'x-circle'
    },
    OFFLINE: {
        value: 'offline',
        label: '오프라인',
        color: '#666666',
        icon: 'wifi-off'
    }
};

// 차트 색상 팔레트
export const CHART_COLORS = {
    PRIMARY: ['#00ccff', '#00ff41', '#ffaa00', '#ff6600', '#ff0040'],
    CYBER: [
        '#00ccff', '#0099cc', '#0066aa', '#003388', '#001155',
        '#00ff41', '#00cc33', '#009922', '#006611', '#003300',
        '#ffaa00', '#ff8800', '#ff6600', '#cc4400', '#992200',
        '#ff0040', '#cc0033', '#990022', '#660011', '#330000'
    ],
    GRADIENT: {
        BLUE: ['#00ccff', '#0080ff', '#0040ff'],
        GREEN: ['#00ff41', '#00cc33', '#008822'],
        YELLOW: ['#ffaa00', '#ff8800', '#ff6600'],
        RED: ['#ff0040', '#cc0033', '#990022']
    }
};

// 애니메이션 설정
export const ANIMATIONS = {
    DURATION: {
        FAST: 200,
        NORMAL: 300,
        SLOW: 500,
        VERY_SLOW: 1000
    },
    EASING: {
        EASE_IN: 'ease-in',
        EASE_OUT: 'ease-out',
        EASE_IN_OUT: 'ease-in-out',
        CUBIC_BEZIER: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// 브레이크포인트 (반응형)
export const BREAKPOINTS = {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE_DESKTOP: '1440px',
    ULTRA_WIDE: '1920px'
};

// 컴포넌트 크기
export const COMPONENT_SIZES = {
    BUTTON: {
        SMALL: { height: '32px', padding: '8px 16px', fontSize: '12px' },
        MEDIUM: { height: '40px', padding: '12px 20px', fontSize: '14px' },
        LARGE: { height: '48px', padding: '16px 24px', fontSize: '16px' }
    },
    CARD: {
        SMALL: { padding: '16px', borderRadius: '8px' },
        MEDIUM: { padding: '20px', borderRadius: '12px' },
        LARGE: { padding: '24px', borderRadius: '16px' }
    },
    MODAL: {
        SMALL: { width: '400px', maxHeight: '300px' },
        MEDIUM: { width: '600px', maxHeight: '500px' },
        LARGE: { width: '800px', maxHeight: '700px' },
        FULLSCREEN: { width: '95vw', maxHeight: '95vh' }
    }
};

// 폰트 설정
export const TYPOGRAPHY = {
    FONT_FAMILY: "'Noto Sans KR', 'Noto Sans', sans-serif",
    FONT_WEIGHTS: {
        LIGHT: 300,
        REGULAR: 400,
        MEDIUM: 500,
        SEMIBOLD: 600,
        BOLD: 700
    },
    FONT_SIZES: {
        XS: '11px',
        SM: '12px',
        BASE: '14px',
        MD: '16px',
        LG: '18px',
        XL: '20px',
        XXL: '24px',
        XXXL: '32px'
    },
    LINE_HEIGHTS: {
        TIGHT: 1.2,
        NORMAL: 1.4,
        RELAXED: 1.6,
        LOOSE: 1.8
    }
};

// 스페이싱 (간격)
export const SPACING = {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '20px',
    XXL: '24px',
    XXXL: '32px',
    XXXXL: '40px'
};

// Z-Index 레이어
export const Z_INDEX = {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    NOTIFICATION: 1080
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME_SETTINGS: 'theme_settings',
    LAST_SESSION: 'last_session',
    DASHBOARD_CONFIG: 'dashboard_config',
    NOTIFICATION_SETTINGS: 'notification_settings'
};

// HTTP 상태 코드
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

// 알림 타입
export const NOTIFICATION_TYPES = {
    SUCCESS: {
        type: 'success',
        icon: 'check-circle',
        color: '#00ff41',
        duration: 3000
    },
    WARNING: {
        type: 'warning',
        icon: 'alert-triangle',
        color: '#ffaa00',
        duration: 5000
    },
    ERROR: {
        type: 'error',
        icon: 'x-circle',
        color: '#ff0040',
        duration: 7000
    },
    INFO: {
        type: 'info',
        icon: 'info',
        color: '#00ccff',
        duration: 4000
    }
};

// 디바이스 타입
export const DEVICE_TYPES = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop'
};

// 방향
export const DIRECTIONS = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};

// 보안 관련 상수
export const SECURITY_CONSTANTS = {
    PASSWORD_MIN_LENGTH: 8,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30분
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15분
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000 // 5분
};