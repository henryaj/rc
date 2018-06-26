---
title: "Tracking physical presence with packet sniffing"
date: 2018-06-26T14:00:00-04:00
---

![](/img/rcdash.png)

I wanted a way to see who was in the Recurse Center space at any given time – or to be able to check if people were in before deciding whether I wanted to take the L to Manhattan (on a weekend, say).

## Wi-fi is nearby

I figure someone being connected to the Recurse Center Wi-Fi is a pretty good proxy for whether or not they're in the space.

Every packet your machine sends out has a source and destination [MAC address](https://en.wikipedia.org/wiki/MAC_address) written into it. When you send a packet to a machine on your local network, your computer needs to figure out which machine you're referring to when you ask for e.g. 192.168.0.12. It does this by [consulting an ARP table](https://www.tummy.com/articles/networking-basics-how-arp-works/), which lists the known local machines' MAC addresses and their corresponding IP addresses.

![](/img/packet.png)

Why are MAC addresses useful? MAC addresses don't change[^change-mac], hence the moniker "burned-in address". (If they changed, that ARP table wouldn't be very useful). Tools like [Wireshark](https://www.wireshark.org/) let you trivially collect packets from a network you're connected to. If I can snoop on these packets, have a look at their sender MAC address, and tie that back to an individual, I can see who's in.

[^change-mac]: Though users tend not to, MAC addresses actually [can be changed](https://en.wikipedia.org/wiki/MAC_spoofing). Some mobile OSes have features to automatically rotate MAC addresses to defeat tracking systems, though it's [not clear that this works](https://www.theregister.co.uk/2017/03/10/mac_address_randomization/).

## Getting MAC addresses

Wireshark has a command-line tool, `tshark`. I only care about the MAC addresses, not the rest of the packet, so I can set the `Tfields` flag to only return the `eth.addr` field:

```bash
$ tshark -Tfields -e eth.addr

Capturing on 'Wi-Fi'

1a:b4:12:6f:c6:23,7c:61:cf:b7:69:15
50:19:d6:f1:fc:0f,0a:a6:af:04:57:26
5c:91:5d:bc:56:31,67:56:76:aa:91:55
...
```

The source and destination MAC addresses are clearly visible. I still don't know who they belong to, though. 

## Signing up

To tie a MAC address to a user, Recursers simply send their MAC address to this friendly bot:

![](/img/zulip_bot.png)

The payload sent to the chat bot includes the message, plus some details of the sender that Zulip provides, including their email address. I can use that to [look them up on the Recurse Center directory](https://github.com/henryaj/rcdash/blob/698183d3340efd52dc6ca85267d25c82f3242a91/lib/auth.rb#L34-L42) to get a photo, a link to their directory page, etc. Now I know what MAC belongs to who.

## Who's in?

With all the parts in place, I can start sniffing. A script runs on a Raspberry Pi in the RC space which sniffs MAC addresses and sends a list of seen MAC addresses to a webserver. This server looks them up against users it knows about – and if it finds any, [it marks them as 'seen'](https://github.com/henryaj/rcdash/blob/698183d3340efd52dc6ca85267d25c82f3242a91/lib/server.rb#L35-L45):

```ruby
post "/macs_seen" do
  body = JSON.parse(request.body.read)
  macs = body.fetch("seen")

  macs.each do |mac|
    u = User.where(mac: mac)
    if u.any?
      u.first.seen!
    end
  end
end
```

From here, I can [grab a list of 'recently seen' users from the database](https://github.com/henryaj/rcdash/blob/698183d3340efd52dc6ca85267d25c82f3242a91/lib/user.rb#L15)...

```ruby
User.where { |u| u.last_seen > ( DateTime.now - AWAY_MINS ) }.all
```

...and show them on a nice web frontend (only visible to Recursers, naturally).

Here's a high-level view of how the finished dashboard works:

![](/img/rcdash-wireframe.png)

## Addendum

Unfortunately, the project proved controversial from a privacy perspective: not everyone was comfortable with their MAC address being sent to a private server. I ended up taking it offline.

During the conversation it prompted, some interesting alternatives were proposed:

* hashing and salting the MAC addresses to keep them secret from the server
* keeping a list of 'opted-in' MAC addresses on the Pi and only sending those over the network, not the full list
* having users install a daemon that registers with the site, instead of using MAC addresses

I don't know whether I'll attempt to implement one of these new tracking methods, though anyone's welcome to [peruse the source](https://github.com/henryaj/rcdash) and make changes.

It should be noted, though, that MAC address sniffing is already ubiquitous. It's being used to [track footfall in stores](https://www.theguardian.com/technology/2016/jan/21/shops-track-smartphone-uk-privacy-watchdog-warns), [identify users' routes on public transport](http://www.gizmodo.co.uk/2017/02/heres-what-tfl-learned-from-tracking-your-phone-on-the-tube/), and even [embedded in trash cans to deliver targeted advertising](https://www.bbc.com/news/technology-23665490). All of which means your MAC address is almost certainly already public knowledge.

_Leave comments on the [Hacker News thread](https://news.ycombinator.com/item?id=17403890)._