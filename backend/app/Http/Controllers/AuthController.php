<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;
        $user->update(['last_seen_at' => now()]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $request->user()->update(['last_seen_at' => now()]);
        return response()->json(['message' => 'Logged out']);
    }

    public function getUser(Request $request)
    {
        return $request->user();
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'   => ['string', 'max:255'],
            'bio'    => ['nullable', 'string', 'max:500'],
            'username' => ['nullable', 'string', 'max:255', 'unique:users,username,' . $request->user()->id],
            'avatar' => ['nullable', 'image', 'max:2048'], // Allow image files up to 2MB
        ]);

        $user = $request->user();
        $data = $request->only('name', 'bio', 'username');

        if ($request->hasFile('avatar')) {
            // Delete old avatar if it exists
            if ($user->avatar && file_exists(public_path($user->avatar))) {
                unlink(public_path($user->avatar));
            }
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = 'storage/' . $path;
        }

        $user->update($data);

        return response()->json($user);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'old_password' => ['required', 'string'],
            'new_password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function togglePreferences(Request $request)
    {
        $request->validate([
            'notifications_enabled' => ['nullable', 'boolean'],
            'two_factor_enabled' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();
        $user->update($request->only(['notifications_enabled', 'two_factor_enabled']));

        return response()->json($user);
    }

    /**
     * Heartbeat — updates last_seen_at so the user appears online.
     */
    public function ping(Request $request)
    {
        $request->user()->update(['last_seen_at' => now()]);
        return response()->json(['ok' => true]);
    }
}
