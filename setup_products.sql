-- Insert sample products
INSERT INTO public.products (
    name,
    description,
    price,
    images,
    category,
    gender,
    sizes,
    stock_quantity,
    is_featured,
    is_new
) VALUES 
(
    'Ankara Print Blazer',
    'Modern cut blazer with traditional Ankara print',
    25999,
    ARRAY['/placeholder.jpg'],
    'formal',
    'male',
    ARRAY['S', 'M', 'L', 'XL'],
    50,
    false,
    true
),
(
    'Adire Maxi Dress',
    'Flowing maxi dress with traditional Adire pattern',
    18999,
    ARRAY['/placeholder.jpg'],
    'traditional',
    'female',
    ARRAY['S', 'M', 'L'],
    30,
    true,
    false
),
(
    'Modern Agbada Set',
    'Contemporary take on the classic Agbada',
    35999,
    ARRAY['/placeholder.jpg'],
    'traditional',
    'male',
    ARRAY['M', 'L', 'XL'],
    20,
    true,
    false
),
(
    'Ankara Pencil Skirt',
    'Professional pencil skirt with Ankara details',
    12999,
    ARRAY['/placeholder.jpg'],
    'formal',
    'female',
    ARRAY['S', 'M', 'L'],
    40,
    false,
    false
); 