"""
AI Provider Management System
Handles multiple LLM providers with secure API key management for mediators
"""

import streamlit as st
import sqlite3
import json
import hashlib
import base64
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from enum import Enum
from cryptography.fernet import Fernet
import os

class LLMProvider(Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    COHERE = "cohere"
    HUGGINGFACE = "huggingface"
    AZURE_OPENAI = "azure_openai"
    OLLAMA = "ollama"
    CUSTOM = "custom"

class AIProviderManager:
    """Manages AI provider configurations and API keys for mediators"""
    
    def __init__(self, db_name: str):
        self.db_name = db_name
        self.encryption_key = self._get_or_create_encryption_key()
        self.cipher_suite = Fernet(self.encryption_key)
        
        # Initialize database tables
        self._init_database()
    
    def _get_or_create_encryption_key(self) -> bytes:
        """Get or create encryption key for API keys"""
        key_file = "encryption.key"
        
        if os.path.exists(key_file):
            with open(key_file, 'rb') as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, 'wb') as f:
                f.write(key)
            return key
    
    def _init_database(self):
        """Initialize database tables for AI provider management"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Create AI provider configurations table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS mediator_ai_configs (
                    config_id TEXT PRIMARY KEY,
                    mediator_id TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    api_key_encrypted TEXT NOT NULL,
                    model_name TEXT,
                    custom_endpoint TEXT,
                    is_active BOOLEAN DEFAULT 0,
                    is_default BOOLEAN DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT,
                    FOREIGN KEY (mediator_id) REFERENCES users (user_id)
                )
            ''')
            
            # Create AI usage logs table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS ai_usage_logs (
                    log_id TEXT PRIMARY KEY,
                    mediator_id TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    model_name TEXT,
                    usage_type TEXT NOT NULL,
                    tokens_used INTEGER,
                    cost DECIMAL(10,4),
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (mediator_id) REFERENCES users (user_id)
                )
            ''')
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            print(f"Error initializing AI provider database: {e}")
    
    def _encrypt_api_key(self, api_key: str) -> str:
        """Encrypt API key for secure storage"""
        try:
            encrypted_key = self.cipher_suite.encrypt(api_key.encode())
            return base64.b64encode(encrypted_key).decode()
        except Exception as e:
            print(f"Error encrypting API key: {e}")
            return ""
    
    def _decrypt_api_key(self, encrypted_key: str) -> str:
        """Decrypt API key for use"""
        try:
            encrypted_bytes = base64.b64decode(encrypted_key.encode())
            decrypted_key = self.cipher_suite.decrypt(encrypted_bytes)
            return decrypted_key.decode()
        except Exception as e:
            print(f"Error decrypting API key: {e}")
            return ""
    
    def get_supported_providers(self) -> List[Dict]:
        """Get list of supported AI providers with their details"""
        return [
            {
                "id": LLMProvider.OPENAI.value,
                "name": "OpenAI",
                "description": "GPT-4, GPT-3.5, and other OpenAI models",
                "models": ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"],
                "website": "https://openai.com",
                "api_docs": "https://platform.openai.com/docs"
            },
            {
                "id": LLMProvider.ANTHROPIC.value,
                "name": "Anthropic",
                "description": "Claude models for advanced reasoning",
                "models": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku", "claude-2"],
                "website": "https://anthropic.com",
                "api_docs": "https://docs.anthropic.com"
            },
            {
                "id": LLMProvider.GOOGLE.value,
                "name": "Google AI",
                "description": "Gemini and other Google AI models",
                "models": ["gemini-pro", "gemini-pro-vision", "text-bison", "chat-bison"],
                "website": "https://ai.google.dev",
                "api_docs": "https://ai.google.dev/docs"
            },
            {
                "id": LLMProvider.COHERE.value,
                "name": "Cohere",
                "description": "Command and Embed models",
                "models": ["command", "command-light", "command-nightly", "embed-english"],
                "website": "https://cohere.com",
                "api_docs": "https://docs.cohere.com"
            },
            {
                "id": LLMProvider.HUGGINGFACE.value,
                "name": "Hugging Face",
                "description": "Open source models and custom deployments",
                "models": ["custom", "meta-llama", "mistralai"],
                "website": "https://huggingface.co",
                "api_docs": "https://huggingface.co/docs"
            },
            {
                "id": LLMProvider.AZURE_OPENAI.value,
                "name": "Azure OpenAI",
                "description": "OpenAI models through Azure",
                "models": ["gpt-4", "gpt-3.5-turbo", "gpt-4o"],
                "website": "https://azure.microsoft.com/en-us/services/cognitive-services/openai-service",
                "api_docs": "https://learn.microsoft.com/en-us/azure/ai-services/openai"
            },
            {
                "id": LLMProvider.OLLAMA.value,
                "name": "Ollama (Local LLM)",
                "description": "Local LLM deployment - Run AI models on your own hardware",
                "models": [
                    "llama3.2", "llama3.1", "llama3", "llama2", 
                    "mistral", "codellama", "vicuna", "phi3", "gemma",
                    "qwen", "deepseek-coder", "starcoder", "wizardcoder",
                    "neural-chat", "orca-mini", "tinyllama", "openchat"
                ],
                "website": "https://ollama.ai",
                "api_docs": "https://ollama.ai/docs",
                "local_advantage": "Complete privacy, no API costs, full control"
            },
            {
                "id": LLMProvider.CUSTOM.value,
                "name": "Custom API",
                "description": "Custom LLM endpoint",
                "models": ["custom"],
                "website": "Custom",
                "api_docs": "Custom"
            }
        ]
    
    def save_mediator_ai_config(self, 
                               mediator_id: str, 
                               provider: str, 
                               api_key: str,
                               model_name: str = None,
                               custom_endpoint: str = None,
                               is_default: bool = False) -> bool:
        """Save mediator's AI provider configuration"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Generate config ID
            import uuid
            config_id = str(uuid.uuid4())
            
            # Encrypt API key
            encrypted_key = self._encrypt_api_key(api_key)
            
            # If this is set as default, unset other defaults for this mediator
            if is_default:
                cursor.execute('''
                    UPDATE mediator_ai_configs 
                    SET is_default = 0 
                    WHERE mediator_id = ? AND is_default = 1
                ''', (mediator_id,))
            
            # Insert new configuration
            cursor.execute('''
                INSERT INTO mediator_ai_configs 
                (config_id, mediator_id, provider, api_key_encrypted, model_name, 
                 custom_endpoint, is_default, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (config_id, mediator_id, provider, encrypted_key, model_name,
                  custom_endpoint, is_default, datetime.now().isoformat(),
                  datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error saving AI config: {e}")
            return False
    
    def get_mediator_ai_configs(self, mediator_id: str) -> List[Dict]:
        """Get all AI configurations for a mediator"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT config_id, provider, model_name, custom_endpoint, 
                       is_active, is_default, created_at, updated_at
                FROM mediator_ai_configs 
                WHERE mediator_id = ? 
                ORDER BY is_default DESC, created_at DESC
            ''', (mediator_id,))
            
            configs = []
            for row in cursor.fetchall():
                configs.append({
                    'config_id': row[0],
                    'provider': row[1],
                    'model_name': row[2],
                    'custom_endpoint': row[3],
                    'is_active': bool(row[4]),
                    'is_default': bool(row[5]),
                    'created_at': row[6],
                    'updated_at': row[7]
                })
            
            conn.close()
            return configs
            
        except Exception as e:
            print(f"Error getting AI configs: {e}")
            return []
    
    def get_mediator_default_config(self, mediator_id: str) -> Optional[Dict]:
        """Get mediator's default AI configuration with decrypted API key"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT config_id, provider, api_key_encrypted, model_name, custom_endpoint
                FROM mediator_ai_configs 
                WHERE mediator_id = ? AND is_default = 1 AND is_active = 1
            ''', (mediator_id,))
            
            result = cursor.fetchone()
            conn.close()
            
            if result:
                decrypted_key = self._decrypt_api_key(result[2])
                return {
                    'config_id': result[0],
                    'provider': result[1],
                    'api_key': decrypted_key,
                    'model_name': result[3],
                    'custom_endpoint': result[4]
                }
            
            return None
            
        except Exception as e:
            print(f"Error getting default AI config: {e}")
            return None
    
    def test_api_connection(self, provider: str, api_key: str, model_name: str = None) -> Tuple[bool, str]:
        """Test API connection for a provider"""
        try:
            if provider == LLMProvider.OPENAI.value:
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                
                # Test with a simple completion
                response = client.chat.completions.create(
                    model=model_name or "gpt-3.5-turbo",
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=5
                )
                return True, "Connection successful"
                
            elif provider == LLMProvider.ANTHROPIC.value:
                import anthropic
                client = anthropic.Anthropic(api_key=api_key)
                
                # Test with a simple message
                response = client.messages.create(
                    model=model_name or "claude-3-haiku-20240307",
                    max_tokens=5,
                    messages=[{"role": "user", "content": "Hello"}]
                )
                return True, "Connection successful"
                
            elif provider == LLMProvider.OLLAMA.value:
                import requests
                try:
                    # Test Ollama connection and model availability
                    endpoint = "http://localhost:11434/api/generate"
                    
                    # First check if Ollama is running
                    try:
                        health_response = requests.get("http://localhost:11434/api/tags", timeout=5)
                        if health_response.status_code != 200:
                            return False, "Ollama server not running. Please start Ollama service."
                    except requests.exceptions.ConnectionError:
                        return False, "Cannot connect to Ollama server. Please ensure Ollama is installed and running on localhost:11434"
                    
                    # Test model generation
                    test_model = model_name or "llama3.2"
                    response = requests.post(endpoint, 
                                           json={
                                               "model": test_model, 
                                               "prompt": "Hello", 
                                               "stream": False
                                           }, 
                                           timeout=30)
                    
                    if response.status_code == 200:
                        return True, f"Ollama connection successful with model '{test_model}'"
                    elif response.status_code == 404:
                        return False, f"Model '{test_model}' not found. Please pull the model first: 'ollama pull {test_model}'"
                    else:
                        return False, f"Ollama connection failed: {response.status_code} - {response.text}"
                        
                except requests.exceptions.Timeout:
                    return False, "Ollama request timeout. Model may be loading or unavailable."
                except Exception as e:
                    return False, f"Ollama connection error: {str(e)}"
            
            else:
                return False, f"Testing not implemented for {provider}"
                
        except Exception as e:
            return False, f"Connection failed: {str(e)}"
    
    def log_ai_usage(self, mediator_id: str, provider: str, model_name: str, 
                    usage_type: str, tokens_used: int = 0, cost: float = 0.0) -> bool:
        """Log AI usage for billing and analytics"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            import uuid
            log_id = str(uuid.uuid4())
            
            cursor.execute('''
                INSERT INTO ai_usage_logs 
                (log_id, mediator_id, provider, model_name, usage_type, 
                 tokens_used, cost, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (log_id, mediator_id, provider, model_name, usage_type,
                  tokens_used, cost, datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error logging AI usage: {e}")
            return False
    
    def get_mediator_usage_stats(self, mediator_id: str, days: int = 30) -> Dict:
        """Get AI usage statistics for a mediator"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            # Calculate date range
            from datetime import timedelta
            start_date = (datetime.now() - timedelta(days=days)).isoformat()
            
            # Get usage statistics
            cursor.execute('''
                SELECT provider, model_name, usage_type, 
                       COUNT(*) as usage_count,
                       SUM(tokens_used) as total_tokens,
                       SUM(cost) as total_cost
                FROM ai_usage_logs 
                WHERE mediator_id = ? AND created_at >= ?
                GROUP BY provider, model_name, usage_type
                ORDER BY created_at DESC
            ''', (mediator_id, start_date))
            
            stats = {
                'total_usage': 0,
                'total_tokens': 0,
                'total_cost': 0.0,
                'by_provider': {},
                'by_model': {},
                'by_type': {}
            }
            
            for row in cursor.fetchall():
                provider, model, usage_type, count, tokens, cost = row
                
                stats['total_usage'] += count
                stats['total_tokens'] += tokens or 0
                stats['total_cost'] += cost or 0.0
                
                # By provider
                if provider not in stats['by_provider']:
                    stats['by_provider'][provider] = {'count': 0, 'tokens': 0, 'cost': 0.0}
                stats['by_provider'][provider]['count'] += count
                stats['by_provider'][provider]['tokens'] += tokens or 0
                stats['by_provider'][provider]['cost'] += cost or 0.0
            
            conn.close()
            return stats
            
        except Exception as e:
            print(f"Error getting usage stats: {e}")
            return {'total_usage': 0, 'total_tokens': 0, 'total_cost': 0.0}

def show_ai_provider_settings():
    """Show AI provider configuration interface for mediators"""
    if st.session_state.user_role != 'mediator':
        st.error("AI provider settings are only available for mediators.")
        return
    
    mediator_id = st.session_state.user_id
    ai_manager = AIProviderManager("unified_mediation.db")
    
    st.header("🤖 AI Provider Settings")
    st.write("Configure your preferred AI/LLM providers for mediation assistance.")
    
    # Get current configurations
    current_configs = ai_manager.get_mediator_ai_configs(mediator_id)
    
    # Show current configurations
    if current_configs:
        st.subheader("📋 Current AI Configurations")
        
        for config in current_configs:
            with st.container():
                col1, col2, col3, col4 = st.columns([3, 1, 1, 1])
                
                with col1:
                    provider_info = next((p for p in ai_manager.get_supported_providers() 
                                        if p['id'] == config['provider']), None)
                    provider_name = provider_info['name'] if provider_info else config['provider']
                    
                    status_badges = []
                    if config['is_default']:
                        status_badges.append("🎯 Default")
                    if config['is_active']:
                        status_badges.append("🟢 Active")
                    else:
                        status_badges.append("🔴 Inactive")
                    
                    st.write(f"**{provider_name}** {' '.join(status_badges)}")
                    if config['model_name']:
                        st.write(f"Model: {config['model_name']}")
                    if config['custom_endpoint']:
                        st.write(f"Endpoint: {config['custom_endpoint']}")
                
                with col2:
                    if st.button("🧪 Test", key=f"test_{config['config_id']}"):
                        # Test connection (would need to decrypt API key)
                        st.info("Testing connection...")
                
                with col3:
                    if st.button("⚙️ Edit", key=f"edit_{config['config_id']}"):
                        st.session_state.editing_config = config['config_id']
                        st.rerun()
                
                with col4:
                    if st.button("🗑️ Delete", key=f"delete_{config['config_id']}"):
                        # Delete configuration
                        st.warning("Delete functionality would be implemented here")
                
                st.divider()
    
    # Add new configuration
    st.subheader("➕ Add New AI Provider")
    
    with st.form("add_ai_provider"):
        # Provider selection
        providers = ai_manager.get_supported_providers()
        provider_options = {p['id']: p['name'] for p in providers}
        
        selected_provider = st.selectbox(
            "Select AI Provider:",
            list(provider_options.keys()),
            format_func=lambda x: provider_options[x]
        )
        
        # Show provider details
        provider_info = next((p for p in providers if p['id'] == selected_provider), None)
        if provider_info:
            with st.expander("Provider Information"):
                st.write(f"**Description:** {provider_info['description']}")
                st.write(f"**Available Models:** {', '.join(provider_info['models'])}")
                st.write(f"**Website:** {provider_info['website']}")
        
        # API key input
        api_key = st.text_input(
            "API Key:",
            type="password",
            help="Your API key for the selected provider"
        )
        
        # Model selection
        available_models = provider_info['models'] if provider_info else []
        model_name = st.selectbox(
            "Model:",
            available_models,
            help="Select the specific model to use"
        )
        
        # Custom endpoint (for custom providers)
        custom_endpoint = None
        if selected_provider in [LLMProvider.CUSTOM.value, LLMProvider.OLLAMA.value]:
            if selected_provider == LLMProvider.OLLAMA.value:
                st.info("🖥️ **Ollama Local LLM Setup**")
                st.write("**Advantages:** Complete privacy, no API costs, full control over your data")
                
                # Ollama endpoint
                custom_endpoint = st.text_input(
                    "Ollama Endpoint:",
                    value="http://localhost:11434",
                    help="Ollama server endpoint (default: http://localhost:11434)"
                )
                
                # Ollama status check
                if st.button("🔍 Check Ollama Status"):
                    try:
                        import requests
                        response = requests.get(f"{custom_endpoint}/api/tags", timeout=5)
                        if response.status_code == 200:
                            data = response.json()
                            available_models = [model['name'] for model in data.get('models', [])]
                            st.success(f"✅ Ollama is running with {len(available_models)} models")
                            if available_models:
                                st.write("**Available models:**")
                                for model in available_models[:10]:  # Show first 10
                                    st.write(f"• {model}")
                                if len(available_models) > 10:
                                    st.write(f"... and {len(available_models) - 10} more")
                        else:
                            st.error("❌ Ollama server not responding")
                    except Exception as e:
                        st.error(f"❌ Cannot connect to Ollama: {str(e)}")
                        st.info("💡 **Setup Instructions:**")
                        st.write("1. Install Ollama: https://ollama.ai/download")
                        st.write("2. Start Ollama service")
                        st.write("3. Pull a model: `ollama pull llama3.2`")
                
                # Model selection with Ollama-specific info
                st.write("**Popular Ollama Models:**")
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.write("**General Purpose:**")
                    st.write("• llama3.2 (latest)")
                    st.write("• llama3.1")
                    st.write("• mistral")
                    st.write("• phi3")
                
                with col2:
                    st.write("**Code Specialized:**")
                    st.write("• codellama")
                    st.write("• deepseek-coder")
                    st.write("• starcoder")
                    st.write("• wizardcoder")
                
                with col3:
                    st.write("• **Lightweight:**")
                    st.write("• tinyllama")
                    st.write("• orca-mini")
                    st.write("• neural-chat")
                
                # Model pulling helper
                if st.button("📥 Pull Model to Ollama"):
                    model_to_pull = st.text_input("Model name to pull:", value="llama3.2")
                    if st.button("🚀 Pull Model"):
                        with st.spinner(f"Pulling {model_to_pull}... This may take several minutes."):
                            try:
                                import requests
                                response = requests.post(
                                    f"{custom_endpoint}/api/pull",
                                    json={"name": model_to_pull},
                                    timeout=300
                                )
                                if response.status_code == 200:
                                    st.success(f"✅ Model {model_to_pull} pulled successfully!")
                                else:
                                    st.error(f"❌ Failed to pull model: {response.text}")
                            except Exception as e:
                                st.error(f"❌ Error pulling model: {str(e)}")
            else:
                custom_endpoint = st.text_input(
                    "Custom Endpoint:",
                    placeholder="http://localhost:11434/api/generate",
                    help="Custom API endpoint URL"
                )
        
        # Options
        col1, col2 = st.columns(2)
        with col1:
            is_default = st.checkbox("Set as Default Provider")
        with col2:
            is_active = st.checkbox("Activate Immediately", value=True)
        
        # Submit button
        submitted = st.form_submit_button("💾 Save Configuration", type="primary")
        
        if submitted and api_key:
            # Test connection first
            with st.spinner("Testing API connection..."):
                success, message = ai_manager.test_api_connection(
                    selected_provider, api_key, model_name
                )
            
            if success:
                # Save configuration
                saved = ai_manager.save_mediator_ai_config(
                    mediator_id, selected_provider, api_key, 
                    model_name, custom_endpoint, is_default
                )
                
                if saved:
                    st.success("AI provider configuration saved successfully!")
                    st.rerun()
                else:
                    st.error("Failed to save configuration.")
            else:
                st.error(f"Connection test failed: {message}")
        elif submitted:
            st.error("Please provide an API key.")
    
    # Usage statistics
    st.subheader("📊 Usage Statistics")
    usage_stats = ai_manager.get_mediator_usage_stats(mediator_id, 30)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Requests (30d)", usage_stats['total_usage'])
    with col2:
        st.metric("Total Tokens (30d)", f"{usage_stats['total_tokens']:,}")
    with col3:
        st.metric("Total Cost (30d)", f"${usage_stats['total_cost']:.2f}")
    
    if usage_stats['by_provider']:
        st.write("**Usage by Provider:**")
        for provider, stats in usage_stats['by_provider'].items():
            st.write(f"• {provider}: {stats['count']} requests, {stats['tokens']:,} tokens, ${stats['cost']:.2f}")

def get_mediator_ai_client(mediator_id: str):
    """Get configured AI client for a mediator"""
    ai_manager = AIProviderManager("unified_mediation.db")
    config = ai_manager.get_mediator_default_config(mediator_id)
    
    if not config:
        return None, "No AI provider configured"
    
    try:
        if config['provider'] == LLMProvider.OPENAI.value:
            from openai import OpenAI
            client = OpenAI(api_key=config['api_key'])
            return client, config['model_name']
            
        elif config['provider'] == LLMProvider.ANTHROPIC.value:
            import anthropic
            client = anthropic.Anthropic(api_key=config['api_key'])
            return client, config['model_name']
            
        elif config['provider'] == LLMProvider.OLLAMA.value:
            import requests
            # Enhanced Ollama client with better error handling
            class OllamaClient:
                def __init__(self, endpoint, model):
                    self.endpoint = endpoint or "http://localhost:11434"
                    self.model = model
                    self.generate_endpoint = f"{self.endpoint}/api/generate"
                    self.chat_endpoint = f"{self.endpoint}/api/chat"
                
                def chat_completions_create(self, model=None, messages=None, **kwargs):
                    """Create a chat completion using Ollama API"""
                    try:
                        target_model = model or self.model
                        
                        # Convert OpenAI-style messages to Ollama format
                        ollama_messages = []
                        for msg in messages:
                            ollama_messages.append({
                                "role": msg["role"],
                                "content": msg["content"]
                            })
                        
                        # Use chat endpoint for better conversation handling
                        payload = {
                            "model": target_model,
                            "messages": ollama_messages,
                            "stream": False,
                            "options": {
                                "temperature": kwargs.get('temperature', 0.7),
                                "top_p": kwargs.get('top_p', 0.9),
                                "max_tokens": kwargs.get('max_tokens', 2048)
                            }
                        }
                        
                        response = requests.post(
                            self.chat_endpoint, 
                            json=payload,
                            timeout=120  # Longer timeout for local models
                        )
                        
                        if response.status_code == 200:
                            result = response.json()
                            return type('Response', (), {
                                'choices': [type('Choice', (), {
                                    'message': type('Message', (), {
                                        'content': result.get('message', {}).get('content', '')
                                    })()
                                })()]
                            })()
                        else:
                            raise Exception(f"Ollama request failed: {response.status_code} - {response.text}")
                            
                    except requests.exceptions.Timeout:
                        raise Exception("Ollama request timeout. The model may be loading or your system may be under load.")
                    except requests.exceptions.ConnectionError:
                        raise Exception("Cannot connect to Ollama server. Please ensure Ollama is running.")
                    except Exception as e:
                        raise Exception(f"Ollama error: {str(e)}")
                
                def get_available_models(self):
                    """Get list of available Ollama models"""
                    try:
                        response = requests.get(f"{self.endpoint}/api/tags", timeout=10)
                        if response.status_code == 200:
                            data = response.json()
                            return [model['name'] for model in data.get('models', [])]
                        return []
                    except:
                        return []
                
                def pull_model(self, model_name):
                    """Pull a model to local Ollama instance"""
                    try:
                        response = requests.post(
                            f"{self.endpoint}/api/pull",
                            json={"name": model_name},
                            timeout=300  # Long timeout for model pulling
                        )
                        return response.status_code == 200
                    except:
                        return False
            
            return OllamaClient(config['custom_endpoint'], config['model_name']), config['model_name']
        
        else:
            return None, f"Provider {config['provider']} not yet implemented"
            
    except Exception as e:
        return None, f"Error initializing AI client: {str(e)}"
