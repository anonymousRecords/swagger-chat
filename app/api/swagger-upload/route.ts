import crypto from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'swagger-docs');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds limit (10MB)' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.json') && !fileName.endsWith('.yaml') && !fileName.endsWith('.yml')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JSON and YAML files are allowed.' },
        { status: 400 }
      );
    }

    const content = await file.text();
    let jsonContent;

    try {
      if (fileName.endsWith('.json')) {
        jsonContent = JSON.parse(content);
      } else {
        return NextResponse.json({ error: 'YAML support coming soon' }, { status: 400 });
      }

      if (!jsonContent.swagger && !jsonContent.openapi) {
        throw new Error('Invalid Swagger/OpenAPI document');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid Swagger/OpenAPI document format' },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const fileId = crypto.randomBytes(16).toString('hex');
    const filePath = path.join(UPLOAD_DIR, `${fileId}.json`);

    await writeFile(filePath, content);
    const tempUrl = `/swagger-docs/${fileId}.json`;

    return NextResponse.json({
      url: tempUrl,
      message: 'File uploaded successfully',
      originalName: file.name,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
