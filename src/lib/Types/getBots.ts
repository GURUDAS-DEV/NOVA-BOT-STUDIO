export interface botInterface{
    message : string | null;
    activeBots : bot[];
    draftBots : bot[];
    pausedBots : bot[];
    deletedBots : bot[];
    totalBots : number | null;
}

export interface bot{
    _id: string;
    userId: string;
    botName: string;
    platform: "Telegram" | "Discord" | "API" | "Instagram" | "WhatsApp";
    status: "active" | "paused" | "disabled";
    intelligenceSource: string;
    created_at: Date;
    updated_at: Date;
    purpose: "chatbot" | "search" | "automation";
    messages: number;
    deleted_at?: Date;
}