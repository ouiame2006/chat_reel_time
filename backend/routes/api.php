<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\StoryController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ──────────────────────────────────────────────────────────────────
    Route::post('/logout',      [AuthController::class, 'logout']);
    Route::get('/user',         [AuthController::class, 'getUser']);
    Route::post('/user/update', [AuthController::class, 'updateProfile']);
    Route::post('/user/ping',   [AuthController::class, 'ping']);          // heartbeat

    // ── Users directory ───────────────────────────────────────────────────────
    Route::get('/users', function () {
        return App\Models\User::where('id', '!=', auth()->id())
            ->select('id','name','email','bio','last_seen_at','created_at')
            ->get()
            ->map(function ($u) {
                $u->is_online = $u->last_seen_at
                    && \Carbon\Carbon::parse($u->last_seen_at)->diffInMinutes(now()) < 5;
                return $u;
            });
    });

    // ── Invitations ───────────────────────────────────────────────────────────
          Route::get('/invitations',                          [InvitationController::class, 'index']);
          Route::get('/invitations/received',                 [InvitationController::class, 'getReceivedInvitations']);
          Route::post('/invitations',                         [InvitationController::class, 'sendInvitation']);
          Route::post('/invitations/{id}/accept',             [InvitationController::class, 'acceptInvitation']);
          Route::post('/invitations/{id}/reject',             [InvitationController::class, 'rejectInvitation']);
          Route::get('/invitations/status/{user}',            [InvitationController::class, 'statusWith']);

    // ── Messages ──────────────────────────────────────────────────────────────
    Route::get('/messages/{receiver}',       [ChatController::class, 'getMessages']);
    Route::post('/messages',                 [ChatController::class, 'sendMessage']);
    Route::post('/messages/{message}/read',  [ChatController::class, 'markRead']);
    Route::get('/unread-counts',             [ChatController::class, 'unreadCounts']);

    // ── Conversations list (friends I've chatted with) ─────────────────────────
    Route::get('/conversations', [ChatController::class, 'conversations']);

    // ── Stories ───────────────────────────────────────────────────────────────
    Route::get('/stories',              [StoryController::class, 'index']);
    Route::post('/stories',             [StoryController::class, 'store']);
    Route::post('/stories/{story}/view',[StoryController::class, 'view']);
    Route::delete('/stories/{story}',   [StoryController::class, 'destroy']);

    // ── Admin ─────────────────────────────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::get('/stats',                         [AdminController::class, 'stats']);
        Route::get('/users',                         [AdminController::class, 'listUsers']);
        Route::get('/users/export',                  [AdminController::class, 'exportUsers']);
        Route::post('/users',                        [AdminController::class, 'createUser']);
        Route::put('/users/{user}',                  [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}',               [AdminController::class, 'deleteUser']);
        Route::post('/users/{user}/block',           [AdminController::class, 'blockUser']);
        Route::post('/users/{user}/unblock',         [AdminController::class, 'unblockUser']);
        Route::post('/users/{user}/suspend',         [AdminController::class, 'suspendUser']);
        Route::post('/users/{user}/warn',            [AdminController::class, 'warnUser']);
        Route::post('/users/{user}/role',            [AdminController::class, 'changeRole']);
        Route::post('/users/{user}/reset-password',  [AdminController::class, 'resetPassword']);
        Route::get('/messages',                      [AdminController::class, 'listMessages']);
        Route::delete('/messages/{message}',         [AdminController::class, 'deleteMessage']);
        Route::post('/messages/bulk-delete',         [AdminController::class, 'deleteMessages']);
        Route::get('/stories',                       [AdminController::class, 'listStories']);
        Route::delete('/stories/{story}',            [AdminController::class, 'deleteStory']);
        Route::get('/conversations',                 [AdminController::class, 'listConversations']);
        Route::post('/conversations/delete',         [AdminController::class, 'deleteConversation']);
        Route::get('/reports',                       [AdminController::class, 'listReports']);
        Route::post('/reports/{report}/resolve',     [AdminController::class, 'resolveReport']);
        Route::post('/messages/cleanup',             [AdminController::class, 'cleanupMessages']);
        Route::get('/settings',                      [AdminController::class, 'getSettings']);
        Route::post('/settings',                     [AdminController::class, 'updateSettings']);
        Route::post('/announce',                     [AdminController::class, 'sendAnnouncement']);
    });
});
