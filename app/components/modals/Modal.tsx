'use client'; //If we use useState in our app components we need to define use client.

import { useState, useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal:React.FC<ModalProps>= ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel
}) => {
    const [showModal, setShowModal] = useState(isOpen); 

    useEffect(() => {
        setShowModal(isOpen); //Assigning the value of isOpen prop to showModal
    },[isOpen]); //Is open is a dependency

    const handleClose = useCallback(() => {//Adding delay of onclose to not break our animations
        if (disabled){
            return;
        }
        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300); //Delay the onClose()
    }, [disabled, onClose]);

    const handleSubmit = useCallback(() => {
        if(disabled){
            return;
        }
        onSubmit();
    },[disabled, onSubmit]);

    const handleSecondaryAction = useCallback(() => {
        if(disabled || !secondaryAction){
            return;
        }
        secondaryAction();
    },[disabled, secondaryAction]);

    if(!isOpen){
        return null;
    }

    return (  
        <> 
        {/* //empty fragment because not all of them will have the same parent */}
        <div
            className="
             justify-center
             items-center
             flex
             overflow-x-hidden
             overflow-y-auto
             fixed 
             inset-0
             z-50
             outline-none
             focus:outline-none
             bg-neutral-800/70
            "
        >
            <div 
                className="
                relative
                w-full
                md:w-4/6
                lg:w-3/6
                xl:w-2/5
                my-6
                mx-auto
                h-full
                lg:h-auto
                md:h-auto
                "
            >
                {/* CONTENT */}
                <div 
                className={`
                    translate
                    duration-300
                    h-full
                    ${showModal ? 'translate-y-0' : 'translate-y-full'}
                    ${showModal ? 'opacity-100' : 'opacity-0'}
                `}>
                    <div
                    className="
                        translate
                        h-full
                        lg:h-auto
                        md:h-auto
                        border-0
                        rounded-lg
                        shadow-lg
                        relative
                        flex
                        flex-col
                        w-full
                        bg-white
                        outline-none
                        focus:outline-none
                    "
                    >
                        {/* Header */}
                        <div
                            className="
                            flex
                            items-center
                            p-6
                            rounded-t
                            justify-center
                            relative
                            boreder-b-[1px]
                            "
                        >
                            <button
                            onClick={handleClose}
                            className="
                            p-1
                            border-0
                            hover:opacity-70
                            transition
                            absolute
                            left-9
                            "
                            >
                                <IoMdClose size={18}/>
                            </button>

                            <div className="text-lg font-semibold">
                                {title}
                            </div>
                        </div>
                        {/* Body */}
                        <div className="relative p-6 flex-auto">
                            {body}
                        </div>
                        {/* Footer */}
                        <div className="flex flex-col gap-2 p-6">
                            <div
                            className="
                            flex
                            flex-row
                            items-center
                            gap-4
                            w-full
                            "
                            >
                                {secondaryAction && secondaryActionLabel && (
                                    <Button 
                                        outline
                                        disabled={disabled}
                                        label={secondaryActionLabel}
                                        onClick={handleSecondaryAction}
                                    />
                                )}
                                <Button 
                                    disabled={disabled}
                                    label={actionLabel}
                                    onClick={handleSubmit}
                                />
                            </div>
                            {footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}
 
export default Modal;