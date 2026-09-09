# Technical Feasibility Matrix & Boundary Audits (crucible)

Mathematical constraints, physical limits, and risk classifications across engineering archetypes.

---

## 1. Archetype A: Distributed Systems, High-Throughput Backends & Data Pipelines

### 1.1 Storage Physics & Write Amplification ($WAF$)
$$WAF = \frac{\text{Total Bytes Written to Storage Media}}{\text{Logical Bytes Written by Application}}$$

- **B-Tree Engines (PostgreSQL, MySQL InnoDB):**
  - Mutating 100 bytes in an 8KB page with WAL double-buffering results in:
    $$WAF_{\text{B-Tree}} \approx \frac{8192 \text{ (WAL)} + 8192 \text{ (Data Page)}}{100} \approx \mathbf{163.8}$$
  - *Cliff:* Working set exceeds RAM $\to$ random disk reads prior to page writes collapse throughput.
- **LSM-Tree Engines (RocksDB, Cassandra, ScyllaDB):**
  - Leveled compaction ($T=10$, $L=4$ levels): $WAF_{\text{Leveled}} \approx O(T \cdot L) \approx \mathbf{40}$.
  - *Write Stall Boundary:* If client ingress $R_{\text{in}} > \frac{\text{Max Media Write Bandwidth}}{WAF}$, the engine triggers a write stall, dropping throughput to near zero.
- **Bloom Filter Sizing:**
  $$m = - \frac{n \ln p}{(\ln 2)^2}$$
  Allocating **10 bits/key** yields $p \approx 0.82\%$ with $k=7$ hashes. 1 billion keys requires **1.16 GiB of pinned DRAM**.
- **Consistent Hashing Load Variance:**
  $$\sigma = \sqrt{\frac{1}{V}}$$
  Without virtual nodes ($V=1$), load variance is $200\text{–}300\%$. With $V=256$, variance drops to **$6.25\%$**.

### 1.2 Consistency & Network Physics
- **PACELC Formulation:**
  - *PA/EL (DynamoDB, Cassandra):* Latency prioritized normally; availability prioritized in partitions. Stale reads; LWW or CRDT reconciliation.
  - *PC/EC (Spanner, CockroachDB):* Consistency prioritized always. Incurs minimum $1 \times \text{WAN RTT} + \text{fsync}$ on write quorums.
- **Distributed Locks & Monotonic Fencing:**
  - Redis Redlock without fencing fails safety during GC pauses or hypervisor descheduling.
  - *Invariant:* Distributed locks (etcd/ZooKeeper) MUST issue a monotonic fencing token (`raft_index`). Storage must reject tokens $\le \text{last\_committed\_token}$.
- **Tail Latency Fan-Out Amplification:**
  $$P(\text{System Latency} > T) = 1 - (1 - P(L > T))^M$$
  With $M=100$ parallel downstream calls and a downstream $p99$ SLA ($1\%$):
  $$P(\text{Tail Latency}) = 1 - (1 - 0.01)^{100} \approx \mathbf{63.4\%}$$
  Requires hedged speculative retries at $p95$ and deadline propagation.
- **Queueing Collapse (Kingman's Formula):**
  $$W_q \approx \left( \frac{\rho}{1 - \rho} \right) \left( \frac{C_a^2 + C_s^2}{2} \right) \frac{1}{\mu}$$
  At utilization $\rho = 0.95$, wait time is **19x service time**. Load shedding is mandatory at $\ge 80\%$ utilization.

---

## 2. Archetype B: AI-Native & Agentic Architectures

### 2.1 KV-Cache Sizing & Hardware VRAM Boundaries
$$\text{Memory}_{\text{KV}} = 2 \times n_{\text{layers}} \times n_{\text{kv\_heads}} \times d_{\text{head}} \times 2 \text{ bytes (FP16)} \times L_{\text{seq}}$$

- **Llama-3-70B GQA ($n_{\text{kv\_heads}}=8$, $d_{\text{head}}=128$, $n_{\text{layers}}=80$):**
  $$\text{Memory per Token} = 2 \times 80 \times 8 \times 128 \times 2 \approx \mathbf{320 \text{ KiB/token}}$$
  - 1 request at 32k context = **10.0 GiB VRAM** solely for KV-cache.
  - 10 concurrent requests at 32k context = **100 GiB VRAM** for KV-cache.
- **RadixAttention / PagedAttention:** Essential to avoid duplicate prefix caching and fragmenting GPU memory.

### 2.2 Stochasticity & Decoding Boundaries
- **Hardware-Level Non-Determinism:** At `temperature = 0.0`, concurrent GPU thread block reductions are non-associative; logit drift occurs.
- **Grammar-Constrained Decoding:** Pushdown automata (Outlines, vLLM guided decoding) mask invalid tokens before softmax, reducing JSON schema violations to mathematical zero.

### 2.3 Security: The Dual-LLM Quarantine Model
- **Quarantined Reader LLM:** Reads untrusted web pages/PDFs with **zero tool access**.
- **Privileged Action LLM:** Plans actions and executes tools using sanitized outputs.
- **MicroVM Sandboxing:** Code execution runs inside Firecracker/gVisor with cloud metadata service (`169.254.169.254`) blocked.

---

## 3. Archetype C: Hard R&D, Novel Algorithms & Scientific Computing

### 3.1 The Roofline Model: Hardware Boundaries
$$\text{Operational Intensity } I = \frac{\text{Total Operations (FLOPs)}}{\text{Total Memory Traffic (Bytes Transferred from DRAM)}}$$
$$\text{Hardware Ridge Point } I^* = \frac{\text{Peak Compute Performance (TFLOPS)}}{\text{Peak Memory Bandwidth (TB/s)}}$$

- On an NVIDIA H100 SXM5 ($989\text{ TFLOPS}$ / $3.35\text{ TB/s}$ HBM3):
  $$I^* = \frac{989}{3.35} \approx \mathbf{295.2 \text{ FLOPs/byte}}$$
  - Any algorithm with $I < 295.2$ is strictly **memory-bandwidth bound**. Adding compute cores yields zero speedup.
  - *FlashAttention:* Tiles $Q, K, V$ into 256 KiB SRAM, computing softmax without round-tripping the $N \times N$ matrix to HBM. Memory traffic drops from $O(N^2)$ to $O(N)$.

### 3.2 Numerical Stability & Catastrophic Cancellation
- **Matrix Condition Number ($\kappa(A)$):**
  $$\kappa(A) = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}$$
  Solving $Ax = b$ loses $\log_{10} \kappa(A)$ digits of decimal precision. In FP32 (~7.2 digits of precision), if $\kappa(A) > 10^7$, the result is pure numerical noise. Preconditioners are mandatory.
- **Catastrophic Cancellation:** $x - y$ when $x \approx y$ loses significant digits instantly; use Log-Sum-Exp trick and numerically stable Softmax ($\text{Softmax}(x_i) = \frac{e^{x_i - \max(X)}}{\sum_j e^{x_j - \max(X)}}$).

---

## 4. Pre-Build Feasibility Decision Framework

### 4.1 Risk Categorization Hierarchy

| Level | Severity | Action Required | Examples |
| :--- | :--- | :--- | :--- |
| **Level 1** | **Fatal** | **Kill Immediately / Redesign Invariants.** | Violates speed of light ($<5\text{ms}$ transcontinental); write ingress exceeds media bandwidth $\times WAF$; combinatorial $O(2^N)$ on $N>40$; unit cost exceeds LTV by $>10\times$. |
| **Level 2** | **High** | **Mandatory Hardened Stress Spike Required.** | Tail latency amplification across $>50$ microservices; distributed locking without fencing; agent tool loops without cycle detection; memory-bound algorithms with $I < I^*$. |
| **Level 3** | **Medium** | **Documented Architectural Trade-off (ADR).** | Eventual consistency lag $<2\text{s}$; model quantization from FP16 to INT8 ($<1.5\%$ drop); managed API vs. self-hosted open weights. |
| **Level 4** | **Low** | **Standard Implementation Practice.** | Routine schema migrations; connection pool tuning; circuit breaker timeouts; rate-limiting quotas. |

---

## 5. The 15 Critical Pre-Build Stress Questions

Before approving any technical architecture:
1. What is the write amplification factor ($WAF$) under peak random mutations?
2. When the working set exceeds RAM, what is the read amplification factor ($RAF$)?
3. What distributed consensus protocol prevents split-brain writes during network partitions?
4. Do distributed locks issue monotonically increasing fencing tokens verified by the datastore?
5. Under Kingman's formula, what is the queue wait time when utilization reaches 85%?
6. When fanning out to downstream dependencies, what is the cumulative $p99$ tail latency?
7. In an AI application, what is the total KV-cache VRAM consumption at peak concurrent sessions?
8. What grammar-constrained pushdown automaton guarantees zero JSON parsing failures?
9. Is untrusted web/PDF content isolated behind a Dual-LLM quarantine architecture?
10. Under the Roofline model, is the core algorithm compute-bound or memory-bandwidth bound?
11. What is the condition number $\kappa(A)$ of system matrices, and does it exceed float precision limits?
12. How does the system degrade when a third-party dependency exhibits a 15-second latency tail?
13. If availability zone A drops, what bulkhead isolates Tier-1 critical paths?
14. What prospective hindsight scenario was uncovered during the Gary Klein pre-mortem?
15. What fundamental constraint shifted by $10\times$ (the "Why Now?" test) that prevented past projects from dying?
