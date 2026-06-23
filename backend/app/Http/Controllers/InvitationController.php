<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    /**
     * Get all invitations for the authenticated user
     * (both sent and received, with statuses).
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $received = Invitation::with('sender:id,name,email,bio,last_seen_at')
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->get();

        $accepted = Invitation::with(['sender:id,name,email,bio,last_seen_at', 'receiver:id,name,email,bio,last_seen_at'])
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })
            ->where('status', 'accepted')
            ->get();

        return response()->json([
            'received' => $received,
            'accepted' => $accepted,
        ]);
    }

    /**
     * Send an invitation to another user.
     */
    public function sendInvitation(Request $request)
    {
        $request->validate(['receiver_id' => 'required|exists:users,id']);

        $senderId   = $request->user()->id;
        $receiverId = $request->receiver_id;

        if ($senderId === $receiverId) {
            return response()->json(['error' => 'Cannot invite yourself.'], 422);
        }

        // Check if already exists
        $existing = Invitation::where(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->first();

        if ($existing) {
            return response()->json(['error' => 'Invitation already exists.', 'invitation' => $existing], 409);
        }

        $invitation = Invitation::create([
            'sender_id'   => $senderId,
            'receiver_id' => $receiverId,
            'status'      => 'pending',
        ]);

        return response()->json($invitation->load(['sender:id,name,email', 'receiver:id,name,email']), 201);
    }

    /**
     * Get all pending invitations for authenticated user
     * (with sender details)
     */
    public function getReceivedInvitations(Request $request)
    {
        $userId = $request->user()->id;

        $pendingInvitations = Invitation::with('sender:id,name,email,bio,last_seen_at')
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json($pendingInvitations);
    }

    /**
     * Accept a pending invitation.
     */
    public function acceptInvitation($id, Request $request)
    {
        $invitation = Invitation::findOrFail($id);
        
        if ($invitation->receiver_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $invitation->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'Invitation accepted!',
            'invitation' => $invitation->load(['sender:id,name,email', 'receiver:id,name,email'])
        ]);
    }

    /**
     * Reject a pending invitation.
     */
    public function rejectInvitation($id, Request $request)
    {
        $invitation = Invitation::findOrFail($id);
        
        if ($invitation->receiver_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $invitation->update(['status' => 'rejected']);

        return response()->json(['message' => 'Invitation rejected.']);
    }

    /**
     * Get invitation status between authenticated user and a specific user.
     */
    public function statusWith(Request $request, User $user)
    {
        $myId   = $request->user()->id;
        $userId = $user->id;

        $invitation = Invitation::where(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $myId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($myId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $myId);
        })->first();

        if (!$invitation) {
            return response()->json(['status' => 'none']);
        }

        return response()->json([
            'status'     => $invitation->status,
            'id'         => $invitation->id,
            'i_sent'     => $invitation->sender_id === $myId,
            'invitation' => $invitation,
        ]);
    }
}
