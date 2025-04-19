import { ReservationService } from './reservation.service';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    create(createReservationDto: any, user: any): Promise<any>;
    update(id: string, updateReservationDto: any, user: any): Promise<any>;
    cancel(id: string, user: any): Promise<any>;
}
