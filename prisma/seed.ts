import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    await prisma.siteSettings.create({
      data: {
        academyName: 'The Fast Academy of Sciences',
        headerLabel: 'THE FAST',
        tagline: 'Learn fast. Build strong foundations.',
        aboutText:
          'We are a community-focused academy in Burewala committed to strong fundamentals, discipline, and modern learning methods.',
        address: 'D Block, Burewala City',
        whatsapp: '+923216534920',
        contactEmail: 'info@thefastacademy.edu.pk',
        heroBadge: 'Admissions Open',
        heroCtaText: 'Contact on WhatsApp',
        heroCtaLink: 'https://wa.me/923216534920',
        statOneValue: '25+',
        statOneLabel: 'Years Legacy',
        statTwoValue: '12+',
        statTwoLabel: 'Expert Teachers',
        statThreeValue: '1,000+',
        statThreeLabel: 'Students Trained',
        aboutBadgeOne: 'Result Focused',
        aboutBadgeTwo: 'Modern Labs',
        aboutBadgeThree: 'Mentoring',
        admissionsTitle: 'Admissions Desk',
        admissionsText: 'Reach us on WhatsApp for admission guidance and updated fee details.',
        officeHours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
        contactHelpTitle: 'Need help?',
        contactHelpText: 'Message us on WhatsApp for admissions and fee details.',
        feeNote: 'Fees can change each term. Please contact the office for the latest updates.'
      }
    });
  }

  const teacherCount = await prisma.teacher.count();
  if (teacherCount === 0) {
    await prisma.teacher.createMany({
      data: [
        { name: 'Shahid Latif', subject: 'Math', order: 1 },
        { name: 'Maqsood', subject: 'Urdu', order: 2 },
        { name: 'Ramish', subject: 'Computer', order: 3 },
        { name: 'Ramish', subject: 'English', order: 4 },
        { name: 'Sarfaraz', subject: 'Biology', order: 5 },
        { name: 'Arshad Abbas', subject: 'Physics', order: 6 },
        { name: 'Asif', subject: 'Chemistry', order: 7 }
      ]
    });
  }

  const feeCount = await prisma.feeItem.count();
  if (feeCount === 0) {
    await prisma.feeItem.create({
      data: {
        title: 'Monthly Tuition',
        amount: 'PKR 3,500',
        period: 'Per month',
        order: 1
      }
    });
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await prisma.post.createMany({
      data: [
        {
          type: 'ANNOUNCEMENT',
          title: 'Admissions Open for the New Session',
          slug: 'admissions-open',
          excerpt: 'Admissions are now open. Limited seats available.',
          contentMd: 'Admissions are open for the new session. Please contact the office for details.',
          published: true,
          pinned: true
        },
        {
          type: 'NEWS',
          title: 'Science Fair Highlights',
          slug: 'science-fair-highlights',
          excerpt: 'Our students presented innovative projects and experiments.',
          contentMd: 'The science fair showcased creativity and strong teamwork from our students.',
          published: true,
          pinned: false
        },
        {
          type: 'POST',
          title: 'Study Tips for Board Exams',
          slug: 'study-tips-board-exams',
          excerpt: 'Practical tips to prepare effectively for exams.',
          contentMd: 'Focus on daily revision, practice past papers, and follow a consistent schedule.',
          published: true,
          pinned: false
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
