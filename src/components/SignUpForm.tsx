import type {FC} from 'react';
import {Form, Input, Modal} from 'antd';

import {useAuth} from '../providers/auth';
import {RestError} from '../rest';

type SignUpProps = {
  open: boolean;
  onCancel: () => void;
};
export const SignUpForm: FC<SignUpProps> = ({open, onCancel}) => {
  const {signUp} = useAuth();

  type SignUpForm = {
    [key in 'firstName' | 'lastName' | 'email' | 'password']: string;
  };

  const [form] = Form.useForm<SignUpForm>();

  return (
    <Modal
      title='Sign Up'
      okText='Sign Up'
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(values => {
          signUp(values)
            .then(() => {
              onCancel();
            })
            .catch(err => {
              if (err instanceof RestError) {
                  if (err.res.type === 'validation_error') {
                    form.setFields(err.res.issues);
                  } else {
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
                  }
                
              }
            });
        });
      }}
    >
      <Form layout='vertical' form={form} name='signup'>
        <div
          style={{
            display: 'flex',
            justifySelf: 'stretch',
            gap: '1em',
          }}
        >
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[{required: true, type: 'string', max: 80}]}
            style={{width: '100%'}}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{required: true, type: 'string', max: 80}]}
            style={{width: '100%'}}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          name='email'
          label='Email'
          rules={[{required: true, type: 'email', max: 254}]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='password'
          label='Password'
          rules={[{required: true, min: 5}]}
        >
          <Input type='password' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
