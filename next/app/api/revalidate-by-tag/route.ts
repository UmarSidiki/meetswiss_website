import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const webhookSecret = process.env.REVALIDATE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'REVALIDATE_WEBHOOK_SECRET is not configured' },
      { status: 500 }
    );
  }

  const requestSecret = request.headers.get('x-revalidate-secret');
  if (requestSecret !== webhookSecret) {
    return NextResponse.json(
      { error: 'Invalid webhook secret' },
      { status: 401 }
    );
  }

  const { tag } = (await request.json()) as { tag?: string };
  if (!tag) {
    return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
  }

  revalidateTag(tag, 'max');
  return NextResponse.json({ revalidated: true, tag });
}
