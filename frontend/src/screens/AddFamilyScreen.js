import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { useState } from 'react';
import { Store } from '../Store'
import { toast } from 'react-toastify';
import { getError } from '../utils';

const AddFamilyScreen = () => {

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {userInfo} = state

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await Axios.post('/api/family/familyMember', {
                name,
                phone,
                email,
                relationship,
                gender,
                age
            })
            toast.success("Family member added.")
        } catch (err) {
            toast.error(getError(err))
        }
    }
    
    const [selectedGender, setSelectedGender] = useState('');

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    return (
        
            <Container className="small-container">
                <Helmet>
                    <title>Sign Up</title>
                </Helmet>
                <h1 className="my-3">Sign Up</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="tel" required onChange={(e) => setPhone(e.target.value)}/>
                    </Form.Group>                    
                    <Form.Group className="mb-3" controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setAge(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedGender}
                            onChange={handleGenderChange}
                            >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            </Form.Control>
                        </Form.Group>
                    <Form.Group className="mb-3" controlId="relationship">
                        <Form.Label>Relationship</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setRelationship(e.target.value)}/>
                    </Form.Group>

                    <div className="mb-3">
                        <Button type="submit">Add Family Member</Button>
                    </div>
                </Form>
            </Container>

    )
}

export default AddFamilyScreen
