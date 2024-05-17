'use client';

import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";
import {BiDollar} from "react-icons/bi";


interface InputProps{
    id: string;
    label: string;
    type?: string;
    disabled?: boolean; //Optional boolean prop
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>, //This is a field for the react hook form
    errors: FieldErrors; 
}

const Input:React.FC<InputProps> = ({
    id,
    label,
    type = 'text',
    disabled,
    formatPrice,
    required,
    register,
    errors
}) => {
    return ( 
        <div className="w-full relative">
            {formatPrice && (
                <BiDollar 
                    size={24}
                    className="
                        text-neutral-700
                        absolute
                        top-5
                        left-2
                    "
                />
            )}
            <input 
                id={id}
                disabled={disabled}
                {...register(id, {required})} //Spread the register function and pass the id and required prop
                placeholder=" " //This is to make the placeholder visible Floating Animation
                type={type}
                className={`
                    peer
                    w-full
                    p-4
                    pt-6
                    font-light
                    bg-white
                    border-2
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not allowed
                    ${formatPrice ? 'pl-9' : 'pl-4'}
                    ${errors[id] ? 'border-rose-500'  : 'border-neutral-300'}
                    ${errors[id] ? 'focus:border-rose-500'  : 'focus:border-black'}
                `}
            />
            <label
                // Adding the label animation 
                className={`
                    absolute
                    text-md
                    duration-150
                    transform
                    -translate-y-3
                    top-5
                    z-10
                    origin-[0]
                    ${formatPrice ? 'left-9' : 'left-4'}
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75
                    peer-focus:-translate-y-4
                    ${errors[id] ? 'text-rose-500' : 'text-neutral-400'}
                    `}
            >
                {label}
            </label>
        </div>
     );
}
 
export default Input;