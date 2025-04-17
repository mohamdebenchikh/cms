<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormSubmission;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function index()
    {
        $page = Page::where('slug', 'contact')
            ->where('status', 'published')
            ->firstOrFail();

        // Get contact information from settings
        $contactInfo = [
            'email' => Setting::where('key', 'contact_email')->value('value') ?? config('mail.from.address'),
            'phone' => Setting::where('key', 'contact_phone')->value('value'),
            'address' => Setting::where('key', 'contact_address')->value('value'),
            'social' => [
                'twitter' => Setting::where('key', 'social_twitter')->value('value'),
                'facebook' => Setting::where('key', 'social_facebook')->value('value'),
                'instagram' => Setting::where('key', 'social_instagram')->value('value'),
                'linkedin' => Setting::where('key', 'social_linkedin')->value('value'),
                'youtube' => Setting::where('key', 'social_youtube')->value('value'),
                'github' => Setting::where('key', 'social_github')->value('value'),
            ],
        ];

        return Inertia::render('blog/contact', [
            'page' => $page,
            'contactInfo' => $contactInfo,
        ]);
    }

    /**
     * Handle contact form submission.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Get admin email from settings or use fallback
        $adminEmail = Setting::where('key', 'contact_email')->value('value')
            ?? config('mail.from.address');

        // Send email
        Mail::to($adminEmail)->send(new ContactFormSubmission($validated));

        return back()->with('success', 'Your message has been sent successfully!');
    }
}
