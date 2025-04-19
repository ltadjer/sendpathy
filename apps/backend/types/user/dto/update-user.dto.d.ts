declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<unknown>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    confirmationToken?: string;
    isActive?: boolean;
    accessCode?: string;
}
export {};
