import React from 'react';
import type { FC } from 'react';
import { Link } from 'umi';
import { List } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import type { IiconTextData } from './data';
import styles from "./index.less"

const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_2600907_5ddrm1ag9xl.js',
    ],
});

const DisplayColumn: FC<IiconTextData> = ({ title, type, grid, dataSource, isheader }) => {
    return (
        <div className={styles.IconTextCompBox} style={{ background: `${!isheader ? '#FFFFFF' : '#F5F5F5'}` }}>
            <List
                grid={grid}
                dataSource={dataSource}
                header={isheader === true ?
                    (<div >{title}</div>)
                    : ""}
                renderItem={(item) => {
                    const { icon, text, img, link, background } = item
                    return (<List.Item>
                        <Link to={link!}>
                            <div className={styles.Box}>
                                {type === "img" ?
                                    (<div className={styles.imgBox}>
                                        <img src={img} alt="alt" />
                                    </div>)
                                    :
                                    (<div className={styles.iconBox} style={{ background }}>
                                        <IconFont type={icon} />
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



