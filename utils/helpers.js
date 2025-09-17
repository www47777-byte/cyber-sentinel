// 📁 파일 위치: src/utils/helpers.js

// ==========================================
// 🛠️ 헬퍼 함수들
// ==========================================

// 날짜/시간 관련 함수
export const dateHelpers = {
    // 현재 시간 포맷팅
    getCurrentTime: (format = 'full') => {
        const now = new Date();
        switch (format) {
            case 'time':
                return now.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                });
            case 'date':
                return now.toLocaleDateString('ko-KR');
            case 'datetime':
                return now.toLocaleString('ko-KR');
            case 'iso':
                return now.toISOString();
            default:
                return now.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
        }
    },

    // 시간 차이 계산
    getTimeDifference: (startTime, endTime = new Date()) => {
        const diff = Math.abs(endTime - startTime);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return { minutes, seconds, total: diff };
    },

    // 상대 시간 표시 (예: "3분 전")
    getRelativeTime: (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return '방금 전';
    },

    // ISO 문자열을 로컬 시간으로 변환
    formatISOToLocal: (isoString) => {
        return new Date(isoString).toLocaleString('ko-KR');
    }
};

// 숫자 관련 함수
export const numberHelpers = {
    // 숫자를 K, M, B 단위로 포맷팅
    formatNumber: (num, decimals = 1) => {
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(decimals) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(decimals) + 'M';
        return (num / 1000000000).toFixed(decimals) + 'B';
    },

    // 파일 크기 포맷팅
    formatFileSize: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    },

    // 퍼센트 계산
    calculatePercentage: (value, total, decimals = 1) => {
        if (total === 0) return 0;
        return parseFloat(((value / total) * 100).toFixed(decimals));
    },

    // 범위 내 값으로 제한
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    // 랜덤 수 생성
    randomBetween: (min, max, isInteger = true) => {
        const random = Math.random() * (max - min) + min;
        return isInteger ? Math.floor(random) : random;
    }
};

// 문자열 관련 함수
export const stringHelpers = {
    // 문자열 자르기
    truncate: (str, length, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    // 카멜케이스 변환
    toCamelCase: (str) => {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    },

    // 케밥케이스 변환
    toKebabCase: (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },

    // 첫 글자 대문자
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // 공백 제거
    removeSpaces: (str) => {
        return str.replace(/\s+/g, '');
    },

    // URL에서 파일명 추출
    getFilenameFromUrl: (url) => {
        return url.split('/').pop();
    },

    // 이메일 유효성 검사
    isValidEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
};

// 배열 관련 함수
export const arrayHelpers = {
    // 배열에서 중복 제거
    removeDuplicates: (arr) => {
        return [...new Set(arr)];
    },

    // 배열 섞기
    shuffle: (arr) => {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    },

    // 배열을 청크로 나누기
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },

    // 배열에서 랜덤 요소 선택
    getRandomElement: (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 배열 정렬 (한글 지원)
    sortKorean: (arr, key = null, ascending = true) => {
        return arr.sort((a, b) => {
            const valueA = key ? a[key] : a;
            const valueB = key ? b[key] : b;
            const result = valueA.localeCompare(valueB, 'ko-KR');
            return ascending ? result : -result;
        });
    }
};

// 객체 관련 함수
export const objectHelpers = {
    // 깊은 복사
    deepClone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },

    // 객체 병합
    merge: (...objects) => {
        return Object.assign({}, ...objects);
    },

    // 중첩된 속성 가져오기
    getNestedValue: (obj, path, defaultValue = null) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : defaultValue;
        }, obj);
    },

    // 중첩된 속성 설정
    setNestedValue: (obj, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            return current[key];
        }, obj);
        target[lastKey] = value;
        return obj;
    },

    // 빈 값 제거
    removeEmpty: (obj) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => 
                value !== null && value !== undefined && value !== ''
            )
        );
    }
};

// DOM 관련 함수
export const domHelpers = {
    // 요소가 뷰포트에 있는지 확인
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 스크롤을 부드럽게 이동
    smoothScrollTo: (elementId, offset = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const targetPosition = element.offsetTop + offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // 클립보드에 복사
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // 폴백 메서드
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    // 다운로드 트리거
    downloadFile: (content, filename, type = 'text/plain') => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// 디바이스 관련 함수
export const deviceHelpers = {
    // 디바이스 타입 감지
    getDeviceType: () => {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },

    // 모바일 여부 확인
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // 터치 지원 여부
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // 브라우저 정보
    getBrowserInfo: () => {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        
        return { browser, userAgent };
    }
};

// 색상 관련 함수
export const colorHelpers = {
    // HEX를 RGB로 변환
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // RGB를 HEX로 변환
    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    // 색상 밝기 조절
    adjustBrightness: (hex, percent) => {
        const rgb = colorHelpers.hexToRgb(hex);
        if (!rgb) return hex;
        
        const adjust = (value) => {
            const adjusted = value + (value * percent / 100);
            return Math.max(0, Math.min(255, Math.round(adjusted)));
        };
        
        return colorHelpers.rgbToHex(
            adjust(rgb.r),
            adjust(rgb.g),
            adjust(rgb.b)
        );
    }
};

// 로컬 스토리지 관련 함수
export const storageHelpers = {
    // 로컬 스토리지에 저장
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('로컬 스토리지 저장 실패:', error);
            return false;
        }
    },

    // 로컬 스토리지에서 가져오기
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('로컬 스토리지 읽기 실패:', error);
            return defaultValue;
        }
    },

    // 로컬 스토리지에서 제거
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('로컬 스토리지 제거 실패:', error);
            return false;
        }
    },

    // 로컬 스토리지 전체 삭제
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('로컬 스토리지 초기화 실패:', error);
            return false;
        }
    }
};

// 디바운스와 스로틀
export const performanceHelpers = {
    // 디바운스
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    // 스로틀
    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(null, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 검증 함수들
export const validationHelpers = {
    // 빈 값 체크
    isEmpty: (value) => {
        return value === null || value === undefined || value === '' || 
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'object' && Object.keys(value).length === 0);
    },

    // 비밀번호 강도 체크
    checkPasswordStrength: (password) => {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
        
        return { checks, score, strength };
    },

    // IP 주소 유효성 체크
    isValidIP: (ip) => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    },

    // URL 유효성 체크
    isValidURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};