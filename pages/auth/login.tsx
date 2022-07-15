import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { signIn, getSession, getProviders } from 'next-auth/react';

import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from "react-hook-form";

import { AuthLayout } from "../../components/layouts";
import { validations } from '../../utils';
//import { tesloApi } from '../../api';
//import { AuthContext } from '../../context';
import { useRouter } from 'next/router';


type FormData = {
    email: string;
    password: string;    
  };

const LoginPage = () => {
  const router= useRouter();
  //const { loginUser } = useContext( AuthContext );
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [ showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});//el tipo es grande
  useEffect(() => {
    getProviders().then( prov =>{
        //console.log({prov});  
        setProviders( prov );
    })
  }, [])
  
  //console.log({errors});
  const onLoginUser = async ( { email, password }: FormData ) => { //data: FormData 
    //const { email, password }= data;
    setShowError( false );

    /* retirado para usar next-auth
    const isValidLogin = await loginUser( email, password );
    if ( !isValidLogin){
        setShowError( true );
        setTimeout( () => setShowError( false ), 3000 ); //se muestra 3 seg
        return;
    };
    const destination = router.query.p?.toString() || '/';//puede venir con parameters, csao de SiderMenu al presionar botón Ingresar
    router.replace(destination);
*/
    /*Esto fué antes de crear el AuthContext
    try {
       const { data }=await tesloApi.post('/user/login', { email, password });
       const { token, user }= data;
       console.log(token, user)
    }catch (error){
        console.log('Error en las credenciales', error);
        setShowError( true );
        setTimeout( () => setShowError( false ), 3000 ); //se muestra 3 seg
    } 
    */   
   await signIn('credentials', { email, password });
  };
  return (
     <AuthLayout title={'Ingresar'}>
        {/* el noValidate es para que no valide Chrome, nosotros lo haremos */}
        <form onSubmit={ handleSubmit ( onLoginUser) } noValidate >
            <Box sx={{ width: 350, padding: '10px 20px' }} >
                <Grid container spacing= {2} >
                    <Grid item xs={ 12 }>
                        <Typography variant='h1' component='h1' >Iniciar sesión</Typography>
                        <Chip
                            label='No se reconoce a ese usuario/contraseña'
                            color= 'error'
                            icon = { <ErrorOutline />} 
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none'}}
                         />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField 
                            type ='email'
                            label='Correo' 
                            variant='filled'                             
                            fullWidth 
                            { ...register('email', { //establece la relación del campo con el form
                             //required: true
                             required: 'Este campo es requerido',
                             validate: validations.isEmail//equivale a (val) => validations.isEmail(val)
                          })}
                          error= { !!errors.email }
                          helperText ={ errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField 
                            label='Contraseña' 
                            type='password' variant='filled'  
                            fullWidth 
                            { ...register('password',{ 
                                required: 'Este campo es requerido',
                                minLength: {value:6 , message: 'Mínimo 6 caracteres'}
                            } ) }
                            error= { !!errors.password }
                            helperText ={ errors.password?.message}
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <Button 
                            type='submit'
                            color='secondary' 
                            className='circular-btn' 
                            size='large' 
                            fullWidth                             
                            disabled={showError}
                        >
                            Ingresar
                        </Button>
                    </Grid>
                    <Grid item xs={ 12 }  display= 'flex' justifyContent='end' >
                        <NextLink href={ router.query.p ? `/auth/register?p=${ router.query.p }`: '/auth/register' }
                            passHref
                        >
                            <Link underline='always' >
                                Crear cuenta
                            </Link>
                        </NextLink>
                    </Grid>  
                    <Grid item xs={ 12 }  display= 'flex' flexDirection='column' justifyContent='end' >
                        <Divider sx={{ width: '100%', mb:2 }} />                      
                        {
                            Object.values( providers ).map (( provider: any) => {//convierte objeto en array
                               if ( provider.id === 'credentials' ) return (<div key='credentials'></div>);// para que no renderice el propio
                               return (
                                <Button
                                    key= { provider.id }
                                    variant = 'outlined'
                                    fullWidth
                                    color= 'primary'
                                    sx={{ mb: 1}}
                                    onClick={ () => signIn( provider.id )  }
                                >
                                    { provider. name }
                                </Button>
                               )
                            })
                        }
                    </Grid>                  
                </Grid>
            </Box>
        </form>
     </AuthLayout>
  )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//verifica al usuario del lado del server
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session= await  getSession( { req } );
    const  { p = '/' } = query;
    if ( session ) {// si tiene una sessión lo sacamos de aquí
       return {
        redirect: {
           destination:  p.toString() ,//para que no lo vea como []
           permanent: false
        }
       }
    }

    return {
        props: { }
    }
}
export default LoginPage