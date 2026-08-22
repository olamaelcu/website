---
title: 'A place of consensus making for the book lexicon'
date: 2026-08-22
description: 'We will not agree on how to organize the information and that is okay.'
tags: ['lexicon', 'discussion']
authors:
  - did: 'did:plc:e2ctbutx6kya6si4if5ngjmm'
    name: 'Jacky'
    url: 'https://www.jacky.wtf'
audience: 'Anyone interested in Livtet, books in the ATProto space but also having some understanding of ATProto primitives'
---

There's a long thread about [the formation of a book lexicon][1] that I think
is starting to demonstrate some of the worts of lexicon design. Different
applications with different levels of use and applications are going to result
in different needs. Instead, I think we're seeing the need for resolve more of
what works within the model of ATProto; consolidation around what _should_ be
shared by the (app)views and less focus on exposing the plumbing of our
individual applications to the rest of the world.

What I have seen repeated is something useful: _exposing_ identifiers that can
be useful for disambiguation. This would be the title, author and a set of
identifiers that can be used to find more information about a book in one's
local catalog like their ISBN, UPC, EAN, ASIN, ISSN, etc. The astute reader
would notice that ISSNs and UPCs can be used for magazines and UPCs for general
products. In some publishing cases, books can be printed with those
constraints. As [Nick][] mentions [here][2] that this work (emphasis mine):

> [This] will be very hard, I would even say firmly, it should not be done.
> There will always be mismatches between datasets, and it will be an MxN
> problem. Exponentially hard when you account for other providers’ datasets.
>
> I think that _the local optimum solution here_ is for the user to have the
> power to make this mapping on their own case-by-case basis.

This helped me, as well as the other points made from Dracome, Hardcover and
micro.blog, to come to the following proposal for the book lexicon XRPC for
appviews and its expected responses:

## Olamaelcu's Proposal for `community.lexicon.book`

I've made a light proposal for these records, but here it is more formalized:

### Records

The goal is for _five records_ to live under the `community.lexicon.book.` NSID, sharing identifier and contribution shapes via `community.lexicon.book.defs`.

<details>
  <summary>Open for all of the record schemas:</summary>

**`community.lexicon.book.defs`**

```javascript
// Shared object shapes used across the book namespace.
// `main`         — identifier object (URI + resource scheme).
// `contribution` — (subject strongRef, role) wrapper for the contributor lists in edition/work.
{
 "lexicon": 1,
 "id": "community.lexicon.book.defs",
 "description": "Shared object shapes used by community.lexicon.book.* records.",
 "defs": {
  "main": {
   "type": "object",
   "description": "An external identifier scoped to a specific source or scheme.",
   "required": ["uri", "resource"],
   "properties": {
    "uri": {
     "type": "string",
     "format": "uri",
     "minLength": 1,
     "maxLength": 2048,
     "description": "URL for vendor/library links, URN for scheme-based IDs (urn:isbn:..., urn:doi:...)."
    },
    "resource": {
     "type": "string",
     // Open set — new sources (vendors, libraries, schemes) can be added without schema changes.
     "description": "Source system or scheme this identifier belongs to.",
     "knownValues": [
      // ISBN family
      "isbn",
      "isbn13",
      "isbn10",
      // Other commerce / catalog schemes
      "asin",
      "doi",
      "oclc",
      "isbnPrefix",
      // Authority records (people/orgs)
      "isni",
      "viaf",
      "wikidata",
      // Vendor / library sites
      "openlibrary",
      "googleBooks",
      "goodreads",
      "amazon",
      "barnes",
      "hardcover",
      "bookhive",
      "bibliograph",
      "imdb",
      "official",
      // Catch-all for personal site / blog
      "web"
     ]
    }
   }
  },
  "contribution": {
   "type": "object",
   "description": "A contribution by a contributor to an edition or work.",
   "required": ["subject", "role"],
   "properties": {
    // → community.lexicon.book.contributor (strongRef: URI + CID)
    "subject": {
     "type": "ref",
     "ref": "com.atproto.repo.strongRef"
    },
    "role": {
     "type": "string",
     "knownValues": [
      "author",
      "coAuthor",
      "editor",
      "translator",
      "illustrator",
      "narrator",
      "foreword",
      "contributor"
     ]
    }
   }
  }
 }
}
```

**`community.lexicon.book.edition`**

```javascript
// A single edition (publication event) of a book. The entry-point record.
// `work`           — OPTIONAL → community.lexicon.book.work (omit if not modeling the work abstraction).
//   `publisher`   — OPTIONAL → community.lexicon.book.publisher (small-press / unknown OK).
//   `contributors[]` — array of community.lexicon.book.defs#contribution (subject + role).
{
 "lexicon": 1,
 "id": "community.lexicon.book.edition",
 "defs": {
  "main": {
   "type": "record",
   "description": "A single edition of a book. Optionally grouped under a work record.",
   "key": "tid",
   "record": {
    "type": "object",
    "required": ["title", "createdAt"],
    "properties": {
     "title": { "type": "string", "minLength": 1, "maxLength": 2048, "maxGraphemes": 200 },
     "subtitle": { "type": "string", "maxLength": 1024, "maxGraphemes": 100 },
     "work": { "type": "ref", "ref": "com.atproto.repo.strongRef" },
     "publisher": { "type": "ref", "ref": "com.atproto.repo.strongRef" },
     "place": {
      "type": "string",
      "maxLength": 256,
      "maxGraphemes": 64,
      "description": "Place of publication. Free-form; not normalized."
     },
     "publishedYear": { "type": "integer", "minimum": 0, "maximum": 9999 },
     "language": { "type": "string", "format": "language" },
     "contributors": {
      "type": "array",
      "minLength": 0,
      "maxLength": 64,
      "items": { "type": "ref", "ref": "community.lexicon.book.defs#contribution" }
     },
     "identifiers": {
      "type": "array",
      "minLength": 0,
      "maxLength": 32,
      "items": { "type": "ref", "ref": "community.lexicon.book.defs#main" }
     },
     "description": {
      "type": "string",
      "maxLength": 8192,
      "maxGraphemes": 1024,
      "description": "Free-form description of this edition. Serves as bibliographic edition statement ('First edition', 'Revised second printing') and/or a blurb/summary."
     },
     "createdAt": { "type": "string", "format": "datetime" }
    }
   }
  }
 }
}
```

**`community.lexicon.book.work`**

```javascript
// An abstract book work — the conceptual work that one or more editions are manifestations of.
// Opt-in: implementations may publish only editions and ignore this layer.
{
 "lexicon": 1,
 "id": "community.lexicon.book.work",
 "defs": {
  "main": {
   "type": "record",
   "description": "An abstract book work. Opt-in layer above editions.",
   "key": "tid",
   "record": {
    "type": "object",
    "required": ["title", "createdAt"],
    "properties": {
     "title": { "type": "string", "minLength": 1, "maxLength": 2048, "maxGraphemes": 200 },
     "subtitle": { "type": "string", "maxLength": 1024, "maxGraphemes": 100 },
     "originalLanguage": { "type": "string", "format": "language" },
     "firstPublishedYear": { "type": "integer", "minimum": 0, "maximum": 9999 },
     "subjects": {
      "type": "array",
      "minLength": 0,
      "maxLength": 32,
      "description": "Subject tags / genres.",
      "items": { "type": "string", "maxLength": 128, "maxGraphemes": 32 }
     },
     "contributors": {
      "type": "array",
      "minLength": 0,
      "maxLength": 64,
      "items": { "type": "ref", "ref": "community.lexicon.book.defs#contribution" }
     },
     "identifiers": {
      "type": "array",
      "minLength": 0,
      "maxLength": 32,
      "items": { "type": "ref", "ref": "community.lexicon.book.defs#main" }
     },
     "description": { "type": "string", "maxLength": 8192, "maxGraphemes": 1024 },
     "createdAt": { "type": "string", "format": "datetime" }
    }
   }
  }
 }
}
```

**`community.lexicon.book.contributor`**

```javascript
// A person (real or pen name) credited in producing book editions or works.
// One record per real-world person; deduplicated by AppViews via `identifiers`.
// `linkedDid` lets the contributor claim ownership by pointing at their own ATProto account.
{
 "lexicon": 1,
 "id": "community.lexicon.book.contributor",
 "defs": {
  "main": {
   "type": "record",
   "description": "A person credited in producing book editions or works.",
   "key": "tid",
   "record": {
    "type": "object",
    "required": ["name", "createdAt"],
    "properties": {
     "name": { "type": "string", "minLength": 1, "maxLength": 256, "maxGraphemes": 64 },
     "aliases": {
      "type": "array",
      "minLength": 0,
      "maxLength": 16,
      "items": { "type": "string", "minLength": 1, "maxLength": 256, "maxGraphemes": 64 }
     },
     "linkedDid": { "type": "string", "format": "did" },
     "bio": { "type": "string", "maxLength": 8192, "maxGraphemes": 1024 },
     "bornYear": { "type": "integer", "minimum": 0, "maximum": 9999 },
     "diedYear": { "type": "integer", "minimum": 0, "maximum": 9999 },
     "identifiers": {
      "type": "array",
      "minLength": 0,
      "maxLength": 16,
      "items": { "type": "ref", "ref": "community.lexicon.book.defs#main" }
     },
     "createdAt": { "type": "string", "format": "datetime" }
    }
   }
  }
 }
}
```

**`community.lexicon.book.publisher`**

```javascript
// A publishing entity (publisher house, imprint, or self-publishing author-as-publisher).
// One record per real-world entity; deduplicated by AppViews via `identifiers`.
// `imprintOf` lets imprints/divisions point up at their parent house (e.g. Tor → Macmillan).
{
 "lexicon": 1,
 "id": "community.lexicon.book.publisher",
 "defs": {
  "main": {
   "type": "record",
   "description": "A publishing entity.",
   "key": "tid",
   "record": {
    "type": "object",
    "required": ["name", "createdAt"],
    "properties": {
     "name": { "type": "string", "minLength": 1, "maxLength": 256, "maxGraphemes": 64 },
     // OPTIONAL → another community.lexicon.book.publisher record (parent house)
     "imprintOf": { "type": "ref", "ref": "com.atproto.repo.strongRef" },
     "foundingDate": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9999,
      "description": "Year founded (4-digit)."
     },
     "closingDate": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9999,
      "description": "Year ceased operations. Omit if still active."
     },
     "identifiers": {
      "type": "array",
      "minLength": 0,
      "maxLength": 16,
      "items": { "type": "ref", "ref": "community.lexicon.book.defs#main" }
     },
     "createdAt": { "type": "string", "format": "datetime" }
    }
   }
  }
 }
}
```

</details>

Contributors can be the author but also the translator, editor, illustrator;
the list gets long and can add a complexity that some catalogs might not
immediately have; making it optional when implementing a compatible AppView.
This also introduces publishers as a first-class record type but also optional. I opted to make editions, the _digestable_ unit of what makes this work work the only thing needed to get to the rest and have everything else opt-in.

### Queries

The sole query needed for a bibliographic AppView to implement would be
`community.lexicon.book.searchEditions`. It'll allow for searching by free form
text text (with the query parameter `q`) or by an identifier (with the query
identifier `id`, supporting the repetition of the parameter so you can send a
list of values). It'll also take in an optional `cursor` parameter to allow
for pagination in whichever way the AppView implements it, similar to other
AppViews in the ATProto space. `limit` will be set to a suggested default of 20.
Responses should be of the following shape and reason:

- `200`: if the search completes okay even if there's no results. A key `items`
  holding the list (empty or not) of `community.lexicon.book.edition` records and
  a optional field `cursor` to page to the next set of results with another
  optional field `total` representing the total number of records in this result.
- `400`: An AppView should return this if the search query is invalid _to_ it.
  For example, if it supports Lucene syntax but it's invalid, return that here.

```
GET /xrpc/community.lexicon.book.searchEditions?
     q=<free form text>
     &id=urn:isbn:9780708899441
     &id=https://openlibrary.org/works/OL24151553W/Harlem_Shuffle?edition=key%3A/books/OL34709636M
     &id=https://www.penguinrandomhouse.com/books/608669/harlem-shuffle-by-colson-whitehead/

HTTP/1.1 200 OK
Content-Type: application/json

{
  "items": [
    { /* entry of the community.lexicon.book.edition shape */}
  ],
  "cursor": "nextPageOfItems",
  "total": 6403

}
```

Other queries like the following would follow the same suit, only that they'd
return 501 if the AppView doesn't support such a query:

- `community.lexicon.book.searchContributors`
- `community.lexicon.book.searchPublishers`
- `community.lexicon.book.searchWorks`

In order to discover what other lexicons and queries that a bibliographic
AppView supports, the following query _MUST_ be implemented (along with
`.book.searchEditions`):

```
GET /xrpc/community.lexicon.book.compatibility

HTTP/1.1 200 OK
Content-Type: application/json

{
  "queries": [
    {"nsid": "book.searchEditions"},
    {"nsid": "book.searchContributors"}
  ]
}
```

A client can call this in advance without having to hit a 501 when calling an
endpoint unexpectedly. This idea was taken from the IndieWeb with [Micropub's
extension for querying for syndication targets][4] to allow for a progressive
interface. The following is the query schema:

```javascript
{
 "lexicon": 1,
 "id": "community.lexicon.book.compatibility",
 "defs": {
  "main": {
   "type": "query",
   "description": "List the XRPC queries (and procedures) this AppView implements under community.lexicon.book.*. Clients use this instead of probing each NSID and tolerating 501 responses.",
   "output": {
    "encoding": "application/json",
    "schema": {
     "type": "object",
     "required": ["queries"],
     "properties": {
      "queries": {
       "type": "array",
       "items": { "type": "ref", "ref": "#queryRef" }
      }
     }
    }
   }
  },
  "queryRef": {
   "type": "object",
   "required": ["nsid"],
   "properties": {
    "nsid": {
     "type": "string",
     "format": "nsid",
     "description": "Truncated NSID relative to the 'community.lexicon' authority (e.g. 'book.searchWorks'). The full NSID is reconstructed by prepending 'community.lexicon.'."
    },
    "type": {
     "type": "string",
     "knownValues": ["query", "procedure"],
     "description": "Whether this endpoint is a query (GET) or procedure (POST). Omit if the AppView only exposes queries."
    }
   }
  }
 }
}
```

---

It's also _very open_ to conversation (would it make more sense to inline this
information into the book record itself instead of having it be a collection of
strong references + thin references? What else do we gain? What else do we
lose?)

---

We can start here for _just_ handling discovery of books and then iterate to
the shape of a review so we can then add more queries to compatible AppViews.
This will eventually allow for the kind of interoperability we see with the
microblogging space (with Bluesky and its kin) and the long form blogging (as
we see with <https://standard.site>). There's another thread where
[conversation for the review shape][3] can be held to help faciliate that but
for now, we need consensus on this. From the conversation held in the thread, I
think proposing the above will work to satisfy everyone's needs for
interoperability.

[1]: https://discourse.atmosphere.community/t/in-which-a-book-lexicon-is-born/1042/32
[2]: https://discourse.atmosphere.community/t/in-which-a-book-lexicon-is-born/1042/26?u=omg.jacky.wtf
[3]: https://discourse.atmosphere.community/t/handling-reviews-for-the-book-lexicon/1085/3
[4]: https://micropub.spec.indieweb.org/#syndication-targets
[nick]: https://nickthesick.com/blog/Home
