import { calculatePlacementProbability, calculateReadinessScore, rankStudents } from "./calculations";
import { StudentAnalyticsRecord } from "./types";

export interface MockCollege {
  id: string;
  name: string;
  code: string;
  location: string;
}

export const MOCK_COLLEGES: MockCollege[] = [
  {
    id: "col_apex_01",
    name: "Apex Institute of Technology",
    code: "AIT",
    location: "Bangalore, India",
  },
  {
    id: "col_metro_02",
    name: "Metropolitan Engineering College",
    code: "MEC",
    location: "Mumbai, India",
  },
  {
    id: "col_national_03",
    name: "National Institute of Computing",
    code: "NIC",
    location: "Hyderabad, India",
  },
];

const RAW_STUDENT_PROFILES = [
  // High Performers (AIT)
  { name: "Aarav Sharma", email: "aarav.sharma@ait.edu", collegeId: "col_apex_01", branch: "CSE", batch: "2025-A", dsa: 92, coding: 95, interview: 88, resume: 85, aptitude: 90, targetRole: "Full Stack Engineer", targetCompany: "Google" },
  { name: "Diya Patel", email: "diya.patel@ait.edu", collegeId: "col_apex_01", branch: "CSE", batch: "2025-A", dsa: 88, coding: 90, interview: 94, resume: 89, aptitude: 86, targetRole: "Software Engineer", targetCompany: "Microsoft" },
  { name: "Rohan Verma", email: "rohan.verma@ait.edu", collegeId: "col_apex_01", branch: "IT", batch: "2025-B", dsa: 85, coding: 86, interview: 82, resume: 80, aptitude: 88, targetRole: "Backend Developer", targetCompany: "Amazon" },
  { name: "Ananya Iyer", email: "ananya.iyer@ait.edu", collegeId: "col_apex_01", branch: "AI & DS", batch: "2025-A", dsa: 94, coding: 92, interview: 90, resume: 92, aptitude: 95, targetRole: "ML Engineer", targetCompany: "Adobe" },
  
  // Moderate / Average (AIT)
  { name: "Kunal Deshmukh", email: "kunal.d@ait.edu", collegeId: "col_apex_01", branch: "CSE", batch: "2025-B", dsa: 68, coding: 72, interview: 65, resume: 70, aptitude: 74, targetRole: "Frontend Developer", targetCompany: "Flipkart" },
  { name: "Sneha Nair", email: "sneha.nair@ait.edu", collegeId: "col_apex_01", branch: "ECE", batch: "2025-A", dsa: 60, coding: 64, interview: 72, resume: 75, aptitude: 68, targetRole: "Embedded / Software", targetCompany: "Qualcomm" },
  { name: "Vikram Singh", email: "vikram.s@ait.edu", collegeId: "col_apex_01", branch: "IT", batch: "2025-B", dsa: 55, coding: 58, interview: 62, resume: 68, aptitude: 60, targetRole: "Software Developer", targetCompany: "TCS" },
  { name: "Pooja Hegde", email: "pooja.h@ait.edu", collegeId: "col_apex_01", branch: "CSE", batch: "2025-A", dsa: 72, coding: 70, interview: 75, resume: 65, aptitude: 70, targetRole: "Full Stack Engineer", targetCompany: "Infosys" },

  // Struggling / Needs Focus (AIT)
  { name: "Aditya Kulkarni", email: "aditya.k@ait.edu", collegeId: "col_apex_01", branch: "MECH", batch: "2025-B", dsa: 35, coding: 40, interview: 48, resume: 52, aptitude: 45, targetRole: "Junior Developer", targetCompany: "Wipro" },
  { name: "Tanvi Joshi", email: "tanvi.j@ait.edu", collegeId: "col_apex_01", branch: "ECE", batch: "2025-A", dsa: 38, coding: 42, interview: 50, resume: 55, aptitude: 48, targetRole: "QA Engineer", targetCompany: "Capgemini" },
  { name: "Mohit Bansal", email: "mohit.b@ait.edu", collegeId: "col_apex_01", branch: "Civil", batch: "2025-B", dsa: 28, coding: 32, interview: 42, resume: 45, aptitude: 50, targetRole: "Analyst", targetCompany: "Cognizant" },

  // High Performers (MEC)
  { name: "Priya Sundaram", email: "priya.s@mec.edu", collegeId: "col_metro_02", branch: "CSE", batch: "2025-A", dsa: 91, coding: 89, interview: 92, resume: 87, aptitude: 90, targetRole: "Cloud Engineer", targetCompany: "Oracle" },
  { name: "Varun Mehta", email: "varun.m@mec.edu", collegeId: "col_metro_02", branch: "CSE", batch: "2025-A", dsa: 87, coding: 88, interview: 85, resume: 82, aptitude: 89, targetRole: "Systems Engineer", targetCompany: "Cisco" },
  { name: "Isha Mukherjee", email: "isha.m@mec.edu", collegeId: "col_metro_02", branch: "IT", batch: "2025-B", dsa: 84, coding: 85, interview: 86, resume: 84, aptitude: 82, targetRole: "DevOps Engineer", targetCompany: "Paytm" },

  // Moderate (MEC)
  { name: "Rahul Gupta", email: "rahul.g@mec.edu", collegeId: "col_metro_02", branch: "CSE", batch: "2025-A", dsa: 70, coding: 68, interview: 72, resume: 70, aptitude: 75, targetRole: "Full Stack Engineer", targetCompany: "Zoho" },
  { name: "Meera Menon", email: "meera.m@mec.edu", collegeId: "col_metro_02", branch: "IT", batch: "2025-B", dsa: 65, coding: 67, interview: 68, resume: 74, aptitude: 70, targetRole: "Data Analyst", targetCompany: "Accenture" },
  { name: "Siddharth Rao", email: "siddharth.r@mec.edu", collegeId: "col_metro_02", branch: "ECE", batch: "2025-A", dsa: 62, coding: 60, interview: 64, resume: 66, aptitude: 65, targetRole: "Software Engineer", targetCompany: "L&T Infotech" },
  { name: "Neha Saxena", email: "neha.s@mec.edu", collegeId: "col_metro_02", branch: "CSE", batch: "2025-B", dsa: 74, coding: 76, interview: 70, resume: 72, aptitude: 73, targetRole: "Backend Engineer", targetCompany: "Swiggy" },
  { name: "Arjun Reddy", email: "arjun.r@mec.edu", collegeId: "col_metro_02", branch: "AI & ML", batch: "2025-A", dsa: 76, coding: 78, interview: 74, resume: 78, aptitude: 80, targetRole: "AI Engineer", targetCompany: "Jio" },

  // Low / Under-prepared (MEC)
  { name: "Gaurav Sen", email: "gaurav.s@mec.edu", collegeId: "col_metro_02", branch: "MECH", batch: "2025-B", dsa: 32, coding: 35, interview: 44, resume: 48, aptitude: 52, targetRole: "Trainee Engineer", targetCompany: "Tech Mahindra" },
  { name: "Bhavna Bhatt", email: "bhavna.b@mec.edu", collegeId: "col_metro_02", branch: "EEE", batch: "2025-A", dsa: 36, coding: 38, interview: 46, resume: 50, aptitude: 45, targetRole: "Associate Software Eng", targetCompany: "HCL" },
  { name: "Karan Johar", email: "karan.j@mec.edu", collegeId: "col_metro_02", branch: "Civil", batch: "2025-B", dsa: 25, coding: 30, interview: 40, resume: 42, aptitude: 40, targetRole: "Technical Associate", targetCompany: "Mindtree" },

  // NIC Students
  { name: "Tarun Chawla", email: "tarun.c@nic.edu", collegeId: "col_national_03", branch: "CSE", batch: "2025-A", dsa: 95, coding: 96, interview: 94, resume: 90, aptitude: 96, targetRole: "Algorithm Engineer", targetCompany: "Goldman Sachs" },
  { name: "Kavya Pillai", email: "kavya.p@nic.edu", collegeId: "col_national_03", branch: "CSE", batch: "2025-A", dsa: 89, coding: 92, interview: 88, resume: 86, aptitude: 91, targetRole: "Full Stack Engineer", targetCompany: "Uber" },
  { name: "Manish Tiwari", email: "manish.t@nic.edu", collegeId: "col_national_03", branch: "IT", batch: "2025-A", dsa: 78, coding: 80, interview: 76, resume: 78, aptitude: 82, targetRole: "Platform Engineer", targetCompany: "Salesforce" },
  { name: "Divya Nambiar", email: "divya.n@nic.edu", collegeId: "col_national_03", branch: "Data Science", batch: "2025-B", dsa: 73, coding: 75, interview: 78, resume: 80, aptitude: 79, targetRole: "Data Scientist", targetCompany: "Walmart Labs" },
  { name: "Suresh Raina", email: "suresh.r@nic.edu", collegeId: "col_national_03", branch: "ECE", batch: "2025-B", dsa: 58, coding: 60, interview: 63, resume: 65, aptitude: 62, targetRole: "Software Engineer", targetCompany: "Infosys" },
  { name: "Ritu Kapoor", email: "ritu.k@nic.edu", collegeId: "col_national_03", branch: "CSE", batch: "2025-B", dsa: 65, coding: 68, interview: 70, resume: 72, aptitude: 67, targetRole: "Web Developer", targetCompany: "Accenture" },
  { name: "Harsh Vardhan", email: "harsh.v@nic.edu", collegeId: "col_national_03", branch: "MECH", batch: "2025-A", dsa: 34, coding: 38, interview: 42, resume: 48, aptitude: 50, targetRole: "Associate Consultant", targetCompany: "TCS" },
  { name: "Pallavi Ghosh", email: "pallavi.g@nic.edu", collegeId: "col_national_03", branch: "IT", batch: "2025-B", dsa: 81, coding: 84, interview: 80, resume: 82, aptitude: 85, targetRole: "Security Analyst", targetCompany: "Palo Alto Networks" },
  { name: "Nikhil Pandey", email: "nikhil.p@nic.edu", collegeId: "col_national_03", branch: "CSE", batch: "2025-A", dsa: 69, coding: 72, interview: 68, resume: 71, aptitude: 73, targetRole: "Full Stack Engineer", targetCompany: "Razorpay" },
];

export function generateMockStudents(): StudentAnalyticsRecord[] {
  const collegeMap = new Map(MOCK_COLLEGES.map((c) => [c.id, c.name]));

  const rawList: StudentAnalyticsRecord[] = RAW_STUDENT_PROFILES.map((p, index) => {
    const scores = {
      dsaScore: p.dsa,
      codingScore: p.coding,
      interviewScore: p.interview,
      resumeScore: p.resume,
      aptitudeScore: p.aptitude,
    };

    const readinessScore = calculateReadinessScore(scores);
    const placementProbability = calculatePlacementProbability({
      ...scores,
      readinessScore,
    });

    // Stagger realistic lastLoginAt timestamps across candidates
    const loginOffsetsMs = [
      2 * 60 * 1000,        // 2m ago (Active now)
      18 * 60 * 1000,       // 18m ago
      45 * 60 * 1000,       // 45m ago
      2 * 3600 * 1000,      // 2h ago
      5 * 3600 * 1000,      // 5h ago
      14 * 3600 * 1000,     // 14h ago
      26 * 3600 * 1000,     // yesterday
      2 * 86400 * 1000,     // 2d ago
      4 * 86400 * 1000,     // 4d ago
      8 * 86400 * 1000,     // 8d ago
    ];
    const offset = loginOffsetsMs[index % loginOffsetsMs.length];
    const lastLoginAt = new Date(Date.now() - offset).toISOString();

    return {
      id: `std_${(index + 1).toString().padStart(3, "0")}`,
      name: p.name,
      email: p.email,
      role: "student",
      college: collegeMap.get(p.collegeId) ?? "Apex Institute of Technology",
      collegeId: p.collegeId,
      branch: p.branch,
      batch: p.batch,
      graduationYear: 2025,
      targetRole: p.targetRole,
      targetCompany: p.targetCompany,
      ...scores,
      readinessScore,
      placementProbability,
      lastLoginAt,
    };
  });

  return rankStudents(rawList);
}

export const MOCK_STUDENTS: StudentAnalyticsRecord[] = generateMockStudents();
