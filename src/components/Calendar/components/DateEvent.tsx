import React, { useEffect, useState } from 'react';
import { SchoolEvent } from '../data';
import styles from '../index.less';

type DateEventProps = {
  colors: string[];
  events: SchoolEvent[];
  handleEvents?: (type: string, date: string, value?: SchoolEvent) => void;
};
const DateEvent = ({ colors, events }: DateEventProps) => {
  return (
    <div className={styles.eventMore}>
      <ul>
        {events.map((event: SchoolEvent, index: number) => {
          return <li key={event.title} >
            <span
              style={{
                background:
                  colors[event.eventIndex! % colors.length],
              }}
            />
            <span className={styles.textCut}>
              {event.title}
            </span>
          </li>
        })}
      </ul>
    </div>
  );
};

export default DateEvent;
