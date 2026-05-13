import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
  console.error('❌ Missing environment variables in .env.local');
  process.exit(1);
}

// Use SERVICE_ROLE_KEY to bypass RLS and manage users
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function syncAdmin() {
  console.log(`\n🚀 Syncing Admin: ${adminEmail}...`);

  // 1. Try to find the user
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError.message);
    return;
  }

  const existingUser = users.find(u => u.email === adminEmail);

  if (existingUser) {
    // 2. Update existing user
    console.log('🔄 User exists. Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: adminPassword, email_confirm: true }
    );

    if (updateError) {
      console.error('❌ Update failed:', updateError.message);
    } else {
      console.log('✅ Admin password updated successfully!');
    }
  } else {
    // 3. Create new user
    console.log('✨ User not found. Creating new admin...');
    const { error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (createError) {
      console.error('❌ Creation failed:', createError.message);
    } else {
      console.log('✅ Admin user created successfully!');
    }
  }
}

syncAdmin();
