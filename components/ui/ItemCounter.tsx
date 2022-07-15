import { PropsWithChildren, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props{
  //children?: React.ReactNode | undefined ;  
  currentValue: number;
  maxValue: number;
  updatedQuantity: ( newValue: number) => void;
 }

export const ItemCounter: React.FC<PropsWithChildren<Props>> = ({ currentValue, maxValue, updatedQuantity }) => {
  //const [quantity, setQuantity] = useState(1);
  const addOrRemove = ( value: number ) => {//no se usó el vlaue
     if ( value === -1 ) {
       if ( currentValue === 1 ) return; //no puede llegar a 0
         return updatedQuantity( currentValue - 1);
     }
     if ( currentValue >= maxValue) return updatedQuantity( maxValue );
     updatedQuantity( currentValue + 1 );

}
  return (
    <Box display= 'flex' alignItems='center' >
        <IconButton onClick={ () => addOrRemove( -1 )}>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}> { currentValue } </Typography>
        <IconButton onClick={ () => addOrRemove( 1 )}>
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
