import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

const CustomPasswordInput = (props: any) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input.Password
      {...props}
      iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeTwoTone />)}
      visibilityToggle
    />
  );
};

export default CustomPasswordInput;
