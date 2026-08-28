# Media processing ownership review

Status: proposal only; no implementation is approved.

Review branch: `codex/media-architecture-review`

Preserved unapproved commits:

- `ba48cc0` — shared image-pipeline constants, concurrency, and HTTP policy
- `999cd48` — unreleased `0.4.1` version bump

The approved Lumi base remains `348aabc` (`0.4.0`).

## Decision

Lumi must remain a browser-facing Svelte design system. It may describe how an
image is presented, but it must not own native image processing, server
scheduling, storage policy, or HTTP file-serving policy.

The shared processing owner should be a separate Node-only package with the
working repository name `media-node`. Coedula and Faztore will consume its small
semantic API only after the package, fixtures, and benchmark gate are approved.

```text
Lumi
  presentation: Image, src/srcset, loading, visual variants

Coedula / Faztore
  authorization, domain rules, database, storage, publication, HTTP

media-node
  validated encoded raster input -> normalized encoded outputs + metadata
```

## Lumi boundary

Keep in Lumi:

- the `Image` component and browser image semantics;
- UI-level `thumb | preview | original` vocabulary where a Lumi Drive component
  directly consumes it;
- URL/srcset composition that does not know how a derivative is generated.

Remove from Lumi before any release:

- the public `./concurrency` entry point;
- native-work queue semantics;
- pixel, resize, encoder-quality, and reduction policy;
- server response headers and active-document download policy;
- environment parsing added only for server image processing.

Lumi must not depend on Sharp, a Rust addon, a media daemon, Node filesystem
APIs, SvelteKit server APIs, or an application storage layout.

## Engine decision

The package boundary and the engine decision are separate.

1. Start the measured baseline with Sharp/libvips. Sharp already delegates
   decode, resize, and encode to native libvips; importing it from a server-only
   package does not add browser weight.
2. Benchmark `@napi-rs/image` as the only near-term Rust-backed Node challenger.
   Its own implementation combines Rust orchestration with
   `fast_image_resize`, `image`, libavif, libwebp, MozJPEG, and resvg. It is not
   an ultra-minimal pure-Rust engine, and strict hostile-input limits and peak
   memory must be proven on the real corpus.
3. Do not create `/opt/media-rs/media-rs` yet. A Rust libvips wrapper uses the
   same engine, while a custom codec stack adds orientation, color, alpha,
   metadata, limit, deployment, and protocol responsibilities.
4. Consider a resident Unix-socket service only if host-global scheduling or
   crash/RSS isolation is required and measured. Never spawn a process per
   derivative.

Primary references:

- [Sharp concurrency and performance](https://sharp.pixelplumbing.com/performance/)
- [Sharp Linux allocator guidance](https://sharp.pixelplumbing.com/install/#linux-memory-allocator)
- [libvips](https://github.com/libvips/libvips)
- [`@napi-rs/image`](https://github.com/Brooooooklyn/Image)
- [`fast_image_resize`](https://github.com/Cykooz/fast_image_resize)
- [Rust `image` codec support](https://docs.rs/image/latest/image/codecs/index.html)

## Approval gates

No implementation begins until all of these are explicitly approved:

- ownership boundary and package name;
- the Coedula and Faztore plans on their companion review branches;
- exact v1 input/output contract and error model;
- whether the first engine is Sharp/libvips;
- representative private fixture corpus and benchmark method;
- release order and rollback strategy.

Rust replaces the baseline only with full behavioral parity and a material
end-to-end production win. The proposed decision threshold is at least one of:

- 30% more completed jobs per second;
- 30% lower p95 transform latency; or
- 25% lower peak process/cgroup RSS;

with no regression in output dimensions, perceptual quality, output size,
malformed-input handling, public-route latency, or operational complexity.

## Git disposition

The two unapproved commits remain preserved on this branch with this plan. The
local `main` branch is moved back to `348aabc`; `0.4.1` must not be published
from the review branch.
