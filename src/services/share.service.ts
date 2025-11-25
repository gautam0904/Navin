/**
 * Offline P2P Sharing Service
 * Uses WebRTC for peer-to-peer data transfer without internet
 * Similar to Xender/ShareNearMe functionality
 */

export interface ShareConnection {
  id: string;
  peerId: string;
  isHost: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string;
}

export interface ShareProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  stage: 'discovering' | 'connecting' | 'transferring' | 'complete';
}

/**
 * Share Service for offline P2P data transfer
 * Uses WebRTC data channels for direct device-to-device communication
 */
export class ShareService {
  private static connection: RTCPeerConnection | null = null;
  private static dataChannel: RTCDataChannel | null = null;
  private static isHosting = false;
  private static onProgress: ((progress: ShareProgress) => void) | null = null;

  /**
   * Start hosting - make this device discoverable
   */
  static async startHosting(
    onDeviceFound: (deviceInfo: { name: string; id: string }) => void,
    onError: (error: string) => void
  ): Promise<string> {
    try {
      this.isHosting = true;

      // Create RTCPeerConnection for WebRTC
      this.connection = new RTCPeerConnection({
        iceServers: [
          // For offline/local network, we'll use mDNS (Multicast DNS)
          // But fallback to STUN servers if available
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });

      // Create data channel for sending data
      this.dataChannel = this.connection.createDataChannel('navin-share', {
        ordered: true,
      });

      this.dataChannel.onopen = () => {
        console.log('Data channel opened');
        onDeviceFound({ name: 'Connected Peer', id: 'peer' });
      };

      this.dataChannel.onerror = (error) => {
        console.error('Data channel error:', error);
        onError('Data channel error');
      };

      // Listen for ICE candidates (for NAT traversal)
      this.connection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('ICE candidate:', event.candidate);
        }
      };

      // Generate offer
      const offer = await this.connection.createOffer();
      await this.connection.setLocalDescription(offer);

      // Return offer SDP for sharing (as QR code or code)
      return offer.sdp || '';
    } catch (error) {
      console.error('Failed to start hosting:', error);
      this.isHosting = false;
      throw new Error('Failed to start sharing. Please try again.');
    }
  }

  /**
   * Join another device's share session
   */
  static async joinShare(offerSdp: string, onError: (error: string) => void): Promise<string> {
    try {
      this.isHosting = false;
      this.connection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // Listen for data channel from host
      this.connection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.dataChannel.onopen = () => {
          console.log('Joined data channel');
        };
        this.dataChannel.onerror = (error) => {
          console.error('Data channel error:', error);
          onError('Data channel error');
        };
      };

      // Set remote description from offer
      await this.connection.setRemoteDescription(
        new RTCSessionDescription({
          type: 'offer',
          sdp: offerSdp,
        })
      );

      // Create and set answer
      const answer = await this.connection.createAnswer();
      await this.connection.setLocalDescription(answer);

      // Return answer SDP
      return answer.sdp || '';
    } catch (error) {
      console.error('Failed to join share:', error);
      throw new Error('Failed to join share. Please check the connection code.');
    }
  }

  /**
   * Send data to connected peer
   */
  static async sendData(data: unknown): Promise<void> {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel is not open');
    }

    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);

      // Send data in chunks if needed
      const chunkSize = 16384; // 16KB chunks
      let offset = 0;

      while (offset < dataBuffer.length) {
        const chunk = dataBuffer.slice(offset, offset + chunkSize);
        this.dataChannel.send(chunk);
        offset += chunkSize;

        // Report progress
        if (this.onProgress) {
          this.onProgress({
            bytesTransferred: offset,
            totalBytes: dataBuffer.length,
            percentage: Math.round((offset / dataBuffer.length) * 100),
            stage: 'transferring',
          });
        }
      }

      // Send completion marker
      this.dataChannel.send(JSON.stringify({ type: 'complete' }));
    } catch (error) {
      console.error('Failed to send data:', error);
      throw new Error('Failed to send data');
    }
  }

  /**
   * Receive data from connected peer
   */
  static async receiveData(
    onData: (data: unknown) => void,
    onProgress?: (progress: ShareProgress) => void
  ): Promise<void> {
    if (!this.dataChannel) {
      throw new Error('Data channel not initialized');
    }

    this.onProgress = onProgress || null;

    let receivedBuffer: Uint8Array[] = [];

    this.dataChannel.onmessage = (event: MessageEvent<ArrayBuffer | Uint8Array | string>) => {
      try {
        const data = event.data;

        // 1. Handle string messages
        if (typeof data === 'string') {
          const parsed = safeJsonParse<{ type?: string }>(data);
          if (parsed?.type === 'complete') {
            const fullData = ShareService.reconstructChunks(receivedBuffer);
            receivedBuffer = [];
            onData(fullData);
          }
          return;
        }

        // 2. Handle binary chunks
        if (data instanceof ArrayBuffer) {
          receivedBuffer.push(new Uint8Array(data));
        } else if (data instanceof Uint8Array) {
          receivedBuffer.push(data);
        } else {
          return;
        }

        // 3. Progress callback
        if (this.onProgress) {
          const bytesReceived = calculateBytes(receivedBuffer);
          this.onProgress({
            bytesTransferred: bytesReceived,
            totalBytes: 0,
            percentage: 0,
            stage: 'transferring',
          });
        }
      } catch (err) {
        console.error('Failed to process received data:', err);
      }
    };

    function safeJsonParse<T>(value: string): T | null {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }

    function calculateBytes(chunks: Uint8Array[]): number {
      return chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    }
  }

  /**
   * Stop sharing/close connection
   */
  static async stopSharing(): Promise<void> {
    try {
      if (this.dataChannel) {
        this.dataChannel.close();
        this.dataChannel = null;
      }

      if (this.connection) {
        this.connection.close();
        this.connection = null;
      }

      this.isHosting = false;
      this.onProgress = null;
    } catch (error) {
      console.error('Error stopping share:', error);
    }
  }

  /**
   * Generate a shareable code (simple hash for easy sharing)
   */
  static generateShareCode(): string {
    // Generate a 6-character code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Get connection status
   */
  static getConnectionStatus(): ShareConnection | null {
    if (!this.connection) {
      return null;
    }

    return {
      id: 'current',
      peerId: '',
      isHost: this.isHosting,
      status: this.dataChannel?.readyState === 'open' ? 'connected' : 'connecting',
    };
  }

  private static reconstructChunks(chunks: Uint8Array[]): unknown {
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Uint8Array(totalLength);

    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(combined);
    return JSON.parse(jsonStr);
  }
}
