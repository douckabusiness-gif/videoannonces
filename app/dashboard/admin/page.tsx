'use client';
import { redirect } from 'next/navigation';

export default function AdminRedirect() {
    // Redirect to the new user management page
    redirect('/admin/users');
    return null;
}
