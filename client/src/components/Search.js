import './Search.css';
import {useNavigate} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function Search() {
    const [project, setProject] = useState('');
    let navigate = useNavigate();

    function handleSubmit() {
        if (project != '')
            navigate('/editor/' + project);
    }

    return (
    <Form className='search-box'>
        <Form.Group>
          <Form.Control
            className='search'
            autoFocus
            type='text'
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </Form.Group>
        <Button className='search-button' onClick={() => handleSubmit()}>Search</Button>
    </Form> );
}

export default Search;