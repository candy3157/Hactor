import prisma from "@/lib/prisma";

export type HomeActivityItem = {
  id: string;
  title: string;
  dateLabel: string;
  year: number;
  category: string;
};

export type HomeActivityYearGroup = {
  year: number;
  items: HomeActivityItem[];
};

export type HomeActivityHistory = {
  years: HomeActivityYearGroup[];
  totalCount: number;
  yearCount: number;
};

export const getHomeActivityHistory = async (): Promise<HomeActivityHistory> => {
  const rows = await prisma.activity.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      dateLabel: true,
      year: true,
      category: true,
    },
  });

  const grouped = new Map<number, HomeActivityItem[]>();

  for (const row of rows) {
    const item: HomeActivityItem = {
      id: row.id,
      title: row.title,
      dateLabel: row.dateLabel,
      year: row.year,
      category: row.category,
    };

    if (!grouped.has(row.year)) {
      grouped.set(row.year, []);
    }

    grouped.get(row.year)?.push(item);
  }

  const years = Array.from(grouped.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));

  return {
    years,
    totalCount: rows.length,
    yearCount: years.length,
  };
};
