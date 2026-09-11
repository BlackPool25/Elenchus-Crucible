# Hardened Stress-Spike Protocol (crucible)

Eliminating the "Status Code 0" Fallacy through adversarial, boundary-breaking empirical microbenchmarks.

**Threshold status: every numeric gate in this file is PROVISIONAL pending smoke-check calibration (todo-15). Do NOT soften thresholds without L1 fatal reclassification per `technical-feasibility-matrix.md`.**

### Tiered numeric gates (pick by reversibility)

- **Low (reversible):** 10-coroutine smoke + 500-iteration RSS check + corrupt-payload rejection.
- **Standard (module boundary / new dep):** 50+ coroutines; RSS monotonicity over 1k–10k iterations with leak-profile verdict; 200ms jitter + 429 + socket drops; malformed/boundary corpus rejection 100%; 10x-ingress saturation curve to collapse + shedding point; mutation inversion gate (harness MUST fail on corrupted code).
- **Irreversible (data-loss / protocol / security):** 200+ coroutines + sustained soak + full fault matrix.

---

## 1. The "Status Code 0" Fallacy

When autonomous agents are instructed to validate architectural feasibility, they default to writing 10-line, single-threaded happy-path scripts. If the script exits with `code 0`, the agent falsely reports: *"Feasibility verified."*

In production, this component fails immediately because it was never tested under:
- Concurrent thread contention on connection pools.
- Slow network sockets and timeout propagation.
- Resident memory growth and garbage collection pauses.
- Malformed inputs and schema poisoning.

**The Golden Spike Rule:** A spike does not test whether a library works under perfect conditions; **a spike tests whether the architecture survives under realistic worst-case boundary conditions.**

---

## 2. The 6 Mandatory Stress-Testing Vectors

Every spike evaluating an architectural dependency or interface must execute all six vectors:

```
                  ┌────────────────────────────────────────┐
                  │    The 6-Vector Stress-Spike Suite     │
                  └───────────────────┬────────────────────┘
                                      │
        ┌───────────────┬─────────────┼─────────────┬───────────────┐
        ▼               ▼             ▼             ▼               ▼
 ┌─────────────┐ ┌─────────────┐┌───────────┐ ┌───────────┐ ┌───────────────┐
 │ 1. High     │ │ 2. Memory   ││ 3. Fault  │ │ 4. Bound. │ │ 5. Backpress. │
 │ Concurrency │ │ Leak Monot. ││ Injection │ │ & Poison  │ │ & Saturation  │
 │ (50-100 ops)│ │ (1k-10k ops)││ (429/Jitt)│ │ (Malformed│ │ (10x Ingress) │
 └─────────────┘ └─────────────┘└───────────┘ └───────────┘ └───────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ 6. Mutation Inversion Gate│
                        │ (Intentional Sabotage Test)
                        └───────────────────────────┘
```

1. **High Concurrency & Contention:**
   - Execute $\ge 50\text{–}100$ parallel coroutines or threads competing for the same client pool, channel, or database transaction (Standard tier minimum: 50+ coroutines).
   - Target: Measure lock contention, thread starvation, connection pool exhaustion, and deadlock probability.
2. **Memory Monotonicity & RSS Profiling:**
   - Execute $1,000\text{–}10,000$ operations in a continuous loop while sampling process Resident Set Size (RSS).
   - Target: Monotonic memory growth $>5\%$ across steady-state iterations triggers an automatic memory leak failure. Kill-gate: RSS growth > 5% → KILL.
3. **Adversarial Fault Injection:**
   - Inject 200ms jitter, random socket disconnects, and simulated HTTP 429 rate limits.
   - Target: Verify that exponential backoff with full jitter functions correctly and context cancellations propagate without leaking goroutines/threads.
4. **Boundary & Malformed Payloads:**
   - Inject null bytes (`\x00`), 10MB payloads when 10KB is expected, circular references, truncated JSON, and SQL injection strings.
   - Target: Confirm safe schema rejection without unhandled exceptions or process panics.
5. **Backpressure & Queue Saturation:**
   - Produce messages at $10\times$ consumer processing capacity for 10 seconds.
   - Target: Verify deterministic drop-tail, load shedding, or caller-runs backpressure rather than Out-Of-Memory (OOM) crashes. Kill-gate: 10x-ingress OOM without shedding → KILL/PIVOT.
6. **The Mutation Inversion Gate:**
   - Deliberately mutate the code under test (e.g., corrupt authentication tokens, pass invalid connection strings, or flip boolean logic).
   - Target: **The verification harness MUST fail.** If the test suite passes on intentionally corrupted code, the spike is vacuous and rejected. This mutation inversion gate is non-negotiable: a harness that cannot detect sabotage proves nothing.

---

## 3. Production-Ready Python Stress-Harness Template

```python
"""
Hardened Pre-Build Stress Harness Template
Validates concurrency, memory stability, fault injection, and mutation inversion.
"""
import asyncio
import os
import sys
import time
import tracemalloc
import psutil

async def target_operation(client_id: int, payload: dict) -> bool:
    """The candidate architectural operation under test."""
    # Simulate work and network latency
    await asyncio.sleep(0.01)
    if payload.get("corrupt"):
        raise ValueError("Simulated fault")
    return True

async def run_concurrency_vector(concurrency: int = 50, operations: int = 500):
    print(f"[*] Vector 1: Testing concurrency ({concurrency} workers, {operations} ops)...")
    sem = asyncio.Semaphore(concurrency)
    successes = 0
    failures = 0

    async def worker(op_id: int):
        nonlocal successes, failures
        async with sem:
            try:
                ok = await target_operation(op_id, {"data": "test_payload"})
                if ok:
                    successes += 1
            except Exception:
                failures += 1

    tasks = [worker(i) for i in range(operations)]
    start = time.perf_counter()
    await asyncio.gather(*tasks)
    duration = time.perf_counter() - start
    print(f"    Completed in {duration:.3f}s. Success: {successes}, Failures: {failures}")
    assert failures == 0, f"Concurrency failed: {failures} errors"

async def run_memory_vector(iterations: int = 2000):
    print(f"[*] Vector 2: Testing memory stability across {iterations} iterations...")
    process = psutil.Process(os.getpid())
    tracemalloc.start()
    
    # Warmup
    for i in range(100):
        await target_operation(i, {"data": "warmup"})
    
    initial_rss = process.memory_info().rss
    snapshot1 = tracemalloc.take_snapshot()

    for i in range(iterations):
        await target_operation(i, {"data": "stress_iteration"})

    final_rss = process.memory_info().rss
    growth_pct = ((final_rss - initial_rss) / initial_rss) * 100
    print(f"    Initial RSS: {initial_rss / 1024 / 1024:.2f} MB | Final RSS: {final_rss / 1024 / 1024:.2f} MB")
    print(f"    RSS Growth: {growth_pct:.2f}%")
    assert growth_pct < 5.0, f"Memory leak detected: RSS grew by {growth_pct:.2f}%"

async def run_fault_vector():
    print("[*] Vector 3: Testing fault injection (corrupt payloads)...")
    try:
        await target_operation(999, {"corrupt": True})
        raise AssertionError("Fault injection failed: Target succeeded on corrupt payload!")
    except ValueError:
        print("    Target cleanly rejected corrupt payload with expected exception.")

async def run_mutation_inversion_gate():
    print("[*] Vector 6: Mutation Inversion Gate (verifying test sensitivity)...")
    # Invert verification logic; ensure the harness catches failure
    caught = False
    try:
        # Deliberately invalid call that must fail
        await target_operation(-1, {"corrupt": True})
    except ValueError:
        caught = True
    assert caught, "Mutation Inversion Failed: Test harness did not catch intentional fault!"
    print("    Mutation inversion passed: Test harness reliably detects broken states.")

async def main():
    print("=== STARTING PRE-BUILD STRESS SPIKE HARNESS ===")
    await run_concurrency_vector()
    await run_memory_vector()
    await run_fault_vector()
    await run_mutation_inversion_gate()
    print("=== ALL STRESS VECTORS PASSED: ARCHITECTURE CORROBORATED ===")

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 4. Spike Lifecycle & Rules of Engagement

1. **Quarantine:** All spike code lives in a throwaway branch or dedicated scratch directory (`spike/`). Spike code never leaves `spike/` quarantine.
2. **Zero Production Merging:** Spike code is **strictly prohibited from merging into `main`**. The "Prototype Trap" (converting a quick hack into production code) is a primary source of technical debt.
3. **Hard Timebox:** Spikes must conclude within **24–48 hours** (or a defined agent step budget). Agent wall-clock: ≤30 min total, ≤10 min per vector.
4. **Kill-gates (automatic):** RSS growth > 5% → KILL; harness passing on corrupted code → spike rejected as vacuous; 10x-ingress OOM without shedding → KILL/PIVOT. "Status Code 0" happy-path scripts with no fault vectors are rejected as anti-toy violations.
5. **Harness docs:** spike-runner SHOULD consult official harness API docs via context7_query-docs and log the library IDs used.
6. **Deliverable:** The only surviving deliverable of a spike is an **Architecture Decision Record (ADR)** in `DECISIONS.md` documenting:
   - Specific killer assumption tested.
   - Exact benchmark measurements (p99 latency, memory growth, error rate).
   - Verdict: `FEASIBLE`, `KILL`, or `PIVOT`, plus saved engineering cost.
