---
title: 'End of May Updates'
date: 2026-06-01
draft: true
description: "What's been happening the last two weeks?"
tags: [meta]
authors:
  - did: 'did:plc:e2ctbutx6kya6si4if5ngjmm'
    name: 'Jacky'
    url: 'https://www.jacky.wtf'
---

## Livtet

I keep coming back to [Livtet][livtet] like [the worry stone it is][1]. Two weeks
ago, I was neck-deep in consolidating the theme — tweaking colors and
restructuring how the styles cascade under the hood. The app leans into
the component library from [Web Awesome][2], which means the interface should
feel more cohesive and load faster since the browser isn't re-doing a bunch of
work on each paint. I'm also wiring in a filter panel so I can actually search
through my books the way I think about them: by who wrote them, what state
they're in, whether I've loaned them out. I'd like to say I had this grand plan
but it started because I was annoyed I couldn't find a specific book I'd lent
to a friend and spent twenty minutes digging through the UI instead of just
_knowing_.

![Livtet pathways search panel](/images/livtet-pathways-home.png)

On the backend, I finally cleaned up the database migration mess. There were 37
separate migration files accumulated over a year of "just one more tweak" — I
consolidated them down to 8 with clearer table and column names. The database
is _the backbone_ of this whole thing so it needed to not feel like technical
debt I was actively accruing. I also added proper structured logging so
when something goes wrong I can actually read the output instead of squinting
at generic error messages.

---

## Spadat

[Spadat][spadat] is starting to feel like a real game instead of a thought experiment.
The last two weeks have been dominated by the game state machine, which sounds
boring. It's the meat of the system, since it's how the app understands how a
hand of Spades works: bidding, playing tricks, scoring, and knowing when the
round is over. I'm implementing a seed reveal system so players can verify the
shuffle was fair after the fact without anyone being able to cheat mid-deal.
I'd like to say I planned this cleanly but the honest story is I kept finding
edge cases while writing tests and having to patch the state transitions. The
reveal phase now rejects duplicate seeds, which is the kind of thing that
seems trivial until you realize "duplicate" means a player could theoretically
try to submit the same seed twice and the protocol would just... accept it -
not good for gameplay! Not anymore. I've also got tests covering
phase transitions, nil card passing, and trick completion — twelve new tests
landed in the last two weeks alone, which is galaxy-brained in the best way.

Matchmaking got some love too. The lobby system now exposes proper status flags
and rule set locking, so you can't join a game mid-play and muck up the state.
There's a game phase system driving everything and the matchmaking tests
cover the full lifecycle of lobbies — six tests, all passing. I'm eager to
get this in front of actual human beings playing together but we're not there
yet. For now it's server-side only and I'm the only player in my own test
environment, which is a lonely kind of development.

---

## Scratchback

[Scratchback][scratchback] got a long-overdue dependency audit that turned into a mini
migration. I replaced the hand-rolled AT Protocol OAuth implementation with my
library [`atproto-poem`][3], which handles the gnarly parts of the OAuth flow so I
don't have to. The tricky bit was swapping out our own implementation for
the library's API — there were some state-sharing issues with the matchmaking
service that required refactoring how we pass things around the server. I also
moved from Yarn PNP to standard Yarn workspaces, which sounds like a chore but
was overdue since PNP has been a source of weird module resolution bugs that'd
surface at the worst times. There's new encryption for game results too,
which means your game history isn't just sitting in raw form on a server somewhere. I'm
still working through the integration but the foundation is solid.

---

## Beats

[Beats][beats] had the most surgical change this cycle: I ripped out a [Odesli][odesli]
integration entirely. Odesli was the service that gave us linked music previews
across platforms but their API economics didn't make sense anymore — two PRs
landed to remove it completely from the backend and tests. I'm replacing it
with `atproto-poem` for OAuth and AT Protocol handle autocomplete, so the login
page can now suggest handles as you type instead of requiring you to remember
the exact `did:plc:` string for everyone you want to follow. The project also
restructured into a Yarn workspace, which unblocks a lot of the frontend
tooling I'd been putting off. It's not glamorous work but it's the kind of
cleanup that makes the next feature less likely to surprise me.

[1]: https://ethanmarcotte.com/wrote/let-a-website-be-a-worry-stone/
[2]: https://webawesome.com/docs/themes
[3]: https://lib.rs/crates/atproto-poem
[livtet]: /projects/livtet
[spadat]: /projects/spadat
[scratchback]: /projects/scratchback
[beats]: /projects/beats
[odesli]: https://odesli.co/
