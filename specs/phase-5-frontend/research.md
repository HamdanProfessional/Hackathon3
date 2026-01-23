# Phase 5: Frontend User Interface - Research

**Phase**: 5
**Status**: Draft

---

## Research-1: Monaco Editor Bundle Strategy

### Question

How should we load Monaco Editor to minimize initial bundle size?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **Bundle with app** | No loading delay | Large initial bundle (~3MB) |
| **Dynamic import** | Small initial bundle, loads on-demand | Flash of unstyled content |
| **SSR disabled** | Simpler build | No SEO benefit |

### Decision

**Choice**: Dynamic import with code splitting

**Rationale**:
- Initial page load is critical for UX
- Monaco only needed on exercise pages
- Next.js dynamic() supports lazy loading
- Can show loading spinner during import

**Implementation**:
```typescript
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
})
```

---

## Research-2: WebSocket vs SSE for Chat

### Question

Should we use WebSocket or Server-Sent Events for chat streaming?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **WebSocket** | Bidirectional, lower latency | More complex, needs connection management |
| **SSE** | Simpler, HTTP-based, automatic reconnection | Unidirectional only |

### Decision

**Choice**: Server-Sent Events (SSE)

**Rationale**:
- Chat is primarily unidirectional (AI → student)
- SSE is simpler (built on HTTP)
- Automatic reconnection handling
- Lower complexity for hackathon timeline

**Implementation**:
```typescript
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  body: JSON.stringify({ message }),
})
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  appendMessage(new TextDecoder().decode(value))
}
```

---

## Research-3: State Management Pattern

### Question

How should we structure Zustand stores for multi-user flows?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **Single store** | Simple state management | Complex for multiple users |
| **Multiple stores** | Separated concerns | Need cross-store actions |
| **Context + Stores** | Best of both | More setup |

### Decision

**Choice**: Multiple Zustand stores (user, code, chat, progress)

**Rationale**:
- Clear separation of concerns
- Each store is simple and focused
- Easy to test independently
- Zustand's devtools support multiple stores

---

## Research-4: Real-Time Struggle Alerts

### Question

How should teachers receive real-time struggle alerts?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **Polling** | Simple implementation | Delayed updates, high server load |
| **SSE** | Real-time, efficient | Unidirectional |
| **WebSocket** | Bidirectional, real-time | More complex |

### Decision

**Choice**: SSE for struggle alerts

**Rationale**:
- Server → Client communication only
- Simpler than WebSocket
- Can use same SSE infrastructure as chat
- Automatic reconnection

**Implementation**:
```typescript
// Teacher dashboard subscribes to struggle stream
const eventSource = new EventSource('/api/struggles/stream')
eventSource.onmessage = (event) => {
  const alert = JSON.parse(event.data)
  addStruggleAlert(alert)
}
```

---

## Summary

| Research ID | Decision | Impact |
|-------------|----------|--------|
| RESEARCH-1 | Dynamic Monaco import | Faster initial page load |
| RESEARCH-2 | SSE for chat | Simpler real-time streaming |
| RESEARCH-3 | Multiple Zustand stores | Separated concerns, simple |
| RESEARCH-4 | SSE for struggle alerts | Real-time alerts with simple setup |
