
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credential from  "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbUsers } from "../../../database";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [//pueden haber varios providers, incluido el nuestro...el orden es como salen en pantalla    
    Credential({
       name: 'Custom Login',
       credentials: {
          email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com'},
          password: { label: 'Contraseña:' , type: 'password', placeholder: 'Contraseña' }

       },
       async authorize(credentials) {
        //console.log(credentials);
        // return { name: 'Juan', correo: 'jj@gamil.con, 'role: 'admin'}
        return await  dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
        //return null;
       }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    })
  ],
  //Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'

  },
  session: {//duración de la sesión
    maxAge:  2592999, //30 días
    strategy: 'jwt',
    updateAge: 86400 // cada día
  },
  //callbacks: cómo se firma, la data que se graba en los toke, la info de la sesiónn, crear al usuario en la BD
  // los callback se van pasando los datos s/orden en que aparecen
  callbacks: {//nuestra autenticación es con el type='credentials' las next-auth son 'oauth'
    async jwt( { token, account, user}) {//utiliza el jwt de next-auth
      //console.log('en NextAuth:',{ token, account, user});
      if ( account ){
        token.accessToken = account.access_token;
        switch ( account. type ){
          case 'oauth':
            //crear o verificar usuario en la BD
            await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
            break;
          case 'credentials'://nuestra auth
            token.user= user;
            break;
        }
      }
      return  token;
    } ,
    async session( { session, token, user }) {
      // console.log({ token, session, user})  
      session.accessToken= token.accessToken;
      session.user = token.user as any;
      return session;
    }
  }
});