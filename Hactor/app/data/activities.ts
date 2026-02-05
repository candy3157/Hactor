export type ActivityItem = {
  title: string;
  date: string;
  category: "스터디" | "프로젝트" | "강의" | "행사";
};

export type ActivityCatalog = {
  current: ActivityItem[];
  archives: {
    title: string;
    items: ActivityItem[];
  }[];
};

export const activityCatalog: ActivityCatalog = {
  current: [
    {
      title: "Web 보안 스터디",
      date: "매주 토요일",
      category: "스터디",
    },
    {
      title: "신학기 오픈 모임",
      date: "Mar 01",
      category: "행사",
    },
    {
      title: "Spring 미니 프로젝트",
      date: "Feb 15",
      category: "프로젝트",
    },
  ],
  archives: [
    {
      title: "2025 하반기",
      items: [
        { title: "ASIS CTF Finals 준비", date: "Dec 28", category: "스터디" },
        { title: "네트워크 보안 강의", date: "Nov 15", category: "강의" },
        { title: "OCTF 대회 참가", date: "Oct 07", category: "스터디" },
        { title: "가을 학기 프로젝트", date: "Sep 30", category: "프로젝트" },
        { title: "SECCON CTF 준비", date: "Sep 21", category: "스터디" },
      ],
    },
    {
      title: "2025 상반기",
      items: [
        { title: "Spring 프로젝트 발표", date: "Jun 15", category: "프로젝트" },
        { title: "웹해킹 스터디 시작", date: "Mar 10", category: "스터디" },
        { title: "동아리 개강 모임", date: "Mar 05", category: "행사" },
        { title: "리버싱 기초 강의", date: "Jan 25", category: "강의" },
      ],
    },
  ],
};
