---
layout: post
title: "🚀 FlowDeck CLI is out!"
date: 2025-12-17 10:00:00
category: blog
tags: [cli, release]
excerpt: "The CLI is live. I've spent the last month rebuilding FlowDeck's core from TypeScript to native Swift. Same capabilities, no editor dependency. FlowDeck becomes infrastructure."
---

CLI is finally out.

I've spent the last month rebuilding FlowDeck's core from TypeScript to native Swift. The VS Code extension was becoming a bottleneck. Every new feature meant fighting the extension API, wrestling with TypeScript bundling and adding workarounds. The architecture that got FlowDeck started was holding it back.

So I rebuilt the foundation as a standalone CLI. Same capabilities, no editor dependency. FlowDeck becomes infrastructure.

## Why this matters

The CLI works everywhere. Your terminal. CI/CD pipelines. AI agents. Any editor that can run shell commands. The extension was one integration point; the CLI is infinite integration possibilities.

Interactive mode is the bread and butter. Launch `flowdeck -i` and stay there. B builds. R runs. T tests. L streams logs. Full dev loop without opening Xcode or typing verbose commands.

![](/images/cli.png)

AI agents can finally close the loop on Apple platforms. Claude Code, Codex, Aider; they all hit a wall when they need to build and test. Apple's tools output unstructured text that's nearly impossible to parse. FlowDeck gives them structured commands in, JSON out. I've already shipped Claude Code integration. More agents coming soon.

CI/CD gets the same benefit. `--json` on every command. No more regex parsing `xcodebuild` output.

## The extension stays free

The Cursor extension isn't going anywhere. Still the easiest way to start, still free forever. The CLI is the engine underneath; the extension becomes a UI layer on top. Faster development, better stability, features that work identically everywhere.

## Pricing

$29/year early adopter price. Normally $59. Seven-day free trial.

I'm a solo developer. The extension is free because it's the easiest way to get people building Apple apps in Cursor. But free doesn't pay for continued development. The CLI is how FlowDeck stays sustainable.

Annual-only, no monthly option. Simpler for me to manage, and it filters for developers who actually want to use this, not just kick the tires indefinitely. If you're building for Apple platforms regularly, $29/year is less than the time you'll save in a single afternoon of not fighting `xcodebuild`.

The early adopter price is real and it won't last forever. When it goes to $59, existing subscribers keep their rate on renewal.

## Get it now
Just fire up your terminal and copy paste.  FlowDeck will guide you through the rest of the process.  FlowDeck CLI also has [extensive documentation](https://docs.flowdeck.studio/cli/) to get you up and running in no time!

```bash
curl -sSL https://flowdeck.studio/install.sh | sh
```



## What's next?

Over the next few updates I'll be stripping TypeScript from the extension as the CLI takes over the core. Less code, better stability, faster iteration, and then..  more exciting stuff


I'm in [Discord](https://discord.gg/VJ6nwb6Weg) daily. Your feedback shapes what comes next.

[Start your free CLI trial →](https://store.flowdeck.studio/buy/e6fa7284-4c29-4b3e-8c76-e3b46c35c52c)
