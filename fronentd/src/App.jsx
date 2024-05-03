import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Products from './components/Products'
import PaymentDynamic from './components/PaymentDynamic'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CustomForm } from './components/CustomForm'
import PaymentForm from './components/PaymentForm'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'



const stripePromise = loadStripe('pk_test_51ORpDXSJivXBSgor7CxOo2rbwC8nhsIfwqxlxb76hPtuTzY4z2we4yK30AnBGsFbalURavuyqsk8obBmYRd7ZA8d00UPnsjnGY')
function App() {

  const navigate = useNavigate()
  const token = localStorage.getItem('token') ? true : false;
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])
  return (

    <Elements stripe={stripePromise}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<CustomForm />} />
        <Route path='/checkout' element={<Products />} />
        <Route path='/payment-form' element={<PaymentForm />} />
      </Routes>
      {/* <PaymentDynamic /> */}
      {/* <Products /> */}
      {/* <PaymentForm /> */}
    </Elements>

  )
}

export default App
