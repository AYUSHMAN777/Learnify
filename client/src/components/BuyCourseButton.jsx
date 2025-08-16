import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession,{ data,isSuccess,isLoading, isError,error}]=useCreateCheckoutSessionMutation();

useEffect(()=>{
  if(isSuccess){
    if(data?.url){
      window.location.href=data.url;  //redirect to stripe checkout url
    }
    else{
      toast.error("Invalid response from server");
    }
  }
  if(isError){
    toast.error(error?.data?.message || "Failed to create checkout session");
  }

},[data, isSuccess, isLoading, isError, error]);

  const purchaseCourseHandler= async () => {
    await createCheckoutSession({ courseId });
  }
  return (
    <Button disabled={isLoading} className="bg-blue-600 text-white w-full hover:bg-blue-700" onClick={purchaseCourseHandler}>
      {isLoading ? 
      <>
      <Loader2 className="animate-spin mr-2 h-4 w-4"/>
      Please Wait
      </>
      : "Purchase Course"}
    </Button>
  )
}

export default BuyCourseButton