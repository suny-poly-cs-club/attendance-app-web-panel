import {FC} from 'react';
import {Form, Input, Modal} from 'antd';

import {useAuth} from '../providers/auth';

type LogInProps = {
  open: boolean;
  onCancel: () => void;
};

export const LoginForm: FC<LogInProps> = ({open, onCancel}) => {
  const {login} = useAuth();
  const [form] = Form.useForm<{[key in 'email' | 'password']: string}>();

  return (
    <Modal
      title="Log In"
      okText="Log In"
      cancelText="Cancel"
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(values => {
          const {email, password} = values;

          login(email, password)
            .then(() => {
              onCancel();
            })
            .catch(err => {
              form.setFields([
                {
                  name: 'email',
                  errors: [err.message],
                },
                {
                  name: 'password',
                  errors: [err.message],
                },
              ]);
            });
        });
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name="login"
        onKeyDown={event => {
          if (event.key === 'Enter') {
            // TODO: wht does this not submit the form?
            form.submit();
          }
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{required: true, type: 'email'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{required: true}]}>
          <Input type="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
