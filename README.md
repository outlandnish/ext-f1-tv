# F1 TV Playback Controls

Modern playback controls for F1 TV. This extension for Chrome and Firefox gives you:

- YouTube style playback controls
- Google Cast support (via the [F1 TV Google Cast Receiver](https://github.com/outlandnish/f1tv-cast-receiver))

[![Download from Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png 'Available in the Chrome Web Store')](https://chrome.google.com/webstore/detail/f1-tv-playback-controls/bndmmpkkilmcaoddlicjenjffkihmmle?hl=en)

[![Get the Add-On](https://ffp4g1ylyit3jdyti1hqcvtb-wpengine.netdna-ssl.com/addons/files/2015/11/get-the-addon.png 'Get the Add-On')](https://addons.mozilla.org/en-US/android/addon/f1-tv-playback-controls/)

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
- If the computer used to cast is resumed from sleep during a cast, the stream reloads

## FAQ + Troubleshooting

### The playback controls aren't responding
Sometimes the browser doesn't load the page for some odd reason. Refresh the page and it should start working again.

### I've got the extension. How do I cast?
Right click on the video and click 'Cast media to device'

### How can I cast from Firefox?
Unfortunately, Google no longer has an extension for Cast outside of Chromium browsers :/ That said, the playback controls still work in Firefox and Cast supposedly works on Firefox for Android.

### When I cast, it mirrors my screen instead of casting the video. How can I fix this?
Your Google Cast device needs to pull the new config that supports the Google Cast receiver for F1 TV. Power cycle / reboot your Cast device and it should pick up the F1 TV Cast Receiver

### I see a blank screen that says F1 TV (Unofficial) but the video does not load.
It's likely the token for the stream expired. To renew it, click on one of the other video tracks (like a driver stream) and then click back to the video track you were watching. It should load properly then.

## Contributions
This code is super quick and dirty / proof of concept level. It's ugly but gets the job done. Wanna make it better? Feel free to send in a PR!

## [Donations](https://paypal.me/nishanth)
I built this extension for fun to learn more about building browser extensions. That said, it did take a bit of time (and a teeny bit of money). If you found it helpful, I'd appreciate any donations! You can contribute [here](https://paypal.me/nishanth)
