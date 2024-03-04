import {Input, Form, Modal} from 'antd';
import {FC} from 'react';

type Props = {
    open: boolean;
    onCreate: (data: CreateClubFormData) => void;
    onCancel: () => void;
    confirmLoading: boolean;
};

type CreateClubFormData = {
    name: string;
};

const CreateClubModal: FC<Props> = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
}) => {
    const [form] = Form.useForm<CreateClubFormData>();

    return (
        <Modal
            title="Create a Club"
            okText="Create"
            cancelText="Cancel"
            open={open}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            onOk={() => {
            form
          .validateFields()
          .then(values => {
              onCreate(values);
          })
          .catch(info => {
              console.log('Form validation failed:', info);
          });
        }}
            >
            <Form form={form} layout="vertical" name="create_club">
                <Form.Item
                    name="name"
                    label="Club Name"
                    rules={[
                    {
                        required: true,
                        // TODO: api request that checks if there is one going on at the entered time
                        message: 'Please enter a name',
                    },
                    {
                        async validator(_, [name]) {
                            if (name.length > 80) {
                                throw new Error('Club name must be less then 80 characters');
                            }
                        },
                    },
                    ]}
                    >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        );
};

export default CreateClubModal;