---
title: "Livtet's Doors are Almost Open"
date: 2026-11-09
description: 'A lot of work has been put into developing Livtet for web. This post goes into what has been done'
tags: [meta, livtet]
authors:
  - did: 'did:plc:e2ctbutx6kya6si4if5ngjmm'
    name: 'Jacky'
    url: 'https://www.jacky.wtf'
audience: 'Anyone interested in Livtet'
---

Livtet is a platform for book tracking and discovery. It's been some time since
I've written about how and what it does &mdash; buckle in!

## Features Today

Livtet has things you'd expect from a book platform under its belt:

- Book tracking: your current reads, long finished and given up on
- Purchase discoverability by way of <https://bookshop.org> and <https://libro.fm>;
- Leaving reviews and ratings about what you've read
- Preliminary progress tracking
- Book clubs with conversation threads, associated reading lists and meeting scheduling

The goal is for folks to find a Atmospheric replacement to things like
**Goodreads** and **Fable** &mdash; apps that build silos and sell back your
information to you. For now, I'm focusing on making the core experience robust
enough that I can use it with friends in the space on a regular basis.

## Enter Spaces

One notable thing is that it's beginning to take advantage of [permissioned
data][1]: allowing folks to write things in not-so-public spaces and have
tighter access over who and what can read it. The short version (of my
implementation is): a protected list doesn't live in your public (facing) repo.
It lives in a separate "space" repo on your own PDS, and every read of it is
gated by a short-lived credential (like a throwaway key) issued by whoever
holds authority over that space.

For a list you own, that authority is **you**: your PDS mints a special token,
then Livtet trades it for a two-hour credential bound to a key it holds, and
uses that credential to access those records. For a list you share,
the member list _is_ the access control list, so adding somebody is the "grant"
and removing them makes their next read from the group fail (like being removed
from a group on Signal or WhatsApp except that if you close the window, you
lose the history).

For ease of development, book clubs weren't built with another system for
access; a club points at a reading list and inherits its visibility. The
refusal happens at your PDS, not in Livtet's UI, which means there's no hidden
URL to guess your way into (unless you make the list public then private again
&mdash; can't help you there). Spaces is still a draft (with many
implementations), so the space permissions get asked for in a second, optional
consent step &mdash; signing in keeps working on a host that hasn't shipped
support for them yet (sorry &mdash; grill your host!).

The features that take advantage of spaces are _reading lists_ (owner to many
member), _book clubs_ and _threaded conversation_ (owner + moderators to many
members), _club bookmarks_ (only for the viewer). These separations of concern
provide the cohesive experience that you can observe in the following video:

## Main Features

[1]: https://github.com/bluesky-social/proposals/tree/main/0016-permissioned-data
