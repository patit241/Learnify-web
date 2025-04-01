import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Controller } from 'react-hook-form'

function FormInput({ formControls = [], register ,control}) {

    const renderComponentByType = (getItem) => {
        let element = null
        switch (getItem.componentType) {
            case 'input':
                element = (
                    <Input
                        id={getItem.name}
                        name={getItem.name}
                        placeholder={getItem.placeholder}
                        type={getItem.type}
                        {...register(getItem.name)}
                    />
                );
                break;
                case 'select':
                    element = (
                      <Controller
                        name={getItem.name}
                        control={control}  // Make sure you get 'control' from useForm
                        defaultValue=""
                        render={({ field: { onChange, value, ref } }) => (
                          <Select
                            id={getItem.name}
                            name={getItem.name}
                            placeholder={getItem.placeholder}
                            value={value}
                            onValueChange={onChange}
                            ref={ref}  // Pass ref if your component supports it
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={getItem.label} />
                            </SelectTrigger>
                            <SelectContent>
                              {getItem.options && getItem.options.length > 0
                                ? getItem.options.map(option => (
                                    <SelectItem key={option.id} value={option.id}>
                                      {option.label}
                                    </SelectItem>
                                  ))
                                : null}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    );
                    break;
            case 'textarea':
                element = (
                    <Textarea
                        id={getItem.name}
                        name={getItem.name}
                        placeholder={getItem.placeholder}
                        {...register(getItem.name)}
                    />
                );
                break;
            default:
                element = (
                    <Input
                        id={getItem.name}
                        name={getItem.name}
                        placeholder={getItem.placeholder}
                        type={getItem.type}
                        {...register(getItem.name)}
                    />
                );
                break;
        }
        return element;
    }
    return (
        <div className='flex flex-col gap-3' >
            {
                formControls.map(el =>
                    <div key={el.name}>
                        <Label htmlFor={el.name}  >{el.label}</Label>
                        {
                            renderComponentByType(el)
                        }
                    </div>)
            }
        </div>
    )
}

export default FormInput