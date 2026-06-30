---
title: "Two Months In: What's Going On?"
date: 2026-06-25
draft: true
description: "A two-month check-in on what's actually moved at Olamaelcu."
tags: [meta]
authors:
  - did: 'did:plc:e2ctbutx6kya6si4if5ngjmm'
    name: 'Jacky'
    url: 'https://www.jacky.wtf'
audience: 'Anyone interested in what Olamaelcu is building.'
---

It's been about two months since [the first post on this
site](/blog/2026/sysinit) landed and I figured I'd do a check-in. Two months
in, three of the projects have moved in three very different directions. One
finished a rebuild without telling anyone. Another tore itself down on purpose
to start over. The third went from a roadmap to a working game. I'm going to
talk through each very briefly, then a few things about this very site.

## Livtet

[Livtet](/projects/livtet) — the personal book-collection app — is the one that
did the most work without making much noise. The short version is that it
stopped being a scaffold and became a multi-platform thing you'd actually use.

The desktop app is still the center of gravity. There's now a working iOS app
that pairs with your library and runs the same reader, and the Android app got
a proper reader screen where your reading spot follows you between devices. You
can browse and pull books from real library catalogs now, not just manually add
them. The plugin system is real too, with a handful of built-in extras shipping
with the app (an [OpenLibrary](https://openlibrary.org) search, a
[KOReader](https://koreader.rocks) importer, and a few others). Backup and
restore work end-to-end, including the part that sorts out duplicates if you
try to restore over a copy that already has changes.

None of this has been shaken out by people using it for real yet. A lot landed
very recently, and the cloud-sync dashboard, browser extension, and Kindle
communication are still on the roadmap as not-started. I want a public beta
before I'd call this done.

## Beats

[Beats](/projects/beats) — the Bluesky-compatible personal music feed — went
through something I'd been avoiding doing for a long time. On May 12, I deleted
most of the app. Not the project, the _app_. The feed view, the follow-graph
stuff, the embed pipeline, the nearby-picks page — all of it gone, leaving just
the login screen and the connection to your feed subscription.

The version I'd built did less than I'd promised on the about page, and I was
tired of that gap. So I tore it out and started over on a cleaner base. What's
new since then is unglamorous and small. Login got the polish it deserved:
handle suggestions as you type, staying signed in between visits, error
messages you can actually read. Signing in now goes through
[atproto-poem](https://crates.io/crates/atproto-poem), a helper library for
Rust that's used in Beats, Spadat, and Livtet. A settings page exists. The
first wave of behind-the-scenes work for the new feed has landed, with more to
come.

## Spadat

[Spadat](/projects/spadat) — the four-player partnership Spades game on the
open social web — is the one I underestimated. I wrote the roadmap in late May
expecting it to take a year. Six weeks later, every step I'd written down is
in, and there's a working game.

You can play a full hand of Spades end-to-end now. The deal is provably fair —
the shuffle is locked in before the cards are dealt and opened up after, so
anyone can check that nobody peeked. There's a separate tool that lets you
re-run the deal from the public records to confirm it. Multiplayer works too,
with matchmaking and real-time play, and a desktop version you can run on your
own computer is within reach now that the game engine talks to the visual side
of the game.

Deployment beyond desktop, and the social/competitive pieces — achievements,
leaderboards, event tracking — are still in the design phase and I don't have a
firm timeline on them.

## The site itself

The site you're reading got more attention than it usually does. There's a real
table of contents on blog posts now, an "intended audience" label above the
post body, and Bluesky comments and webmentions actually working — you can
reply to a post from Bluesky and have it show up under the post. Preview images
generate across the site for when links get shared. There's a [/stack](/stack)
page that lists what runs the projects, an [/open-source](/open-source) page
that pulls from where the code lives, and a project-roadmap and changelog
system on the projects page so the stuff I described above isn't the only place
you can read about it.

If you want to follow along without checking back here, [the
waitlist](https://waitlist.olamaelcu.net) is the spot. I send an update when
something new is generally available, and not before. That'll be the only place
where one can live the "no memos, more demos" space &mdash; as Badu once said,
I'm sensitive about my isht.
