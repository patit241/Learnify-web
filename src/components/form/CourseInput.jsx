
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Input } from '../ui/input'


function CourseInput({formControls=[],formData,setFormData}) {
    console.log(formData)
    
    const renderComponentByType = (getItem)=>{
        let element = null
        const currentControlItemValue = formData[getItem.name] || ""
        
        switch(getItem.componentType){
            case 'input':
                element = <Input
                id= {getItem.name}
                name= {getItem.name}
                placeholder= {getItem.placeholder}
                type= {getItem.type}
                value={currentControlItemValue}
                onChange={e=>
                   setFormData({...formData,[getItem.name]:e.target.value
                })}
                />
                break;
            case 'select':
                element = 
                <Select
                onValueChange={value=>setFormData({
                    ...formData,[getItem.name]:value
                })}
                value={currentControlItemValue}>
                    <SelectTrigger className="w-full" >
                        <SelectValue placeholder={getItem.label} ></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            getItem.options && getItem.options.length >0 
                            ?getItem.options.map(option=> <SelectItem key={option.id} value={option.id} >{option.label}</SelectItem>) 
                            :null
                        }
                    </SelectContent>
                </Select>
                break;
            case 'textarea':
                element = <Textarea
                id= {getItem.name}
                name= {getItem.name}
                placeholder= {getItem.placeholder}
                value={currentControlItemValue}
                onChange={e=>
                   setFormData({...formData,[getItem.name]:e.target.value
                })}/>
                break;
                    
            default:
                element = <Input
                id= {getItem.name}
                name= {getItem.name}
                placeholder= {getItem.placeholder}
                type= {getItem.type}
                value={currentControlItemValue}
                onChange={e=>
                   setFormData({...formData,[getItem.name]:e.target.value
                })}/>
                break;
                        
        }
        return element;
    }
    

  return (
    <div className='flex flex-col gap-3' >
        {
            formControls.map(el=> 
            <div key={el.name}>
                <Label htmlFor ={el.name}  >{el.label}</Label>
                {
                    renderComponentByType(el)
                }
            </div>)
        }
    </div>
  )
}

export default CourseInput