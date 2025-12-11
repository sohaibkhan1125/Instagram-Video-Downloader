# Quick Start - Supabase Migration

## 🚀 3-Step Setup

### Step 1: Create Database Table (2 minutes)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy entire content from `supabase_migration.sql`
5. Click **Run**
6. ✅ Done! Table created.

### Step 2: Enable Realtime (1 minute)

1. Go to **Database** → **Replication**
2. Find `website_content_instagram_downloader`
3. Toggle switch to **ON**
4. ✅ Done! Real-time enabled.

### Step 3: Test Your Website (2 minutes)

```bash
npm start
```

1. Open http://localhost:3000/admin
2. Go to **Hero Management**
3. Change title/description → Click **Save**
4. Open http://localhost:3000 in another tab
5. ✅ See changes appear instantly!

## 📋 What Changed?

| Before | After |
|--------|-------|
| localStorage | Supabase Database |
| Manual refresh needed | Real-time updates |
| Browser-specific | Works everywhere |
| Can be cleared | Persistent storage |

## 🎯 Table Structure

```
website_content_instagram_downloader
├── hero_title          → Hero section title
├── hero_description    → Hero section description
└── main_content        → Content above FAQ
```

## ✅ Verification Checklist

- [ ] SQL migration executed successfully
- [ ] Table appears in Supabase Table Editor
- [ ] Realtime is enabled for the table
- [ ] Admin panel can save hero content
- [ ] Homepage displays hero content
- [ ] Admin panel can save main content
- [ ] Homepage displays main content
- [ ] Changes appear without page refresh

## 🐛 Troubleshooting

**Problem**: Can't save content
- **Fix**: Check RLS policies are enabled (migration script does this)

**Problem**: Changes don't appear
- **Fix**: Enable Realtime in Database → Replication

**Problem**: "PGRST116" error
- **Fix**: This is normal - means no data yet. App uses defaults.

## 📝 Environment Variables

Already configured in `.env`:
```env
REACT_APP_SUPABASE_URL=https://deyzyxzqlsyszbmeqiqx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🎉 You're Done!

Your website now uses Supabase for all text content storage with real-time updates!

For detailed information, see `SUPABASE_MIGRATION_GUIDE.md`
