import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

const EmailList = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/emails')
            .then((response) => response.json())
            .then((data) => setEmails(data));
    }, []);

    return (
        <Container>
            <h2>Emails</h2>
            <ListGroup>
                {emails.map((email, index) => (
                <ListGroup.Item key={index}>
                    <h3>{email.headers.from}</h3>
                </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default EmailList;
