<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    Schema::create('groups', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('photo')->nullable();
    $table->foreignId('created_by')->constrained('users');
    $table->text('description')->nullable();
    $table->timestamps();
});
    }
};
