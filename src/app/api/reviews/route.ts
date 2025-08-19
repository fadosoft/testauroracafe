import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: parseInt(productId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, userId, rating, comment } = await request.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        userId: userId ? parseInt(userId) : null,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
