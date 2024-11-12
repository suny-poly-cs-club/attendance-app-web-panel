import Button from 'antd/es/button';
import Popconfirm from 'antd/es/popconfirm';
import {type FC, useCallback} from 'react';
import {useRest} from '../providers/auth';
import type {Club} from '../rest';

type ClubTableData = Club & {key: number};

type Props = {
  setClubs: (f: (clubs: ClubTableData[]) => ClubTableData[]) => void;
  club: Club;
};

const DeleteClubButton: FC<Props> = ({club, setClubs}) => {
  const rest = useRest();

  // TODO: how do I make this rerender the page?

  const confirmDelete = useCallback(async () => {
    await rest.deleteClub(club.id).catch(console.error);
    setClubs(c => c.filter(cl => cl.id !== club.id));
  }, [club, rest, setClubs]);

  return (
    <Popconfirm
      title='Delete Club'
      description='Are you sure you want to delete this club?'
      onConfirm={confirmDelete}
    >
      <Button danger>Delete</Button>
    </Popconfirm>
  );
};

export default DeleteClubButton;
