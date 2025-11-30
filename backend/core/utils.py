"""
Core utilities for HMAC signing, YAML processing, and shared helpers.
"""
import hashlib
import hmac
import base64
import yaml
import json
from typing import Dict, Any, Optional
from django.conf import settings


def get_hmac_secret() -> bytes:
    """Get the HMAC secret key from settings."""
    secret = getattr(settings, 'HMAC_SECRET_KEY', settings.SECRET_KEY)
    if isinstance(secret, str):
        return secret.encode('utf-8')
    return secret


def compute_hmac_signature(data: str) -> str:
    """
    Compute HMAC-SHA256 signature for the given data.
    
    Args:
        data: String data to sign
        
    Returns:
        Base64url-encoded signature
    """
    secret = get_hmac_secret()
    signature = hmac.new(secret, data.encode('utf-8'), hashlib.sha256).digest()
    # Use base64url encoding (URL-safe, no padding)
    return base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')


def verify_hmac_signature(data: str, signature: str) -> bool:
    """
    Verify HMAC-SHA256 signature.
    
    Args:
        data: Original data string
        signature: Base64url-encoded signature to verify
        
    Returns:
        True if signature is valid, False otherwise
    """
    try:
        expected_signature = compute_hmac_signature(data)
        # Add padding if needed for comparison
        sig1 = expected_signature + '=' * (4 - len(expected_signature) % 4)
        sig2 = signature + '=' * (4 - len(signature) % 4)
        return hmac.compare_digest(sig1, sig2)
    except Exception:
        return False


def canonicalize_yaml_data(data: Dict[str, Any]) -> str:
    """
    Canonicalize YAML data for signing.
    
    According to the plan, we sign:
    - v (version)
    - event.id
    - share.scope
    - share.eventId
    - share.shareId
    - share.promoterId (if present)
    - share.issuedAt
    
    Args:
        data: Dictionary containing event and share data
        
    Returns:
        Canonicalized string for signing
    """
    parts = []
    
    # Version
    parts.append(f"v:{data.get('v', 1)}")
    
    # Event ID
    event = data.get('event', {})
    event_id = event.get('id', '')
    parts.append(f"event.id:{event_id}")
    
    # Share data
    share = data.get('share', {})
    parts.append(f"share.scope:{share.get('scope', '')}")
    parts.append(f"share.eventId:{share.get('eventId', '')}")
    parts.append(f"share.shareId:{share.get('shareId', '')}")
    
    # Promoter ID (optional)
    promoter_id = share.get('promoterId')
    if promoter_id:
        parts.append(f"share.promoterId:{promoter_id}")
    
    # Issued at
    issued_at = share.get('issuedAt', 0)
    parts.append(f"share.issuedAt:{issued_at}")
    
    return '\n'.join(parts)


def sign_yaml_payload(data: Dict[str, Any]) -> str:
    """
    Sign a YAML payload and add the signature to the data.
    
    Args:
        data: Dictionary containing event and share data
        
    Returns:
        Signature string
    """
    canonical = canonicalize_yaml_data(data)
    signature = compute_hmac_signature(canonical)
    return signature


def verify_yaml_payload(data: Dict[str, Any]) -> bool:
    """
    Verify the signature in a YAML payload.
    
    Args:
        data: Dictionary containing event, share, and signature
        
    Returns:
        True if signature is valid, False otherwise
    """
    share = data.get('share', {})
    signature = share.get('sig', '')
    
    if not signature:
        return False
    
    # Remove signature from data before canonicalizing
    data_copy = data.copy()
    share_copy = share.copy()
    share_copy.pop('sig', None)
    data_copy['share'] = share_copy
    
    canonical = canonicalize_yaml_data(data_copy)
    return verify_hmac_signature(canonical, signature)


def parse_yaml_payload(yaml_string: str) -> Optional[Dict[str, Any]]:
    """
    Parse a YAML string into a dictionary.
    
    Args:
        yaml_string: YAML string to parse
        
    Returns:
        Parsed dictionary or None if parsing fails
    """
    try:
        return yaml.safe_load(yaml_string)
    except Exception:
        return None


def generate_yaml_payload(data: Dict[str, Any]) -> str:
    """
    Generate a YAML string from a dictionary.
    
    Args:
        data: Dictionary to convert to YAML
        
    Returns:
        YAML string
    """
    return yaml.dump(data, default_flow_style=False, sort_keys=False)


def create_signed_yaml_payload(event_data: Dict[str, Any], share_data: Dict[str, Any]) -> str:
    """
    Create a signed YAML payload for event sharing.
    
    Args:
        event_data: Event information dictionary
        share_data: Share metadata dictionary (should not include 'sig' yet)
        
    Returns:
        Complete signed YAML payload as string
    """
    payload = {
        'v': 1,
        'event': event_data,
        'share': share_data,
    }
    
    # Sign the payload
    signature = sign_yaml_payload(payload)
    payload['share']['sig'] = signature
    
    # Generate YAML
    return generate_yaml_payload(payload)


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure URL-safe token.

    Args:
        length: approximate number of bytes of randomness (passed to token_urlsafe)

    Returns:
        URL-safe token string
    """
    import secrets
    return secrets.token_urlsafe(length)

