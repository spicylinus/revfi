import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { CLIENT_DELIVERIES } from '@/lib/mock-deliveries';
import { existsSync } from 'fs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;

  if (!CLIENT_DELIVERIES[clientId]) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get extension
    const ext = file.name.split('.').pop();
    const filename = `${clientId}-logo.${ext}`;
    const publicPath = join(process.cwd(), 'public', 'client-logos');
    const filePath = join(publicPath, filename);

    // Delete old logos if they exist (different extensions)
    const extensions = ['jpg', 'jpeg', 'png', 'svg', 'webp'];
    for (const e of extensions) {
      const oldPath = join(publicPath, `${clientId}-logo.${e}`);
      if (existsSync(oldPath)) {
        await unlink(oldPath);
      }
    }

    // Save new logo
    await writeFile(filePath, buffer);

    const logoUrl = `/client-logos/${filename}`;
    
    // Update mock data
    if (CLIENT_DELIVERIES[clientId].profile) {
      CLIENT_DELIVERIES[clientId].profile!.logoUrl = logoUrl;
    }

    return NextResponse.json({ success: true, logoUrl });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
  }
}
