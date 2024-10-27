/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = {
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register user
         * @description To sign up new user. User will need to verify their email through OTP before they can login. [Learn more](#tag/Auth/operation/sendUserEmailVerification)
         */
        post: operations["registerUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login
         * @description To login user. This endpoint is required to get the access token for accessing resources. [Learn more to refresh token](#)
         */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Logout
         * @description To logout user. This endpoint is required to revoke accessing resources from their device. [Learn more to logout from all devices](#)
         *     > **Refresh token** should be passed in Authorization header.
         */
        delete: operations["logout"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Refresh access token
         * @description To refresh access token when expired. This endpoint allows user to use the app without having to login again when access token expired.
         *     > 💡 Refresh token as `Bearer token` is required in Authorization header for other devices. For browsers, refresh token will be passed in cookie.
         */
        get: operations["getAccessToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get me (logged in)
         * @description To get the currently logged in user data.
         */
        get: operations["getMe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        "register-user.dto": {
            /**
             * Format: full name
             * @description User's full name for their profile.
             * @example John watson
             */
            fullName?: string;
            /**
             * Format: email
             * @description A valid email address.
             * @example john@gmail.com
             */
            email: string;
            /**
             * Format: strong
             * @description A strong password.
             * @example ZOsU%KkwY{s#bIm)
             */
            password: string;
        };
        "register-user.response": {
            /** @example Success */
            message?: string;
        };
        "email-password.dto": {
            /**
             * Format: email
             * @description A valid email address.
             * @example john@gmail.com
             */
            email: string;
            /**
             * Format: strong
             * @description A strong password
             * @example password@123
             */
            password: string;
        };
        /**
         * Format: mongo-objectid
         * @example 507f1f77bcf86cd799439011
         */
        "object-id": string;
        "user.response": {
            id: components["schemas"]["object-id"];
            /** @example John watson */
            fullName?: string;
            /** @example john@gmail.com */
            email: string;
            /** @example 1714595395449 */
            createdAt: number;
            /** @example 1714595411370 */
            updatedAt: number;
        };
        "token.response": {
            /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTcxN2ZjM2VjNGY5ZWVhN2IwNTBkMTMiLCJlbWFpbCI6Imtpc2hvcmJoYW5kYXJpNjA4QGdtYWlsLmNvbSIsImlhdCI6MTcwMTkzNzEyMCwiZXhwIjoxNzAxOTQwNzIwfQ.qDscgauyJQz5L_8m6V67CJvORFWBAPL-jQcC5u-a9CM */
            accessToken?: string;
            /** @example 2023-12-07T09:18:40.322Z */
            accessTokenExpiry?: string;
            /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTcxN2ZjM2VjNGY5ZWVhN2IwNTBkMTMiLCJlbWFpbCI6Imtpc2hvcmJoYW5kYXJpNjA4QGdtYWlsLmNvbSIsImlhdCI6MTcwMTkzNzEyMCwiZXhwIjoxNzAyMDIzNTIwfQ.Vsfe2ZanYWz6sVCPsBGm_GxJLoEGS_UWXl7GtBXZqkY */
            refreshToken?: string;
            /** @example 2023-12-08T08:18:40.322Z */
            refreshTokenExpiry?: string;
            user?: components["schemas"]["user.response"];
        };
    };
    responses: {
        /** @description Unauthorized */
        unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @example 401 */
                    statusCode?: number;
                    /** @example UnauthorizedException */
                    reason?: string;
                    /** @example Unauthorized */
                    message?: string;
                };
            };
        };
        /** @description The action was successful and the response body is empty. */
        "no-content": {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    registerUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["register-user.dto"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["register-user.response"];
                };
            };
            401: components["responses"]["unauthorized"];
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["email-password.dto"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["token.response"];
                };
            };
            401: components["responses"]["unauthorized"];
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: components["responses"]["no-content"];
            401: components["responses"]["unauthorized"];
        };
    };
    getAccessToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["token.response"];
                };
            };
            401: components["responses"]["unauthorized"];
        };
    };
    getMe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["user.response"];
                };
            };
            400: components["responses"]["unauthorized"];
        };
    };
}
