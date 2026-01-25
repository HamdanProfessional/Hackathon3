"""
Configurable LLM Client - Supports OpenAI and GLM 4.7

Usage:
    from common.llm_client import get_llm_client, LLMProvider

    # Use OpenAI
    client = get_llm_client(LLMProvider.OPENAI, api_key="sk-...")

    # Use GLM 4.7 (Z.ai / Zhipu AI)
    client = get_llm_client(LLMProvider.GLM, api_key="your-z.ai-key")

    # From environment
    import os
    provider = LLMProvider(os.getenv("LLM_PROVIDER", "openai"))
    client = get_llm_client(provider, api_key=os.getenv("LLM_API_KEY"))
"""

import os
from enum import Enum
from typing import Optional
from openai import AsyncOpenAI, OpenAI


class LLMProvider(str, Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    GLM = "glm"  # Z.ai / Zhipu AI


# Provider configurations
PROVIDER_CONFIGS = {
    LLMProvider.OPENAI: {
        "base_url": None,  # Use OpenAI default
        "default_model": "gpt-4o-mini",
        "models": ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    },
    LLMProvider.GLM: {
        "base_url": "https://open.bigmodel.cn/api/paas/v4/",
        "default_model": "glm-4.7",
        "models": ["glm-4.7", "glm-4.6v", "glm-4", "glm-3-turbo"],
    }
}


def get_llm_client(
    provider: LLMProvider = LLMProvider.OPENAI,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    async_client: bool = False
) -> OpenAI | AsyncOpenAI:
    """
    Get a configured LLM client.

    Args:
        provider: LLM provider (openai or glm)
        api_key: API key (if None, reads from environment)
        base_url: Base URL override
        async_client: Return async client if True

    Returns:
        Configured OpenAI client
    """
    config = PROVIDER_CONFIGS[provider]

    # Get API key from env if not provided
    if api_key is None:
        if provider == LLMProvider.OPENAI:
            api_key = os.getenv("OPENAI_API_KEY")
        elif provider == LLMProvider.GLM:
            api_key = os.getenv("GLM_API_KEY") or os.getenv("ZAI_API_KEY")

    if not api_key:
        raise ValueError(
            f"API key required for {provider.value}. "
            f"Set {provider.value.upper()}_API_KEY environment variable."
        )

    # Use config base_url unless overridden
    if base_url is None:
        base_url = config["base_url"]

    # Create client
    client_kwargs = {"api_key": api_key}
    if base_url:
        client_kwargs["base_url"] = base_url

    ClientClass = AsyncOpenAI if async_client else OpenAI
    return ClientClass(**client_kwargs)


def get_default_model(provider: LLMProvider) -> str:
    """Get the default model for a provider"""
    return PROVIDER_CONFIGS[provider]["default_model"]


def list_models(provider: LLMProvider) -> list[str]:
    """List available models for a provider"""
    return PROVIDER_CONFIGS[provider]["models"]


class LLMClientFactory:
    """
    Factory class for creating LLM clients with consistent configuration.
    Useful for dependency injection.
    """

    def __init__(
        self,
        provider: LLMProvider = LLMProvider.OPENAI,
        api_key: Optional[str] = None,
        model: Optional[str] = None
    ):
        self.provider = provider
        self.api_key = api_key
        self.model = model or get_default_model(provider)
        self._sync_client = None
        _async_client = None

    @property
    def sync_client(self) -> OpenAI:
        """Get or create sync client"""
        if self._sync_client is None:
            self._sync_client = get_llm_client(
                self.provider, self.api_key, async_client=False
            )
        return self._sync_client

    @property
    def async_client(self) -> AsyncOpenAI:
        """Get or create async client"""
        if self._async_client is None:
            self._async_client = get_llm_client(
                self.provider, self.api_key, async_client=True
            )
        return self._async_client

    def create_sync_client(self) -> OpenAI:
        """Create a new sync client instance"""
        return get_llm_client(self.provider, self.api_key, async_client=False)

    def create_async_client(self) -> AsyncOpenAI:
        """Create a new async client instance"""
        return get_llm_client(self.provider, self.api_key, async_client=True)


# Environment-based factory - useful for containerized apps
def get_llm_factory_from_env() -> LLMClientFactory:
    """
    Create LLMClientFactory from environment variables.

    Required env vars:
        LLM_PROVIDER: "openai" or "glm" (default: openai)
        OPENAI_API_KEY or GLM_API_KEY: Your API key

    Optional env vars:
        LLM_MODEL: Model name (default: provider's default model)
    """
    provider_str = os.getenv("LLM_PROVIDER", "openai").lower()
    provider = LLMProvider(provider_str)

    # Get API key based on provider
    if provider == LLMProvider.OPENAI:
        api_key = os.getenv("OPENAI_API_KEY")
    else:
        api_key = os.getenv("GLM_API_KEY") or os.getenv("ZAI_API_KEY")

    model = os.getenv("LLM_MODEL")

    return LLMClientFactory(provider=provider, api_key=api_key, model=model)


# Convenience functions for common patterns
def create_openai_client(api_key: str, model: str = "gpt-4o-mini") -> OpenAI:
    """Create OpenAI client with default settings"""
    return get_llm_client(LLMProvider.OPENAI, api_key=api_key)


def create_glm_client(api_key: str, model: str = "glm-4.7") -> OpenAI:
    """Create GLM (Z.ai) client with default settings"""
    return get_llm_client(LLMProvider.GLM, api_key=api_key)
