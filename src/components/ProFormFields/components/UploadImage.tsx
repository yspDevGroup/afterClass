import React, { useEffect, useState } from 'react';
import { Button, message, Upload, Image } from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import styles from './UploadImage.less';
import { getAuthorization } from '@/utils/utils';

type UploadImageProps = {
  imageurl?: string; // 回显地址
  upurl?: string; // 上传地址
  readonly?: boolean; // 值为true时，不展示上传按钮
  disabled?: boolean; // 值为true时，上传按钮不可点击
  accept?: string; // 类型
  imagename?: string; // 发到后台的文件参数名
  width?: number; // 图片宽度
  height?: number; // 图片高度
  handleImageChange?: (value: any) => void;
  data?: object | ((file: any) => object) | Promise<object>; // 上传所需额外参数或返回上传额外参数的方法
};

const UploadImage = (props: UploadImageProps) => {
  const { upurl, readonly, disabled, accept, imagename,width = 110,height = 72, data, handleImageChange } = props;
  const [imageUrl, setImageUrl] = useState(props.imageurl);
  useEffect(() => {
    setImageUrl(props.imageurl);
  }, [props.imageurl]);

  // const getBase64 = (img: any, callback: any) => {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // };
  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件必须小于 2MB');
    }
    return isLt2M;
  };

  const onResetClick = () => {
    setImageUrl(undefined);
  };
  return (
    <div className={styles.uploadStyles}>
      {imageUrl ? (
        <div style={{ marginRight: 16 }}>
          <Image width={width} height={height} src={imageUrl} />
        </div>
      ) : (
        <div className={styles.defImgStyles}>
          <div className={styles.icon} />
        </div>
      )}
      {readonly ? (
        ''
      ) : (
        <div className={styles.uploadButStyles}>
          <ImgCrop rotate aspect={width / height}>
            <Upload
              showUploadList={false}
              name={imagename}
              action={upurl}
              disabled={disabled}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              accept={accept}
              data={data}
              headers={{
                Authorization: getAuthorization(),
              }}
            >
              <Button type="primary" disabled={disabled}>
                上传
              </Button>
            </Upload>
          </ImgCrop>
          <Button disabled={disabled} style={{ marginTop: 8 }} onClick={onResetClick}>
            重置
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
