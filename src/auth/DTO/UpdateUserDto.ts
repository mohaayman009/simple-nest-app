
import {Matches, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
    @IsEmail()
  @IsNotEmpty()
  email: string;

    
  @IsOptional()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  },{message: 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one symbol.'})
  password: string;

    
  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber("EG", { message: 'Invalid phone number format' })
  @Matches(/^[^+]/, { message: 'Enter the number without the "+" prefix' }) // Ensures no "+"
  @Matches(/^(?!002)/, { message: 'Enter the number without the "002" prefix' }) // Ensures no "00  @IsPhoneNumber("EG", { message: 'Invalid phone number format' })
  phone: string;
    
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}
