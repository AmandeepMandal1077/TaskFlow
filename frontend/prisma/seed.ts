import prisma from "../lib/prisma";

async function main() {
  // 1. Clean existing data
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.board.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "Amandeep Mandal",
      email: "amandeep@email.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@email.com",
    },
  });

  // 3. Create Labels
  const labels = [
    { name: "Bug", color: "bg-red-500" },
    { name: "Feature", color: "bg-blue-500" },
    { name: "Enhancement", color: "bg-teal-500" },
    { name: "Design", color: "bg-purple-500" },
    { name: "Documentation", color: "bg-yellow-500" },
    { name: "Urgent", color: "bg-orange-500" },
  ];

  const createdLabels = [];
  for (const label of labels) {
    createdLabels.push(await prisma.label.create({ data: label }));
  }

  // 4. Create Board and Lists
  const board = await prisma.board.create({
    data: {
      title: "TaskFlow MVP Development",
      description: "Main board for TaskFlow project",
      color: "bg-blue-600",
      user_id: user1.id,
      lists: {
        create: [
          { title: "To Do", order: 0 },
          { title: "In Progress", order: 1 },
          { title: "Done", order: 2 },
        ],
      },
    },
    include: {
      lists: true,
    },
  });

  const board2 = await prisma.board.create({
    data: {
      title: "Marketing Campaign Q3",
      description: "Planning and execution for Q3 marketing",
      color: "",
      image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
      user_id: user1.id,
      lists: {
        create: [
          { title: "Ideas", order: 0 },
          { title: "Drafting", order: 1 },
          { title: "Review", order: 2 },
          { title: "Published", order: 3 },
        ],
      },
    },
    include: {
      lists: true,
    },
  });

  const board3 = await prisma.board.create({
    data: {
      title: "Personal Goals",
      description: "My personal to-dos and targets",
      color: "",
      image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
      user_id: user1.id,
      lists: {
        create: [
          { title: "This Week", order: 0 },
          { title: "Next Month", order: 1 },
          { title: "Long Term", order: 2 },
        ],
      },
    },
    include: {
      lists: true,
    },
  });

  const todoList = board.lists.find((l) => l.title === "To Do")!;
  const inProgressList = board.lists.find((l) => l.title === "In Progress")!;
  const doneList = board.lists.find((l) => l.title === "Done")!;

  // 5. Create Cards with varied data
  
  // Card 1: Standard ToDo with checklists
  const card1 = await prisma.card.create({
    data: {
      title: "Implement Card Details UI",
      description: "We need a detailed view for cards matching the Trello style.",
      list_id: todoList.id,
      order: 0,
      due_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      assignees: { connect: [{ id: user1.id }] },
      labels: { connect: [{ id: createdLabels[1].id }, { id: createdLabels[3].id }] },
      checklists: {
        create: [
          {
            title: "Frontend Components",
            items: {
              create: [
                { title: "Create CardDetailDialog", is_checked: true },
                { title: "Add shadcn components", is_checked: true },
                { title: "Wire up API calls", is_checked: false },
              ],
            },
          },
          {
            title: "Backend Setup",
            items: {
              create: [
                { title: "Update Prisma schema", is_checked: true },
                { title: "Write server actions", is_checked: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Card 2: Urgent bug in progress
  const card2 = await prisma.card.create({
    data: {
      title: "Fix drag and drop flickering",
      description: "When dragging between lists, the card flickers momentarily.",
      list_id: inProgressList.id,
      order: 0,
      due_date: new Date(), // Today
      assignees: { connect: [{ id: user2.id }] },
      labels: { connect: [{ id: createdLabels[0].id }, { id: createdLabels[5].id }] },
    },
  });

  // Card 3: Completed task
  const card3 = await prisma.card.create({
    data: {
      title: "Setup initial Next.js project",
      description: "Initialize with Tailwind, shadcn, and Prisma.",
      list_id: doneList.id,
      order: 0,
      is_complete: true,
      labels: { connect: [{ id: createdLabels[2].id }] },
      checklists: {
        create: [
          {
            title: "Setup",
            items: {
              create: [
                { title: "Install Next.js", is_checked: true },
                { title: "Install Prisma", is_checked: true },
              ],
            },
          },
        ],
      },
    },
  });

  // Card 4: Simple task
  const card4 = await prisma.card.create({
    data: {
      title: "Write documentation",
      list_id: todoList.id,
      order: 1,
      labels: { connect: [{ id: createdLabels[4].id }] },
    },
  });

  // Fetch lists for Board 2
  const b2Ideas = board2.lists.find((l) => l.title === "Ideas")!;
  const b2Drafting = board2.lists.find((l) => l.title === "Drafting")!;
  const b2Review = board2.lists.find((l) => l.title === "Review")!;

  // Cards for Board 2
  await prisma.card.create({
    data: {
      title: "Brainstorm slogan",
      list_id: b2Ideas.id,
      order: 0,
    },
  });
  await prisma.card.create({
    data: {
      title: "Target audience research",
      list_id: b2Ideas.id,
      order: 1,
    },
  });
  await prisma.card.create({
    data: {
      title: "Write blog post draft",
      list_id: b2Drafting.id,
      order: 0,
      assignees: { connect: [{ id: user2.id }] },
    },
  });
  await prisma.card.create({
    data: {
      title: "Review ad copy",
      list_id: b2Review.id,
      order: 0,
      assignees: { connect: [{ id: user1.id }] },
      due_date: new Date(),
    },
  });

  // Fetch lists for Board 3
  const b3ThisWeek = board3.lists.find((l) => l.title === "This Week")!;
  const b3NextMonth = board3.lists.find((l) => l.title === "Next Month")!;

  // Cards for Board 3
  await prisma.card.create({
    data: {
      title: "Buy groceries",
      list_id: b3ThisWeek.id,
      order: 0,
    },
  });
  await prisma.card.create({
    data: {
      title: "Call mom",
      list_id: b3ThisWeek.id,
      order: 1,
      due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    },
  });
  await prisma.card.create({
    data: {
      title: "Plan vacation",
      list_id: b3NextMonth.id,
      order: 0,
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
