import axios from 'axios'
import React,  { useReducer, useEffect, useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Rating from '../components/Rating'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils'
import { Store } from '../Store'
import { getUserInfo } from '../utils'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import {Table} from 'react-bootstrap'

const reducer = (state, action) => {
    switch(action.type) {
      case 'FETCH_REQUEST':
        return {...state, loading: true};
      case 'FETCH_SUCCESS':
        return {...state, product: action.payload, loading: false}
      case 'FETCH_FAIL':
        return {...state, loading: false, error: action.payload}
      default:
        return state;
    }
}

const ProductScreen = () => {

    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState([])

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [age, setAge] = useState('');
    const [familyMembers, setFamilyMembers] = useState([]);
const [formSubmitted, setFormSubmitted] = useState(false);
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/family/familyMember', {
                retreatRegistrationId: isAlreadyRegistered[0]._id,
                name,
                phone,
                email,
                relationship,
                gender: selectedGender,
                age
              });
              setFormSubmitted(true);
            toast.success("Family member added.")
        } catch (err) {
            toast.error(getError(err))
        }
    }

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    const [{loading, error, product}, dispatch] = useReducer(reducer, {     
        product: [], loading: true, error: ''
    })
    const userInfo = getUserInfo();
    useEffect(() => {
        const fetchData = async () => {
        dispatch({type: 'FETCH_REQUEST'})
        try {
            const result = await axios.get(`/api/products/slug/${slug}`)
            const { data } = await axios.get(`/api/retreat/retreatRegistration?userID=${userInfo._id}&retreatID=${result.data._id}`);
            setIsAlreadyRegistered(data);
            console.log(data);
            dispatch({type: 'FETCH_SUCCESS', payload: result.data})
        } catch (err) {
            dispatch({type: 'FETCH_FAIL', payload: getError(err) })
        }
        
        };
        fetchData();

    }, [slug]);

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { cart } = state;
    
    const RegisterMe = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/retreat/retreatRegistration', {
                userId: userInfo._id,
                product: product._id
            })
            toast.success("Registered Successfully")
            window.location.reload();
        } catch (err) {
            toast.error(getError(err))
        }
    }

    const addToCartHandler = async () => {

        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countInStock < quantity){
            window.alert('Sorry, product is out of stock');
            return;
        }

        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}});
        navigate('/cart')
    }

    useEffect(() => {
        const getFamilyMembers = async () => {
            try{
                const { data } = await axios.get(`/api/family/familyMember/${isAlreadyRegistered[0]._id}`);
                setFamilyMembers(data);
            } catch (err) {
                toast.error(getError(err))
            }
        }
        if(isAlreadyRegistered.length > 0){
            getFamilyMembers()
        }
    },[isAlreadyRegistered, formSubmitted] )

    return (
        loading ? (
            <LoadingBox />
          ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            )
        : ( 
            <div> 
                {isAlreadyRegistered.length > 0 ? (
                    <Row>
                    <Col lg={12}>
                        <div>
                            <p>You are registered for the Miami Residential Retreat. Add a family member below.</p>
                        </div>
                        {/*<Link to="addFamilyMember"> Add Family Member</Link>*/}
                        
                        <div className="container mt-4">
      <h2 className="mb-4">Below are the Registered Members for the {product.name} </h2>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Relationship</th>
              <th>Phone</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.age}</td>
                <td>{member.relationship}</td>
                <td>{member.phone}</td>
                <td>{member.gender}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>

                        <Form onSubmit={submitHandler}>
                        <Row>
                        <Form.Group className="mb-3 col-lg-6" controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" required onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="tel" required onChange={(e) => setPhone(e.target.value)}/>
                        </Form.Group>                    
                        <Form.Group className="mb-3 col-lg-6" controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control type="text" required onChange={(e) => setAge(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="gender">
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
                        <Form.Group className="mb-3 col-lg-6" controlId="relationship">
                            <Form.Label>Relationship</Form.Label>
                            <Form.Control type="text" required onChange={(e) => setRelationship(e.target.value)}/>
                        </Form.Group>
    
                        <div className="mb-3 col-lg-12">
                            <Button type="submit">Add Family Member</Button>
                        </div>
                        </Row>
                   </Form>
                   </Col>
                   </Row>
    
                ) : (

                    <Row>

                
                    <Col md={6}><img width={200} height={200} className="img-small" src={ product.image } alt= { product.name }></img></Col>
                     <Col md={6}>
                         <ListGroup variant="flush">
                             <ListGroup.Item>
                                 <Helmet>
                                     <title>{ product.name }</title>
                                 </Helmet>
                             </ListGroup.Item>
                         </ListGroup>
                         <Card>
                         <Card.Body>
                         <ListGroup variant="flush">
 
                             <ListGroup.Item> <p> { product.description } </p> </ListGroup.Item>
                             </ListGroup>
                             </Card.Body>
                         </Card>
                     </Col>
                     <Button onClick={RegisterMe}>Register Me</Button>
                 </Row>

                )}

            </div>
        )
    )
}

export default ProductScreen
