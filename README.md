# Taskify - Modern Todo List Application

A production-ready Todo List application built with modern technologies, featuring authentication, task management, deadline tracking, and real-time notifications via Discord.

## ✨ Features

### Core Features
- **🔐 Authentication** - Secure login/register with NextAuth v5 (Credentials provider)
- **📝 Task Management** - Create, read, update, delete tasks with full CRUD operations
- **⏰ Deadline Tracking** - Date/time picker with WITA (Asia/Makassar) timezone support
- **🔔 Smart Notifications** - Multi-channel notifications (Discord DM, Webhook)
- **👤 User Profile** - Edit name, Discord ID, password with validation
- **🎨 Modern UI** - Dark mode, responsive design, smooth animations

### Notification System
- **Smart Reminders:**
  - Daily reminder (24 hours before deadline)
  - Hourly reminders (last 24 hours)
  - Overdue alerts (when past deadline)
- **Multi-channel:**
  - Discord Direct Messages (via Bot API)
  - Discord Webhook support
- **Real-time Scheduler** - Runs every minute via node-cron

### Security
- **Password Security:** bcrypt hashing (cost factor 12)
- **Input Validation:** Zod schema validation on all inputs
- **CSRF Protection:** Built-in NextAuth protection
- **SQL Injection Prevention:** Prisma ORM parameterized queries
- **XSS Prevention:** React's built-in escaping

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | SQLite + Prisma ORM |
| **Auth** | NextAuth v5 (Credentials) |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Animations** | Framer Motion |
| **Validation** | Zod |
| **Database** | Prisma ORM + SQLite |
| **Scheduling** | node-cron |
| **Notifications** | Discord Bot API + Webhooks |

## 📁 Project Structure

```
project-todolist/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Database seeding
│   └── seedTasks.ts          # Task seeding for testing
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/  # NextAuth API routes
│   │   ├── auth/
│   │   │   └── register-action.ts   # Registration server action
│   │   ├── login/            # Login page
│   │   ├── register/         # Register page
│   │   ├── profile/          # User profile page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main dashboard
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── TodoList.tsx      # Task list with animations
│   │   ├── TodoForm.tsx      # Task creation/edit form
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── ProfileForm.tsx   # Profile edit form
│   │   └── EditTodoModal.tsx # Edit task modal
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   ├── schema.ts         # Zod validation schemas
│   │   ├── scheduler.ts      # Notification scheduler
│   │   └── whatsapp.ts       # WhatsApp integration
│   ├── app/
│   │   ├── actions.ts        # Server actions (CRUD)
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── updateAction.ts   # Update task action
│   │   └── profile/
│   │       └── discordTest.ts # Discord DM test action
│   └── middleware.ts         # Auth middleware
├── public/
│   └── uploads/              # File uploads
├── .env.example              # Environment template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Discord Bot Token (for notifications)

### Installation

```bash
# Clone repository
git clone https://github.com/bojams/project-todolist.git
cd project-todolist

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"

# Discord Bot (for DM notifications)
DISCORD_BOT_TOKEN="your-discord-bot-token"

# Optional: Discord Webhook (fallback)
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application → Bot
3. Enable **Message Content Intent** and **Server Members Intent**
4. Copy token to `DISCORD_BOT_TOKEN`
5. Invite bot to your server with `bot` scope

## 🧪 Testing Features

### Create Test Data
```bash
# Creates sample tasks with deadlines for notification testing
npx tsx prisma/seedTasks.ts
```

### Test Notifications
1. Go to `/profile` page
2. Enter your Discord User ID (right-click profile → Copy User ID)
3. Click "Test Kirim Pesan DM Discord"
4. Check DM for test message

## 📱 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
```

## 🔒 Security Checklist

- [x] Password hashing with bcrypt (cost 12)
- [x] Zod validation on all inputs
- [x] NextAuth CSRF protection
- [x] Prisma parameterized queries
- [x] Environment variable protection
- [x] Secure session handling
- [x] Password strength requirements
- [x] SQL injection prevention
- [x] XSS prevention via React

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Prisma, and Discord.js**