// 📁 파일 위치: src/services/websocket/socketManager.js

import { io } from 'socket.io-client';

class SocketManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.listeners = new Map();
        this.messageQueue = [];
    }

    // 소켓 연결 초기화
    connect(url = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001') {
        try {
            this.socket = io(url, {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true,
                reconnection: true,
                reconnectionDelay: this.reconnectInterval,
                reconnectionAttempts: this.maxReconnectAttempts
            });

            this.setupEventListeners();
            console.log('🔌 WebSocket 연결 시도 중...', url);
            
        } catch (error) {
            console.error('❌ WebSocket 연결 실패:', error);
            this.handleConnectionError(error);
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        if (!this.socket) return;

        // 연결 성공
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('✅ WebSocket 연결됨 - ID:', this.socket.id);
            
            // 대기 중인 메시지 전송
            this.flushMessageQueue();
            
            // 연결 상태 알림
            this.emit('connection_status', { connected: true, id: this.socket.id });
        });

        // 연결 해제
        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            console.log('🔌 WebSocket 연결 해제:', reason);
            this.emit('connection_status', { connected: false, reason });
        });

        // 연결 오류
        this.socket.on('connect_error', (error) => {
            console.error('❌ WebSocket 연결 오류:', error);
            this.handleConnectionError(error);
        });

        // 재연결 시도
        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 재연결 시도 ${attemptNumber}/${this.maxReconnectAttempts}`);
            this.emit('reconnect_attempt', { attempt: attemptNumber });
        });

        // 재연결 성공
        this.socket.on('reconnect', (attemptNumber) => {
            console.log('✅ 재연결 성공:', attemptNumber);
            this.emit('reconnect_success', { attempt: attemptNumber });
        });

        // 재연결 실패
        this.socket.on('reconnect_failed', () => {
            console.error('❌ 재연결 실패 - 최대 시도 횟수 초과');
            this.emit('reconnect_failed', {});
        });

        // 보안 관련 실시간 데이터
        this.socket.on('threat_detected', (data) => {
            console.log('🚨 위협 탐지:', data);
            this.emit('threat_detected', data);
        });

        this.socket.on('threat_blocked', (data) => {
            console.log('🛡️ 위협 차단:', data);
            this.emit('threat_blocked', data);
        });

        this.socket.on('system_status', (data) => {
            this.emit('system_status', data);
        });

        this.socket.on('ai_battle_update', (data) => {
            console.log('⚔️ AI 배틀 업데이트:', data);
            this.emit('ai_battle_update', data);
        });

        // AWS 서비스 상태
        this.socket.on('aws_metrics', (data) => {
            this.emit('aws_metrics', data);
        });

        this.socket.on('lambda_logs', (data) => {
            this.emit('lambda_logs', data);
        });

        this.socket.on('dynamodb_metrics', (data) => {
            this.emit('dynamodb_metrics', data);
        });

        this.socket.on('waf_activity', (data) => {
            this.emit('waf_activity', data);
        });

        this.socket.on('guardduty_findings', (data) => {
            this.emit('guardduty_findings', data);
        });
    }

    // 이벤트 리스너 등록
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // 소켓이 연결되어 있으면 즉시 등록
        if (this.socket && this.isConnected) {
            this.socket.on(event, callback);
        }
    }

    // 이벤트 리스너 제거
    off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }

        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    // 이벤트 발생
    emit(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`이벤트 리스너 오류 (${event}):`, error);
                }
            });
        }
    }

    // 메시지 전송
    send(event, data) {
        if (this.isConnected && this.socket) {
            this.socket.emit(event, data);
        } else {
            // 연결되지 않은 경우 큐에 저장
            this.messageQueue.push({ event, data, timestamp: Date.now() });
            console.log('📨 메시지 큐에 저장:', event);
        }
    }

    // 대기 중인 메시지 전송
    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            // 5분 이상 된 메시지는 제거
            if (Date.now() - message.timestamp < 300000) {
                this.socket.emit(message.event, message.data);
                console.log('📤 큐에서 메시지 전송:', message.event);
            }
        }
    }

    // 연결 오류 처리
    handleConnectionError(error) {
        this.isConnected = false;
        this.reconnectAttempts++;
        
        this.emit('connection_error', { 
            error: error.message || error,
            attempt: this.reconnectAttempts 
        });

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('❌ 최대 재연결 시도 횟수 초과');
            this.emit('max_reconnect_exceeded', {});
        }
    }

    // 수동 재연결
    reconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.reconnectAttempts = 0;
        this.connect();
    }

    // 특정 이벤트 구독
    subscribeToThreatUpdates(callback) {
        this.on('threat_detected', callback);
        this.on('threat_blocked', callback);
        this.send('subscribe', { channel: 'threats' });
    }

    subscribeToSystemStatus(callback) {
        this.on('system_status', callback);
        this.send('subscribe', { channel: 'system' });
    }

    subscribeToAIBattle(callback) {
        this.on('ai_battle_update', callback);
        this.send('subscribe', { channel: 'ai_battle' });
    }

    subscribeToAWSMetrics(callback) {
        this.on('aws_metrics', callback);
        this.on('lambda_logs', callback);
        this.on('dynamodb_metrics', callback);
        this.on('waf_activity', callback);
        this.on('guardduty_findings', callback);
        this.send('subscribe', { channel: 'aws' });
    }

    // 구독 해제
    unsubscribe(channel) {
        this.send('unsubscribe', { channel });
    }

    // 연결 상태 확인
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            socketId: this.socket?.id || null,
            reconnectAttempts: this.reconnectAttempts,
            queuedMessages: this.messageQueue.length
        };
    }

    // 연결 해제
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
        this.listeners.clear();
        this.messageQueue = [];
        console.log('🔌 WebSocket 연결 해제됨');
    }

    // 소켓 상태 진단
    diagnose() {
        const status = this.getConnectionStatus();
        console.log('🔍 WebSocket 진단:', {
            ...status,
            url: this.socket?.io?.uri || 'N/A',
            transport: this.socket?.io?.engine?.transport?.name || 'N/A',
            listeners: Array.from(this.listeners.keys()),
            uptime: this.socket?.connected ? Date.now() - this.socket.connected : 0
        });
        return status;
    }
}

// 싱글톤 인스턴스 생성
const socketManager = new SocketManager();

export default socketManager;