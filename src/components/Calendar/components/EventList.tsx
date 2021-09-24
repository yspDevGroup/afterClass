import React from 'react';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styles from '../index.less';
import { Config, SchoolEvent } from '../data';

type EventListProps = {
  config: Partial<Config>,
  events: SchoolEvent[];
  handleEvents?: (type: string, date: string, value?: SchoolEvent) => void;
};
const EventList = ({ config, events, handleEvents }: EventListProps) => {
  const { edit, primaryColor, colors, eventListWidth } = config;
  return (
    <div className={styles.eventWrapper} style={{ width: eventListWidth }}>
      {edit ? <Button type="primary" style={{ background: primaryColor }} onClick={() => {
        const date = new Date().toISOString();
        handleEvents?.('new',date);
      }} >
        <PlusOutlined /> 新增安排
      </Button > : ''}
      <div>
        {events.length > 0 ? (
          <div className={styles.events}>
            {events.map((item: SchoolEvent, index) => {
              return (
                <div className={styles.eventsItem} key={item.title}>
                  <div
                    className={styles.slot}
                    style={{ background: colors![index % colors!.length] }}
                  />
                  <div className={styles.event}>
                    <div
                      className={`${styles.eventTitle} ${styles.textCut}`}
                      onClick={() => {
                        const date = item.editRange![0];
                        handleEvents?.('check', date, item);
                      }}
                    >{item.title}</div>
                  <div className={styles.eventDate}>{item.dateItem}</div>
                </div>
                  {
                edit ? <div className={styles.operation}>
                  <FormOutlined onClick={() => {
                    const date = item.editRange![0];
                    handleEvents?.('edit', date, item);
                  }} />
                </div> : ''
              }
                </div>
        );
            })}
      </div>
      ) : (
      <div className={styles.noData} >{config.nodataImg ? <img src={config.nodataImg} /> : `暂无安排`} </div>
        )}
    </div>

    </div >
  );
};

export default EventList;
