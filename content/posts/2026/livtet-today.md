---
title: "Livtet's Making Space(s work)"
date: 2026-11-10
description: 'Livtet makes use of permissioned data (or spaces) to provide novel functionality for the Atmospheric biblioverse'
tags: [meta, livtet, spaces]
authors:
  - did: 'did:plc:e2ctbutx6kya6si4if5ngjmm'
    name: 'Jacky'
    url: 'https://www.jacky.wtf'
audience: 'Anyone interested in Livtet and has an technical penchant of Atmospheric concepts'
---

Livtet is a platform for book tracking, discovery and developing community.
It's been some time since I've written about how and what it does &mdash;
buckle in!

## Features Today

Livtet has things you'd expect from a book platform under its belt:

- Book tracking: your current reads, long finished and given up on
- Purchase discoverability by way of <https://bookshop.org> and <https://libro.fm>
- Reviews and ratings about what you've read
- (Rudimentary) progress tracking
- Book clubs with:
  - conversation threads
  - associated reading lists
  - meeting scheduling
  - public/protected visibility

The goal is for folks to find a Atmospheric replacement to things like
**Goodreads** and **Fable** &mdash; apps that build silos and sell back your
information to you. For now, I'm focusing on making the core experience robust
enough that I can use it with friends in the space on a regular basis.

## Enter Spaces

One notable thing is that it's beginning to take advantage of [permissioned
data][1]: allowing folks to write things in not-so-public spaces and have
tighter access over who and what can read it.

### Mumbo Jumbo

Livtet implements the client logic of "permissioned data" through [proposal
`0016`: Spaces][1], where access control is managed by space authorities rather
than a centralized database. Each space is identified by an AT URI
(something like `at://authority-did/space/space-type-nsid/space-key`), and the
authority determines access by issuing short-lived space credentials (like a
self destructing key to an apartment) via an XRPC call to `getSpaceCredential`.
The repo host enforces these credentials by verifying _both_ the credential
itself and the HTTP signature on every read request, while Livtet acts
as a client that exchanges user sessions for temporary credentials (more self
destructing keys! to more apartments!) and reads from other accounts'
repositories. It doesn't host spaces of its own (leaves it to the visiting
user's PDS) and can't (really, it doesn't) mint a credential on its own; the
only local bookkeeping is a membership index, reconciled from the authority's
list and failing closed when that list can't be read. This bookkeeping is like
a quick index of data that's meant to make spaces access a bit quicker.

Access is decided by the authority, not by the scopes: a scope only says what
Livtet may _ask_ for on a space **type**, and the authority then checks the
reader against its own policy &mdash; the member list, for a protected list.
Credentials live for ten minutes or so, and renewing one means letting it go
and asking the reader's PDS for a fresh [_delegation token_][2] to exchange,
which is designed to be single-use and good for about a minute. When access
changes (e.g., visibility toggles from a protected list of viewers to public to
the world), cached credentials are dropped &mdash; though that's Livtet
deleting its own copy, not the protocol revoking anything: a credential already
held elsewhere simply runs out its ten minutes (hence good reason to ditch
those keys).

What comes back is verified, too: every returned value is hashed and compared
against the CID the host reported, and record and commit MACs are checked where
the host supplies them. The fuller commit and hash checks exists, but the
reading list and club pages don't lean on it yet. Yet.

### Translation

So, in short if I ask for access to a particular space, the credential I get is
bound to that space: like a key to an apartment unit versus a master key to the
whole building. And to be clear about what this is and isn't &mdash; spaces are
access control, not encryption. The authority, the repo host and my own PDS can
all read what's in there.

## Main Features

The features that take advantage of spaces are _reading lists_ (owner to many
member), _book clubs_ (anchored on their owner's DID, with access inherited from
a linked reading list and moderators helping to run the show), _club bookmarks_
(only for the viewer). These separations of concern provide the cohesive
experience that you can observe in the following video (early content preview):

<video autoplay="off" controls>
  <source src="/videos/screencast-2026-11-10-09-54-16.mp4" type="video/mp4">
</video>

## General Availability?

If your PDS supports the latest revision of the spaces proposal, Livtet will do
its best to detect it and enable these features (book clubs, reading lists and
bookmarks) for you. Otherwise, you can still browse for books, track your
reading history and follow along with other folks are doing in the **Atmospheric
biblioverse** (it's canonical now, can't change it!). I have it [on good
authority][3] that The Biggest PDS will soon support spaces so it'll be coming
to you.

### Testing

Testing this has meant _living with two dialects_ of the same proposal. Bluesky's
PDS (`pds-spaces-alpha`) speaks the canonical `com.atproto.space.*` family;
`blacksky.app` and `rsky` only speak the older `com.atproto.simplespace.*` one,
so Livtet maps its policies onto that shape and, on a host that gates
individual methods, escalates a single procedural call grant from a refusal.
Another PDS implementation, `vlpds`, speaks the canonical family on its main
build (I built it into a container image for local testing). This is why you're
able to see me use it with my Blacksky account in that prior video.

`rsky`'s minting of delegation tokens is different: it uses a different
audience than the canonical hosts expect, so an rsky account and a canonical
list can't read each other's spaces yet. If your PDS implementation is open
source, hit me up and I'll start aiming to test against it.

[1]: https://github.com/bluesky-social/proposals/tree/main/0016-permissioned-data
[2]: https://www.rfc-editor.org/rfc/rfc8693.html#name-delegation-token-exchange-e
[3]: https://blacksky.community/profile/jimray.bsky.team/post/3mzv4riq2v222
