import { Priority } from '../enums/priority.enum';

export interface Note {
    id: number;
    title: string;
    text: string;
    priority: Priority;
    endDate: Date;
}
