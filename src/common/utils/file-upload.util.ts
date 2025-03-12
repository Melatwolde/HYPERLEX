import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as pdf from 'pdf-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';
@Injectable()
export class FileUploadUtil {
  static storage = multer.memoryStorage();

  static uploadFile() {
    return multer({ storage: this.storage }).single('file');
  }

  static async parsePDF(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  static async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join(__dirname, '../../uploads', file.originalname);
    fs.writeFileSync(uploadPath, file.buffer);
    return uploadPath;
  }
}