import { IsString, IsNotEmpty } from "class-validator";

export class CreateDepartmentDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  responsableName: string;

  @IsNotEmpty()
  @IsString()
  responsableEmail: string;
}
