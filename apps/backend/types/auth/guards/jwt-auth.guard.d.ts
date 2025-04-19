import { ExecutionContext, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private validateHttpRequest;
    private validateWsRequest;
    private extractTokenFromHeader;
    private verifyToken;
}
