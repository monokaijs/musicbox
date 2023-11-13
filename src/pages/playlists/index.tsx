import React from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {Button, Col, Dropdown, List, Row, Typography} from "antd";
import styles from "./Playlists.module.scss";
import {getPlaylistDescription, getPlaylistThumbnail} from "@/utils/player.utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisVertical, faPen, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import GoBack from "@/components/shared/GoBack";
import {setApp} from "@/redux/slices/app.slice";
import {useRouter} from "next/router";

export default function Playlists() {
  const dispatch = useAppDispatch();
  const {playlists} = useAppSelector(state => state.app);
  const {queue} = useAppSelector(state => state.player);
  const router = useRouter();


  return <div className={styles.outer}>
    <div className={styles.header}>
      <GoBack/>
      <Typography.Title className={styles.title} level={2}>
        Playlists
      </Typography.Title>
      <Button
        type={'text'}
        icon={<FontAwesomeIcon icon={faPlus}/>}
        onClick={() => dispatch(setApp({
          createPlaylistModal: true,
        }))}
      >
        Create
      </Button>
    </div>
    <div
      className={styles.content}
      style={{
        paddingBottom: queue.length === 0 ? 0 : 90,
      }}
    >
      <Row className={styles.list} gutter={[24, 24]}>
        {playlists.map((item: Playlist) => (
          <Col key={item.id} span={8}>
            <div
              className={styles.item}
              onClick={() => router.push('/playlists/' + item.id + '/')}
            >
              <div
                className={styles.artwork}
                style={{
                  backgroundImage: `url('${getPlaylistThumbnail(item)}')`
                }}
              />
              <div className={styles.meta}>
                <div className={styles.info}>
                  <Typography.Text className={styles.name}>
                    {item.name}
                  </Typography.Text>
                  <Typography.Text className={styles.authors}>
                    {getPlaylistDescription(item)}
                  </Typography.Text>
                </div>
                <div className={styles.controls}>
                  <Dropdown
                    menu={{
                      items: [{
                        key: 'edit',
                        icon: <FontAwesomeIcon icon={faPen}/>,
                        label: 'Edit'
                      }, {
                        type: 'divider'
                      }, {
                        key: 'delete',
                        icon: <FontAwesomeIcon icon={faTrashCan}/>,
                        label: 'Delete',
                        danger: true,
                        disabled: item.systemPlaylist,
                        onClick: e => {
                          e.domEvent.stopPropagation();
                          dispatch(setApp({
                            playlists: playlists.filter(x => x.id !== item.id),
                          }))
                        }
                      }]
                    }}
                  >
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      size={'small'}
                      type={'text'}
                      shape={'circle'}
                      icon={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                    />
                  </Dropdown>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </div>
}
