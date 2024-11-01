import React from 'react'
import UpdateProduct from './UpdateProduct'

const productId = "rtrwt"

function Test() {
  return (
    <div>
      {productId && <UpdateProduct productId={productId}/>}
    </div>
  )
}

export default Test