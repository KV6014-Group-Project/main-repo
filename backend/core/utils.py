"""
Core utilities for Ed25519 signing, YAML processing, and shared helpers.
"""
import base64
import yaml
from typing import Dict, Any, Optional
from django.conf import settings
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from cryptography.hazmat.primitives import serialization


def get_signing_key() -> Ed25519PrivateKey:
    """Get the Ed25519 private key from settings."""
    private_key_pem = getattr(settings, 'ED25519_PRIVATE_KEY', None)
    
    if not private_key_pem:
        raise ValueError("ED25519_PRIVATE_KEY not configured in settings")
    
    if isinstance(private_key_pem, str):
        private_key_pem = private_key_pem.encode('utf-8')
    
    return serialization.load_pem_private_key(private_key_pem, password=None)


def get_verification_key() -> Ed25519PublicKey:
    """Get the Ed25519 public key from the private key."""
    private_key = get_signing_key()
    return private_key.public_key()


def get_public_key_base64() -> str:
    """
    Get the public key as a base64url-encoded string for frontend use.
    
    Returns:
        Base64url-encoded public key (raw bytes, no PEM format)
    """
    public_key = get_verification_key()
    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )
    return base64.urlsafe_b64encode(public_bytes).decode('utf-8').rstrip('=')


def compute_signature(data: str) -> str:
    """
    Compute Ed25519 signature for the given data.
    
    Args:
        data: String data to sign
        
    Returns:
        Base64url-encoded signature
    """
    private_key = get_signing_key()
    signature = private_key.sign(data.encode('utf-8'))
    return base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')


def verify_signature(data: str, signature: str) -> bool:
    """
    Verify Ed25519 signature.
    
    Args:
        data: Original data string
        signature: Base64url-encoded signature to verify
        
    Returns:
        True if signature is valid, False otherwise
    """
    try:
        public_key = get_verification_key()
        
        # Add padding if needed
        signature_padded = signature + '=' * (4 - len(signature) % 4)
        signature_bytes = base64.urlsafe_b64decode(signature_padded)
        
        public_key.verify(signature_bytes, data.encode('utf-8'))
        return True
    except Exception:
        return False


def canonicalize_yaml_data(data: Dict[str, Any]) -> str:
    """
    Canonicalize YAML data for signing.
    Supports both full format and compact format.
    
    Args:
        data: Dictionary containing event and share data
        
    Returns:
        Canonicalized string for signing
    """
    parts = []
    
    parts.append(f"v:{data.get('v', 1)}")
    
    event = data.get('event', {})
    parts.append(f"event.id:{event.get('id', '')}")
    
    share = data.get('share', {})
    
    # Support both full and compact formats
    scope = share.get('scope') or share.get('s', '')
    event_id = share.get('eventId') or share.get('e', '')
    share_id = share.get('shareId') or share.get('i', '')
    promoter_id = share.get('promoterId') or share.get('p')
    issued_at = share.get('issuedAt') or share.get('t', 0)
    
    parts.append(f"share.scope:{scope}")
    parts.append(f"share.eventId:{event_id}")
    parts.append(f"share.shareId:{share_id}")
    
    if promoter_id:
        parts.append(f"share.promoterId:{promoter_id}")
    
    parts.append(f"share.issuedAt:{issued_at}")
    
    return '\n'.join(parts)


def sign_yaml_payload(data: Dict[str, Any]) -> str:
    """
    Sign a YAML payload and return the signature.
    
    Args:
        data: Dictionary containing event and share data
        
    Returns:
        Signature string
    """
    canonical = canonicalize_yaml_data(data)
    return compute_signature(canonical)


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
    
    data_copy = data.copy()
    share_copy = share.copy()
    share_copy.pop('sig', None)
    data_copy['share'] = share_copy
    
    canonical = canonicalize_yaml_data(data_copy)
    return verify_signature(canonical, signature)


def parse_yaml_payload(yaml_string: str) -> Optional[Dict[str, Any]]:
    """Parse a YAML string into a dictionary."""
    try:
        return yaml.safe_load(yaml_string)
    except Exception:
        return None


def generate_yaml_payload(data: Dict[str, Any]) -> str:
    """Generate a YAML string from a dictionary."""
    return yaml.dump(data, default_flow_style=False, sort_keys=False)


def create_compact_qr_payload(event_id: str, event_title: str, event_start: str, 
                               promoter_id: str, share_id: str) -> str:
    """
    Create a minimal signed payload for QR codes.
    Uses short keys and JSON for compactness.
    
    Format: Base64(JSON({v, e:{id,t,s}, p, i, ts, sig}))
    - v: version
    - e: event {id, t=title, s=start}
    - p: promoter_id
    - i: share_id
    - ts: timestamp (seconds)
    - sig: signature
    
    Returns:
        Base64url-encoded compact payload
    """
    import json
    import time
    
    ts = int(time.time())
    
    # Create minimal payload
    payload = {
        'v': 1,
        'e': {
            'id': event_id,
            't': event_title[:50],  # Truncate long titles
            's': event_start,
        },
        'p': promoter_id,
        'i': share_id,
        'ts': ts,
    }
    
    # Canonicalize for signing
    canonical = f"v:1\ne.id:{event_id}\np:{promoter_id}\ni:{share_id}\nts:{ts}"
    signature = compute_signature(canonical)
    payload['sig'] = signature
    
    # Encode as compact JSON, then base64
    json_str = json.dumps(payload, separators=(',', ':'))
    return base64.urlsafe_b64encode(json_str.encode()).decode().rstrip('=')


def parse_compact_qr_payload(encoded: str) -> Optional[Dict[str, Any]]:
    """
    Parse and verify a compact QR payload.
    
    Returns:
        Parsed payload dict if valid, None if invalid
    """
    import json
    
    try:
        # Decode base64
        padded = encoded + '=' * (4 - len(encoded) % 4)
        json_str = base64.urlsafe_b64decode(padded).decode()
        payload = json.loads(json_str)
        
        # Extract and verify signature
        signature = payload.pop('sig', None)
        if not signature:
            return None
        
        # Recreate canonical string
        canonical = f"v:{payload['v']}\ne.id:{payload['e']['id']}\np:{payload['p']}\ni:{payload['i']}\nts:{payload['ts']}"
        
        if not verify_signature(canonical, signature):
            return None
        
        return payload
    except Exception:
        return None


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
    
    signature = sign_yaml_payload(payload)
    payload['share']['sig'] = signature
    
    return generate_yaml_payload(payload)


def create_compact_yaml_payload(event_id: str, event_title: str, event_start: str,
                                 promoter_id: str, share_id: str) -> str:
    """
    Create a minimal signed YAML payload for QR codes.
    Uses short keys but keeps full IDs for server lookup.
    
    Returns:
        Compact YAML string (still human-readable)
    """
    import time
    
    ts = int(time.time())
    
    # Build compact payload with short keys but FULL IDs
    # e=event, p=promoter, i=shareId, t=timestamp
    payload = {
        'v': 1,
        'e': event_id,              # Full event ID (needed for lookup)
        't': event_title[:50],      # Title (truncated for display)
        's': event_start[:16],      # Start datetime (YYYY-MM-DDTHH:MM)
        'p': promoter_id,           # Full promoter ID (for attribution)
        'i': share_id,              # Full share ID (for dedup)
        'ts': ts,
    }
    
    # Canonicalize for signing
    canonical = f"v:1\ne:{event_id}\np:{promoter_id}\ni:{share_id}\nts:{ts}"
    signature = compute_signature(canonical)
    payload['sig'] = signature
    
    # Generate block-style YAML (more readable)
    return yaml.dump(payload, default_flow_style=False, sort_keys=False).strip()

def create_organiser_invitation_token(event_id: str, promoter_id: str = None) -> dict:
    """
    Create a signed invitation token for organiser→promoter invitations.
    Uses the same Ed25519 signing as YAML payloads for consistency.
    
    Args:
        event_id: UUID of the event
        promoter_id: Optional PromoterProfile ID to target specific promoter
        
    Returns:
        Dictionary with token and metadata
    """
    import uuid
    import time
    
    share_id = str(uuid.uuid4())
    issued_at = int(time.time() * 1000)
    
    # Create token payload
    token_payload = {
        'scope': 'organiser',
        'eventId': event_id,
        'shareId': share_id,
        'issuedAt': issued_at,
        'channel': 'token'
    }
    
    # Add targeted promoter ID if provided
    if promoter_id:
        token_payload['promoterId'] = promoter_id
    
    # Canonicalize and sign
    canonical_parts = [
        f"scope:{token_payload['scope']}",
        f"eventId:{token_payload['eventId']}",
        f"shareId:{token_payload['shareId']}",
        f"issuedAt:{token_payload['issuedAt']}",
        f"channel:{token_payload['channel']}"
    ]
    
    # Include promoter ID in signature if present
    if promoter_id:
        canonical_parts.append(f"promoterId:{promoter_id}")
    
    canonical_string = '\n'.join(canonical_parts)
    signature = compute_signature(canonical_string)
    
    # Add signature to payload
    token_payload['sig'] = signature
    
    # Encode as base64url
    import json
    token_json = json.dumps(token_payload, separators=(',', ':'))
    token = base64.urlsafe_b64encode(token_json.encode()).decode().rstrip('=')
    
    TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000  # 7 days
    
    return {
        'token': token,
        'share_id': share_id,
        'issued_at': issued_at,
        'expires_at': issued_at + TOKEN_EXPIRY_MS,
    }


def parse_organiser_invitation_token(token: str, promoter_id: str = None) -> dict:
    """
    Parse and validate an organiser invitation token.
    
    Args:
        token: Base64url-encoded token string
        promoter_id: Optional - PromoterProfile ID of user accepting token (for validation)
        
    Returns:
        Dictionary with parsed and validated components
        
    Raises:
        ValueError: If token is invalid, tampered, expired, or promoter mismatch
    """
    import json
    import time
    
    try:
        # Decode token
        token_padded = token + '=' * (4 - len(token) % 4)
        token_json = base64.urlsafe_b64decode(token_padded).decode()
        token_payload = json.loads(token_json)
        
        # Validate required fields
        required_fields = ['scope', 'eventId', 'shareId', 'issuedAt', 'sig']
        for field in required_fields:
            if field not in token_payload:
                raise ValueError(f"Missing required field: {field}")
        
        # Verify scope
        if token_payload['scope'] != 'organiser':
            raise ValueError("Invalid token scope")
        
        # Extract signature
        signature = token_payload.pop('sig')
        
        # Recreate canonical string for verification
        canonical_parts = [
            f"scope:{token_payload['scope']}",
            f"eventId:{token_payload['eventId']}",
            f"shareId:{token_payload['shareId']}",
            f"issuedAt:{token_payload['issuedAt']}",
            f"channel:{token_payload.get('channel', 'token')}"
        ]
        
        # Include promoter ID in verification if present
        token_promoter_id = token_payload.get('promoterId')
        if token_promoter_id:
            canonical_parts.append(f"promoterId:{token_promoter_id}")
            
            # If token is targeted, validate promoter matches
            if promoter_id and promoter_id != token_promoter_id:
                raise ValueError("This invitation is for a different promoter")
        
        canonical_string = '\n'.join(canonical_parts)
        
        # Verify signature
        if not verify_signature(canonical_string, signature):
            raise ValueError("Invalid signature - token may have been tampered with")
        
        # Check expiration
        current_time = int(time.time() * 1000)
        issued_at_ms = int(token_payload['issuedAt'])
        TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000  # 7 days
        
        if current_time - issued_at_ms > TOKEN_EXPIRY_MS:
            raise ValueError("Token has expired")
        
        return {
            'event_id': token_payload['eventId'],
            'share_id': token_payload['shareId'],
            'issued_at': issued_at_ms,
            'scope': token_payload['scope'],
            'promoter_id': token_promoter_id,  # None if generic token
            'is_valid': True,
        }
        
    except json.JSONDecodeError:
        raise ValueError("Invalid token format - not valid JSON")
    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Invalid token: {str(e)}")