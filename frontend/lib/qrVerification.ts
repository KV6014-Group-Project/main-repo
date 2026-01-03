// lib/qrVerification.ts
import nacl from 'tweetnacl';
import { decodeUTF8, decodeBase64 } from 'tweetnacl-util';
import { getPublicKey } from './api'; // Import from api.ts

// Hardcoded public key as fallback for offline verification
const FALLBACK_PUBLIC_KEY = '3WAIN0CmexT6hpkVo8QVMzL-DH_KmyvIfYUPY2FU4bU';

let PUBLIC_KEY: Uint8Array | null = null;

export async function initializePublicKey() {
  try {
    // Try to fetch from server first
    const publicKeyBase64 = await getPublicKey();
    PUBLIC_KEY = base64UrlDecode(publicKeyBase64);
    console.log('Public key loaded from server successfully');
  } catch (error) {
    console.warn('Failed to load public key from server, using fallback:', error);
    // Use hardcoded fallback for offline verification
    try {
      PUBLIC_KEY = base64UrlDecode(FALLBACK_PUBLIC_KEY);
      console.log('Using fallback public key');
    } catch (fallbackError) {
      console.error('Failed to decode fallback public key:', fallbackError);
    }
  }
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str + '='.repeat((4 - str.length % 4) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return decodeBase64(base64);
}

function extractYAMLField(yaml: string, fieldPath: string): string | null {
  const patterns = [
    new RegExp(`^\\s*${fieldPath}:\\s*['"]?([^'"\\n\\r]+)['"]?`, "m"),
  ];

  for (const pattern of patterns) {
    const match = yaml.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function canonicalizeCompactPayload(data: string): string {
  const v = extractYAMLField(data, 'v');
  const e = extractYAMLField(data, 'e');
  const p = extractYAMLField(data, 'p');
  const i = extractYAMLField(data, 'i');
  const ts = extractYAMLField(data, 'ts');
  
  return `v:${v}\ne:${e}\np:${p}\ni:${i}\nts:${ts}`;
}

export function verifyQRSignature(yamlString: string): boolean {
  if (!PUBLIC_KEY) {
    console.error('Public key not initialized');
    // Try to initialize with fallback immediately
    try {
      PUBLIC_KEY = base64UrlDecode(FALLBACK_PUBLIC_KEY);
      console.log('Initialized with fallback public key');
    } catch (error) {
      console.error('Failed to initialize fallback key:', error);
      return false;
    }
  }

  try {
    const signature = extractYAMLField(yamlString, 'sig');
    
    if (!signature) {
      console.error('No signature found in QR data');
      return false;
    }
    
    const canonical = canonicalizeCompactPayload(yamlString);
    console.log('Canonical for verification:', canonical);
    
    const signatureBytes = base64UrlDecode(signature);
    const message = decodeUTF8(canonical);
    
    const isValid = nacl.sign.detached.verify(message, signatureBytes, PUBLIC_KEY);
    console.log('Signature valid:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}