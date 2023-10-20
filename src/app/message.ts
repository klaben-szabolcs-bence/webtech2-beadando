export interface Message {
    _id: string;
    id: number;
    senderId: string;
    timestamp: Date;
    content: string;
}
