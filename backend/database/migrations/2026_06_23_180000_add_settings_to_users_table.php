
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->boolean('notifications_enabled')->default(true)->after('is_admin');
            $table->boolean('two_factor_enabled')->default(false)->after('notifications_enabled');
            $table->string('account_type')->default('standard')->after('two_factor_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'notifications_enabled', 'two_factor_enabled', 'account_type']);
        });
    }
};
