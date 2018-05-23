---
title: "BitTorrent clients for fun and profit"
date: 2018-05-23T16:12:18-04:00
draft: false
---

_This is a work in progress._

...well, not really for profit. The world doesn't need another BitTorrent client. But it's a great project for learning about an interesting web protocol, exploring the networking stack, getting to grips with Wireshark and debugging, and learning how things work.

## Reading a `.torrent`

The torrent files you might find somewhere like The Pirate Bay are encoded with [bencode](https://en.wikipedia.org/wiki/Bencode) (pronounced "B-Encode", but I'm still gonna say "ben-code"), a terse file format for representing a few simple data structures (strings, ints, dicts and lists).

A bencoded file might look like this:

```
dl10:hello dave!d3:foo3:bar4:fizz4:buzzei42eee
```

Tasty. Let's add newlines for effect:

```
d
  4:info
  l
    10:hello dave!
    d
      3:foo3:bar
      4:fizz4:buzz
    e
    i42e
  e
e
```

Elements in a bencoded structure have a letter denoting what they are: `d` for dicts, `l` for lists, `i` for ints. All of those are terminated with a trailing `e`. Strings are a little different: they start with the length of the string, then a colon, followed by the string itself (e.g. `3:foo`).

In the above example, the root of the structure is a dict with one key ("info") whose value is a list containing a string, a dict and an int.

Writing a decoder for this is an interesting exercise in itself; in the end, I used [jackpal/bencode-go](https://github.com/jackpal/bencode-go).

Here's what a JSON output of this file might look like (I'm using a Ubuntu image torrent):

```json
{
    "announce": "http://torrent.ubuntu.com:6969/announce",
    "announce-list": [
        [
            "http://torrent.ubuntu.com:6969/announce"
        ],
        [
            "http://ipv6.torrent.ubuntu.com:6969/announce"
        ]
    ],
    "comment": "Ubuntu CD releases.ubuntu.com",
    "creation date": 1524776308,
    "info": {
        "length": 1921843200,
        "name": "ubuntu-18.04-desktop-amd64.iso",
        "piece length": 524288,
        "pieces": "\ufffd <truncated> \ufffd"
    }
}
```

## Talk to the tracker

Next, we need to make a request to the tracker to find some peers to connect to. The tracker URL is in the "announce" field of the metadata.

When first trying this, I got an HTTP 400 and the following error:

`you sent me garbage - id not of length 20`

Damn. This tracker is so SALTY.

Making a correct request to the tracker requires URL-encoding a bunch of params, including a SHA1 hash of the bencoded "info" section of the torrent metadata. The flow looks something like:

1. de-bencode torrent metadata
1. extract the "announce" address
1. re-bencode the "info" block
1. generate a random 20-byte peer ID:
```golang
func newClientID() []byte {
	clientID := make([]byte, 20)
	rand.Read(clientID)
	return clientID
}
```

1. make a GET request to the announce URL with a bunch of query params:
```
"info_hash": <bencoded, hashed "info" block>
"peer_id":   <unique peer ID>
"port":      <port you're listening for connection on>
"uploaded":  <number of bytes uploaded>
"left":      <number of bytes left to download>
"compact":   <1 if using compact mode>
"event":     <one of 'started', 'completed', or 'stopped'>
```

1. de-bencode the response from the tracker, which contains a list of peers in the torrent swarm.

## Handshaking with peers

Next, we have to handshake with some subset of the peers the tracker has told us about.

We open a TCP connection to the peer, and send the following message:

![Peer handshake message](/img/bittorrent_handshake.jpg)

_To be continued..._
