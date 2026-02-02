export type ActivityItem = {
  title: string;
  date: string;
  category: "스터디" | "프로젝트" | "강의" | "행사";
  status: "진행중" | "예정" | "완료";
  summary: string;
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
      status: "진행중",
      summary: "웹 보안 핵심 개념과 실제 CVE 분석을 진행하는 정기 스터디",
    },
    {
      title: "신학기 오픈 모임",
      date: "Mar 01",
      category: "행사",
      status: "예정",
      summary: "새 학기 맞이하여 누구든 참여 가능한 오픈 모임 진행",
    },
    {
      title: "Spring 미니 프로젝트",
      date: "Feb 15",
      category: "프로젝트",
      status: "예정",
      summary: "팀 단위로 진행하는 Spring Boot 백엔드 프로젝트",
    },
  ],
  archives: [
    {
      title: "2025 하반기",
      items: [
        {
          title: "ASIS CTF Finals 준비",
          date: "Dec 28",
          category: "스터디",
          status: "완료",
          summary: "ASIS CTF Finals 온사이트 참가를 위한 집중 준비",
        },
        {
          title: "네트워크 보안 강의",
          date: "Nov 15",
          category: "강의",
          status: "완료",
          summary: "네트워크 프로토콜과 패킷 분석을 주제로 한 강의",
        },
        {
          title: "OCTF 대회 참가",
          date: "Oct 07",
          category: "스터디",
          status: "완료",
          summary: "OCTF 2025 온라인 대회에 팀 단위로 참가",
        },
        {
          title: "가을 학기 프로젝트",
          date: "Sep 30",
          category: "프로젝트",
          status: "완료",
          summary: "팀별로 진행한 보안 관련 미니 프로젝트 및 발표",
        },
        {
          title: "SECCON CTF 준비",
          date: "Sep 21",
          category: "스터디",
          status: "완료",
          summary: "SECCON CTF 13 Quals 준비를 위한 스터디 진행",
        },
      ],
    },
    {
      title: "2025 상반기",
      items: [
        {
          title: "Spring 프로젝트 발표",
          date: "Jun 15",
          category: "프로젝트",
          status: "완료",
          summary: "Spring Boot 기반 백엔드 프로젝트 최종 발표",
        },
        {
          title: "웹해킹 스터디 시작",
          date: "Mar 10",
          category: "스터디",
          status: "완료",
          summary: "웹 해킹 기본 개념과 실제 공격/방어 실습 진행",
        },
        {
          title: "동아리 개강 모임",
          date: "Mar 05",
          category: "행사",
          status: "완료",
          summary: "새 학기 개강 기념 모임 및 스터디 계획 논의",
        },
        {
          title: "리버싱 기초 강의",
          date: "Jan 25",
          category: "강의",
          status: "완료",
          summary: "리버스엔지니어링 기본 개념과 동적 분석 실습",
        },
      ],
    },
    {
      title: "2024 하반기",
      items: [],
    },
  ],
};
