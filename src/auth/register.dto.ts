import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

class RegisterDTO {
  @MaxLength(100, { message: 'First name has exceeded 100 characters' })
  firstName?: string;

  @MaxLength(100, { message: 'Last name has exceeded 100 characters' })
  lastName?: string;

  @MaxLength(100, { message: 'Email has exceeded 100 characters' })
  @IsEmail({}, { message: 'Email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @MaxLength(100, { message: 'Password has exceeded 100 characters' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @MaxLength(100, {
    message: 'Password confirmation has exceeded 100 characters',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  passwordConfirmation: string;
}

export default RegisterDTO;
