import { type NextRequest } from 'next/server';
import { lettaMiddleware } from '@letta-ai/letta-nextjs/server';
import {LETTA_API_KEY, LETTA_BASE_URL} from "@/environment";


export function middleware(request: NextRequest) {
    const response = lettaMiddleware(request, {
        apiKey: LETTA_API_KEY,
        baseUrl: LETTA_BASE_URL,
    });

    if (response) {
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
