<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Delete existing admin if any
        DB::table('users')->where('email', 'admin@chatreel.com')->delete();

        DB::table('users')->insert([
            'name'         => 'Admin',
            'email'        => 'admin@chatreel.com',
            'password'     => Hash::make('admin123'),
            'bio'          => 'Platform administrator',
            'is_admin'     => 1,
            'last_seen_at' => now(),
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $this->command->info('✅ Admin created: admin@chatreel.com / admin123');
    }
}
