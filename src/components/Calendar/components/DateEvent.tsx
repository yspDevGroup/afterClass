/*
 * @Author: your name
 * @Date: 2021-10-27 15:57:02
 * @LastEditTime: 2022-03-28 15:33:06
 * @LastEditors: Wu Zhan
 * @Description: In User Settings Edit
 * @FilePath: \afterClass\src\components\Calendar\components\DateEvent.tsx
 */
import React, { useEffect, useState } from 'react';
import ShowName from '@/components/ShowName';
import type { SchoolEvent } from '../data';

import styles from '../index.less';

type DateEventProps = {
  colors: string[];
  events: SchoolEvent[];
  handleEvents?: (type: string, date: string, value?: SchoolEvent) => void;
};
const DateEvent = ({ colors, events }: DateEventProps) => {
  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    document.addEventListener('click', () => {
      setStatus(false);
    });
  }, []);
  console.log(
    'document.documentElement.clientWidth is not a function',
    document.documentElement.clientWidth,
  );
  return (
    <div className={styles.eventMore}>
      <ul>
        {events.map((event: SchoolEvent, index: number) => {
          const w = document.documentElement.clientWidth;
          if ((w > 1255 && index < 4) || (w <= 1255 && index < 2)) {
            return (
              <li key={event.title}>
                <span
                  style={{
                    background: colors[event.eventIndex! % colors.length],
                  }}
                />
                <span className={styles.textCut}>
                  <ShowName XM={event.title} type="userName" openid={event.wechatUserId} />
                </span>
              </li>
            );
          }
          return '';
        })}
      </ul>
      {events.length > 4 ? (
        <div>
          <p
            onMouseOver={(e) => {
              e.stopPropagation();
              setStatus(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setTimeout(() => {
                setStatus(false);
              }, 500);
            }}
          >
            更多...
          </p>
          {status ? (
            <ul className={styles.listMore}>
              {events.map((event: SchoolEvent) => {
                return (
                  <li key={event.title}>
                    <span
                      style={{
                        background: colors[event.eventIndex! % colors.length],
                      }}
                    />
                    <span className={styles.textCut}>
                      <ShowName XM={event.title} type="userName" openid={event.wechatUserId} />
                    </span>
                  </li>
                );

                // return '';
              })}
            </ul>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default DateEvent;
