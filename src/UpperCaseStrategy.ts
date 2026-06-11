import { transform } from '../types/interface';

export class UpperCaseStrategy implements transform {
    toUpperCase(name: string): string{
        return name.toUpperCase();
    }   

    toLowerCase(name: string): string {
        return name.toLowerCase();
    }
}