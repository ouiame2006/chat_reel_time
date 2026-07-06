<?php

namespace App\Console\Commands;

use App\Models\Story;
use Illuminate\Console\Command;

class DeleteExpiredStories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-expired-stories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all stories that have expired';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Story::where('expires_at', '<', now())->delete();
        $this->info("Deleted {$count} expired stories.");
    }
}
