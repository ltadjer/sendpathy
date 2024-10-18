import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomSocket } from 'src/events/types/custom-socket';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    /**
     * Determines if a request is authorized based on the context type.
     * @param context - The execution context.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        if (context.getType() === 'http') {
            return this.validateHttpRequest(context);
        } else if (context.getType() === 'ws') {
            return this.validateWsRequest(context);
        }
        return false;
    }

    /**
     * Validates an HTTP request by checking the JWT token.
     * @param context - The execution context.
     */
    private validateHttpRequest(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        const payload = this.verifyToken(token);
        request.user = payload;
        return true;
    }

    /**
     * Validates a WebSocket request by checking the JWT token.
     * @param context - The execution context.
     */
    private validateWsRequest(context: ExecutionContext): boolean {
        const client: CustomSocket = context.switchToWs().getClient();
        const token = this.extractTokenFromHeader(client.handshake.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        const payload = this.verifyToken(token);
        client.user = payload;
        return true;
    }

    /**
     * Extracts the token from the authorization header.
     * @param authorization - The authorization header.
     */
    private extractTokenFromHeader(authorization: string): string | null {
        if (!authorization) {
            return null;
        }
        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        return parts[1];
    }

    /**
     * Verifies the JWT token.
     * @param token - The JWT token.
     */
    private verifyToken(token: string): any {
        try {
            return verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}