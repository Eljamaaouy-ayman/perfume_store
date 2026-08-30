import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap, map } from "rxjs";

@Injectable()
export class loggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        console.log("before the route handler")
        return next.handle().pipe(map((dataFromRouteHandler) => {
            const {password, ...otherData} = dataFromRouteHandler
            return {...otherData}
        }))
    }

}