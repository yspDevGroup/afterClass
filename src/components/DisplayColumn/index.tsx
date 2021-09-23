import React from 'react';
import type { FC } from 'react';
import { Link } from 'umi';
import { List, Badge } from 'antd';
import type { IiconTextData } from './data';
import IconFont from '../CustomIcon';
import styles from './index.less';

const DisplayColumn: FC<IiconTextData> = ({
  hidden = false,
  title,
  type,
  grid,
  dataSource,
  isheader,
  totil,
  parentLink,
  bjid
}) => {
  return (
    <div
      className={styles.IconTextCompBox}
      style={{
        background: `${!isheader ? '#FFFFFF' : '#F5F5F5'}`,
        display: hidden ? 'none' : 'block',
      }}
    >
      <List
        grid={grid}
        dataSource={dataSource}
        header={isheader === true ? <div>{title}</div> : ''}
        renderItem={(item, index) => {
          const { icon, text, img, link, background, fontSize, count, itemType } = item;
          let curLink = link || '';
          if (parentLink) {
            curLink = parentLink[index];
          }
          return (
            <List.Item onClick={()=>item.handleClick?.(bjid)}>
              <Link to={curLink}>
                <div className={styles.Box}>
                  {type === 'img' || itemType === 'img' ? (
                    <div>
                      <div className={styles.last}>
                        <div className={styles.imgBox} style={{ background }}>
                          <img src={img} alt="alt" />
                        </div>
                        <div className={styles.iconShwBox1} style={{ background }} />
                      </div>
                      <div className={styles.TextBox1}>{text}</div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <div className={styles.iconBox} style={{ background }}>
                          {totil && index === 0 ? (
                            <Badge dot offset={[-5, 3]} count={count}>
                              <IconFont
                                type={icon}
                                style={{
                                  color: !isheader ? '#fff' : 'inherit',
                                  fontSize: fontSize || '18px',
                                }}
                              />
                            </Badge>
                          ) : (
                            <IconFont
                              type={icon}
                              style={{
                                color: !isheader ? '#fff' : 'inherit',
                                fontSize: fontSize || '18px',
                              }}
                            />
                          )}
                        </div>
                        <div className={styles.iconShwBox} style={{ background }} />
                      </div>
                      <div className={styles.TextBox}>{text}</div>
                    </div>

                  )}

                </div>
              </Link>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default DisplayColumn;
