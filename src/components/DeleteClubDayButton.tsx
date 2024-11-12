import Button from 'antd/es/button';
import Popconfirm from 'antd/es/popconfirm';
import {type FC, useCallback} from 'react';
import {useRest} from '../providers/auth';
import type {Club, ClubDay} from '../rest';

type Props = {
  club: Club;
  clubDay: ClubDay;
  rerender: () => void;
};

const DeleteClubDayButton: FC<Props> = ({club, clubDay, rerender}) => {
  const rest = useRest();

  // TODO: how do I make this rerender the page?

  const confirmDelete = useCallback(async () => {
    await rest.deleteClubDay(club.id, clubDay.id).catch(console.error);
    rerender();
  }, [clubDay, rest, rerender, club]);

  return (
    <Popconfirm
      title='Delete Club Day'
      description='Are you sure you want to delete this club day?'
      onConfirm={confirmDelete}
    >
      <Button danger>Delete</Button>
    </Popconfirm>
  );
};

export default DeleteClubDayButton;
