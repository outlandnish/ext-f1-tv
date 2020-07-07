# ext-f1-tv 

Modern playback controls for F1 TV. This extension for Chrome and Firefox gives you:

- YouTube style playback controls
- Google Cast support

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
- __[1]...[9]__: skip to 10...90% of the video
- __[home]__: seek to the start of video
- __[end]__: seek to the end of the video

## Known Issues

- Mute button in UI is not synced with mute / unmute from keyboard
- Volume control in UI is not synced with volume changes from keyboard
- Mute / volume controls in UI do nothing for Google Cast