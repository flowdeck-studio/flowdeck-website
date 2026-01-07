---
layout: post
title: "🚀 FlowDeck is Here!"
date: 2025-10-10 19:16:51 
category: blog
tags: []
excerpt: "I built FlowDeck because I was tired of choosing between AI assistance and iOS development. Four months ago I was debugging a SwiftUI state issue in Xcode. Thirty minutes, no…"
---

I built FlowDeck because I was tired of choosing between AI assistance and iOS development.





Four months ago I was debugging a SwiftUI state issue in Xcode. Thirty minutes, no progress. Opened the same project in Cursor. Asked Claude. Found it in two minutes.





Back to Xcode to build. New error. Back to Cursor for a fix. Back to Xcode. Build again. Different error.





This back-and-forth is the reality of iOS development with AI tools. Cursor has Claude, GPT, and Gemini built in. Full context. Multi-file editing. But it doesn’t support iOS. You still need Xcode to build.





I tried SweetPad. Spent a weekend configuring buildServer.json files. Got it working. Broke two days later. Spent another evening fixing it. I was maintaining my tooling more than building my app.





Then Xcode 16 shipped with Swift Assist. Apple chose the models. That’s it. Want Claude? Gemini? Local models? Wait for Apple.





I’m not waiting anymore.





Build iOS Apps in Cursor



FlowDeck is a VS Code extension for iOS development. Install it. Open your Xcode project. Hit Cmd+R. It builds and runs.





No config files. No buildServer.json edits. No debugging why SourceKit-LSP won’t start. Install and build.





The workflow: write SwiftUI with Claude’s help, Cmd+R to build, test in simulator, debug with breakpoints. All in Cursor.





Four months of development. xcodebuild integration. SourceKit-LSP configuration. CodeLLDB debugging. Simulator management. Testing support. Made it work without manual setup.





The Complete Workflow




**Build & Run**: Cmd+B to build, Cmd+R to run. Xcode keyboard shortcuts that work.



**Debug**: CodeLLDB integration. Breakpoints, variable inspection, LLDB console.



**Test**: Native VS Code test explorer. Run tests, see results inline.



**Intelligence**: SourceKit-LSP for Swift autocomplete and diagnostics.



**Platforms**: iOS, macOS, watchOS, tvOS. Simulators and physical devices.




Write code with AI assistance. Error appears. Ask AI to fix it inline. Apply the fix. Keep building. No switching editors. No copying errors to chat windows.





Why Now



Cursor 2.0 launched last week. Composer agents for multi-file changes. Parallel agents trying different approaches. Four models working simultaneously.





This is where AI development is heading. Fast iteration. Multiple approaches tested in parallel.





iOS developers couldn’t use it. FlowDeck changes that.





What’s Next



This is beta. It works—I use it daily. But there are rough edges. Some features need polish. Some workflows could be smoother.





I built what I needed. If you need it too, try it. Join the Discord. Tell me what breaks. Help shape what comes next.





The iOS development landscape changed. AI exists. Better editors exist. Apple platforms don’t need to be stuck in the past.





**Install FlowDeck from the VS Code marketplace.**





**Join the community on Discord.**





The tool iOS development needed is here.
