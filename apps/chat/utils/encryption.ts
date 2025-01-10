/**
 * 브라우저의 localStorage에 저장되는 API 키를 보호하기 위한 암호화 유틸리티
 */

// 암호화에 사용될 키
const ENCRYPTION_KEY = new Uint8Array([
  21, 31, 41, 51, 61, 71, 81, 91,
  22, 32, 42, 52, 62, 72, 82, 92,
  23, 33, 43, 53, 63, 73, 83, 93,
  24, 34, 44, 54, 64, 74, 84, 94
]);

/**
 * API 키 암호화
 * 1. IV 생성
 * 2. API 키를 AES-GCM으로 암호화
 */
export const encryptApiKey = async (apiKey: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    
    // IV 생성 (매번 새로운 IV 사용)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // 암호화 키 생성
    const key = await crypto.subtle.importKey(
      'raw',
      ENCRYPTION_KEY,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // 데이터 암호화
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(apiKey)
    );
    
    // IV + 암호화된 데이터 결합
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Failed to encrypt API key:', error);
    throw new Error('API 키 암호화에 실패했습니다.');
  }
};

/**
 * API 키 복호화
 * 1. IV 추출
 * 2. 암호화된 데이터를 AES-GCM으로 복호화
 */
export const decryptApiKey = async (encryptedValue: string): Promise<string> => {
  try {
    // Base64 디코딩
    const combined = new Uint8Array(
      atob(encryptedValue)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // IV와 암호화된 데이터 분리
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    // 암호화 키 생성
    const key = await crypto.subtle.importKey(
      'raw',
      ENCRYPTION_KEY,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // 복호화
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );
    
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Failed to decrypt API key:', error);
    return '';
  }
};
