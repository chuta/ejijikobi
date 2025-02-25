# Ejiji Kobi - Modern African Fashion E-commerce

A modern e-commerce platform for African fashion, built with Next.js, Supabase, and Stripe.

## Features

- 🛍️ Product catalog with categories and filters
- 👤 User authentication with Google Sign-in
- 🛒 Shopping cart functionality
- 💳 Secure payments with Stripe
- 📱 Responsive design
- 🖼️ Image upload and management
- 👩‍💼 Admin dashboard for product management

## Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Payment:** Stripe
- **Deployment:** Vercel
- **Email:** Resend

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ejiji-kobi.git
cd ejiji-kobi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RESEND_API_KEY=your_resend_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

1. Create a new project in Supabase
2. Run the SQL setup scripts in the following order:
   - `src/lib/supabase/setup_database.sql`
   - `src/lib/supabase/setup_storage.sql`
   - `src/lib/supabase/setup_profiles.sql`

## Deployment

1. Push your code to GitHub
2. Create a new project in Vercel
3. Connect your GitHub repository
4. Add your environment variables in Vercel
5. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
