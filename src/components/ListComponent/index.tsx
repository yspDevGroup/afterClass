/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: txx
 * @Date: 2021-05-31 10:24:05
 * @LastEditTime: 2021-12-20 16:36:21
 * @LastEditors: Sissle Lynn
 */

import type { ListData, ListItem, ListType } from './data';
import { List } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import DisplayColumn from '../DisplayColumn';
import Nodata from '../Nodata';
import noPic from '@/assets/noPic.png';
import noPic1 from '@/assets/noPic1.png';

const statusText = ['已请假', '班主任已请假', '已调课', '代课', '已换课'];
const NewsList = (props: { data: ListItem[]; type: ListType; operation: any }) => {
  const { data, type, operation } = props;
  const teacher = history.location.pathname.indexOf('teacher') > -1;

  return (
    <div className={styles[type]}>
      <List
        dataSource={data}
        renderItem={(v, index) => {
          const { status } = v;
          return (
            <div
              className={
                operation
                  ? 'ui-listItemWrapper'
                  : !statusText.includes?.(v.titleRight?.text || '')
                  ? 'itemWrapper'
                  : 'itemDisabled'
              }
            >
              <div className={operation ? 'ui-listItemContent' : 'itemContent'}>
                {status ? (
                  <span
                    className={styles.specialPart}
                    style={{ background: status.indexOf('已请假') > -1 ? '#F48A82' : '#7dce81' }}
                  >
                    {status}
                  </span>
                ) : (
                  ''
                )}
                <a
                  onClick={() => {
                    if (v.link) {
                      history.push(v.link);
                    }
                  }}
                >
                  <List.Item.Meta
                    style={
                      type === 'descList'
                        ? {
                            background:
                              v.titleRight?.text === '待上课'
                                ? 'rgba(69, 201, 119, 0.05)'
                                : v.titleRight?.text === '代上课'
                                ? 'rgba(255, 199, 0, 0.05)'
                                : 'rgba(102, 102, 102, 0.05)',
                          }
                        : {}
                    }
                    // eslint-disable-next-line no-nested-ternary
                    avatar={
                      v.img || v.img === '' ? (
                        v.img.indexOf('http') > -1 ? (
                          <img width="110" height="70" alt={v.title} src={v.img} />
                        ) : (
                          <div
                            style={{
                              width: '110px',
                              height: '70px',
                              border: '1px solid #F7F7F7',
                              borderRadius: '8px',
                              textAlign: 'center',
                            }}
                          >
                            <img width="68" src={teacher ? noPic1 : noPic} />
                          </div>
                        )
                      ) : (
                        ''
                      )
                    }
                    title={
                      <div className={styles.TitleRow}>
                        <div className={styles.Title}>
                          {' '}
                          <span className={styles.titles} style={{ width: 'calc(100% - 50px)' }}>
                            {v.title}
                          </span>
                          {v.fkzt === 3 ? <span className={styles.types}>待缴费</span> : <></>}
                        </div>
                        <div className={styles.TitleRight}>
                          {v.titleRight?.text === '待上课' ? (
                            <span style={{ color: '#15B628' }}>{v.titleRight?.text}</span>
                          ) : (
                            <span style={{ color: '#999' }}>{v.titleRight?.text}</span>
                          )}
                        </div>
                      </div>
                    }
                    description={
                      <>
                        {v.desc?.map((item, ind) => {
                          return (
                            <div className={styles.descRow} key={`${v.title}${ind.toString()}`}>
                              <div className={styles.descleft}>
                                {item?.left?.map((t, i) => {
                                  return (
                                    <span key={t} className={styles.descleftspan}>
                                      {i === 0 ? (
                                        ''
                                      ) : (
                                        <span className={styles.descleftInspan}>|</span>
                                      )}
                                      {t}
                                    </span>
                                  );
                                })}
                              </div>
                              <div className={styles.descright}>{item.right}</div>
                            </div>
                          );
                        })}
                      </>
                    }
                  />
                </a>
              </div>
              {!statusText.includes(status || '') && operation ? (
                <div className="ui-operation" style={{ display: 'block', paddingTop: '10px' }}>
                  <DisplayColumn
                    type="icon"
                    grid={{ column: operation.length }}
                    dataSource={operation}
                    parentLink={[v.enrollLink]}
                    bjid={v.bjid}
                    callbackData={data[index]}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />
    </div>
  );
};
const ListComp = (props: { listData?: ListData; cls?: string; operation?: any }) => {
  if (props.listData) {
    const { header, list, type, noDataImg, noDataText, noDataIcon } = props.listData;
    const { cls, operation } = props;
    return (
      <div className={`${styles.ListComponentBigBox} ${cls}`}>
        {header && header.title ? (
          <div className={styles.ListHeader}>
            <div className={styles.ListHeaderTitle}>{header?.title}</div>
            <div className={styles.ListHeaderMore}>
              <a href={header?.link}>{header?.moreText}</a>
            </div>
          </div>
        ) : (
          ''
        )}
        {list && list.length ? (
          <NewsList data={list} type={type} operation={operation} />
        ) : (
          <>
            {noDataIcon ? (
              <div className={styles.noData}>
                <Nodata imgSrc={noDataImg} desc={noDataText} />
              </div>
            ) : (
              <Nodata imgSrc={noDataImg} desc={noDataText} />
            )}
          </>
        )}
      </div>
    );
  }
  return <></>;
};
export default ListComp;
