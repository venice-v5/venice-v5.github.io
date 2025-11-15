---
title: What is Venice? 
order: 1
---

## What is Venice?

Venice is a MicroPython runtime for VEX V5 robots. It takes Python code that you write and runs it on the V5 brain, giving it access to control devices like motors and sensors. Venice abstracts low-level features like task scheduling and memory allocation to allow your code to run seamlessly on the brain.

## What do you mean, "MicroPython"?

MicroPython is an implementation of the Python 3 programming language in C for embedded devices. The V5 brain is one such embedded device, meaning that it doesn't have access to a full-fledged operating system like Linux or MacOS. MicroPython is designed to run on embedded devices by using significantly fewer OS-level APIs and being extremely resource-efficient.

If you've used Python before, you're in luck; the vast majority of modern Python syntax Just Works in Venice's MicroPython. The primary difference is that some standard library modules, such as `requests` and `os`, are partially or fully unimplemented because they rely on an operating system. Venice provides implementations for some of the standard library modules, such as `typing`, that you'll want to use in your programs.

## Why should I use Venice?

After all, VEX itself provides a [first-party MicroPython implementation](https://api.vex.com/v5/home/python/index.html).

The biggest thing that distinguishes Venice from the VEX Python implementation is that **it's just Python**. What does that mean?

<ul class="[&_li]:list-disc ml-4">
    <li>To add Venice to a project, you can <i>just install it</i>! The Venice CLI and runtime SDK are available as a regular PyPI package. This is in contrast to VEX Python, which is only available through VEXcode or a proprietary VSCode extension.</li>
    <li>All of your program's metadata is stored in the industry-standard pyproject.toml config file, compared to VEX Python's custom configuration formula.</li>
    <li>Multi-file support is built-in to Venice, just like any other Python project. In VEX Python, you can only have one file, which is a dealbreaker for many teams.</li>
    <li>(coming soon) You can use regular libraries from PyPI in your Venice programs, compared to VEX Python which does not support adding libraries.</li>
    <li>Venice takes advantage of modern Python features, such as <code>typing</code> annotations, Async Python for long-running tasks, idiomatic APIs, and more. The VEX Python SDK is unidiomatic, preventing integration with the broader Python ecosystem.</li>
    <li>Venice can be used everywhere! You can write Venice code in a code editor of your choice; the <code>venice</code> CLI is just a regular executable package that you can run from anywhere with a terminal.</li>
</ul>

## Venice is fully open-source

Venice stands on the shoulders of giants, such as [vexide](https://vexide.dev/), [MicroPython](https://micropython.org/), and [Rust](https://www.rust-lang.org/). In the same spirit, Venice is fully open-source. All of its major repositories are fully open-source and licensed under MPL 2.0, enabling anyone to build on our work. Feel free to submit fixes and features to our [runtime](https://github.com/venice-v5/venice) and [CLI](https://github.com/venice-v5/venice-cli)!
