<?php

namespace App\Http\Controllers;

use App\Models\BlockedUser;
use App\Models\Invitation;
use App\Models\Message;
use App\Models\Report;
use App\Models\Setting;
use App\Models\Story;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class AdminController extends Controller
{
    private function guard(Request $request): void
    {
        $isAdmin = Schema::hasColumn('users', 'is_admin')
            ? (bool) $request->user()->is_admin
            : $request->user()->email === 'admin@chatreel.com';
        if (!$isAdmin) abort(403, 'Admin access required.');
    }

    // ── Stats ─────────────────────────────────────────────────────────────────
    public function stats(Request $request)
    {
        $this->guard($request);
        $now = now();
        
        // Daily messages chart data (last 30 days)
        $dailyMessages = Message::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'total_users'       => User::count(),
            'online_users'      => Schema::hasTable('users') && Schema::hasColumn('users','last_seen_at')
                ? User::where('last_seen_at','>=', $now->copy()->subMinutes(5))->count() : 0,
            'active_today'      => User::where('last_seen_at','>=', today())->count(),
            'new_today'         => User::whereDate('created_at', today())->count(),
            'total_messages'    => Message::count(),
            'messages_today'    => Message::whereDate('created_at', today())->count(),
            'total_stories'     => Story::count(),
            'total_invitations' => Invitation::count(),
            'invitations_accepted' => Invitation::where('status', 'accepted')->count(),
            'pending_reports'   => Report::where('status', 'pending')->count(),
            'daily_messages'    => $dailyMessages,
            // AI Simulation Stats (as AI is client-side for now)
            'ai_conversations'  => Message::where('message', 'like', '%Nexus-X%')->count() / 2, // approximation
        ]);
    }

    // ── Users ─────────────────────────────────────────────────────────────────
    public function listUsers(Request $request)
    {
        $this->guard($request);
        $q = $request->query('q','');
        $query = User::withCount('sentMessages as messages_count');
        if ($q) $query->where(fn($x) => $x->where('name','like',"%$q%")->orWhere('email','like',"%$q%"));
        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function showUser(Request $request, User $user)
    {
        $this->guard($request);
        return response()->json($user->loadCount('sentMessages as messages_count'));
    }

    public function createUser(Request $request)
    {
        $this->guard($request);
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'is_admin' => 'boolean',
        ]);
        $data = [
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ];
        if (Schema::hasColumn('users','is_admin'))     $data['is_admin']     = $request->boolean('is_admin', false);
        if (Schema::hasColumn('users','last_seen_at')) $data['last_seen_at'] = null;
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function updateUser(Request $request, User $user)
    {
        $this->guard($request);
        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,'.$user->id,
            'bio'      => 'sometimes|string|max:1000',
            'is_admin' => 'sometimes|boolean',
            'password' => 'sometimes|string|min:8',
        ]);
        $data = $request->only('name','email','bio');
        if ($request->has('password')) $data['password'] = Hash::make($request->password);
        if ($request->has('is_admin') && Schema::hasColumn('users','is_admin')) $data['is_admin'] = $request->boolean('is_admin');
        $user->update($data);
        return response()->json($user->fresh());
    }

    public function deleteUser(Request $request, User $user)
    {
        $this->guard($request);
        if ($user->id === $request->user()->id) return response()->json(['error'=>'Cannot delete yourself.'],422);
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message'=>'User deleted.']);
    }

    public function blockUser(Request $request, User $user)
    {
        $this->guard($request);
        $user->update(['is_blocked' => true]);
        return response()->json(['message' => 'User blocked successfully.']);
    }

    public function unblockUser(Request $request, User $user)
    {
        $this->guard($request);
        $user->update(['is_blocked' => false]);
        return response()->json(['message' => 'User unblocked successfully.']);
    }

    public function suspendUser(Request $request, User $user)
    {
        $this->guard($request);
        $request->validate(['days' => 'required|integer|min:0']);
        
        $suspendedUntil = $request->days > 0 ? now()->addDays($request->days) : null;
        $user->update(['suspended_until' => $suspendedUntil]);
        
        return response()->json([
            'message' => $request->days > 0 ? "User suspended for {$request->days} days." : "User suspension removed.",
            'suspended_until' => $suspendedUntil
        ]);
    }

    public function warnUser(Request $request, User $user)
    {
        $this->guard($request);
        $user->increment('warning_count');
        
        // Send a system message as warning
        Message::create([
            'user_id' => $request->user()->id,
            'receiver_id' => $user->id,
            'message' => '⚠️ [Warning] This is a formal warning from administration regarding your behavior.',
            'is_read' => false
        ]);

        return response()->json([
            'message' => 'Warning sent.',
            'warning_count' => $user->warning_count
        ]);
    }

    public function changeRole(Request $request, User $user)
    {
        $this->guard($request);
        $request->validate(['is_admin'=>'required|boolean']);
        if (Schema::hasColumn('users','is_admin')) $user->update(['is_admin'=>$request->boolean('is_admin')]);
        return response()->json($user->fresh());
    }

    public function resetPassword(Request $request, User $user)
    {
        $this->guard($request);
        $request->validate(['password'=>'required|string|min:8']);
        $user->update(['password'=>Hash::make($request->password)]);
        $user->tokens()->delete();
        return response()->json(['message'=>'Password reset.']);
    }

    public function exportUsers(Request $request)
    {
        $this->guard($request);
        $users = User::withCount('sentMessages as messages_count')->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'bio'        => $u->bio,
                'is_admin'   => $u->is_admin ?? false,
                'messages'   => $u->messages_count,
                'created_at' => $u->created_at,
            ]);
        return response()->json($users);
    }

    // ── Messages ──────────────────────────────────────────────────────────────
    public function listMessages(Request $request)
    {
        $this->guard($request);
        $q      = $request->query('q','');
        $userId = $request->query('user_id');
        $from   = $request->query('from');
        $to     = $request->query('to');

        $query = Message::with(['user:id,name,email','receiver:id,name,email']);
        if ($q)      $query->where('message','like',"%$q%");
        if ($userId) $query->where(fn($x) => $x->where('user_id',$userId)->orWhere('receiver_id',$userId));
        if ($from)   $query->whereDate('created_at','>=',$from);
        if ($to)     $query->whereDate('created_at','<=',$to);

        return response()->json($query->orderByDesc('created_at')->paginate(50));
    }

    public function deleteMessage(Request $request, Message $message)
    {
        $this->guard($request);
        $message->delete();
        return response()->json(['message'=>'Deleted.']);
    }

    public function deleteMessages(Request $request)
    {
        $this->guard($request);
        $request->validate(['ids'=>'required|array','ids.*'=>'integer']);
        Message::whereIn('id',$request->ids)->delete();
        return response()->json(['message'=>'Deleted '.count($request->ids).' messages.']);
    }

    // ── Stories ───────────────────────────────────────────────────────────────
    public function listStories(Request $request)
    {
        $this->guard($request);
        $userId = $request->query('user_id');
        $query  = Story::with('user:id,name,email');
        if ($userId) $query->where('user_id',$userId);
        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function deleteStory(Request $request, Story $story)
    {
        $this->guard($request);
        $story->delete();
        return response()->json(['message'=>'Story deleted.']);
    }

    public function deleteStories(Request $request)
    {
        $this->guard($request);
        $request->validate(['ids'=>'required|array']);
        Story::whereIn('id',$request->ids)->delete();
        return response()->json(['message'=>'Deleted.']);
    }

    // ── Announcements ─────────────────────────────────────────────────────────
    public function sendAnnouncement(Request $request)
    {
        $this->guard($request);
        $request->validate(['message'=>'required|string|max:1000']);
        // Store as a system message from admin to all users
        $adminId = $request->user()->id;
        $users   = User::where('id','!=',$adminId)->get();
        foreach ($users as $u) {
            Message::create([
                'user_id'     => $adminId,
                'receiver_id' => $u->id,
                'message'     => '📢 [Announcement] '.$request->message,
                'is_read'     => false,
            ]);
        }
        return response()->json(['message'=>'Announcement sent to '.$users->count().' users.']);
    }

    // ── Settings ──────────────────────────────────────────────────────────────
    public function getSettings(Request $request)
    {
        $this->guard($request);
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function updateSettings(Request $request)
    {
        $this->guard($request);
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'Settings updated successfully.']);
    }

    // ── Moderation ────────────────────────────────────────────────────────────
    public function listReports(Request $request)
    {
        $this->guard($request);
        return response()->json(Report::with(['reporter:id,name', 'reported:id,name'])->latest()->get());
    }

    public function resolveReport(Request $request, Report $report)
    {
        $this->guard($request);
        $report->update(['status' => 'resolved']);
        return response()->json(['message' => 'Report resolved.']);
    }

    public function cleanupMessages(Request $request)
    {
        $this->guard($request);
        $request->validate(['keyword' => 'required|string']);
        $count = Message::where('message', 'like', "%{$request->keyword}%")->delete();
        return response()->json(['message' => "Cleaned up {$count} messages."]);
    }

    // ── Conversations ─────────────────────────────────────────────────────────
    public function listConversations(Request $request)
    {
        $this->guard($request);
        // Groups messages into unique pairs
        $convos = Message::select(
            DB::raw('LEAST(user_id, receiver_id) as user1'),
            DB::raw('GREATEST(user_id, receiver_id) as user2'),
            DB::raw('COUNT(*) as total_messages'),
            DB::raw('MAX(created_at) as last_message_at')
        )
        ->groupBy('user1', 'user2')
        ->orderByDesc('last_message_at')
        ->get();

        foreach ($convos as $c) {
            $c->user1_info = User::find($c->user1, ['id', 'name', 'email']);
            $c->user2_info = User::find($c->user2, ['id', 'name', 'email']);
        }

        return response()->json($convos);
    }

    public function deleteConversation(Request $request)
    {
        $this->guard($request);
        $request->validate([
            'user1' => 'required|integer',
            'user2' => 'required|integer'
        ]);

        Message::where(function($q) use ($request) {
            $q->where('user_id', $request->user1)->where('receiver_id', $request->user2);
        })->orWhere(function($q) use ($request) {
            $q->where('user_id', $request->user2)->where('receiver_id', $request->user1);
        })->delete();

        return response()->json(['message' => 'Conversation deleted.']);
    }
}
