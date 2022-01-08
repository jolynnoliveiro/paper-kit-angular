export class Notifications {
    notification_id: number = 0;
    description: string = "";
    user_id: number = 0;
    notification_datetime: string = "";
}

export class NotificationList {
    notifications: Notifications[] = [];
    
}