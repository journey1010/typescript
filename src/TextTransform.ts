import { 
    UpperCase, 
    LowerCase
} from '../types/interface';

export class UpperCaseStrategy implements UpperCase {
    toUpperCase(name: string): string{
        return name.toUpperCase();
    }   
}

export class LowerCaseStrategy implements LowerCase {
    toLowerCase(name: string): string {
        return name.toLowerCase();
    }
}