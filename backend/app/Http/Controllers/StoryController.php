<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StoryController extends Controller
{
    public function index()
    {
        return Story::with('user')
            ->where('expires_at', '>', Carbon::now())
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'nullable|string',
            'type' => 'required|in:text,image',
            'image' => 'nullable|image|max:2048',
        ]);

        $mediaUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('stories', 'public');
            $mediaUrl = 'storage/' . $path;
        }

        $story = Story::create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'type' => $request->type,
            'media_url' => $mediaUrl,
            'expires_at' => Carbon::now()->addHours(24),
        ]);

        return response()->json($story->load('user'));
    }

    public function view(Request $request, Story $story)
    {
        // Could track viewers — for now just return ok
        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, Story $story)
    {
        if ($story->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $story->delete();
        return response()->json(['message' => 'Story deleted.']);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    public function adminListStories()
    {
        $this->requireAdmin();
        return response()->json(
            Story::with('user')->latest()->get()
        );
    }

    public function adminDeleteStory(Story $story)
    {
        $this->requireAdmin();
        $story->delete();
        return response()->json(['message' => 'Story deleted.']);
    }

    private function requireAdmin(): void
    {
        if (!auth()->user()->is_admin && auth()->user()->email !== 'admin@chatreel.com') {
            abort(403, 'Admin access required.');
        }
    }
}
