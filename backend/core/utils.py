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
    parts.append(f"share.scope:{share.get('scope', '')}")
    parts.append(f"share.eventId:{share.get('eventId', '')}")
    parts.append(f"share.shareId:{share.get('shareId', '')}")
    
    promoter_id = share.get('promoterId')
    if promoter_id:
        parts.append(f"share.promoterId:{promoter_id}")
    
    parts.append(f"share.issuedAt:{share.get('issuedAt', 0)}")
    
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