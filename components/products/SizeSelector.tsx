import { PropsWithChildren  } from 'react';
import { Box, Button } from '@mui/material';
import { ISize } from '../../interfaces';



interface Props{
   selectedSize?: ISize; 
   sizes: ISize[];
   onSelectedSize: ( size: ISize ) => void;//esta se comparte con el componente que llama a éste ([slug].tsx)
}
export const SizeSelector: React.FC<PropsWithChildren<Props>> = ({ selectedSize, sizes, onSelectedSize }) => {//la función a compartir debe estar en la interface y aquí
    return (
    <Box>
        {
            sizes.map( size => (
                <Button 
                    key= { size }
                    size= 'small'
                    color= { selectedSize === size ? 'primary':'info' }
                    onClick= {() => onSelectedSize( size ) }
                >
                    { size }
                </Button>
            ))
        }
    </Box>
  )
}
