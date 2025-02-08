// import { handlers } from '@/auth';

import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

// export const { GET, POST } = handlers;
export async function GET(request: Request) {
     
            return NextResponse.json({ message: 'No session found' }, { status: 401 });
 
}
export async function POST(request: Request) {
     
    return NextResponse.json({ message: 'No session found' }, { status: 401 });

}