import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

class UpdateUserDTO {
  @MaxLength(100, { message: 'First name has exceeded 100 characters' })
  @IsOptional()
  firstName?: string;

  @MaxLength(100, { message: 'Last name has exceeded 100 characters' })
  @IsOptional()
  lastName?: string;

  @MaxLength(100, { message: 'Email has exceeded 100 characters' })
  @IsEmail({}, { message: 'Email is invalid' })
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsNotEmpty({ message: 'Password is required' })
  currentPassword: string;

  @MaxLength(100, { message: 'New password has exceeded 100 characters' })
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  @IsOptional()
  newPassword: string;

  @MaxLength(100, {
    message: 'New password verification has exceeded 100 characters',
  })
  @MinLength(6, {
    message: 'New password verification must be at least 6 characters',
  })
  @IsOptional()
  newPasswordVerification: string;
}

export default UpdateUserDTO;
