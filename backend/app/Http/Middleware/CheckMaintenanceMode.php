<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip check if settings table doesn't exist yet
        if (!Schema::hasTable('settings')) {
            return $next($request);
        }

        $maintenance = Setting::where('key', 'maintenance_mode')->first();
        
        if ($maintenance && $maintenance->value === 'true') {
            // Allow Admins to bypass maintenance
            $user = $request->user();
            $isAdmin = false;
            
            if ($user) {
                $isAdmin = Schema::hasColumn('users', 'is_admin')
                    ? (bool) $user->is_admin
                    : $user->email === 'admin@chatreel.com';
            }

            if (!$isAdmin) {
                return response()->json([
                    'message' => 'App is currently under maintenance. Please try again later.',
                    'maintenance' => true
                ], 503);
            }
        }

        return $next($request);
    }
}
