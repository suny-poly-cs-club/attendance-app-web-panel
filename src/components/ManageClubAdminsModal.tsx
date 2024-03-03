import {FC, useEffect, useState} from 'react';
import {AuthUser, useRest} from '../providers/auth';
import {Button, Modal} from 'antd';
import styles from '../pages/ClubDays.module.css';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export const AddClubAdminsModal: FC<Props> = ({ open, setOpen}) => {
    const rest = useRest();

    const [admins, setAdmins] = useState<AuthUser[]>([]);

    useEffect(() => {
        if (!open) {
            return;
        }
        
        //(in rest) get the user list here. but dont becaus they have to search
        //rest.getAttendees(clubDay.id).then(a => setAttendees(a));
        }, [ open]);

  function updateList(input: string) {
      rest.searchUsers(input).then(users => setAdmins(users));
  }
  

    return (
        <>
        <Modal
            open={open}
            footer={[
            //attendees.length > 0 && (
            //    
            //    ),

            <Button
                type="primary"
                onClick={() => setOpen(false)}
                key="close_button"
                >
                Close
            </Button>,
            ]}
            onCancel={() => setOpen(false)}
            >
            <div>
                {/*search bar here*/}
                <input placeholder={"Search"} onChange={(event)=>{updateList(event.target.value);}}/>
                {admins.length ? (
                    admins.map((a, i) => (
                        <p key={i} className={styles.clubAdminUserList}>
                            {a.firstName} {a.lastName}
                            <Button  onClick={() =>{}}> Add </Button>
                        </p>
                        //add button here
                        ))
                        ) : (
                            <p>No Users Found</p>
                            )}
            </div>
        </Modal>
        </>
        );
};

export const RemoveClubAdminsModal: FC<Props> = ({ open, setOpen}) => {
    const rest = useRest();

    const [admins, setAdmins] = useState<AuthUser[]>([]);

    useEffect(() => {
        if (!open) {
            return;
        }

        //(in rest) get the admins list here
        rest.getClubAdmins().then(a => setAdmins(a));
    }, [ open]);

    return (
        <>
        <Modal
            open={open}
            footer={[
            //attendees.length > 0 && (
                //    
                //    ),

                <Button
                    type="primary"
                    onClick={() => setOpen(false)}
                    key="close_button"
                    >
                    Close
                </Button>,
                ]}
            onCancel={() => setOpen(false)}
            >
            <div>
                <br></br>
                <div className={styles.clubAdminUserList}>
                    <h3>Name</h3>
                    <h3>Actions</h3>
                </div>
                {admins.length ? (
                    admins.map((a, i) => (
                        <p key={i} className={styles.clubAdminUserList}>
                            {a.firstName} {a.lastName}
                            <Button danger onClick={() =>{}}> Remove </Button>
                        </p>
                        //remove button here
                        
                        ))
                        ) : (
                            <p>No one is admin of this club</p>
                            )}
            </div>
        </Modal>
        </>
        );
};
