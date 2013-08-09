"v=0
o=Mozilla-SIPUA-23.0 18275 0 IN IP4 0.0.0.0
s=SIP Call
t=0 0
a=ice-ufrag:466b1fd9
a=ice-pwd:97ecdbb1d3cf3e224541e3e2d886d65d
a=fingerprint:sha-256 AA:2D:3A:D0:4B:BE:EA:BF:60:08:66:11:BD:30:10:FF:7D:58:71:C7:E9:EC:56:E0:70:78:E9:0B:FE:0A:E1:11m=audio 58707 RTP/SAVPF 109 0 8 101c=IN IP4 192.76.177.124
a=rtpmap:109 opus/48000/2
a=ptime:20a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-15
a=sendrecv
a=candidate:0 1 UDP 2113667327 172.30.8.73 58707 typ host
a=candidate:1 1 UDP 1694302207 192.76.177.124 58707 typ srflx raddr 172.30.8.73 rport 58707
a=candidate:0 2 UDP 2113667326 172.30.8.73 55941 typ host
a=candidate:1 2 UDP 1694302206 192.76.177.124 22876 typ srflx raddr 172.30.8.73 rport 55941
m=video 60505 RTP/SAVPF 120
c=IN IP4 192.76.177.124
a=rtpmap:120 VP8/90000
a=sendrecv
a=candidate:0 1 UDP 2113667327 172.30.8.73 60505 typ host
a=candidate:1 1 UDP 1694302207 192.76.177.124 60505 typ srflx raddr 172.30.8.73 rport 60505
a=candidate:0 2 UDP 2113667326 172.30.8.73 56725 typ host
a=candidate:1 2 UDP 1694302206 192.76.177.124 56725 typ srflx raddr 172.30.8.73 rport 56725
a=rtcp-fb:* nack
a=rtcp-fb:* ccm fir"


"v=0
o=- 6495095062080119681 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video
a=msid-semantic: WMS If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZb
m=audio 1 RTP/SAVPF 111 103 104 0 8 107 106 105 13 126
c=IN IP4 0.0.0.0
a=rtcp:1 IN IP4 0.0.0.0
a=ice-ufrag:pKxDCyQq/ponWURR
a=ice-pwd:3VC70GK9+BVo0icU7T6W1t2B
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=sendrecv
a=mid:audio
a=rtcp-mux
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:edo+7nEmeb9bD3EFISCN5zPw/7vULquwZJ2n6JRi
a=rtpmap:111 opus/48000/2
a=fmtp:111 minptime=10
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:107 CN/48000
a=rtpmap:106 CN/32000
a=rtpmap:105 CN/16000
a=rtpmap:13 CN/8000
a=rtpmap:126 telephone-event/8000
a=maxptime:60
a=ssrc:2106874736 cname:GMc6XsAYuviR1GyH
a=ssrc:2106874736 msid:If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZb If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZba0
a=ssrc:2106874736 mslabel:If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZb
a=ssrc:2106874736 label:If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZba0
m=video 1 RTP/SAVPF 100 116 117
c=IN IP4 0.0.0.0
a=rtcp:1 IN IP4 0.0.0.0
a=ice-ufrag:pKxDCyQq/ponWURR
a=ice-pwd:3VC70GK9+BVo0icU7T6W1t2B
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
a=sendrecv
a=mid:video
a=rtcp-mux
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:edo+7nEmeb9bD3EFISCN5zPw/7vULquwZJ2n6JRi
a=rtpmap:100 VP8/90000
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack 
a=rtcp-fb:100 goog-remb 
a=rtpmap:116 red/90000
a=rtpmap:117 ulpfec/90000
a=ssrc:984527600 cname:GMc6XsAYuviR1GyH
a=ssrc:984527600 msid:If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZb If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZbv0
a=ssrc:984527600 mslabel:If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZb
a=ssrc:984527600 label:If53UUny09HfYVB1BOwXhH75Zv4Gr8LmbpZbv0
"




 var inline = 'a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890abc\r\nc=IN';
    sdp = sdp.indexOf('a=crypto') == -1 ? sdp.replace(/c=IN/g, inline) : sdp;
