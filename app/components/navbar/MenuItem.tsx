'use client';

interface MenuItemProps{
    onClick: () => void;
    label: string;

}

const MenuItem: React.FC<MenuItemProps> = ({
    //Props
    onClick,
    label    
}) =>{

    return (
        <div 
        onClick={onClick}
        className="
            px-4
            py-3
            hover:bg-neutral-100
            transition
            cursor-pointer
        "
        >
            {label}
        </div>

    );
}

export default MenuItem;