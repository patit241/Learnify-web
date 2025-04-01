import { captureAndFinalizePaymentService } from '@/api/order'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import useAuthStore from '@/store/auth-store'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function PaypalPaymentReturnPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const paymentId = params.get('paymentId')
  const payerId = params.get('PayerID')
  const token = useAuthStore(state=>state.token)

  useEffect(()=>{
      if(paymentId && payerId){
          async function capturePayment() {
              const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'))

              const response = await captureAndFinalizePaymentService(
                  paymentId,payerId,orderId,token
              )

              if(response?.success){
                  sessionStorage.removeItem('currentOrderId')
                  localStorage.setItem("cartData", JSON.stringify({}));
                  window.location.href = "/student/student-courses"
              }
          }
          capturePayment()
      }
  },[payerId,paymentId])

  console.log(params)

return (
  <Card>
      <CardHeader>
          <CardTitle>
              Processing payment ... Please wait
          </CardTitle>
      </CardHeader>
  </Card>
)
}

export default PaypalPaymentReturnPage