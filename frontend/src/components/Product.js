import React from 'react'
import axios from 'axios';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Rating from './Rating'
import { Store } from '../Store';
import { getUserInfo } from '../utils';

const Product = (props) => {
    const { product } = props;

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems }
    } = state;

    const addToCartHandler = async (item)=> {

        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        const { data } = await axios.get(`/api/products/${item._id}`);

        if (data.countInStock < quantity){
            window.alert('Sorry, product is out of stock');
            return;
        }

        ctxDispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
    };

    const userInfo = getUserInfo();
console.log(userInfo)
    return (
        <Card key={product.slug}>

{userInfo && userInfo !== null ? (
                    <Link to={`/product/${product.slug}`}>
                    
                        <img src={product.image} className="card-img-top" alt={product.name} />
                    </Link>
                    ) : (
                        <Link to={`/signin`}>
                        <img src={product.image} className="card-img-top" alt={product.name} />
                    </Link>
                    )}
            <Card.Body>
            {userInfo && userInfo !== null ? (
                    <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                    </Link>
                    ) : (
                    <Link to={`/signin`}>
                    <Card.Title>{product.name}</Card.Title>
                    </Link>
                    )}
    {/*            <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>${product.price}</Card.Text>
                {product.countInStock === 0
                    ? <Button variant='light' disabled>Out of Stock</Button>
                    : <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
                }
            */}
            </Card.Body>
        </Card>
    )
}

export default Product
