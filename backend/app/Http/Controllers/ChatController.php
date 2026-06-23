<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getMessages(User $receiver)
    {
        $userId = Auth::id();

        // Mark all messages from receiver as read
        Message::where('user_id', $receiver->id)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return Message::where(function ($query) use ($userId, $receiver) {
            $query->where('user_id', $userId)->where('receiver_id', $receiver->id);
        })->orWhere(function ($query) use ($userId, $receiver) {
            $query->where('user_id', $receiver->id)->where('receiver_id', $userId);
        })->with('user')->orderBy('created_at', 'asc')->get();
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'user_id'     => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message'     => $request->message,
            'is_read'     => false,
        ]);

        $receiver = User::find($request->receiver_id);

        broadcast(new MessageSent(Auth::user(), $message->load('user'), $receiver))->toOthers();

        return response()->json(['status' => 'Message Sent!', 'message' => $message->load('user')]);
    }

    /**
     * Mark a specific message as read and broadcast the update.
     */
    public function markRead(Message $message)
    {
        if ($message->receiver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->update(['is_read' => true]);

        return response()->json(['status' => 'marked_read', 'message' => $message]);
    }

    /**
     * Return unread message count per sender for the authenticated user.
     */
    public function unreadCounts()
    {
        $userId = Auth::id();

        $counts = Message::where('receiver_id', $userId)
            ->where('is_read', false)
            ->selectRaw('user_id, count(*) as count')
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id')
            ->map(fn($row) => $row->count);

        return response()->json($counts);
    }

    /**
     * Return list of conversations (friends the user has exchanged messages with).
     */
    public function conversations()
    {
        $userId = Auth::id();

        // Get all unique partner IDs the user has chatted with
        $partnerIds = \App\Models\Message::where('user_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->map(fn($m) => $m->user_id === $userId ? $m->receiver_id : $m->user_id)
            ->unique()
            ->values();

        $partners = \App\Models\User::whereIn('id', $partnerIds)
            ->select('id','name','email','bio','last_seen_at')
            ->get()
            ->map(function ($u) use ($userId) {
                // Last message
                $last = \App\Models\Message::where(function ($q) use ($userId, $u) {
                    $q->where('user_id', $userId)->where('receiver_id', $u->id);
                })->orWhere(function ($q) use ($userId, $u) {
                    $q->where('user_id', $u->id)->where('receiver_id', $userId);
                })->latest()->first();

                $u->last_message     = $last?->message;
                $u->last_message_at  = $last?->created_at;
                $u->unread_count     = \App\Models\Message::where('user_id', $u->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->count();
                $u->is_online = $u->last_seen_at &&
                    \Carbon\Carbon::parse($u->last_seen_at)->diffInMinutes(now()) < 5;
                return $u;
            })
            ->sortByDesc('last_message_at')
            ->values();

        return response()->json($partners);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    public function adminListMessages()
    {
        $this->requireAdmin();
        return response()->json(
            Message::with(['user', 'receiver'])->latest()->get()
        );
    }

    public function adminDeleteMessage(Message $message)
    {
        $this->requireAdmin();
        $message->delete();
        return response()->json(['message' => 'Message deleted.']);
    }

    private function requireAdmin(): void
    {
        if (!auth()->user()->is_admin && auth()->user()->email !== 'admin@chatreel.com') {
            abort(403, 'Admin access required.');
        }
    }
}
