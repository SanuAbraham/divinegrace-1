import axios from 'axios'
import React,  { useReducer, useEffect, useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(null)

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
            toast.success("Register Successfully")
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

    return (
        loading ? (
            <LoadingBox />
          ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            )
        : ( 
            <div> 
                <Row>
                   <Col md={6}><img className="img-small" src={ product.image } alt= { product.name }></img></Col>
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
                    {isAlreadyRegistered.length > 0 ? 
                            <Link to="addFamilyMember"> Add Family Member</Link>
                        :   <Button onClick={RegisterMe}>Register Me</Button>
                    }
                </Row>
            </div>
        )
    )
}

export default ProductScreen
