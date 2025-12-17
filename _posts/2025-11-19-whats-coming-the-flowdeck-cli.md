---
layout: post
title: "What’s Coming: The FlowDeck CLI"
date: 2025-11-19 16:51:07 
category: whats-new
tags: []
excerpt: "Big changes coming to FlowDeck. Not visible yet, but they’ll make everything better. I’m rebuilding FlowDeck’s core as a Swift CLI. The extension you’re using now will stay the same…"
---

Big changes coming to FlowDeck. Not visible yet, but they’ll make everything better.





I’m rebuilding FlowDeck’s core as a Swift CLI. The extension you’re using now will stay the same on the surface: same commands, same workflow, same “just works” experience. But underneath, it’ll run on a proper foundation.





Right now, all of FlowDeck’s logic lives in TypeScript inside the extension. Project parsing, build management, simulator control, all in the extension layer. That works, but it creates limits.





The CLI changes that. Native Swift handling the actual work. The extension becomes a clean interface on top. Same features, better performance, more reliable.





But here’s where it gets interesting: FlowDeck won’t be locked to VS Code anymore.





The CLI works anywhere. Neovim. CI pipelines. GitHub Actions. Other editors. Any environment that can run a command-line tool. One foundation, multiple ways to use it.





And AI agents. They’ll be able to use FlowDeck directly through the CLI. No more MCP servers, guessing xcodebuild syntax or your project structure. FlowDeck already understands your workspace. Agents just need to call the CLI commands. Build, test, iterate, all autonomous.





This is early in development. Nothing to download yet. But the response has been strong.  Developers want professional iOS tooling that works everywhere, and agents that can actually build apps, not just generate code.





The extension you’re using today keeps getting better. This just makes everything else possible too.





More updates as development progresses.  Heres a sneak peek:
