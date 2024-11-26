import { environment } from '../environments/environment';

export function log(data: any) {
    if (!environment.production) {
        console.log(data);
    }
}