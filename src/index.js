import React, { Fragment } from 'react'
import 'antd/dist/antd.css';
import { Form, Input, Button, Card, Collapse } from 'antd';
import mqtt from 'mqtt';

const { Panel } = Collapse;

let g_var = {};

const loadPreference = (m, v) => {
  if (localStorage.getItem(m) === null || localStorage.getItem(m) === undefined) {
    localStorage.setItem(m, v);
  }
  return localStorage.getItem(m);
}

export default function MqttComponent(props) {
  const savedAddress = loadPreference('rubenchoi-mqtt-address', props.defaultAddress || '127.0.0.1');
  const savedPort = loadPreference('rubenchoi-mqtt-port', props.defaultPort || '8888');

  const [form] = Form.useForm();
  const [address, setAddress] = React.useState(savedAddress);
  const [port, setPort] = React.useState(savedPort);
  const [publish, setPublish] = React.useState(undefined);
  const [received, setReceived] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);

  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

  const onFinish = (data) => {
    setAddress(data.ip);
    setPort(data.port);
    localStorage.setItem('rubenchoi-mqtt-address', data.ip);
    localStorage.setItem('rubenchoi-mqtt-port', data.port);
  };

  React.useEffect(() => {
    const handleMessage = (topic, payload) => {
      let decodedPayload = new Buffer.from(payload, 'base64').toString('utf-8');
      setReceived("[" + topic + "] " + decodedPayload);
      props.callbacks.onMessage(topic, decodedPayload);
    }

    const handleError = (err) => {
      setError(err);
      props.callbacks.onConnect(false);
    }

    const connect = () => {
      try {
        const url = 'ws://' + address + ':' + port;
        const mqttHandler = mqtt.connect(url);
        mqttHandler.on('connect', () => {
          props.subscribeTo.forEach(topic => {
            mqttHandler.subscribe(topic);
          })
          g_var.mqtt = mqttHandler;
          props.callbacks.onConnect(true);
        });
        mqttHandler.on('disconnect', () => handleError('MQTT Disconnected'));
        mqttHandler.on('error', (err) => handleError(err));
        mqttHandler.on('message', handleMessage);
      } catch (err) {
        handleError(err);
      }
    }

    connect();
  }, [])

  React.useEffect(() => {
    try {
      g_var.mqtt.publish(props.publish.topic, props.publish.payload);
      setPublish(props.publish);
    } catch (err) {
      console.log('ERROR: cannot publish');
    }
  }, [props.publish])

  return (
    <>
      {props.settings &&
        <Card size="small" title="Settings" extra={'MQTT'} style={{ width: '50vw' }}>
          <Form
            {...formItemLayout}
            layout={'horizontal'}
            form={form}
            initialValues={{
              ip: address,
              port: port
            }}
            onFinish={onFinish}
          >
            <Form.Item label="IP" name="ip">
              <Input />
            </Form.Item>
            <Form.Item label="Port" name="port">
              <Input />
            </Form.Item>
            <Form.Item {...buttonItemLayout}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>

          {error && <div style={{ position: 'absolute' }}>{error}</div>}

          {props.log && <>
            <p>Log</p>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="Published Message" key="1">
                {publish && <p>[{publish.topic}] {publish.payload}</p>}
              </Panel>
              <Panel header="Received Message" key="2">
                <p>{received}</p>
              </Panel>
            </Collapse>
          </>}
        </Card>
      }
    </>
  );
};
