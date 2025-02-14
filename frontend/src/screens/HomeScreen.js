import { Link } from 'react-router-dom';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
//import logger from 'use-reducer-logger';
//import data from '../data';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getUserInfo } from '../utils';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, products: action.payload, loading: false}
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}
    default:
      return state;
  }
}

const HomeScreen = () => {

  //const [{loading, error, products}, dispatch] = useReducer(logger(reducer), { 
  const [{loading, error, products}, dispatch] = useReducer(reducer, {     
    products: [], loading: true, error: ''
  })
  //const [products, setProducts] = useState([]);

  const userInfo = getUserInfo();

  function sortProductsByOrder(products) {
    return products.sort((a, b) => a.order - b.order);
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const result = await axios.get('/api/products')
        const sortedProducts = sortProductsByOrder(result.data.slice());
        dispatch({type: 'FETCH_SUCCESS', payload: sortedProducts})
      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: err.message })
      }
      
      //setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
        <Helmet><title>Divine Grace!</title></Helmet>
        <h1>Retreats</h1>
          <div className="products">
          { loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
                <Row>
                  {
                    products.map(product => (
                      <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                        <Product product={product}></Product>
                      </Col>
                    ))
                  }
                </Row>

          )
          }
          </div>
    </div>
  )
}

export default HomeScreen
