---
title: Introduction
order: 1
---

# Venice Program Table: Introduction

The Venice Program Table (VPT) is a compact, language-agnostic, versioned binary container for bundling multiple "program" modules (by name) together with their source code or bytecode. Initially designed for the Venice MicroPython runtime, it can also be used for other languages such as Lua or Haskell, enabling you to package and deploy a “module → bytecode” mapping as a single buffer that the runtime can validate and load efficiently. It is intended for use by custom language runtimes similar to Venice.

## Why VPT?

- Single artifact: Link a single blob that contains all your precompiled modules.
- Zero-copy access: The runtime reads module names and payloads directly from the buffer without extra allocations.
- Robustness: Built-in magic, version, and vendor identifiers to detect wrong or incompatible blobs early.
- Alignment-aware: Entries and their payloads are padded to 8-byte alignment for fast and safe access on the ARM Cortex A7.

## High-level Structure

In this documentation and API, a “program” refers to a named payload: the payload is the module’s source code, bytecode, or whatever needs to be shipped; and the name is the name to be used by the language runtime.

A VPT consists of:
- A header that identifies the blob and describes its contents:
  - Magic number
  - Format version
  - Vendor ID (lets you differentiate tables built for different consumers/purposes)
  - Total size
  - Number of contained programs
- A sequence of “program” entries (one per module):
  - A small per-entry header with the lengths of the module name and the payload
  - The module’s bytecode payload (for the Venice MicroPython runtime)
  - The module’s name (as bytes)
  - Padding to maintain 8-byte alignment

## Producing and Consuming VPT

- Building (host side):
  - Gather your source code or bytecode modules, along with their names.
  - Use the optional builder to add each module’s name and bytecode and then serialize a VPT blob.
  - Link the blob to your runtime or embed it as static data.

- Loading (target side):
  - Provide the blob and its expected vendor ID to the runtime.
  - The parser validates the header (magic, version compatibility, vendor ID, size).
  - Iterate programs to locate modules by name and pass their payloads to the runtime.
    - For fast lookup, you may iterate them once and index them into a hash map.

## Design Notes

- Versioned format to support evolution while preserving compatibility.
- 8-byte alignment for proper payload access.
- Zero-copy iteration over entries for minimal overhead.

Use VPT whenever you need a reliable, portable way to deliver a bundle of named program modules to the VEX V5 programs.
