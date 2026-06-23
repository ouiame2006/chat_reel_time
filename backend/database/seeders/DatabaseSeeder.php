<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Add missing columns if they don't exist
        if (!Schema::hasColumn('users', 'is_admin')) {
            DB::statement('ALTER TABLE users ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0');
            $this->command->info('✅ Added is_admin column');
        }

        if (!Schema::hasColumn('users', 'last_seen_at')) {
            DB::statement('ALTER TABLE users ADD COLUMN last_seen_at TIMESTAMP NULL');
            $this->command->info('✅ Added last_seen_at column');
        }

        // Create admin user
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@chatreel.com'],
            [
                'name'         => 'Admin',
                'password'     => Hash::make('admin123'),
                'bio'          => 'Platform administrator',
                'is_admin'     => 1,
                'last_seen_at' => now(),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]
        );

        // Create test users
        $testUsers = [
            [
                'email' => 'elena@chatreel.com',
                'name' => 'Elena Vance',
                'password' => Hash::make('password123'),
                'bio' => 'UI/UX Designer & Coffee Lover',
                'last_seen_at' => now(),
            ],
            [
                'email' => 'mike@chatreel.com',
                'name' => 'Mike Johnson',
                'password' => Hash::make('password123'),
                'bio' => 'Full Stack Developer',
                'last_seen_at' => now()->subMinutes(10),
            ],
            [
                'email' => 'sarah@chatreel.com',
                'name' => 'Sarah Chen',
                'password' => Hash::make('password123'),
                'bio' => 'Product Manager',
                'last_seen_at' => now()->subHours(2),
            ],
        ];

        foreach ($testUsers as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                array_merge($user, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        $this->command->info('✅ Admin ready → admin@chatreel.com / admin123');
        $this->command->info('✅ Test users created!');
    }
}
