import React from 'react'
import { Button } from '../ui/button'
import FormControl from './FormInput'
import FormInput from './FormInput'
import { Loader } from 'lucide-react'

function AuthForm({ control,handleSubmit, register, submit, buttonText, formControls = [],isSubmitting}) {

    return (
        <form onSubmit={handleSubmit(submit)}>
            <FormInput formControls={formControls} register={register} control={control} />
            <Button type='Submit' className='mt-5 w-full' >
                {
                    isSubmitting ? <div className='flex'><Loader className='animate-spin' /><p>Loading...</p></div> : <p>{buttonText}</p>
                }
            </Button>
        </form>
    )
}

export default AuthForm