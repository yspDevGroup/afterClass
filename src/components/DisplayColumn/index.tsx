import React from 'react';
import type { FC } from 'react';
import { Link } from 'umi';
import { List, Badge } from 'antd';
import type { IiconTextData } from './data';
import IconFont from '../CustomIcon';
import styles from "./index.less";


const DisplayColumn: FC<IiconTextData> = ({hidden = false, title, type, grid, dataSource, isheader, totil }) => {
    return (
        <div className={styles.IconTextCompBox} style={{ background: `${!isheader ? '#FFFFFF' : '#F5F5F5'}`, display: hidden? 'none':'block' }}>
            <List
                grid={grid}
                dataSource={dataSource}
                header={isheader === true ?
                    (<div >{title}</div>)
                    : ""}
                renderItem={(item) => {
                    const { icon, text, img, link, background, fontSize, count } = item;
                    return (<List.Item>
                        <Link to={link!}>
                            <div className={styles.Box}>
                                {type === "img" ?
                                    (<div className={styles.imgBox}>
                                        <img src={img} alt="alt" />
                                    </div>)
                                    :
                                    (<div >
                                        {totil ?
                                            (<div className={styles.iconBoxShw} >
                                                <Badge dot offset={[-5, 3]} count={count}>
                                                    <IconFont type={icon} style={{ 'color': !isheader ? '#fff' : 'inherit', 'fontSize': fontSize || '18px' }} />
                                                </Badge>
                                            </div>)
                                            :
                                            (<div>
                                                <div className={styles.iconBox} style={{ background }} >
                                                    <IconFont type={icon} style={{ 'color': !isheader ? '#fff' : 'inherit', 'fontSize': fontSize || '18px' }} />
                                                </div>
                                                <div className={styles.iconShwBox} style={{ background }}></div>
                                            </div>
                                            )
                                        }
                                    </div>)
                                }
                                <div className={styles.TextBox}>{text}</div>
                            </div>

                        </Link>
                    </List.Item>)
                }}
            />
        </div>
    )
}

export default DisplayColumn;



