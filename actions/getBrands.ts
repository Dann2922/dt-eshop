import prisma from '@/libs/prismadb';

export default async function getBrands() {
    try {
        const brands = await prisma.brand.findMany({
            select: {
                id : true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return brands;
    } catch (error: any) {
        throw new Error(`Failed to fetch brands: ${error.message}`);
    }
}
