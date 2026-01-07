---
layout: post
title: "FlowDeck now has a Claude Code Plugin"
date: 2025-12-18 10:00:00
category: blog
tags: [claude-code, plugin, release]
excerpt: "The new Claude Code plugin has shipped. Two commands to install, and Claude starts using FlowDeck by default for iOS development."
---

The new Claude Code plugin has shipped: [github.com/flowdeck-studio/flowdeck-plugin](https://github.com/flowdeck-studio/flowdeck-plugin)

Two commands to install:

```
/plugin marketplace add flowdeck-studio/flowdeck-plugin
/plugin install flowdeck@flowdeck-studio-flowdeck-plugin
```

## What It Does

Claude Code knows `xcodebuild`. It's been trained on years of Stack Overflow answers and Apple documentation. When you ask it to build an iOS app, that's what it reaches for.

The plugin changes that. Now Claude uses FlowDeck by default, and more importantly, it knows *why* to use FlowDeck. The plugin teaches Claude the debug loop: run the app, stream logs, capture screenshots. It understands that `flowdeck context --json` gives it everything it needs about your project without parsing Xcode files.

It also blocks xcodebuild, xcrun simctl, and xcrun devicectl. Not because they don't work, but because you have something better installed.

## Why Bother

If you're using Claude Code for iOS development and you have FlowDeck, this makes both tools work together properly. Claude stops guessing at xcodebuild flags and starts using the tool designed to give it visibility into your app.

That's it. Go install it.
