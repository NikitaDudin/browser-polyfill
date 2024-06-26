import '@expo/browser-polyfill';

import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { GLView } from 'expo-gl';
/*
 Issue: https://github.com/expo/browser-polyfill/issues/2
 Firebase doesn't work with this lib.
 Adding it here to test.
*/
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import * as database from 'firebase/database';
import React from 'react';
import { Text, View } from 'react-native';

function setupFirebase() {
  const config = {
    apiKey: 'AIzaSyAfgPq82VdNqEZ8hqnOvYdD7kSPiFK9W1k',
    authDomain: 'keira-knightley-51df6.firebaseapp.com',
    databaseURL: 'https://keira-knightley-51df6.firebaseio.com',
    projectId: 'keira-knightley-51df6',
    storageBucket: 'keira-knightley-51df6.appspot.com',
    messagingSenderId: '628588079444',
  };
  initializeApp(config);
  // app.firestore().settings({ timestampsInSnapshots: true });

  const _onAuthStateChanged = async (user) => {
    // app.database().forceDisallow();
    // console.log(firebase.database());
    // return;
    if (!user) {
      try {
        await signInAnonymously(getAuth());
      } catch ({ message }) {
        alert(message);
      }
    } else {
      console.log('signed in');
      const testRef = database.ref(database.getDatabase(), '/test_data');
      try {
        const snapshot = await database.get(testRef);
        const { key } = snapshot;
        const value = snapshot.val();
        console.log('Firebase Database: ', { key, value });
      } catch ({ message }) {
        console.error('Error: Firebase Database: ', message);
      }
    }
  };

  const auth = getAuth();

  onAuthStateChanged(auth, _onAuthStateChanged);
}

const tests = {
  timer: () => {
    const tag = 'test-timer';
    console.time(tag);
    console.timeEnd(tag);
    console.count(tag);
  },
  userAgent: () => {
    console.log('userAgent: ', global.userAgent);
  },
  process: () => {
    console.log('process: ', global.process);
  },
  navigator: () => {
    console.log('navigator: ', Object.keys(global.navigator));
  },
  performance: () => {
    console.log('performance: ', Object.keys(global.performance));
  },
  window: () => {
    console.log('location: ', Object.keys(window.location));
  },
  base64: async () => {
    const asset = Asset.fromModule(require('./image.png'));
    await asset.downloadAsync();
    console.log('B64: ASSET:', asset.localUri);
    const data = (await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    })).trim();

    global.__debug_browser_polyfill_image = true;
    const pngPrefix = 'data:image/png;base64,';
    // console.log('B64: DATA: ', pngPrefix + data);
    const image = new global.HTMLImageElement();
    image.addEventListener('loading', () => {
      console.log('B64: Loading Image');
    });
    image.addEventListener('error', () => {
      console.log('B64: Error Loading Image');
    });
    image.onload = () => {
      const { src, width, height } = image;
      console.log('B64: Loaded Image', { src, width, height });
    };
    image.src = pngPrefix + data;
  },
  correctElementsCreated: () => {
    const {
      HTMLImageElement,
      ImageBitmap,
      HTMLVideoElement,
      HTMLCanvasElement,
    } = global;
    const types = [
      { type: 'img', inst: HTMLImageElement },
      { type: 'video', inst: HTMLVideoElement },
      { type: 'canvas', inst: HTMLCanvasElement },
      { type: 'img', inst: ImageBitmap },
    ];
    types.forEach((item) => {
      const element = document.createElement(item.type);
      console.log(
        'type',
        item.type,
        element instanceof item.inst,
        element instanceof Number,
      );
    });
  },
  elements: () => {
    const {
      HTMLImageElement,
      Image,
      ImageBitmap,
      HTMLVideoElement,
      Video,
      HTMLCanvasElement,
      Canvas,
    } = global;
    const elements = {
      HTMLImageElement,
      Image,
      ImageBitmap,
      HTMLVideoElement,
      Video,
      HTMLCanvasElement,
      Canvas,
    };
    console.log(
      'Elements: ',
      Object.keys(elements).map((key) => ({ [key]: !!elements[key] })),
    );
  },
  loadImage: () => {
    const image = new global.HTMLImageElement();
    image.addEventListener('loading', () => {
      console.log('Loading Image');
    });
    image.addEventListener('error', () => {
      console.log('Error Loading Image');
    });
    image.onload = () => {
      const { src, width, height } = image;
      console.log('Loaded Image', { src, width, height });
    };
    image.src = 'https://avatars0.githubusercontent.com/u/9664363?s=40&v=4';
  },
  textDecoder: () => {
    console.log('TextDecoder: ', !!global.TextDecoder);
    const utfLabel = 'utf-8';
    const options = { fatal: true };
    const decoder = new TextDecoder(utfLabel, options);

    const data = '{}';
    let buffer = '';
    buffer += decoder.decode(data, { stream: true });
    console.log('TextDecoder buffer', buffer, ' from: ', Object.keys(data));
  },
  context: () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const webgl = canvas.getContext('webgl');
    console.log(context, webgl);
  },
  domParser: () => {
    console.log('window.DOMParser: ', !!window.DOMParser);
    const parser = new window.DOMParser();

    const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div class="container" id="container-id" name="container-name">
          some text content
          <h1 class="header">Charlie Cheever</h1>
          <p id="subtitle">is my dad.</p>
          <input name="named-input" type="text" value="Ben Affleck" />
        </div>
      </body>
    </html>
    `;
    const dom = parser.parseFromString(html);
    const container = dom.getElementById('container-id');
    Object.keys(container).forEach((key) => {
      const obj = container[key];
      console.log(`DOMParser: container.${key}: ${obj}`);
    });
  },
};

const testGL = !Constants.isDevice;

function useWindowDeviceSize() {
  const [size, setSize] = React.useState(null);
  React.useEffect(() => {
    const onLayout = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio,
      });
      console.log('Update Layout:', {
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio,
      });
    };

    window.addEventListener('resize', onLayout);

    return () => {
      window.removeEventListener('resize', onLayout);
    };
  }, []);
  return size;
}

export default function App() {
  const size = useWindowDeviceSize();

  React.useEffect(() => {
    if (!testGL) {
      runTests();
    }
    setupFirebase();
  }, []);

  const runTests = () => {
    Object.keys(tests).forEach((key) => {
      try {
        console.log('Run Test: ', key);
        tests[key]();
      } catch (error) {
        console.error(`Error running ${key} test: `, error);
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Check your console...</Text>
      {testGL && (
        <GLView
          onContextCreate={(context) => {
            global.__context = context;
            runTests();
          }}
        />
      )}
    </View>
  );
}
