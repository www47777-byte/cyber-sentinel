// 📁 파일 위치: src/services/voice/voiceRecognition.js

class VoiceRecognitionService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isSupported = false;
        this.language = 'ko-KR';
        this.continuous = false;
        this.interimResults = true;
        this.maxAlternatives = 1;
        this.callbacks = {
            onResult: null,
            onStart: null,
            onEnd: null,
            onError: null,
            onNoMatch: null
        };
        this.commands = new Map();
        this.initialize();
    }

    // 음성 인식 초기화
    initialize() {
        try {
            // 브라우저 지원 확인
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                console.warn('🎤 이 브라우저는 음성 인식을 지원하지 않습니다.');
                this.isSupported = false;
                return;
            }

            this.recognition = new SpeechRecognition();
            this.isSupported = true;
            this.setupRecognition();
            console.log('🎤 음성 인식 서비스 초기화 완료');

        } catch (error) {
            console.error('❌ 음성 인식 초기화 실패:', error);
            this.isSupported = false;
        }
    }

    // 음성 인식 설정
    setupRecognition() {
        if (!this.recognition) return;

        this.recognition.lang = this.language;
        this.recognition.continuous = this.continuous;
        this.recognition.interimResults = this.interimResults;
        this.recognition.maxAlternatives = this.maxAlternatives;

        // 이벤트 리스너 설정
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('🎤 음성 인식 시작');
            if (this.callbacks.onStart) {
                this.callbacks.onStart();
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('🎤 음성 인식 종료');
            if (this.callbacks.onEnd) {
                this.callbacks.onEnd();
            }
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const confidence = event.results[i][0].confidence;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                    console.log('🎤 최종 결과:', transcript, '신뢰도:', confidence);
                    
                    // 명령어 처리
                    this.processCommand(transcript.trim());
                    
                } else {
                    interimTranscript += transcript;
                }
            }

            if (this.callbacks.onResult) {
                this.callbacks.onResult({
                    final: finalTranscript,
                    interim: interimTranscript,
                    event: event
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.error('❌ 음성 인식 오류:', event.error);
            this.isListening = false;
            
            if (this.callbacks.onError) {
                this.callbacks.onError(event.error);
            }
        };

        this.recognition.onnomatch = (event) => {
            console.log('🎤 음성을 인식하지 못했습니다.');
            if (this.callbacks.onNoMatch) {
                this.callbacks.onNoMatch(event);
            }
        };
    }

    // 음성 인식 시작
    start() {
        if (!this.isSupported) {
            console.warn('🎤 음성 인식이 지원되지 않습니다.');
            return false;
        }

        if (this.isListening) {
            console.log('🎤 이미 음성 인식이 실행 중입니다.');
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('❌ 음성 인식 시작 실패:', error);
            return false;
        }
    }

    // 음성 인식 중지
    stop() {
        if (!this.recognition || !this.isListening) return;

        try {
            this.recognition.stop();
        } catch (error) {
            console.error('❌ 음성 인식 중지 실패:', error);
        }
    }

    // 음성 인식 중단
    abort() {
        if (!this.recognition) return;

        try {
            this.recognition.abort();
            this.isListening = false;
        } catch (error) {
            console.error('❌ 음성 인식 중단 실패:', error);
        }
    }

    // 콜백 설정
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    // 언어 설정
    setLanguage(language) {
        this.language = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
    }

    // 연속 모드 설정
    setContinuous(continuous) {
        this.continuous = continuous;
        if (this.recognition) {
            this.recognition.continuous = continuous;
        }
    }

    // 중간 결과 설정
    setInterimResults(interimResults) {
        this.interimResults = interimResults;
        if (this.recognition) {
            this.recognition.interimResults = interimResults;
        }
    }

    // 명령어 등록
    addCommand(trigger, action, description = '') {
        const normalizedTrigger = this.normalizeCommand(trigger);
        this.commands.set(normalizedTrigger, {
            action,
            description,
            originalTrigger: trigger
        });
        console.log(`🎤 명령어 등록: "${trigger}" -> ${description}`);
    }

    // 명령어 제거
    removeCommand(trigger) {
        const normalizedTrigger = this.normalizeCommand(trigger);
        this.commands.delete(normalizedTrigger);
        console.log(`🎤 명령어 제거: "${trigger}"`);
    }

    // 모든 명령어 제거
    clearCommands() {
        this.commands.clear();
        console.log('🎤 모든 명령어 제거됨');
    }

    // 명령어 목록 조회
    getCommands() {
        const commandList = [];
        this.commands.forEach((value, key) => {
            commandList.push({
                trigger: value.originalTrigger,
                description: value.description
            });
        });
        return commandList;
    }

    // 명령어 처리
    processCommand(text) {
        const normalizedText = this.normalizeCommand(text);
        
        // 정확히 일치하는 명령어 찾기
        for (const [trigger, command] of this.commands) {
            if (normalizedText.includes(trigger)) {
                console.log(`🎤 명령어 실행: "${command.originalTrigger}"`);
                try {
                    command.action(text, trigger);
                    return true;
                } catch (error) {
                    console.error('❌ 명령어 실행 오류:', error);
                }
            }
        }

        // 유사한 명령어 찾기 (여유도 포함)
        for (const [trigger, command] of this.commands) {
            if (this.fuzzyMatch(normalizedText, trigger)) {
                console.log(`🎤 유사 명령어 실행: "${command.originalTrigger}"`);
                try {
                    command.action(text, trigger);
                    return true;
                } catch (error) {
                    console.error('❌ 명령어 실행 오류:', error);
                }
            }
        }

        console.log('🎤 인식된 명령어 없음:', text);
        return false;
    }

    // 명령어 정규화
    normalizeCommand(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거
            .replace(/\s+/g, ' ') // 여러 공백을 하나로
            .trim();
    }

    // 유사 매칭 (간단한 포함 관계 체크)
    fuzzyMatch(text, trigger) {
        const words = trigger.split(' ');
        return words.some(word => text.includes(word) && word.length > 1);
    }

    // 기본 명령어 설정
    setupDefaultCommands(callbacks = {}) {
        // 시스템 제어 명령어
        this.addCommand('보안 스캔', () => {
            if (callbacks.onSecurityScan) callbacks.onSecurityScan();
        }, '보안 스캔 시작');

        this.addCommand('시스템 점검', () => {
            if (callbacks.onSystemCheck) callbacks.onSystemCheck();
        }, '시스템 상태 점검');

        this.addCommand('위협 차단', () => {
            if (callbacks.onThreatBlock) callbacks.onThreatBlock();
        }, '수동 위협 차단');

        this.addCommand('대시보드', () => {
            if (callbacks.onNavigateDashboard) callbacks.onNavigateDashboard();
        }, '메인 대시보드로 이동');

        this.addCommand('모니터링', () => {
            if (callbacks.onNavigateMonitoring) callbacks.onNavigateMonitoring();
        }, '모니터링 화면으로 이동');

        this.addCommand('설정', () => {
            if (callbacks.onOpenSettings) callbacks.onOpenSettings();
        }, '설정 화면 열기');

        this.addCommand('도움말', () => {
            if (callbacks.onShowHelp) callbacks.onShowHelp();
        }, '도움말 표시');

        this.addCommand('음성 중지', () => {
            this.stop();
        }, '음성 인식 중지');

        // 숫자 명령어
        for (let i = 1; i <= 10; i++) {
            this.addCommand(`${i}번`, (text) => {
                if (callbacks.onNumberCommand) callbacks.onNumberCommand(i);
            }, `${i}번 항목 선택`);
        }

        console.log('🎤 기본 명령어 설정 완료');
    }

    // 지원 여부 확인
    isSupported() {
        return this.isSupported;
    }

    // 상태 확인
    getStatus() {
        return {
            supported: this.isSupported,
            listening: this.isListening,
            language: this.language,
            continuous: this.continuous,
            interimResults: this.interimResults,
            commandCount: this.commands.size
        };
    }

    // 마이크 권한 요청
    async requestMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // 스트림 즉시 해제 (권한 확인 목적)
            stream.getTracks().forEach(track => track.stop());
            console.log('🎤 마이크 권한 승인됨');
            return true;
        } catch (error) {
            console.error('❌ 마이크 권한 거부됨:', error);
            return false;
        }
    }

    // 테스트 모드
    test() {
        if (!this.isSupported) {
            console.log('❌ 음성 인식이 지원되지 않습니다.');
            return;
        }

        console.log('🎤 음성 인식 테스트 시작...');
        
        this.setCallbacks({
            onStart: () => console.log('✅ 음성 인식 시작됨'),
            onEnd: () => console.log('✅ 음성 인식 종료됨'),
            onResult: (result) => console.log('✅ 인식 결과:', result.final || result.interim),
            onError: (error) => console.error('❌ 오류:', error)
        });

        this.addCommand('테스트', () => {
            console.log('✅ 테스트 명령어 실행됨!');
        }, '테스트 명령어');

        this.start();
    }
}

// 싱글톤 인스턴스 생성
const voiceRecognitionService = new VoiceRecognitionService();

export default voiceRecognitionService;