import {DatePicker, Form, Modal} from 'antd';
import type {Dayjs} from 'dayjs';
import type {FC} from 'react';

type Props = {
  open: boolean;
  onCreate: (data: CreateClubDayFormData) => void;
  onCancel: () => void;
  confirmLoading: boolean;
};

type CreateClubDayFormData = {
  range: [Dayjs, Dayjs];
};

const CreateClubDayModal: FC<Props> = ({
  open,
  onCreate,
  onCancel,
  confirmLoading,
}) => {
  const [form] = Form.useForm<CreateClubDayFormData>();

  return (
    <Modal
      title='Create a Club Day'
      okText='Create'
      cancelText='Cancel'
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
      <Form form={form} layout='vertical' name='create_club_day'>
        <Form.Item
          name='range'
          label='Start and End Times'
          rules={[
            {
              required: true,
              // TODO: api request that checks if there is one going on at the entered time
              message: 'Please select a start and end time',
            },
            {
              async validator(_, [_start, end]) {
                if (end.$d.getTime() <= Date.now()) {
                  throw new Error('Clubs cannot be created in the past');
                }
              },
            },
          ]}
        >
          <DatePicker.RangePicker
            format='M/D/YYYY, h:mm A'
            showTime={{use12Hours: true, format: 'h:mm A', minuteStep: 5}}
            use12Hours={true}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClubDayModal;
