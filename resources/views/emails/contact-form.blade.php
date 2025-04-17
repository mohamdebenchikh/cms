<x-mail::message>
# New Contact Form Submission

You have received a new message from your website's contact form.

<x-mail::panel>
**Name:** {{ $name }}

**Email:** {{ $email }}

**Subject:** {{ $subject }}

**Message:**
{{ $message }}
</x-mail::panel>

<x-mail::button :url="route('admin.dashboard')">
View Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
