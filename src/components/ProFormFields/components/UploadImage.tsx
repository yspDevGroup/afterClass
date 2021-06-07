import React, { useState } from 'react';
import { Button, message, Upload, Image } from 'antd';
import ImgCrop from 'antd-img-crop';

import styles from './UploadImage.less';

type UploadImageProps = {
  imageurl?: string; // 回显地址
  upurl?: string; // 上传地址
  readonly?: boolean; // 值为true时，不展示上传按钮
  accept?: string; // 类型
  imagename?: string; // 发到后台的文件参数名
  data?: object | ((file: any) => object) | Promise<object>; // 上传所需额外参数或返回上传额外参数的方法
};

const UploadImage = (props: UploadImageProps) => {
  const { upurl, readonly, accept, imagename, data } = props;
  const [imageUrl, setImageUrl] = useState(props.imageurl);
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件必须小于 2MB');
    }
    return isLt2M;
  };
  const handleChange = (e: any) => {
    if (e.file.status === 'done') {
      getBase64(e.file.originFileObj, (imageUrls: any) => {
        setImageUrl(imageUrls);
      });
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        message.success(`上传成功`);
        setImageUrl(e.file.response);
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;

      message.error(`上传失败，${mass}`);
    }
  };
  const onResetClick = () => {
    setImageUrl(undefined);
  };
  return (
    <div className={styles.uploadStyles}>
      {imageUrl ? (
        <div style={{ marginRight: 16 }}>
          <Image width={110} height={130} src={imageUrl} />
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
          <ImgCrop rotate aspect={0.8}>
            <Upload
              showUploadList={false}
              name={imagename}
              action={upurl}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              accept={accept}
              data={data}
            >
              <Button type="primary">上传</Button>
            </Upload>
          </ImgCrop>
          <Button style={{ marginTop: 8 }} onClick={onResetClick}>
            重置
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
