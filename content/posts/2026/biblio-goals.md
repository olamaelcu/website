---
title: "What's the point of Bibliograph?"
date: 2026-08-11
description: 'Explaining why Bibliograph is being built and how it can benefit the ATProto ecosystem'
tags: [meta]
authors:
  - did: 'did:plc:e2ctbutx6kya6si4if5ngjmm'
    name: 'Jacky'
    url: 'https://www.jacky.wtf'
audience: 'Anyone interested in Livtet, books in the ATProto space but also having some understanding of ATProto primitives'
---

<script>
window.addEventListener("load", async () => {
  console.log("fetching live count");
  const fillInElem = document.querySelector("#live-count");
  const resp = await window.fetch("https://biblio.livtet.olamaelcu.net/api/live-counts");
  const bookCount = resp.json().books;
  console.log(bookCount, "books");
  fillInElem.innerText = bookCount.toLocaleString();
})
</script>

So, you're curious about [Bibliograph][]. It came out of a discussion with some
folks about [how we can model a book lexicon][1] and is a direct product of
what [Livtet's move to rely on ATProto][2] for all of its work &mdash; from
shelving content to finding what books are trending across the Atmosphere.

## The Recent Outage

> If you're not familiar with the internals of SQLite, you can skip this section.

As I was importing the books from OpenLibrary's torrent dump, Bibliograph ended
up generating a _48 gigabyte_ WAL file that locked up the little 2GB RAM
machine it's running on[^1]. I had to do the following:

- Cap the WAL size to 128M using `journal_size_limit = 134217728`
- Lock it to be synchronous for a moment
- Run a throttling on the reconnection to Olamaelcu's `tap` instance

All of this is described in [this commit][3]. These changes are needed to keep
it running well on a tight machine and my goal is to _keep_ it running on this
sized machine for as long as possible so anyone can pick this up and run it on
commodity hardware.

However, something else was happening. Can you tell what's wrong with this SQL query?

```typescript
results = await db.query.books.findMany({
 where: or(
  like(books.title, `%__health_check__ __health_check__%`),
  like(books.author, `%__health_check__ __health_check__%`)
 ),
 limit,
 offset
});
```

Running this query against a 4G SQLite database sounds okay if you don't mind
waiting 30 seconds on a 2GB RAM machine. This is what led me to do early
termination. Basically, running a full-table scan on 3.4 GB of books slowed
things down a lot because `LIKE '%...%'` can't use a B-tree index; especially
within a Node loop. This `__health_check__` bit is coming from Livtet _every 5
minutes_ to make sure that Bibliograph is responsive &mdash; this was how it
knew to send interactions to Bibliograph (like enriching book and author
information, fetching shelving information, etc).

## The Current Status

As of now (time of writing), Bibliograph knows of <strong>5,111,432</strong>
books (currently <span id="live-count">5,111,432</span> books). This allows Livtet's public search to return all of the books it knows
without having to ask Google Books or OpenLibrary (directly) anymore. This also
powers the logic around [the soon-to-come jigsaw puzzle game][4] that Livtet has based on the
cover of books &mdash; the first of many attempts to build engaging experiences
around books that don't involve reading (or just reading, you should _still_ be
reading)!

---

I'm _very_ open to feedback, ideas and questions about these apps! Send
feedback to their pages [for Livtet][ui:1] and [for Bibliograph][ui:2].

[bibliograph]: https://biblio.livtet.olamaelcu.net
[2]: /blog/2026/on-livtet
[1]: https://discourse.atmosphere.community/t/in-which-a-book-lexicon-is-born/1042
[3]: https://github.com/olamaelcu/bibliograph/commit/2ccec98ab4875b50a162872f2205d39127391270
[4]: https://livtet.olamaelcu.net/play
[ui:1]: https://userinput.app/s/did:plc:ejggqolmgpylroktvaktibik/3ms42jyyi4p2f
[ui:2]: https://userinput.app/s/did:plc:ejggqolmgpylroktvaktibik/3mst4pvyu7m2f

[^1]: This is why there's rate limiting!
