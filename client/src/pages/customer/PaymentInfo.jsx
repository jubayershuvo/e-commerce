import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentStatus from '../../components/PaymentStatus';

function PaymentInfo() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
  return (
    <PaymentStatus status={status} orderId={orderId}/>
  )
}

export default PaymentInfo