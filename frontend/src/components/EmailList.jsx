import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

const EmailList = () => {
    const [emails, setEmails] = useState([]);
    const [checked, setChecked] = React.useState([0]);

    useEffect(() => {
        fetch('http://localhost:3001/emails')
            .then((response) => response.json())
            .then((data) => setEmails(data));
    }, []);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    };

    const handleSelectAll = () => {
        const allChecked = emails.map((email, index) => index);
        setChecked(allChecked);
    };

    const handleDeselectAll = () => {
        setChecked([]);
    };

    return (
        <>
            <div>
                <Button onClick={handleSelectAll} variant="contained" color="primary">
                    Select All
                </Button>
                <Button onClick={handleDeselectAll} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
                    Deselect All
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {emails.map((email, index) => {
                        const labelId = `checkbox-list-label-${index}`;

                        return (
                            <ListItem
                                key={index}
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(index)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(index) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={email.headers.from} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        </>
    );
};

export default EmailList;
