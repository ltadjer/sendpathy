import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

export async function saveFileToServer(file: any): Promise<string> {
  validateFile(file);

  const uploadPath = path.join(__dirname, '..', '..', '..', 'uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalName}`;
  const filePath = path.join(uploadPath, fileName);
  fs.writeFileSync(filePath, Buffer.from(file.base64Content, 'base64'));

  return `/uploads/${fileName}`;
}

function validateFile(file: any) {
  const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4', 'audio/mpeg'];
  const maxSize = 10 * 1024 * 1024; // 10 MB

  if (!allowedTypes.includes(file.type)) {
    throw new BadRequestException('Invalid file type');
  }

  if (file.size > maxSize) {
    throw new BadRequestException('File size exceeds the maximum limit of 10 MB');
  }
}