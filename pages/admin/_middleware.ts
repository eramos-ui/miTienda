import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwt } from '../../utils';


export async function middleware( req: NextRequest | any, ev: NextFetchEvent ) {
    
    const { origin } = req.nextUrl;
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if ( !session ) {
        const requestedPage = req.page.name;
        return NextResponse.redirect(`${ origin }/auth/login?p=${ requestedPage} `);
    }
    
    const validRoles = ['admin','super-user','SEO'];
    if ( !validRoles.includes( session.user.role ) ) {
        return NextResponse.redirect('/');
    }
    return NextResponse.next();



}
