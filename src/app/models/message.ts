export interface Message {
    _id: string;
    id: number;
    senderId: number;
    timestamp: Date;
    content: string;
}
