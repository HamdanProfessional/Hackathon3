# Phase 4: Backend Services - Research

**Phase**: 4
**Status**: Draft

---

## Research-1: Dapr Service Invocation Patterns

### Question

Should we use HTTP or gRPC for Dapr service invocation?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **HTTP** | Simple debugging, widely supported, easier to mock | Higher latency than gRPC |
| **gRPC** | Lower latency, binary format, built-in streaming | More complex debugging, protobuf overhead |

### Decision

**Choice**: HTTP

**Rationale**:
- Development simplicity is critical for hackathon timeline
- HTTP debugging is straightforward with standard tools
- Dapr HTTP sidecar has <5ms overhead vs gRPC (acceptable)
- Easier to generate OpenAPI documentation from HTTP services

**Alternatives Considered**: gRPC (rejected due to complexity)

---

## Research-2: Kafka Event Batching Strategy

### Question

What is the optimal batch size for publishing events to Kafka via Dapr?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **Individual (1)** | Lowest latency, immediate processing | High overhead, TCP/IP cost per message |
| **Small batch (50)** | Balanced latency/throughput | Moderate complexity |
| **Large batch (500)** | High throughput, low overhead | Higher latency, more memory |

### Decision

**Choice**: Small batch (50 messages)

**Rationale**:
- Dapr's default batch size is 50 (proven default)
- 2-second max wait ensures freshness
- Learning platform benefits from real-time feedback
- Throughput requirements modest (100 concurrent users)

**Alternatives Considered**: Individual (rejected - too much overhead), Large batch (rejected - too much latency)

---

## Research-3: AsyncOpenAI Connection Pooling

### Question

How should we manage AsyncOpenAI client connections across services?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **Per-request client** | No connection reuse, simple | High latency, connection overhead |
| **Singleton client** | Connection reuse, simple | Potential bottleneck |
| **Pooled client (20)** | Balanced, concurrent requests | More complex setup |

### Decision

**Choice**: Singleton client per service

**Rationale**:
- AsyncOpenAI client manages its own connection pool internally
- One instance per service is Dapr's recommended pattern
- Simplicity wins (no custom pool management)
- Each service scales horizontally (multiple instances = multiple pools)

**Alternatives Considered**: Per-request (rejected - latency), Pooled (rejected - unnecessary complexity)

---

## Research-4: State Store Partitioning Strategy

### Question

How should we partition state in Dapr state store for multi-tenant isolation?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **No partitioning** | Simple, single namespace | Hotspots, scalability limits |
| **By student_id prefix** | Even distribution, predictable routing | Requires prefix-based queries |
| **By service** | Service isolation | Uneven load (progress-service heavy) |

### Decision

**Choice**: By student_id prefix

**Rationale**:
- Student operations naturally group by student
- Predictable routing (hash-based on prefix)
- Enables future sharding by student range
- Services can query efficiently by student

**Implementation**:
```
State key format: {student_id[:2]}:{student_id}:{entity_type}:{entity_id}
Example: a1:550e8400-e29b-41d4-a716-446655440000:progress:loops
```

**Alternatives Considered**: No partitioning (rejected - scalability), By service (rejected - uneven load)

---

## Research-5: AI Provider Fallback Strategy

### Question

What should services do when OpenAI API is unavailable?

### Options

| Option | Pros | Cons |
|--------|------|------|
| **Fail fast** | Clear error, no partial behavior | Poor UX, learning interrupted |
| **Cache-based fallback** | Continues serving | Stale content, limited coverage |
| **Local model fallback** | Full capability | Higher latency, quality variance |

### Decision

**Choice**: Cache-based fallback with graceful degradation

**Rationale**:
- Common explanations (for loops, lists) cache well
- 80% of learning platform traffic covers 20% of topics
- Local model fallback adds infrastructure complexity
- Graceful error messaging when cache miss

**Implementation**:
- Cache common concept explanations for 1 hour
- Return cached response with "using offline mode" notice
- Show helpful error if no cache available

**Alternatives Considered**: Fail fast (rejected - poor UX), Local model (rejected - complexity)

---

## Summary

| Research ID | Decision | Impact |
|-------------|----------|--------|
| RESEARCH-1 | HTTP invocation | Development simplicity |
| RESEARCH-2 | Batch 50 events | Balanced latency/throughput |
| RESEARCH-3 | Singleton client | Connection reuse, simple |
| RESEARCH-4 | Student ID prefix partitioning | Scalable state storage |
| RESEARCH-5 | Cache-based fallback | Resilience to outages |
