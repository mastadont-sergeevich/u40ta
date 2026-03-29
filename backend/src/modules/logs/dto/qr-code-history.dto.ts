import { IsInt, IsNotEmpty } from 'class-validator';

export class QrCodeHistoryDto {
  @IsInt()
  @IsNotEmpty()
  qr_code_id: number;

  @IsInt()
  @IsNotEmpty()
  old_object_id: number;

  @IsInt()
  @IsNotEmpty()
  new_object_id: number;
}