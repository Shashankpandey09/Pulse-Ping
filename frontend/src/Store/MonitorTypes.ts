export type Monitor={
      name: string;
    url: string;
    interval: number;
    userId: string;
    id: number;
    currentStatus: string | null;
    createdAt: Date;
}
export type history={
     id: number;
    monitorId: number;
    lastStatus: string;
    lastPing: Date;
    responseTime: number | null;
}