import React from 'react'

import MqttComponent from '@rubenchoi/react-mqtt'

const TEST = {
  headTurnLeft: { bone: [{ 'CC_Base_Head:r:z:a': 0.3 }, { 'head:r:z:a': 0.3 }, { 'upperarm_r:r:x': 1.5 }] },
  headTurnRight: { bone: [{ 'CC_Base_Head:r:z:a': -0.3 }, { 'head:r:z:a': -0.3 }, { 'upperarm_r:r:x': 0 }] },
  faceA: {
    morphTarget: [{ 'Explosive:CC_Game_Body': 1 }, { 'Eye_Blink:CC_Game_Body': 1 }, { 'Lip_Open:CC_Game_Body': 1 },
    { 'Explosive:CC_Base_Body': 1 }, { 'Eye_Blink:CC_Base_Body': 1 }, { 'Lip_Open:CC_Base_Body': 1 }]
  },
  faceB: {
    morphTarget: [{ 'Explosive:CC_Game_Body': 0 }, { 'Eye_Blink:CC_Game_Body': 0 }, { 'Lip_Open:CC_Game_Body': 0 },
    { 'Explosive:CC_Base_Body': 0 }, { 'Eye_Blink:CC_Base_Body': 0 }, { 'Lip_Open:CC_Base_Body': 0 }]
  }
}

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

  const sendTestCharacter = (index) => {
    console.log("index:", index, TEST[index]);
    setData({ topic: 'characterMovement', payload: JSON.stringify(TEST[index]) });
  }

  return (<>
    <p>State: {connected}</p>
    <button style={{ margin: '2em' }} onClick={publish}>Send Data TOPIC1</button>
    <span style={{ marginLeft: '3em' }}>Character Movement:
      <select onChange={e => sendTestCharacter(e.target.value)} style={{ marginLeft: '1em' }}>
        <option value={'headTurnLeft'}>Head Turn Left</option>
        <option value={'headTurnRight'}>Head Turn Right</option>
        <option value={'faceA'}>Face Expression A</option>
        <option value={'faceB'}>Face Expression B</option>
      </select>
    </span>
    {/* {data && <span>[{data.topic}] {data.payload}</span>} */}
    <MqttComponent
      subscribeTo={[
        'characterMovement', 'TOPIC1'
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

export default App
