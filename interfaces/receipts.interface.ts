import { Business, User } from "./actors.interface";

export interface Receipt {
    id: number;
    file_path: string;
    user: User;
    business: Business;
    created_at: string;
}

export interface GroupedReceipt{
    date: string;
    receipts: Receipt[]
}