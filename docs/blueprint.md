# **App Name**: FinYearly

## Core Features:

- User Authentication Mocking: Allows admin to select the active user from a list for easy prototyping without full auth implementation.
- Financial Year Management: Configure and manage financial year instances (e.g., 25/26, 26/27) to isolate holiday data and allowance per year.
- Holiday Request Submission: Users can submit holiday requests specifying date ranges, half-day options, and view validation errors if exceeding available days. This function operates in accordance with the rules set forth for a selected tool that measures date ranges by full day, half day AM, and half day PM.
- Holiday Approval Workflow: Department managers and admins can approve or deny holiday requests, with filtering options by department for admin users.
- User Profile & Allowance Tracking: Displays remaining holidays, approved holidays, and total allowance for the selected financial year, giving users clear visibility of their holiday status.
- Team Holiday Calendar: Shows approved holidays for all users in a department, tagged with user names, within a calendar view for easy team coordination.
- Admin User Management: Admin users can manage users and departments, set default allowances, and assign roles.

## Style Guidelines:

- Primary color: Dark indigo (#4B0082) for a professional yet modern feel.
- Background color: Very light gray (#F5F5F5) to provide a neutral, clean backdrop.
- Accent color: Teal (#008080) to provide a clear visual call to actions.
- Body font: 'Inter', sans-serif, for a clean and modern look that ensures readability across all devices.
- Headline font: 'Space Grotesk', sans-serif, to provide a tech-forward feel that can apply across headlines and body text.
- Use minimalist and clear icons from the lucide.dev library to represent actions and status.
- Mobile-responsive design with a clear hierarchy, ensuring the app is easy to use on any device.