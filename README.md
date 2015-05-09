## Webmaker for Android

Mozilla Webmaker's mission is to help enable a new generation of digital creators and webmakers, giving people the tools and skills they need to move from using the Web to actively making the Web. To this end, the Webmaker App is an entry point to the Webmaker community that provides a radically simple interface for creating mobile application directly on device.

![Webmaker for Android](https://cloud.githubusercontent.com/assets/747641/7551523/6e866ae2-f640-11e4-8606-2e7f890b438e.jpg)

## Getting Started

#### Prerequisites
Before you jump into the code you'll want to download, install, and configure the following:

- [Android Studio](http://developer.android.com/sdk)
- [Node 0.12+](https://nodejs.org/) w/ ES6 ("harmony") features enabled
- [NPM 2.6+](https://www.npmjs.com/)

#### Clone & Install Dependencies
```bash
git clone https://github.com/mozilla/webmaker-android
cd webmaker-android
npm install
```

#### Android
While the majority of `webmaker-android` is built using Web technologies, it runs within a native Android wrapper that is included as part of this codebase. If you would like to make changes to the wrapper or if you'd like to test the app, we recommend you use [Android Studio](http://developer.android.com/sdk/index.html).

- Create the built assets with `npm run build`
- Install and configure [Android Studio](http://developer.android.com/sdk)
- Open Android Studio and select "Import Project"
- If Android Studio asks, choose "Create project from existing sources"
- Select the "webmaker-android" directory

Once you have the project open, you can run it within an emulator or on any Android device with USB debugging enabled by selecting "Run 'app'" from the "Run" dropdown menu. For more information, please check out the [Android SDK documentation](http://developer.android.com/training/index.html).

#### Web
Each fragment within `webmaker-android` is actually just a web page! You can find all of the js, css, and static assets in the `./www_src/` directory. Static files in `./www_src/static/` will be copied to the main directory during build.

To run and develop in a web browser without testing on device, simply run

```bash
npm start
```

## Contact Us
IRC: `#webmaker` on `irc.mozilla.org`

Forum: [https://groups.google.com/forum/#!forum/mozilla.webmaker](https://groups.google.com/forum/#!forum/mozilla.webmaker)

---

## Adding New Pages or Components

There are a few standards to bear in mind when adding new pages or components to the project.

Components are added to the `www_src/components` directory. Pages are added to `www_src/pages`. Each component or page needs its own subdirectory, JSX file, and LESS file. All three should share a common name.

For example:

```
www_src/components/link/
├── link.jsx
└── link.less
```

*Be sure to add the LESS file as an import in `www_src/main.less` so that it gets compiled!*

Component markup should contain a top-level class name that corresponds to its filename (eg: `.link` for `link`). Pages should similarly have a top-level ID (eg: `#editor` for `editor`).

File names are hyphenated lowercase. For example: `section-2.jsx`.

## Network Assets

Webmaker for Android attempts to use network resources as sparingly as possible. In addition, it is important to cover failure and loading states gracefully at all times. To this end, we have a few React components and libraries included in the project to help make this easier:

#### API Requests
The `./lib/api.js` module is the primary way in which you should interact with api.webmaker.org. This module uses Android's `SharedPreferences` API to cache API requests by default thus reducing network requests. If you need to bypass the cache, you can send `useCache: false` to the module:

```js
var api = require('./lib/api.js');

api({
    uri: '/discover',
    useCache: false
}, function (err, results) {
    // do stuff!
});
```

#### Loading Images
Any time you are loading images over the network, we recommend that you use the `<ImageLoader>` react component. This gives you access to important events like loading and error states as well as a hook for providing a loading animation. Full documentation can be found here: https://github.com/hzdg/react-imageloader

#### Accessing Android Route Parameters
The application uses an Android class called `Router` to move between activities. Similar to how you can pass parameters in a URL router like [Express](http://expressjs.com/), the Android `Router` class can provide route parameters via the `router.js` mixin. When using the mixin, route parameters will be bound to `route` within the react class's state.
```js
var router = require('./lib/router.js');

var MyThing = React.createClass({
  mixins: [router],
  // ...
  componentWillMount: function () {
    console.log(this.state.route);
  }
});
```

#### Interacting with SharedPreferences
`SharedPreferences` is a simple key/value store API native to Android that can be used to persist values to disk that are only available to the Webmaker application. You can both set and get values to `SharedPreferences` using Java <-> JS bindings that are provided within `WebAppInterface.java`:
```js
if (window.Android) {
  window.Android.setSharedPreferences('my::cache::key', 'foobar', false);
  var hit = window.Android.getSharedPreferences('my::cache::key', false);
  console.log(hit); // prints "foobar"
}
```

`SharedPreferences` can be namespaced to the current activity by using the last "scope" parameter. For example using the following in an Activity called "MyActivity":
```js
window.Android.getSharedPreferences('state', true);
```
will result in a `SharedPreferences` key of `state::MyActivity`.
