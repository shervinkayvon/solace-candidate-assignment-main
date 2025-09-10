import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  // Calculate pagination
  const offset = (page - 1) * limit;

  // For now, using static data. In production, you'd use the database:
  // const data = await db.select().from(advocates);
  let data = advocateData;

  // Apply search filter if provided
  if (search) {
    data = data.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(search.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(search.toLowerCase()) ||
        advocate.city.toLowerCase().includes(search.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(search.toLowerCase()) ||
        advocate.specialties.some((specialty: string) => 
          specialty.toLowerCase().includes(search.toLowerCase())
        ) ||
        advocate.yearsOfExperience.toString().toLowerCase().includes(search.toLowerCase()) ||
        advocate.phoneNumber.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  // Get total count for pagination metadata
  const totalCount = data.length;
  const totalPages = Math.ceil(totalCount / limit);

  // Apply pagination
  const paginatedData = data.slice(offset, offset + limit);

  return Response.json({ 
    data: paginatedData,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
}
