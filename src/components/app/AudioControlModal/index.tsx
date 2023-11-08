import styles from "./AudioControlModal.module.scss";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {Button, message, Select, Slider, theme, Typography} from "antd";
import {setPlayer} from "@/redux/slices/player.slice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faHeadphones, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {playerEl} from "@/components/providers/PlayerProvider";

export default function AudioControlModal() {
  const dispatch = useAppDispatch();
  const {audioControlModal, volumeLevel} = useAppSelector(state => state.player);
  const {token: {colorBgBase}} = theme.useToken();
  const [selectedDevice, setSelectedDevice] = useState('');
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(enumeratedDevices => {
      enumeratedDevices = enumeratedDevices.filter(x => x.kind === 'audiooutput' && x.deviceId !== '');
      setDevices(enumeratedDevices);
      setSelectedDevice(enumeratedDevices.find(x => x.deviceId === 'default')?.deviceId || '');
    });
  }, [permissionRequested]);

  useEffect(() => {
    if (selectedDevice && playerEl && (playerEl as any).setSinkId) {
      (playerEl as any).setSinkId(selectedDevice);
    }
  }, [selectedDevice]);

  const close = () => dispatch(setPlayer({
    audioControlModal: false,
  }));

  const requestPermission = () => {
    navigator.mediaDevices.getUserMedia({audio: true}).then(() => {
      setPermissionRequested(true);
    }).catch(err => {
      return message.error("Failed to request permissions");
    });
  }

  return <div
    className={styles.outer + ` ${audioControlModal ? styles.show : ''}`}
    onClick={close}
  >
    <div className={styles.content} onClick={e => {
      e.stopPropagation();
    }}>
      <div className={styles.topControls}>
        <Button
          shape={'circle'} icon={<FontAwesomeIcon icon={faChevronDown}/>} type={'text'} size={'large'}
          onClick={close}
        />
      </div>
      <Typography.Title level={3} className={styles.title}>
        Audio Control
      </Typography.Title>
      <Typography.Text>
        Audio Level
      </Typography.Text>
      <Slider
        value={volumeLevel}
        step={1}
        min={0}
        max={100}
        onChange={value => {
          dispatch(setPlayer({
            volumeLevel: value,
          }))
        }}
      />
      <div className={styles.sectionTitle}>
        <Typography.Text>
          <FontAwesomeIcon icon={faHeadphones}/>{' '}
          Output Device
        </Typography.Text>
        <Button type={'text'} onClick={requestPermission}>
          <FontAwesomeIcon icon={faQuestionCircle} style={{marginRight: 4}}/>
          Cannot see your device?
        </Button>
      </div>
      <Select
        value={selectedDevice}
        onChange={value => {
          setSelectedDevice(value);
        }}
      >
        {devices.map(device => (
          <Select.Option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </Select.Option>
        ))}
      </Select>
      <Typography.Text className={styles.credit}>
        Made with love by <a href={'https://delimister.com'}>@delimister</a> (a.k.a @monokaijs)
      </Typography.Text>
    </div>
  </div>
}
