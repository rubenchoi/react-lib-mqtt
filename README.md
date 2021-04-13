# mqtt-client-react

> MQTT client for React using mqtt.js and having setting UI


[![NPM](https://img.shields.io/npm/v/mqtt-client-react.svg)](https://www.npmjs.com/package/mqtt-client-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @rubenchoi/react-mqtt
```

## Usage

```jsx
import React from 'react'
import MqttComponent from '@rubenchoi/react-mqtt'

const App = () => {
  const [data, setData] = React.useState(undefined);
  const [counter, setCounter] = React.useState(1);
  const [connected, setConnected] = React.useState('Connected');

  const publish = () => {
    const date = new Date();
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    const s = "TestData-" + (counter) + " ---- " + time;
    setData({ topic: 'TOPIC1', payload: s });
    setCounter(counter + 1);
  }

  return (<>
    <p>State: {connected}</p>
    <button style={{ margin: '2em' }} onClick={publish}>Send Data</button>
    {data && <span>[{data.topic}] {data.payload}</span>}
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
  </>)
}
```

## To use a sample MQTT server, 
```bash
  example/server$ npm install
  example/server$ node AedesBroker.js

  [aedes]http listening on port 8888
  [aedes]tls listening on port 1883
```

## License

MIT © [rubenchoi](https://github.com/rubenchoi)
