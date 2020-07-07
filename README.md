# F1 TV Playback Controls

Modern playback controls for F1 TV. This extension for Chrome and Firefox gives you:

- YouTube style playback controls
- Google Cast support (via the [F1 TV Google Cast Receiver](https://github.com/outlandnish/f1tv-cast-receiver))

## Installation

1. Go to your browser's developer mode page: `about://extensions` on a Chromium browser and `about://debugging` on Firefox
2. Enable Developer Mode
3. `Load unpacked extension` on a Chromium browser and `Load Temporary Add-on` in Firefox. For Firefox, select any file in the folder and it will load the extension
4. Enjoy!

## Usage

- __[space]__: pause / play the video
- __m__: mute / unmute the video
- __+__ / __-__: increment / decrement the volume by 5%
- __[left arrow]__ / __[right arrow]__: backward / forward by 5 seconds
- __j__ / __l__: backward / forward by 10 seconds
- __f__: fullscreen
- __[1]...[9]__: skip to 10%...90% of the video
- __[home]__: seek to the start of video
- __[end]__: seek to the end of the video

## Known Issues

- Mute button in UI is not synced with mute / unmute from keyboard
- Volume control in UI is not synced with volume changes from keyboard
- Mute / volume controls in UI do nothing for Google Cast
- If video source is cast some time after loading, the token to access the stream expires. Click on a different stream and click back for it to load.

## FAQ + Troubleshooting

### I've got the extension. How do I cast?
Right click on the video and click 'Cast media to device'

### When I cast, it just mirrors my screen instead of casting the video. How can I fix this?
Your Google Cast device needs to pull the new config that supports the Google Cast receiver for F1 TV. Power cycle / reboot your Cast device and it should pick up the F1 TV Cast Receiver

### I see a blank screen that says F1 TV (Unofficial) but the video does not load. How can I fix this?
It's likely the token for the stream expired. To renew it, click on one of the other video tracks (like a driver stream) and then click back to the video track you were watching. It should load properly then.

### There's no touch controls for my Google Home! What gives?
These haven't been implemented yet. It might be there in a future release!

### How can I cast from Firefox?
Unfortunately, Google no longer has an extension for Cast outside of Chromium browsers :/ That said, the playback controls still work in Firefox and Cast supposedly works on Firefox for Android.

## Contributions
This code is super quick and dirty / proof of concept level. It's ugly but gets the job done. Wanna make it better? Feel free to send in a PR!

## [Donations](https://paypal.me/nishanth)
I built this extension for fun to learn more about building browser extensions. That said, it did take a bit of time (and a teeny bit of money). If you found it helpful, I'd appreciate any donations! You can contribute [here](https://paypal.me/nishanth)
