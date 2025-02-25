const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleProducts = [
  {
    name: 'Ankara Print Blazer',
    description: 'Modern cut blazer with traditional Ankara print',
    price: 25999,
    images: ['/placeholder.jpg'],
    category: 'formal',
    gender: 'male',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: 50,
    is_featured: false,
    is_new: true
  },
  {
    name: 'Adire Maxi Dress',
    description: 'Flowing maxi dress with traditional Adire pattern',
    price: 18999,
    images: ['/placeholder.jpg'],
    category: 'traditional',
    gender: 'female',
    sizes: ['S', 'M', 'L'],
    stock_quantity: 30,
    is_featured: true,
    is_new: false
  },
  {
    name: 'Modern Agbada Set',
    description: 'Contemporary take on the classic Agbada',
    price: 35999,
    images: ['/placeholder.jpg'],
    category: 'traditional',
    gender: 'male',
    sizes: ['M', 'L', 'XL'],
    stock_quantity: 20,
    is_featured: true,
    is_new: false
  },
  {
    name: 'Ankara Pencil Skirt',
    description: 'Professional pencil skirt with Ankara details',
    price: 12999,
    images: ['/placeholder.jpg'],
    category: 'formal',
    gender: 'female',
    sizes: ['S', 'M', 'L'],
    stock_quantity: 40,
    is_featured: false,
    is_new: false
  }
];

async function verifyProducts() {
  try {
    // Check if products exist
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);

    if (fetchError) {
      console.error('Error checking products:', fetchError);
      return;
    }

    if (!existingProducts || existingProducts.length === 0) {
      console.log('No products found. Inserting sample products...');
      
      // Insert sample products
      const { data: insertedProducts, error: insertError } = await supabase
        .from('products')
        .insert(sampleProducts)
        .select('id, name, price');

      if (insertError) {
        console.error('Error inserting products:', insertError);
        return;
      }

      console.log('Successfully inserted products:', insertedProducts);
    } else {
      console.log('Products already exist in the database.');
      
      // Fetch all products to verify
      const { data: allProducts, error: listError } = await supabase
        .from('products')
        .select('id, name, price');

      if (listError) {
        console.error('Error listing products:', listError);
        return;
      }

      console.log('Current products in database:', allProducts);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the verification
verifyProducts(); 