# mqtt-client-react

> MQTT client for React using mqtt.js and having setting UI

To use a sample MQTT server, 
```bash
  example/server$ npm install
  example/server$ node AedesBroker.js

  [aedes]http listening on port 8888
  [aedes]tls listening on port 1883
```


[![NPM](https://img.shields.io/npm/v/mqtt-client-react.svg)](https://www.npmjs.com/package/mqtt-client-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @rubenchoi/react-mqtt
```

## Usage

```jsx
import React, { Component } from 'react'
import MyComponent from '@rubenchoi/react-mqtt'

class Example extends Component {
  render() {
    return (
      <MqttComponent
        subscribeTo={[
          'TOPIC1', 'TOPIC2'
        ]}
        publish={data}
        callbacks={{
          onConnect: (isConnected = true) => setConnected(isConnected ? "Connected" : "Disconnected"),
          onMessage: (topic, payload) => {
            console.log("onMessage: topic=" + topic, payload);
          }
        }}
        settings={true}
        log={true}
      />
    )
  }
}
```

## License

MIT © [rubenchoi](https://github.com/rubenchoi)
